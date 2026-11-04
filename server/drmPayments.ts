import express from 'express';
import type { AuthenticatedRequest } from './drmAuth.ts';

export function createPaymentsRouter(db: any, pushPaymentToCloud?: (payment: any) => Promise<void>) {
  const router = express.Router();

  // 1. Submit Payment Request (Student submits UPI UTR)
  router.post('/api/payments/request', async (req: AuthenticatedRequest, res) => {
    try {
      const {
        username: rawUsername,
        user_name,
        phone,
        item_type = 'MASTER_PDF_BUNDLE',
        item_id = 'ALL',
        amount = 149,
        upi_ref,
        screenshot_file_name,
        screenshot_file_data
      } = req.body;

      const username = (req.user?.username || rawUsername || '').trim();
      const studentName = (user_name || req.user?.displayName || username || 'Student').trim();
      const studentPhone = (phone || req.user?.phone || '').trim();
      const cleanUpiRef = String(upi_ref || '').trim();

      if (!cleanUpiRef || cleanUpiRef.length < 6) {
        return res.status(400).json({
          error: 'INVALID_UTR',
          message: 'সঠিক UPI রেফারেন্স নম্বর বা UTR / Transaction ID (কমপক্ষে ৬ ডিজিট) প্রদান করুন।'
        });
      }

      if (!studentPhone) {
        return res.status(400).json({
          error: 'PHONE_REQUIRED',
          message: 'পেমেন্ট যাচাইকরণের জন্য শিক্ষার্থীর সঠিক ফোন নম্বর প্রয়োজন।'
        });
      }

      // 2. DUPLICATE CHECK: Prevent re-use of already submitted or approved UTRs
      const existingPayment = db.prepare(`
        SELECT id, username, status, upi_ref, timestamp 
        FROM payments 
        WHERE LOWER(TRIM(upi_ref)) = LOWER(TRIM(?))
          AND status IN ('Pending Verification', 'Approved')
        LIMIT 1
      `).get(cleanUpiRef) as any;

      if (existingPayment) {
        return res.status(400).json({
          error: 'DUPLICATE_UTR',
          message: `এই Transaction ID / UTR নম্বরটি (${cleanUpiRef}) ইতিমধ্যে সিস্টেমে জমা দেওয়া হয়েছে (স্ট্যাটাস: ${existingPayment.status})। দয়া করে আপনার সঠিক ও অনন্য ট্রানজ্যাকশন আইডি প্রদান করুন।`
        });
      }

      // 3. Insert payment record
      const timestamp = new Date().toISOString();
      const insertStmt = db.prepare(`
        INSERT INTO payments 
        (username, user_name, user_role, phone, item_type, item_id, amount, upi_ref, status, admin_note, timestamp, screenshot_file_name, screenshot_file_data)
        VALUES (?, ?, 'student', ?, ?, ?, ?, ?, 'Pending Verification', '', ?, ?, ?)
      `);

      const result = insertStmt.run(
        username,
        studentName,
        studentPhone,
        item_type,
        String(item_id),
        parseInt(String(amount), 10) || 149,
        cleanUpiRef,
        timestamp,
        screenshot_file_name || null,
        screenshot_file_data || null
      );

      const paymentId = Number(result.lastInsertRowid);

      // 4. Asynchronously push to central Firestore if configured
      if (pushPaymentToCloud) {
        pushPaymentToCloud({
          id: paymentId,
          username,
          user_name: studentName,
          phone: studentPhone,
          item_type,
          item_id: String(item_id),
          amount: parseInt(String(amount), 10) || 149,
          upi_ref: cleanUpiRef,
          status: 'Pending Verification',
          timestamp
        }).catch(err => console.error('[Payments] Cloud sync error:', err));
      }

      res.json({
        success: true,
        paymentId,
        status: 'Pending Verification',
        message: 'আপনার পেমেন্ট রিকোয়েস্ট সফলভাবে জমা নেওয়া হয়েছে। অ্যাডমিন ম্যানুয়ালি যাচাই করার পর ম্যাটেরিয়াল অ্যাক্সেস আনলক হয়ে যাবে।'
      });
    } catch (e: any) {
      console.error('[Payments] Error creating payment request:', e);
      res.status(500).json({ error: e.message });
    }
  });

  // 2. Fetch logged-in student's payment history & status
  router.get('/api/payments/my_requests', (req: AuthenticatedRequest, res) => {
    try {
      const username = req.user?.username || req.query.username;
      const phone = req.user?.phone || req.query.phone;

      if (!username && !phone) {
        return res.status(401).json({ error: 'লগইন তথ্য পাওয়া যায়নি (Authentication required)' });
      }

      const rows = db.prepare(`
        SELECT id, username, user_name, phone, item_type, item_id, amount, upi_ref, status, admin_note, timestamp, approved_at
        FROM payments 
        WHERE (username = ? AND username != '') OR (phone = ? AND phone != '')
        ORDER BY id DESC
        LIMIT 50
      `).all(username || '', phone || '');

      res.json(rows);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // 3. Check student's current active subscription status
  router.get('/api/payments/subscription_status', (req: AuthenticatedRequest, res) => {
    try {
      const username = req.user?.username || req.query.username;
      const isAdmin = req.user?.isAdmin || false;

      if (isAdmin) {
        return res.json({
          hasActiveSubscription: true,
          isAdmin: true,
          status: 'admin_unlimited',
          planType: 'ALL_ACCESS (Admin Lifetime)',
          expiresAt: null,
          daysLeft: 9999
        });
      }

      if (!username) {
        return res.json({ hasActiveSubscription: false, status: 'unauthenticated' });
      }

      // Check subscriptions table
      const sub = db.prepare(`
        SELECT * FROM subscriptions 
        WHERE username = ? 
          AND status = 'active'
          AND (expires_at IS NULL OR datetime(expires_at) >= datetime('now'))
        ORDER BY id DESC 
        LIMIT 1
      `).get(username) as any;

      if (sub) {
        let daysLeft = null;
        if (sub.expires_at) {
          const diffMs = new Date(sub.expires_at).getTime() - Date.now();
          daysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
        }

        return res.json({
          hasActiveSubscription: true,
          subscription: {
            id: sub.id,
            planType: sub.plan_type,
            materialId: sub.material_id,
            status: sub.status,
            startsAt: sub.starts_at,
            expiresAt: sub.expires_at,
            daysLeft
          }
        });
      }

      // Check user_purchases fallback
      const purchase = db.prepare(`
        SELECT * FROM user_purchases 
        WHERE username = ? AND status = 'Active'
        ORDER BY id DESC 
        LIMIT 1
      `).get(username) as any;

      if (purchase) {
        return res.json({
          hasActiveSubscription: true,
          subscription: {
            id: purchase.id,
            planType: purchase.item_type || 'ALL_ACCESS',
            materialId: purchase.item_id || 'ALL',
            status: 'active',
            startsAt: purchase.activated_at,
            expiresAt: null,
            daysLeft: 365
          }
        });
      }

      // Check if there is a pending payment
      const pendingPayment = db.prepare(`
        SELECT id, upi_ref, timestamp, amount FROM payments 
        WHERE username = ? AND status = 'Pending Verification'
        ORDER BY id DESC LIMIT 1
      `).get(username) as any;

      return res.json({
        hasActiveSubscription: false,
        status: pendingPayment ? 'pending_approval' : 'none',
        pendingPayment: pendingPayment || null
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  return router;
}
