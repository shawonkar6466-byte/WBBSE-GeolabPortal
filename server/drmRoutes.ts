import type express from 'express';
import { createAuthMiddleware } from './drmAuth.ts';
import { initDrmTables, createMaterialsRouter } from './drmMaterials.ts';
import { createPaymentsRouter } from './drmPayments.ts';
import { createAdminRouter } from './drmAdmin.ts';

export function registerDrmModule(
  app: express.Express,
  db: any,
  pushPaymentToCloud?: (payment: any) => Promise<void>,
  pushUserPurchaseToCloud?: (purchase: any) => Promise<void>
) {
  // 1. Initialize SQLite tables for DRM, subscriptions and audit logs
  initDrmTables(db);

  // 2. Attach global user authentication middleware with database lookup
  const authMiddleware = createAuthMiddleware(db);
  app.use(authMiddleware);

  // 3. Mount DRM Routers
  app.use(createMaterialsRouter(db));
  app.use(createPaymentsRouter(db, pushPaymentToCloud));
  app.use(createAdminRouter(db, pushPaymentToCloud, pushUserPurchaseToCloud));

  // 4. DRM Public Configuration (UPI Payment Info, Pricing, Anti-Piracy Details)
  app.get('/api/drm/config', (req, res) => {
    res.json({
      upi_id: 'geolab@upi',
      admin_phone: '7001257277',
      admin_whatsapp: '7001257277',
      portal_name: 'GeoLabPortal WBBSE Class 10',
      plans: [
        {
          id: 'full_syllabus_bundle',
          name: 'সম্পূর্ণ সিলেবাস মাস্টার বান্ডিল (অধ্যায় ১-৬)',
          marks_covered: '২, ৩ ও ৫ নম্বরের সমস্ত মাস্টার প্রশ্ন-উত্তর',
          original_price: 299,
          price: 149,
          validity_days: 365,
          recommended: true,
          features: [
            'সমস্ত অধ্যায়ের ৫ নম্বরের সচিত্র মডেল উত্তর',
            '৩ নম্বরের সংক্ষেপ ও পার্থক্য ছক',
            '২ নম্বরের সংজ্ঞা ও বৈশিষ্ট্য মাস্টারশিট',
            'ইন-অ্যাপ নিরাপদ DRM রিডার (ল্যাপটপ ও মোবাইল)',
            '৩৬৫ দিন আনলিমিটেড ভিউ অ্যাক্সেস'
          ]
        },
        {
          id: '5m_master_bundle',
          name: '৫ নম্বরের স্পেশাল মাস্টার প্যাক',
          marks_covered: '৫ নম্বরের বড় প্রশ্ন ও চিত্র গাইড',
          original_price: 99,
          price: 49,
          validity_days: 365,
          features: [
            'মাধ্যমিকের সম্ভাব্য ৫ নম্বরের পূর্ণমান উত্তরের সংকলন',
            'ভূগোলের নিখুঁত ডায়াগ্রাম আঁকার নির্দেশনা',
            'ইন-অ্যাপ নিরাপদ DRM ভিউয়ার'
          ]
        },
        {
          id: '2m_3m_bundle',
          name: '২ ও ৩ নম্বরের টু-দ্য-পয়েন্ট শর্ট প্যাক',
          marks_covered: '২ ও ৩ নম্বরের সংক্ষিপ্ত প্রশ্ন-উত্তর',
          original_price: 79,
          price: 39,
          validity_days: 365,
          features: [
            'সহজ ও স্পষ্ট সংজ্ঞাসমূহ',
            'তুচ্ছ ভুলে নম্বর না কাটার ট্রিকস',
            'ইন-অ্যাপ নিরাপদ DRM ভিউয়ার'
          ]
        }
      ],
      drm_security_notice: 'GeoLabPortal মাস্টার পিডিএফসমূহ সম্পূর্ণ কপিরাইট সুরক্ষিত। প্রতিটি পাতায় শিক্ষার্থীর নাম, ফোন ও আইডিসহ ডায়নামিক ওয়াটারমার্ক দৃশ্যমান থাকে। শেয়ার বা স্ক্রিনশটের চেষ্টা করলে অ্যাকাউন্ট স্বয়ংক্রিয়ভাবে ব্লক হবে।'
    });
  });

  console.log('[DRM] Registered GeoLabPortal DRM & Paid Master PDF engine successfully.');
}
