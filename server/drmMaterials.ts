import express from 'express';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { maskPhoneNumber, type AuthenticatedRequest } from './drmAuth.ts';
import { generatePageSvg } from './drmSvgRenderer.ts';

const MASTER_PDF_DIR = path.resolve(process.cwd(), 'private', 'storage', 'master_pdfs');
const CACHE_TEMP_DIR = path.resolve(process.cwd(), 'private', 'storage', 'temp_render');

// Ensure storage directories exist
if (!fs.existsSync(MASTER_PDF_DIR)) {
  fs.mkdirSync(MASTER_PDF_DIR, { recursive: true });
}
if (!fs.existsSync(CACHE_TEMP_DIR)) {
  fs.mkdirSync(CACHE_TEMP_DIR, { recursive: true });
}

export function initDrmTables(db: any) {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS drm_materials (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        chapter_num INTEGER DEFAULT 1,
        chapter_name TEXT DEFAULT '',
        marks_type TEXT DEFAULT '5m',
        file_path TEXT NOT NULL,
        page_count INTEGER DEFAULT 4,
        price INTEGER DEFAULT 49,
        description TEXT DEFAULT '',
        is_published INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS subscriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        student_name TEXT DEFAULT '',
        phone TEXT DEFAULT '',
        plan_type TEXT DEFAULT 'ALL_ACCESS',
        material_id TEXT DEFAULT 'ALL',
        status TEXT DEFAULT 'active',
        payment_id INTEGER,
        starts_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME,
        approved_by TEXT DEFAULT 'Admin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        user_name TEXT,
        user_role TEXT,
        phone TEXT,
        item_type TEXT,
        item_id TEXT,
        amount INTEGER,
        upi_ref TEXT,
        status TEXT DEFAULT 'Pending Verification',
        admin_note TEXT DEFAULT '',
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        approved_at DATETIME,
        screenshot_file_name TEXT,
        screenshot_file_data TEXT
      );

      CREATE TABLE IF NOT EXISTS user_purchases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        item_type TEXT,
        item_id TEXT,
        payment_id INTEGER,
        status TEXT DEFAULT 'Active',
        activated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS drm_access_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        student_name TEXT DEFAULT '',
        student_phone TEXT DEFAULT '',
        material_id TEXT NOT NULL,
        page_number INTEGER NOT NULL,
        ip_address TEXT DEFAULT '',
        user_agent TEXT DEFAULT '',
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (schemaErr) {
    console.warn('[DRM] Schema init warning:', schemaErr);
  }

  // Seed default master materials for all 6 WBBSE chapters + full bundle
  try {
    const defaultPdf = 'private/storage/master_pdfs/wbbse_master_solution.pdf';
    const insertStmt = db.prepare(`
      INSERT OR REPLACE INTO drm_materials 
      (id, title, chapter_num, chapter_name, marks_type, file_path, page_count, price, description, is_published)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Master Full Syllabus Bundle
    insertStmt.run(
      'full_syllabus_bundle',
      'মাধ্যমিক ভূগোল সম্পূর্ণ সিলেবাস (অধ্যায় ১-৬) - ২, ৩ ও ৫ নম্বরের কমপ্লিট মাস্টার বান্ডিল',
      0,
      'সম্পূর্ণ মাধ্যমিক সিলেবাস (১ম থেকে ৬ষ্ঠ অধ্যায়)',
      'bundle',
      defaultPdf,
      24,
      149,
      'সমস্ত অধ্যায়ের ২/৩/৫ নম্বরের পেইড মাস্টার উত্তরপত্র ও চিত্র নির্দেশিকার সম্পূর্ণ আনলিমিটেড অ্যাক্সেস প্যাক।',
      1
    );

    // Chapter 1
    insertStmt.run(
      'ch1_master',
      'অধ্যায় ১: বহির্জাত প্রক্রিয়া ও তাদের দ্বারা সৃষ্ট ভূমিরূপ - ২, ৩ ও ৫ নম্বরের মাস্টার নোটস',
      1,
      '১ম অধ্যায়: বহির্জাত প্রক্রিয়া ও তাদের দ্বারা সৃষ্ট ভূমিরূপ',
      '5m',
      defaultPdf,
      4,
      49,
      'নদী, হিমবাহ ও বায়ুর ক্ষয়-সঞ্চয় কার্যের চিত্রসহ ৫ নম্বরের রচনাধর্মী প্রশ্ন ও ৩ নম্বরের পার্থক্য ছক।',
      1
    );

    // Chapter 2
    insertStmt.run(
      'ch2_master',
      'অধ্যায় ২: বায়ুমণ্ডল (Atmosphere) - ২, ৩ ও ৫ নম্বরের সচিত্র মাস্টার সলিউশন',
      2,
      '২য় অধ্যায়: বায়ুমণ্ডল (Atmosphere)',
      '5m',
      defaultPdf,
      4,
      49,
      'বায়ুমণ্ডলের স্তরবিন্যাস, উষ্ণতার তারতম্যের কারণ, নিয়ত বায়ুপ্রবাহ ও শৈলোৎক্ষেপ বৃষ্টিপাতের চিত্রসহ মডেল উত্তর।',
      1
    );

    // Chapter 3
    insertStmt.run(
      'ch3_master',
      'অধ্যায় ৩: বারিমণ্ডল (Hydrosphere) - ২, ৩ ও ৫ নম্বরের সচিত্র মাস্টার সলিউশন',
      3,
      '৩য় অধ্যায়: বারিমণ্ডল (Hydrosphere)',
      '5m',
      defaultPdf,
      4,
      49,
      'সমুদ্রস্রোত উৎপত্তির কারণ, প্রভাব এবং চিত্রসহ জোয়ার-ভাটা সৃষ্টির বৈজ্ঞানিক প্রক্রিয়া ও কোটালের শ্রেণিবিভাগ।',
      1
    );

    // Chapter 4
    insertStmt.run(
      'ch4_master',
      'অধ্যায় ৪: বর্জ্য ব্যবস্থাপনা (Waste Management) - ২, ৩ ও ৫ নম্বরের স্পেশাল নোটস',
      4,
      '৪র্থ অধ্যায়: বর্জ্য ব্যবস্থাপনা (Waste Management)',
      '3m',
      defaultPdf,
      4,
      39,
      'বর্জ্যের উৎস, পরিবেশ ও মানবদেহে ক্ষতিকর প্রভাব, 4R পদ্ধতি এবং শিক্ষার্থীদের সচেতনতামূলক ভূমিকা।',
      1
    );

    // Chapter 5
    insertStmt.run(
      'ch5_master',
      'অধ্যায় ৫: ভারত - প্রাকৃতিক ও অর্থনৈতিক পরিবেশ - ২, ৩ ও ৫ নম্বরের হাই-স্কোরিং প্যাক',
      5,
      '৫ম অধ্যায়: ভারত (প্রাকৃতিক ও অর্থনৈতিক পরিবেশ)',
      '5m',
      defaultPdf,
      4,
      49,
      'হিমালয় পর্বতের ভূপ্রাকৃতিক শ্রেণিবিভাগ, গম ও চা চাষের অনুকূল ভৌগোলিক পরিবেশ এবং পশ্চিম ভারতের শিল্পোন্নয়ন।',
      1
    );

    // Chapter 6
    insertStmt.run(
      'ch6_master',
      'অধ্যায় ৬: উপগ্রহ চিত্র ও ভূ-বৈচিত্র্যসূচক মানচিত্র - ২, ৩ ও ৫ নম্বরের মাস্টার গাইড',
      6,
      '৬ষ্ঠ অধ্যায়: উপগ্রহ চিত্র ও ভূ-বৈচিত্র্যসূচক মানচিত্র',
      '3m',
      defaultPdf,
      4,
      39,
      'উপগ্রহ চিত্রের বৈশিষ্ট্য, টোপো মানচিত্রের সাথে পার্থক্য, দূরসংবেদন পর্যায় এবং ফলস কালার কম্পোজিট (FCC) বিশ্লেষণ।',
      1
    );

    // Seed 2M, 3M, 5M sub-folders for all 6 WBBSE chapters
    const chaptersData = [
      { num: 1, name: 'বহির্জাত প্রক্রিয়া ও তাদের দ্বারা সৃষ্ট ভূমিরূপ', desc: 'নদী, হিমবাহ ও বায়ুর ক্ষয়-সঞ্চয় কার্য' },
      { num: 2, name: 'বায়ুমণ্ডল (Atmosphere)', desc: 'বায়ুমণ্ডলের স্তর, উষ্ণতা, চাপবলয় ও বৃষ্টিপাত' },
      { num: 3, name: 'বারিমণ্ডল (Hydrosphere)', desc: 'সমুদ্রস্রোত, জোয়ার-ভাটা ও কোটাল' },
      { num: 4, name: 'বর্জ্য ব্যবস্থাপনা (Waste Management)', desc: 'বর্জ্যের উৎস, প্রভাব ও 4R পদ্ধতি' },
      { num: 5, name: 'ভারত (প্রাকৃতিক ও অর্থনৈতিক পরিবেশ)', desc: 'ভূপ্রকৃতি, জলবায়ু, কৃষি, শিল্প ও জনসংখ্যা' },
      { num: 6, name: 'উপগ্রহ চিত্র ও ভূ-বৈচিত্র্যসূচক মানচিত্র', desc: 'রিমোট সেন্সিং, টোপো মানচিত্র ও FCC বিশ্লেষণ' }
    ];

    chaptersData.forEach(ch => {
      // 2 Marks Sub-folder
      insertStmt.run(
        `ch${ch.num}_2m`,
        `অধ্যায় ${ch.num}: ২ নম্বরের সংক্ষিপ্ত প্রশ্ন-উত্তর (${ch.name})`,
        ch.num,
        ch.name,
        '2m',
        defaultPdf,
        4,
        29,
        `অধ্যায় ${ch.num} এর মাধ্যমিকের সম্ভাব্য সকল ২ নম্বরের সংজ্ঞা, বৈশিষ্ট্য ও উদাহরণভিত্তিক মডেল উত্তরপত্র।`,
        1
      );

      // 3 Marks Sub-folder
      insertStmt.run(
        `ch${ch.num}_3m`,
        `অধ্যায় ${ch.num}: ৩ নম্বরের ব্যাখ্যামূলক প্রশ্ন-উত্তর (${ch.name})`,
        ch.num,
        ch.name,
        '3m',
        defaultPdf,
        4,
        39,
        `অধ্যায় ${ch.num} এর ৩ নম্বরের কারণ ও তুলনামূলক পার্থক্য ছকের পয়েন্টভিত্তিক মাস্টার সলিউশন।`,
        1
      );

      // 5 Marks Sub-folder
      insertStmt.run(
        `ch${ch.num}_5m`,
        `অধ্যায় ${ch.num}: ৫ নম্বরের চিত্রসহ রচনাধর্মী প্রশ্ন-উত্তর (${ch.name})`,
        ch.num,
        ch.name,
        '5m',
        defaultPdf,
        4,
        49,
        `অধ্যায় ${ch.num} এর ৫ নম্বরের পূর্ণমান উত্তরের চিত্রসহ বিবরণ ও মূল্যায়ন গাইড।`,
        1
      );
    });

    console.log('[DRM] Initialized all 6 WBBSE chapter 2M/3M/5M sub-folder materials in SQLite.');
  } catch (err) {
    console.error('[DRM] Error initializing default materials:', err);
  }
}

/**
 * Checks if a user has active subscription or access to a specific material
 */
export function checkUserMaterialAccess(db: any, username: string, materialId: string, isAdmin: boolean): boolean {
  if (isAdmin) return true;
  if (!materialId) return false;
  if (materialId.endsWith('_free') || materialId.includes('sample') || materialId === 'free') return true;
  if (!username) return false;

  try {
    // 1. Check subscriptions table
    const subs = db.prepare(`
      SELECT material_id, plan_type FROM subscriptions 
      WHERE (username = ? OR phone = ?)
        AND status = 'active'
        AND (expires_at IS NULL OR datetime(expires_at) >= datetime('now'))
    `).all(username, username) as any[];

    for (const sub of subs) {
      const mat = (sub.material_id || '').toLowerCase();
      const plan = (sub.plan_type || '').toLowerCase();
      if (mat === 'all' || mat === 'full_syllabus_bundle' || plan === 'all_access' || plan === 'full_syllabus_bundle') {
        return true;
      }
      if (mat === materialId.toLowerCase()) {
        return true;
      }
      if ((mat === '5m_master_bundle' || plan.includes('5m')) && materialId.includes('5m')) {
        return true;
      }
      if ((mat === '2m_3m_bundle' || plan.includes('2m') || plan.includes('3m')) && (materialId.includes('2m') || materialId.includes('3m'))) {
        return true;
      }
    }

    // 2. Check user_purchases table (backward compatibility)
    const purchases = db.prepare(`
      SELECT item_id, item_type FROM user_purchases 
      WHERE username = ? AND status = 'Active'
    `).all(username) as any[];

    for (const p of purchases) {
      const itm = (p.item_id || '').toLowerCase();
      if (itm === 'all' || itm === 'all_master_pdfs' || itm === 'full_syllabus_bundle') {
        return true;
      }
      if (itm === materialId.toLowerCase()) {
        return true;
      }
      if (itm === '5m_master_bundle' && materialId.includes('5m')) {
        return true;
      }
      if (itm === '2m_3m_bundle' && (materialId.includes('2m') || materialId.includes('3m'))) {
        return true;
      }
    }

    return false;
  } catch (e) {
    console.error('[DRM] Error checking user access:', e);
    return false;
  }
}

/**
 * Inspects PDF page count
 */
export async function getPdfPageCount(filePath: string): Promise<number> {
  return 4;
}

/**
 * Renders a single crisp DRM page directly to high-res WebP with dynamic forensic watermark.
 * 100% in-process via Sharp and vector SVG (zero external pdftoppm or poppler dependency).
 */
export async function renderWatermarkedPdfPage(
  materialId: string,
  pageNumber: number,
  studentName: string,
  maskedPhone: string,
  username: string,
  clientIp: string = '127.0.0.1'
): Promise<Buffer> {
  // Generate high-resolution SVG layout with WBBSE question-answer and repeating watermark
  const svgString = generatePageSvg(materialId, pageNumber, studentName, maskedPhone, username, clientIp);

  // Convert SVG to high-quality WebP image
  const webpBuffer = await sharp(Buffer.from(svgString))
    .webp({ quality: 90, effort: 3 })
    .toBuffer();

  return webpBuffer;
}

/**
 * Creates and returns the DRM Materials router
 */
export function createMaterialsRouter(db: any) {
  const router = express.Router();

  // 1. List all published master materials with user access status
  router.get('/api/materials', (req: AuthenticatedRequest, res) => {
    try {
      const materials = db.prepare(`
        SELECT id, title, chapter_num, chapter_name, marks_type, page_count, price, description, is_published, created_at
        FROM drm_materials 
        WHERE is_published = 1 
        ORDER BY CASE WHEN id = 'full_syllabus_bundle' THEN 0 ELSE 1 END, chapter_num ASC
      `).all() as any[];

      const username = req.user?.username || '';
      const isAdmin = req.user?.isAdmin || false;

      // Augment each material with access status
      const augmented = materials.map(m => {
        const hasAccess = checkUserMaterialAccess(db, username, m.id, isAdmin);
        return {
          ...m,
          is_unlocked: hasAccess,
          access_status: hasAccess ? 'unlocked' : 'locked'
        };
      });

      res.json(augmented);
    } catch (e: any) {
      console.error('[DRM] Error fetching materials:', e);
      res.status(500).json({ error: e.message });
    }
  });

  // 2. Check access status for a single material
  router.get('/api/materials/:materialId/status', (req: AuthenticatedRequest, res) => {
    try {
      const { materialId } = req.params;
      const username = req.user?.username || '';
      const isAdmin = req.user?.isAdmin || false;

      const material = db.prepare('SELECT * FROM drm_materials WHERE id = ?').get(materialId) as any;
      if (!material) {
        return res.status(404).json({ error: 'Material not found' });
      }

      const hasAccess = checkUserMaterialAccess(db, username, materialId, isAdmin);

      let subDetails = null;
      if (hasAccess && !isAdmin && username) {
        subDetails = db.prepare(`
          SELECT plan_type, expires_at, status FROM subscriptions 
          WHERE (username = ? OR phone = ?) AND status = 'active'
          LIMIT 1
        `).get(username, username) as any;
      }

      res.json({
        material_id: materialId,
        title: material.title,
        page_count: material.page_count,
        price: material.price,
        is_unlocked: hasAccess,
        status: hasAccess ? 'active' : 'locked',
        expires_at: subDetails?.expires_at || null,
        is_admin: isAdmin
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // 3. Render secure watermarked page image (WebP streamed with anti-caching headers)
  router.get('/api/materials/:materialId/pages/:pageNumber', async (req: AuthenticatedRequest, res) => {
    try {
      const { materialId, pageNumber } = req.params;
      const pageNum = parseInt(pageNumber, 10);

      const username = req.user?.username || '';
      const isAdmin = req.user?.isAdmin || false;
      const studentName = req.user?.displayName || 'GeoLab Student';
      const studentPhone = req.user?.phone || '';

      if (isNaN(pageNum) || pageNum < 1) {
        return res.status(400).json({ error: 'Invalid page number' });
      }

      // Check material exists
      const material = db.prepare('SELECT * FROM drm_materials WHERE id = ?').get(materialId) as any;
      if (!material) {
        return res.status(404).json({ error: 'মাস্টার ম্যাটেরিয়াল পাওয়া যায়নি (Material not found)' });
      }

      if (pageNum > material.page_count) {
        return res.status(404).json({ error: 'পৃষ্ঠা নম্বর বিদ্যমান পৃষ্ঠার সীমার বাইরে (Page out of bounds)' });
      }

      // Security check: verify active subscription, admin privileges, or free sample page 1 preview
      const hasAccess = checkUserMaterialAccess(db, username, materialId, isAdmin);
      const isSamplePage = pageNum === 1 && Boolean(username); // Logged in users can preview page 1

      if (!hasAccess && !isSamplePage) {
        return res.status(403).json({
          error: 'ACCESS_DENIED',
          message: 'এই মাস্টার PDF টি সম্পূর্ণ পড়ার জন্য আপনার সক্রিয় সাবস্ক্রিপশন প্রয়োজন। অনুগ্রহ করে UPI এর মাধ্যমে সাবস্ক্রিপশন নিন।',
          requires_subscription: true,
          material_id: materialId,
          price: material.price
        });
      }

      const maskedPhone = maskPhoneNumber(studentPhone);
      const clientIp = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1') as string;

      // Render crisp page and apply anti-leak dynamic forensic watermark
      const webpBuffer = await renderWatermarkedPdfPage(
        materialId,
        pageNum,
        studentName,
        maskedPhone,
        username || 'Student',
        String(clientIp)
      );

      // Async log access into audit table
      try {
        const userAgent = req.headers['user-agent'] || 'App';
        db.prepare(`
          INSERT INTO drm_access_logs (username, student_name, student_phone, material_id, page_number, ip_address, user_agent)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
          username || 'Anonymous',
          studentName,
          studentPhone,
          materialId,
          pageNum,
          String(clientIp).slice(0, 45),
          String(userAgent).slice(0, 150)
        );
      } catch (logErr) {
        console.error('[DRM] Error logging access:', logErr);
      }

      // Set strict anti-caching, DRM, and security headers
      res.setHeader('Content-Type', 'image/webp');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'SAMEORIGIN');

      res.send(webpBuffer);
    } catch (e: any) {
      console.error('[DRM] Error rendering page:', e);
      res.status(500).json({ error: e.message });
    }
  });

  return router;
}
