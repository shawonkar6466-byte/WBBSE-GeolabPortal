import express from 'express';
import { requireAdmin, type AuthenticatedRequest } from './drmAuth.ts';

export function createAdminRouter(
  db: any,
  pushPaymentToCloud?: (payment: any) => Promise<void>,
  pushUserPurchaseToCloud?: (purchase: any) => Promise<void>
) {
  const router = express.Router();

  // 1. Pending Payments Queue
  router.get('/api/admin/payments/pending', requireAdmin, (req: AuthenticatedRequest, res) => {
    try {
      const rows = db.prepare(`
        SELECT id, username, user_name, phone, item_type, item_id, amount, upi_ref, status, admin_note, timestamp, screenshot_file_name, screenshot_file_data
        FROM payments 
        WHERE status = 'Pending Verification' 
        ORDER BY id DESC
      `).all();

      res.json(rows);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // 2. All Payments with optional status filter
  router.get('/api/admin/payments/all', requireAdmin, (req: AuthenticatedRequest, res) => {
    try {
      const status = req.query.status as string;
      let query = `
        SELECT id, username, user_name, phone, item_type, item_id, amount, upi_ref, status, admin_note, timestamp, approved_at, screenshot_file_name
        FROM payments
      `;
      const params: any[] = [];

      if (status) {
        query += ' WHERE status = ?';
        params.push(status);
      }

      query += ' ORDER BY id DESC LIMIT 100';

      const rows = db.prepare(query).all(...params);
      res.json(rows);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // 3. Approve Payment & Unlock Subscription
  router.post('/api/admin/payments/approve', requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const { paymentId, validityDays = 365, adminNote = 'Verified by Admin via UPI' } = req.body;

      if (!paymentId) {
        return res.status(400).json({ error: 'Payment ID is required' });
      }

      const payment = db.prepare('SELECT * FROM payments WHERE id = ?').get(paymentId) as any;
      if (!payment) {
        return res.status(404).json({ error: 'Payment record not found' });
      }

      const approvedAt = new Date().toISOString();
      const expiresAt = new Date(Date.now() + (parseInt(String(validityDays), 10) || 365) * 86400000).toISOString();

      // Update payment record
      db.prepare(`
        UPDATE payments 
        SET status = 'Approved', approved_at = ?, admin_note = ?
        WHERE id = ?
      `).run(approvedAt, adminNote, paymentId);

      // Create / renew active subscription in subscriptions table
      const materialId = payment.item_id || 'ALL';
      const planType = payment.item_type || 'ALL_ACCESS';

      // Mark old active subscriptions for this user as upgraded/renewed
      db.prepare(`
        UPDATE subscriptions 
        SET status = 'expired', updated_at = CURRENT_TIMESTAMP 
        WHERE username = ? AND status = 'active'
      `).run(payment.username);

      const subInsert = db.prepare(`
        INSERT INTO subscriptions 
        (username, student_name, phone, plan_type, material_id, status, payment_id, starts_at, expires_at, approved_by)
        VALUES (?, ?, ?, ?, ?, 'active', ?, ?, ?, ?)
      `);

      const subResult = subInsert.run(
        payment.username,
        payment.user_name || payment.username,
        payment.phone || '',
        planType,
        materialId,
        paymentId,
        approvedAt,
        expiresAt,
        req.user?.displayName || 'Admin'
      );

      const newSubId = Number(subResult.lastInsertRowid);

      // Also update or insert user_purchases for system-wide backward compatibility
      db.prepare(`
        INSERT OR REPLACE INTO user_purchases (username, item_type, item_id, payment_id, status, activated_at)
        VALUES (?, ?, ?, ?, 'Active', ?)
      `).run(
        payment.username,
        planType,
        materialId,
        paymentId,
        approvedAt
      );

      // Sync updated payment to Cloud Firestore if connected
      if (pushPaymentToCloud) {
        pushPaymentToCloud({
          ...payment,
          status: 'Approved',
          approved_at: approvedAt,
          admin_note: adminNote
        }).catch(err => console.error('[Admin] Cloud sync payment error:', err));
      }

      if (pushUserPurchaseToCloud) {
        pushUserPurchaseToCloud({
          id: newSubId,
          username: payment.username,
          item_type: planType,
          item_id: materialId,
          payment_id: paymentId,
          status: 'Active',
          activated_at: approvedAt
        }).catch(err => console.error('[Admin] Cloud sync purchase error:', err));
      }

      res.json({
        success: true,
        subscriptionId: newSubId,
        expiresAt,
        validityDays,
        message: `পেমেন্ট সফলভাবে অনুমোদিত হয়েছে! শিক্ষার্থীর সাবস্ক্রিপশন ${validityDays} দিনের জন্য সক্রিয় করা হয়েছে।`
      });
    } catch (e: any) {
      console.error('[Admin] Error approving payment:', e);
      res.status(500).json({ error: e.message });
    }
  });

  // 4. Reject Payment
  router.post('/api/admin/payments/reject', requireAdmin, (req: AuthenticatedRequest, res) => {
    try {
      const { paymentId, adminNote = 'Invalid or unverified Transaction ID' } = req.body;

      if (!paymentId) {
        return res.status(400).json({ error: 'Payment ID is required' });
      }

      const payment = db.prepare('SELECT * FROM payments WHERE id = ?').get(paymentId) as any;
      if (!payment) {
        return res.status(404).json({ error: 'Payment record not found' });
      }

      db.prepare(`
        UPDATE payments 
        SET status = 'Rejected', admin_note = ?
        WHERE id = ?
      `).run(adminNote, paymentId);

      if (pushPaymentToCloud) {
        pushPaymentToCloud({
          ...payment,
          status: 'Rejected',
          admin_note: adminNote
        }).catch(err => console.error('[Admin] Cloud sync payment error:', err));
      }

      res.json({
        success: true,
        message: 'পেমেন্ট সফলভাবে বাতিল (Rejected) করা হয়েছে।'
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // 5. Subscription Management & Listing
  router.get('/api/admin/subscriptions', requireAdmin, (req: AuthenticatedRequest, res) => {
    try {
      const rows = db.prepare(`
        SELECT 
          s.id, s.username, s.student_name, s.phone, s.plan_type, s.material_id, 
          s.status, s.payment_id, s.starts_at, s.expires_at, s.approved_by, s.created_at,
          u.school_name, u.district,
          (SELECT COUNT(*) FROM drm_access_logs WHERE username = s.username) as total_page_views
        FROM subscriptions s
        LEFT JOIN users u ON s.username = u.username
        ORDER BY s.id DESC
      `).all() as any[];

      // Calculate days remaining
      const enriched = rows.map(sub => {
        let daysLeft = null;
        let isExpired = false;
        if (sub.expires_at) {
          const diffMs = new Date(sub.expires_at).getTime() - Date.now();
          daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
          if (daysLeft <= 0) {
            isExpired = true;
            daysLeft = 0;
          }
        }
        return {
          ...sub,
          days_left: daysLeft,
          is_expired: isExpired
        };
      });

      res.json(enriched);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // 6. Revoke Subscription (Anti-Sharing Enforcement)
  router.post('/api/admin/subscriptions/revoke', requireAdmin, (req: AuthenticatedRequest, res) => {
    try {
      const { subscriptionId, reason = 'Suspected account or material sharing' } = req.body;

      if (!subscriptionId) {
        return res.status(400).json({ error: 'Subscription ID is required' });
      }

      const sub = db.prepare('SELECT * FROM subscriptions WHERE id = ?').get(subscriptionId) as any;
      if (!sub) {
        return res.status(404).json({ error: 'Subscription not found' });
      }

      // Mark subscription as revoked
      db.prepare(`
        UPDATE subscriptions 
        SET status = 'revoked', updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `).run(subscriptionId);

      // Also revoke user_purchases
      db.prepare(`
        UPDATE user_purchases 
        SET status = 'Revoked' 
        WHERE username = ?
      `).run(sub.username);

      res.json({
        success: true,
        message: `শিক্ষার্থী ${sub.student_name || sub.username}-এর সাবস্ক্রিপশন সফলভাবে বাতিল (Revoked) করা হয়েছে। কারণ: ${reason}`
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // 7. Extend Subscription Validity
  router.post('/api/admin/subscriptions/extend', requireAdmin, (req: AuthenticatedRequest, res) => {
    try {
      const { subscriptionId, additionalDays = 30 } = req.body;

      const sub = db.prepare('SELECT * FROM subscriptions WHERE id = ?').get(subscriptionId) as any;
      if (!sub) {
        return res.status(404).json({ error: 'Subscription not found' });
      }

      const baseDate = sub.expires_at && new Date(sub.expires_at).getTime() > Date.now()
        ? new Date(sub.expires_at)
        : new Date();

      const newExpiresAt = new Date(baseDate.getTime() + (parseInt(String(additionalDays), 10) || 30) * 86400000).toISOString();

      db.prepare(`
        UPDATE subscriptions 
        SET expires_at = ?, status = 'active', updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `).run(newExpiresAt, subscriptionId);

      // Reactivate in user_purchases if needed
      db.prepare(`
        UPDATE user_purchases 
        SET status = 'Active' 
        WHERE username = ?
      `).run(sub.username);

      res.json({
        success: true,
        newExpiresAt,
        message: `সাবস্ক্রিপশনের মেয়াদ আরও ${additionalDays} দিন বৃদ্ধি করা হয়েছে।`
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // 8. DRM Access Audit Logs
  router.get('/api/admin/access_logs', requireAdmin, (req: AuthenticatedRequest, res) => {
    try {
      const logs = db.prepare(`
        SELECT id, username, student_name, student_phone, material_id, page_number, ip_address, user_agent, timestamp
        FROM drm_access_logs 
        ORDER BY id DESC 
        LIMIT 100
      `).all();

      const totalViews = db.prepare('SELECT COUNT(*) as c FROM drm_access_logs').get() as any;
      const uniqueStudents = db.prepare('SELECT COUNT(DISTINCT username) as c FROM drm_access_logs').get() as any;

      res.json({
        total_views: totalViews?.c || 0,
        unique_students: uniqueStudents?.c || 0,
        logs
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  return router;
}
