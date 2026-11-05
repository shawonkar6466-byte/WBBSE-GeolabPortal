process.env.DISABLE_HMR = 'true';

import express from 'express';
import path from 'path';
import fs from 'fs';
import { DatabaseSync } from 'node:sqlite';
import { createServer as createViteServer } from 'vite';
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  initializeFirestore,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  getDocs,
  collection,
  writeBatch
} from 'firebase/firestore';
import { registerDrmModule } from './server/drmRoutes.ts';

let firestoreDb: any = null;
let isCloudInitialized = false;

function getCloudDb() {
  if (isCloudInitialized) return firestoreDb;
  try {
    const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
    if (!fs.existsSync(configPath)) {
      console.warn('[CloudSync] firebase-applet-config.json not found');
      return null;
    }
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const app = !getApps().length ? initializeApp(config) : getApp();
    firestoreDb = initializeFirestore(app, {
      experimentalForceLongPolling: true
    }, config.firestoreDatabaseId);
    isCloudInitialized = true;
    console.log('[CloudSync] Centralized Firestore initialized successfully with DB:', config.firestoreDatabaseId);
    return firestoreDb;
  } catch (err) {
    console.error('[CloudSync] Failed to initialize Firestore:', err);
    return null;
  }
}

// Push local question to Firestore
async function pushQuestionToCloud(q: any) {
  const cdb = getCloudDb();
  if (!cdb || !q || !q.id) return;
  try {
    const ref = doc(cdb, 'questions', String(q.id));
    await setDoc(ref, {
      id: q.id,
      topic_id: q.topic_id || 1,
      pyq_year: q.pyq_year || '',
      is_pyq: q.is_pyq || 0,
      question_text: q.question_text || '',
      question_text_en: q.question_text_en || '',
      option_a: q.option_a || '',
      option_a_en: q.option_a_en || '',
      option_b: q.option_b || '',
      option_b_en: q.option_b_en || '',
      option_c: q.option_c || '',
      option_c_en: q.option_c_en || '',
      option_d: q.option_d || '',
      option_d_en: q.option_d_en || '',
      correct_option: q.correct_option || 'A',
      explanation: q.explanation || '',
      explanation_en: q.explanation_en || '',
      difficulty: q.difficulty || 'Medium',
      is_descriptive: q.is_descriptive || 0,
      marks: q.marks || 1,
      model_answer: q.model_answer || '',
      model_answer_en: q.model_answer_en || '',
      marking_scheme: q.marking_scheme || '',
      marking_scheme_en: q.marking_scheme_en || '',
      q_type: q.q_type || 'MCQ',
      updated_at: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.error(`[CloudSync] Error pushing question ${q.id} to cloud:`, err);
  }
}

// Delete question from Firestore
async function deleteQuestionFromCloud(questionId: number | string) {
  const cdb = getCloudDb();
  if (!cdb) return;
  try {
    const ref = doc(cdb, 'questions', String(questionId));
    await deleteDoc(ref);
  } catch (err) {
    console.error(`[CloudSync] Error deleting question ${questionId} from cloud:`, err);
  }
}

// Push user account to Firestore
async function pushUserToCloud(user: any) {
  const cdb = getCloudDb();
  if (!cdb || !user || !user.username) return;
  try {
    const ref = doc(cdb, 'users', String(user.username));
    await setDoc(ref, {
      id: user.id || null,
      username: user.username,
      password: user.password,
      role: user.role || 'student',
      full_name: user.full_name || '',
      school_name: user.school_name || '',
      class_grade: user.class_grade || '10',
      phone: user.phone || '',
      district: user.district || '',
      email: user.email || '',
      approved: user.approved !== undefined ? user.approved : 0,
      is_admin: user.is_admin || 0,
      referral_code: user.referral_code || '',
      referral_count: user.referral_count || 0,
      mp_exam_year: user.mp_exam_year || 2027,
      created_at: user.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.error(`[CloudSync] Error pushing user ${user.username} to cloud:`, err);
  }
}

// Push payment transaction to Firestore
async function pushPaymentToCloud(payment: any) {
  const cdb = getCloudDb();
  if (!cdb || !payment || !payment.id) return;
  try {
    const ref = doc(cdb, 'payments', String(payment.id));
    await setDoc(ref, {
      ...payment,
      updated_at: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.error(`[CloudSync] Error pushing payment ${payment.id} to cloud:`, err);
  }
}

// Push answer sheet metadata to Firestore
async function pushAnswerSheetToCloud(sheet: any) {
  const cdb = getCloudDb();
  if (!cdb || !sheet || !sheet.id) return;
  try {
    const ref = doc(cdb, 'chapter_answer_sheets', String(sheet.id));
    const payload: any = {
      id: sheet.id,
      topic_id: sheet.topic_id || 1,
      marks_type: sheet.marks_type || '2m',
      access_tier: sheet.access_tier || 'free',
      language: sheet.language || 'Bengali',
      title: sheet.title || '',
      file_name: sheet.file_name || '',
      uploaded_by: sheet.uploaded_by || 'Teacher/Admin',
      timestamp: sheet.timestamp || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    if (sheet.file_data && sheet.file_data.length <= 850000) {
      payload.file_data = sheet.file_data;
    }
    await setDoc(ref, payload, { merge: true });
  } catch (err) {
    console.error(`[CloudSync] Error pushing answer sheet ${sheet.id} to cloud:`, err);
  }
}

// Delete answer sheet from Firestore
async function deleteAnswerSheetFromCloud(sheetId: number | string) {
  const cdb = getCloudDb();
  if (!cdb) return;
  try {
    const ref = doc(cdb, 'chapter_answer_sheets', String(sheetId));
    await deleteDoc(ref);
  } catch (err) {
    console.error(`[CloudSync] Error deleting answer sheet ${sheetId} from cloud:`, err);
  }
}

// Push promo request to Firestore
async function pushPromoRequestToCloud(promo: any) {
  const cdb = getCloudDb();
  if (!cdb || !promo || !promo.id) return;
  try {
    const ref = doc(cdb, 'promo_requests', String(promo.id));
    await setDoc(ref, {
      id: promo.id,
      username: promo.username || '',
      full_name: promo.full_name || '',
      phone: promo.phone || '',
      promo_code: promo.promo_code || '',
      status: promo.status || 'Pending',
      admin_note: promo.admin_note || '',
      timestamp: promo.timestamp || new Date().toISOString(),
      approved_at: promo.approved_at || null,
      updated_at: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.error(`[CloudSync] Error pushing promo_request ${promo.id} to cloud:`, err);
  }
}

// Push user purchase to Firestore
async function pushUserPurchaseToCloud(purchase: any) {
  const cdb = getCloudDb();
  if (!cdb || !purchase || !purchase.id) return;
  try {
    const ref = doc(cdb, 'user_purchases', String(purchase.id));
    await setDoc(ref, {
      id: purchase.id,
      username: purchase.username || '',
      item_type: purchase.item_type || 'BUNDLE',
      item_id: String(purchase.item_id || 'ALL'),
      payment_id: purchase.payment_id || null,
      status: purchase.status || 'Active',
      activated_at: purchase.activated_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.error(`[CloudSync] Error pushing user_purchase ${purchase.id} to cloud:`, err);
  }
}

// Initial full synchronization of questions, users, payments, and answer sheets to/from Firestore
async function initialSyncWithCloud(sqliteDb: any) {
  const cdb = getCloudDb();
  if (!cdb) return;

  try {
    console.log('[CloudSync] Starting initial cloud synchronization check...');

    // 1. Questions Synchronization (Two-Way Union)
    const cloudQuestionsSnap = await getDocs(collection(cdb, 'questions'));
    const cloudQDocs = cloudQuestionsSnap.docs;
    const localQuestions = sqliteDb.prepare('SELECT * FROM questions').all() as any[];

    console.log(`[CloudSync] Questions: Cloud = ${cloudQDocs.length}, Local = ${localQuestions.length}`);

    const cloudQMap = new Map<string, any>();
    for (const d of cloudQDocs) {
      cloudQMap.set(String(d.id), d.data());
    }

    const localQMap = new Map<string, any>();
    for (const lq of localQuestions) {
      localQMap.set(String(lq.id), lq);
    }

    // A. Push local questions missing in cloud
    const missingInCloud = localQuestions.filter(lq => !cloudQMap.has(String(lq.id)));
    if (missingInCloud.length > 0) {
      console.log(`[CloudSync] Pushing ${missingInCloud.length} local questions to Cloud Firestore...`);
      const chunkSize = 250;
      for (let i = 0; i < missingInCloud.length; i += chunkSize) {
        const chunk = missingInCloud.slice(i, i + chunkSize);
        const batch = writeBatch(cdb);
        for (const q of chunk) {
          const ref = doc(cdb, 'questions', String(q.id));
          batch.set(ref, {
            id: q.id,
            topic_id: q.topic_id || 1,
            pyq_year: q.pyq_year || '',
            is_pyq: q.is_pyq || 0,
            question_text: q.question_text || '',
            question_text_en: q.question_text_en || '',
            option_a: q.option_a || '',
            option_a_en: q.option_a_en || '',
            option_b: q.option_b || '',
            option_b_en: q.option_b_en || '',
            option_c: q.option_c || '',
            option_c_en: q.option_c_en || '',
            option_d: q.option_d || '',
            option_d_en: q.option_d_en || '',
            correct_option: q.correct_option || 'A',
            explanation: q.explanation || '',
            explanation_en: q.explanation_en || '',
            difficulty: q.difficulty || 'Medium',
            is_descriptive: q.is_descriptive || 0,
            marks: q.marks || 1,
            model_answer: q.model_answer || '',
            model_answer_en: q.model_answer_en || '',
            marking_scheme: q.marking_scheme || '',
            marking_scheme_en: q.marking_scheme_en || '',
            q_type: q.q_type || 'MCQ',
            updated_at: new Date().toISOString()
          }, { merge: true });
        }
        await batch.commit();
      }
    }

    // B. Pull cloud questions missing locally
    const missingInLocal = cloudQDocs.filter(d => !localQMap.has(String(d.id)));
    if (missingInLocal.length > 0) {
      console.log(`[CloudSync] Pulling ${missingInLocal.length} cloud questions to local SQLite...`);
      const insertQ = sqliteDb.prepare(`
        INSERT OR REPLACE INTO questions 
        (id, topic_id, pyq_year, is_pyq, question_text, question_text_en, option_a, option_a_en,
         option_b, option_b_en, option_c, option_c_en, option_d, option_d_en, correct_option,
         explanation, explanation_en, difficulty, is_descriptive, marks, model_answer,
         model_answer_en, marking_scheme, marking_scheme_en, q_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const docSnap of missingInLocal) {
        const q = docSnap.data();
        insertQ.run(
          q.id, q.topic_id || 1, q.pyq_year || '', q.is_pyq || 0, q.question_text || '', q.question_text_en || '',
          q.option_a || '', q.option_a_en || '', q.option_b || '', q.option_b_en || '',
          q.option_c || '', q.option_c_en || '', q.option_d || '', q.option_d_en || '',
          q.correct_option || 'A', q.explanation || '', q.explanation_en || '',
          q.difficulty || 'Medium', q.is_descriptive || 0, q.marks || 1, q.model_answer || '',
          q.model_answer_en || '', q.marking_scheme || '', q.marking_scheme_en || '', q.q_type || 'MCQ'
        );
      }
    }

    // 2. Sync Users (Two-Way)
    const cloudUsersSnap = await getDocs(collection(cdb, 'users'));
    const localUsers = sqliteDb.prepare('SELECT * FROM users').all() as any[];
    console.log(`[CloudSync] Users count: Cloud = ${cloudUsersSnap.size}, Local = ${localUsers.length}`);

    for (const u of localUsers) {
      const existsInCloud = cloudUsersSnap.docs.some(d => d.id === u.username);
      if (!existsInCloud) {
        await pushUserToCloud(u);
      }
    }

    const insertUser = sqliteDb.prepare(`
      INSERT OR REPLACE INTO users 
      (id, username, password, role, full_name, school_name, class_grade, phone, district, email, approved, is_admin, referral_code, referral_count, mp_exam_year, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    cloudUsersSnap.forEach((docSnap) => {
      const u = docSnap.data();
      const local = localUsers.find(lu => lu.username === u.username);
      if (!local) {
        insertUser.run(
          u.id || null, u.username, u.password, u.role || 'student', u.full_name || '',
          u.school_name || '', u.class_grade || '10', u.phone || '', u.district || '',
          u.email || '', u.approved || 0, u.is_admin || 0, u.referral_code || '', u.referral_count || 0,
          u.mp_exam_year || 2027, u.created_at || new Date().toISOString()
        );
      }
    });

    // 3. Sync Payments (Two-Way)
    const cloudPaymentsSnap = await getDocs(collection(cdb, 'payments'));
    const localPayments = sqliteDb.prepare('SELECT * FROM payments').all() as any[];
    for (const p of localPayments) {
      const existsInCloud = cloudPaymentsSnap.docs.some(d => d.id === String(p.id));
      if (!existsInCloud) {
        await pushPaymentToCloud(p);
      }
    }
    const insertPay = sqliteDb.prepare(`
      INSERT OR REPLACE INTO payments 
      (id, username, user_name, user_role, phone, item_type, item_id, amount, upi_ref, status, admin_note, timestamp, approved_at, screenshot_file_name, screenshot_file_data)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    cloudPaymentsSnap.forEach((docSnap) => {
      const p = docSnap.data();
      const localExists = localPayments.some(lp => String(lp.id) === String(p.id));
      if (!localExists) {
        insertPay.run(
          p.id, p.username, p.user_name || '', p.user_role || '', p.phone || '',
          p.item_type || '', p.item_id || '', p.amount || 0, p.upi_ref || '',
          p.status || 'Pending Verification', p.admin_note || '', p.timestamp || '',
          p.approved_at || null, p.screenshot_file_name || null, p.screenshot_file_data || null
        );
      }
    });

    // 4. Sync Chapter Answer Sheets (Two-Way)
    const cloudSheetsSnap = await getDocs(collection(cdb, 'chapter_answer_sheets'));
    const localSheets = sqliteDb.prepare('SELECT * FROM chapter_answer_sheets').all() as any[];
    for (const s of localSheets) {
      const existsInCloud = cloudSheetsSnap.docs.some(d => d.id === String(s.id));
      if (!existsInCloud) {
        await pushAnswerSheetToCloud(s);
      }
    }
    const insertSheet = sqliteDb.prepare(`
      INSERT OR REPLACE INTO chapter_answer_sheets (id, topic_id, marks_type, access_tier, language, title, file_name, file_data, uploaded_by, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    cloudSheetsSnap.forEach((docSnap) => {
      const s = docSnap.data();
      const local = localSheets.find(ls => String(ls.id) === String(s.id));
      if (!local || (!local.file_data && s.file_data)) {
        insertSheet.run(
          s.id, s.topic_id || 1, s.marks_type || '2m', s.access_tier || 'free',
          s.language || 'Bengali', s.title || 'Answer Sheet', s.file_name || '',
          s.file_data || local?.file_data || '', s.uploaded_by || 'Teacher/Admin', s.timestamp || new Date().toISOString()
        );
      }
    });

    // 5. Sync User Purchases (Two-Way)
    const cloudPurchasesSnap = await getDocs(collection(cdb, 'user_purchases'));
    const localPurchases = sqliteDb.prepare('SELECT * FROM user_purchases').all() as any[];
    for (const p of localPurchases) {
      const existsInCloud = cloudPurchasesSnap.docs.some(d => d.id === String(p.id));
      if (!existsInCloud) {
        await pushUserPurchaseToCloud(p);
      }
    }
    const insertPurchase = sqliteDb.prepare(`
      INSERT OR REPLACE INTO user_purchases (id, username, item_type, item_id, payment_id, status, activated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    cloudPurchasesSnap.forEach((docSnap) => {
      const p = docSnap.data();
      const localExists = localPurchases.some(lp => String(lp.id) === String(p.id));
      if (!localExists) {
        insertPurchase.run(
          p.id || null, p.username, p.item_type || 'BUNDLE', String(p.item_id || 'ALL'),
          p.payment_id || null, p.status || 'Active', p.activated_at || new Date().toISOString()
        );
      }
    });

    // 6. Sync Promo Requests (Two-Way)
    const cloudPromoSnap = await getDocs(collection(cdb, 'promo_requests'));
    const localPromos = sqliteDb.prepare('SELECT * FROM promo_requests').all() as any[];
    for (const pr of localPromos) {
      const existsInCloud = cloudPromoSnap.docs.some(d => d.id === String(pr.id));
      if (!existsInCloud) {
        await pushPromoRequestToCloud(pr);
      }
    }
    const insertPromo = sqliteDb.prepare(`
      INSERT OR REPLACE INTO promo_requests (id, username, full_name, phone, promo_code, status, admin_note, timestamp, approved_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    cloudPromoSnap.forEach((docSnap) => {
      const pr = docSnap.data();
      const localExists = localPromos.some(lp => String(lp.id) === String(pr.id));
      if (!localExists) {
        insertPromo.run(
          pr.id || null, pr.username, pr.full_name || '', pr.phone || '',
          pr.promo_code || '', pr.status || 'Pending', pr.admin_note || '',
          pr.timestamp || new Date().toISOString(), pr.approved_at || null
        );
      }
    });

    console.log('[CloudSync] Full two-way cloud synchronization completed successfully!');
  } catch (err) {
    console.error('[CloudSync] Error during initialSyncWithCloud:', err);
  }
}

// Background sync loop
function startPeriodicCloudSync(sqliteDb: any) {
  setInterval(async () => {
    const cdb = getCloudDb();
    if (!cdb) return;
    try {
      // 1. Sync Users
      const usersSnap = await getDocs(collection(cdb, 'users'));
      const updateUserStmt = sqliteDb.prepare(`
        INSERT OR REPLACE INTO users 
        (id, username, password, role, full_name, school_name, class_grade, phone, district, email, approved, is_admin, referral_code, referral_count, mp_exam_year, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      usersSnap.forEach((docSnap) => {
        const u = docSnap.data();
        const local = sqliteDb.prepare('SELECT approved, role, password, email FROM users WHERE username = ?').get(u.username) as any;
        if (!local || local.approved !== u.approved || local.role !== u.role || local.password !== u.password || local.email !== u.email) {
          updateUserStmt.run(
            u.id || null, u.username, u.password, u.role || 'student', u.full_name || '',
            u.school_name || '', u.class_grade || '10', u.phone || '', u.district || '',
            u.email || '', u.approved || 0, u.is_admin || 0, u.referral_code || '', u.referral_count || 0,
            u.mp_exam_year || 2027, u.created_at || new Date().toISOString()
          );
        }
      });

      // 2. Sync Payments
      const paymentsSnap = await getDocs(collection(cdb, 'payments'));
      const updatePaymentStmt = sqliteDb.prepare(`
        INSERT OR REPLACE INTO payments 
        (id, username, user_name, user_role, phone, item_type, item_id, amount, upi_ref, status, admin_note, timestamp, approved_at, screenshot_file_name, screenshot_file_data)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      paymentsSnap.forEach((docSnap) => {
        const p = docSnap.data();
        const localP = sqliteDb.prepare('SELECT status FROM payments WHERE id = ?').get(p.id) as any;
        if (!localP || localP.status !== p.status) {
          updatePaymentStmt.run(
            p.id, p.username, p.user_name || '', p.user_role || '', p.phone || '',
            p.item_type || '', p.item_id || '', p.amount || 0, p.upi_ref || '',
            p.status || 'Pending Verification', p.admin_note || '', p.timestamp || '',
            p.approved_at || null, p.screenshot_file_name || null, p.screenshot_file_data || null
          );
        }
      });

      // 3. Sync Answer Sheets
      const sheetsSnap = await getDocs(collection(cdb, 'chapter_answer_sheets'));
      const updateSheetStmt = sqliteDb.prepare(`
        INSERT OR REPLACE INTO chapter_answer_sheets (id, topic_id, marks_type, access_tier, language, title, file_name, file_data, uploaded_by, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      sheetsSnap.forEach((docSnap) => {
        const s = docSnap.data();
        const localS = sqliteDb.prepare('SELECT timestamp, file_data FROM chapter_answer_sheets WHERE id = ?').get(s.id) as any;
        if (!localS || (!localS.file_data && s.file_data)) {
          updateSheetStmt.run(
            s.id, s.topic_id || 1, s.marks_type || '2m', s.access_tier || 'free',
            s.language || 'Bengali', s.title || 'Answer Sheet', s.file_name || '',
            s.file_data || localS?.file_data || '', s.uploaded_by || 'Teacher/Admin', s.timestamp || new Date().toISOString()
          );
        }
      });

      // 4. Sync User Purchases
      const purchasesSnap = await getDocs(collection(cdb, 'user_purchases'));
      const updatePurchaseStmt = sqliteDb.prepare(`
        INSERT OR REPLACE INTO user_purchases (id, username, item_type, item_id, payment_id, status, activated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      purchasesSnap.forEach((docSnap) => {
        const p = docSnap.data();
        const localP = sqliteDb.prepare('SELECT status FROM user_purchases WHERE id = ?').get(p.id) as any;
        if (!localP || localP.status !== p.status) {
          updatePurchaseStmt.run(
            p.id || null, p.username, p.item_type || 'BUNDLE', String(p.item_id || 'ALL'),
            p.payment_id || null, p.status || 'Active', p.activated_at || new Date().toISOString()
          );
        }
      });

      // 5. Sync Promo Requests
      const promoSnap = await getDocs(collection(cdb, 'promo_requests'));
      const updatePromoStmt = sqliteDb.prepare(`
        INSERT OR REPLACE INTO promo_requests (id, username, full_name, phone, promo_code, status, admin_note, timestamp, approved_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      promoSnap.forEach((docSnap) => {
        const pr = docSnap.data();
        const localPr = sqliteDb.prepare('SELECT status FROM promo_requests WHERE id = ?').get(pr.id) as any;
        if (!localPr || localPr.status !== pr.status) {
          updatePromoStmt.run(
            pr.id || null, pr.username, pr.full_name || '', pr.phone || '',
            pr.promo_code || '', pr.status || 'Pending', pr.admin_note || '',
            pr.timestamp || new Date().toISOString(), pr.approved_at || null
          );
        }
      });
    } catch (e) {
      // quiet
    }
  }, 10000);
}

const DB_PATH = path.resolve(process.cwd(), 'geography_exam.db');
const db = new DatabaseSync(DB_PATH);

// Helper to run migrations if not already run
function initSchema() {
  try {
    try {
      db.exec(`
        PRAGMA busy_timeout = 10000;
        PRAGMA journal_mode = DELETE;
        PRAGMA synchronous = NORMAL;
        PRAGMA cache_size = -32000;
        PRAGMA temp_store = MEMORY;
      `);
    } catch (e) {
      console.warn('SQLite PRAGMA warning:', e);
    }

  db.exec(`
    CREATE TABLE IF NOT EXISTS exams (
      id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, description TEXT
    );
    CREATE TABLE IF NOT EXISTS topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT, exam_id INTEGER, name TEXT,
      FOREIGN KEY(exam_id) REFERENCES exams(id)
    );
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT, topic_id INTEGER,
      pyq_year TEXT DEFAULT '', is_pyq INTEGER DEFAULT 0,
      question_text TEXT, question_text_en TEXT,
      option_a TEXT, option_a_en TEXT, option_b TEXT, option_b_en TEXT,
      option_c TEXT, option_c_en TEXT, option_d TEXT, option_d_en TEXT,
      correct_option CHAR(1), explanation TEXT, explanation_en TEXT,
      difficulty TEXT DEFAULT 'Medium', is_descriptive INTEGER DEFAULT 0,
      marks INTEGER DEFAULT 1, model_answer TEXT, model_answer_en TEXT,
      marking_scheme TEXT, marking_scheme_en TEXT,
      q_type TEXT DEFAULT 'MCQ',
      FOREIGN KEY(topic_id) REFERENCES topics(id)
    );
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE,
      password TEXT, role TEXT DEFAULT 'student', full_name TEXT,
      school_name TEXT, class_grade TEXT, phone TEXT, district TEXT,
      email TEXT DEFAULT '',
      approved INTEGER DEFAULT 0, is_admin INTEGER DEFAULT 0,
      referral_code TEXT DEFAULT '', referral_count INTEGER DEFAULT 0,
      mp_exam_year INTEGER DEFAULT 2027,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS student_scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT, student_name TEXT,
      student_phone TEXT, school_name TEXT, district TEXT, exam_name TEXT,
      topic_name TEXT, score INTEGER, total_questions INTEGER,
      percentage REAL, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS student_doubts (
      id INTEGER PRIMARY KEY AUTOINCREMENT, student_username TEXT,
      student_name TEXT, question_id INTEGER,
      doubt_text TEXT DEFAULT '',
      assigned_teacher_username TEXT DEFAULT '',
      teacher_answer TEXT DEFAULT '', status TEXT DEFAULT 'Pending',
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS mock_tests (
      id INTEGER PRIMARY KEY AUTOINCREMENT, test_type TEXT, code_num TEXT,
      file_name TEXT, file_data TEXT, uploader TEXT, price INTEGER DEFAULT 0,
      is_published INTEGER DEFAULT 1, language TEXT DEFAULT 'Bengali', timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS system_settings (
      key TEXT PRIMARY KEY, value TEXT
    );
    CREATE TABLE IF NOT EXISTS duplicate_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT, original_q_id INTEGER,
      duplicate_q_id INTEGER, similarity REAL, removed_by TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS ask_corner (
      id INTEGER PRIMARY KEY AUTOINCREMENT, submitter_username TEXT,
      submitter_name TEXT, submitter_role TEXT, category TEXT,
      message TEXT, admin_reply TEXT DEFAULT '', status TEXT DEFAULT 'New',
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, user_name TEXT,
      user_role TEXT, phone TEXT, item_type TEXT, item_id TEXT,
      amount INTEGER, upi_ref TEXT, status TEXT DEFAULT 'Pending Verification',
      admin_note TEXT DEFAULT '', timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      approved_at DATETIME
    );
    CREATE TABLE IF NOT EXISTS user_purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, item_type TEXT,
      item_id TEXT, payment_id INTEGER, status TEXT DEFAULT 'Active',
      activated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS exam_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT, student_username TEXT,
      student_name TEXT, exam_type TEXT, exam_code TEXT,
      answer_file_name TEXT, answer_file_data TEXT,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      checker_username TEXT DEFAULT '', status TEXT DEFAULT 'Submitted',
      corrected_file_name TEXT DEFAULT '', corrected_file_data TEXT,
      corrected_at DATETIME, admin_note TEXT DEFAULT '',
      teacher_corrected_file_name TEXT DEFAULT '',
      teacher_corrected_file_data TEXT,
      teacher_note TEXT DEFAULT '',
      teacher_submitted_at DATETIME
    );
    CREATE TABLE IF NOT EXISTS teacher_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT, teacher_username TEXT,
      teacher_name TEXT, sub_type TEXT, title TEXT, description TEXT,
      file_name TEXT, file_data TEXT,
      status TEXT DEFAULT 'Pending Admin Review',
      admin_note TEXT DEFAULT '', published_mock_id INTEGER DEFAULT 0,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS admin_notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT, student_username TEXT,
      title TEXT, message TEXT, priority TEXT DEFAULT 'Info',
      is_read INTEGER DEFAULT 0, created_by TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS chapter_answer_sheets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      topic_id INTEGER,
      marks_type TEXT DEFAULT 'all',
      access_tier TEXT DEFAULT 'paid',
      title TEXT,
      file_name TEXT,
      file_data TEXT,
      uploaded_by TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(topic_id) REFERENCES topics(id)
    );
    CREATE TABLE IF NOT EXISTS promo_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, full_name TEXT,
      phone TEXT, promo_code TEXT, status TEXT DEFAULT 'Pending',
      admin_note TEXT DEFAULT '', timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      approved_at DATETIME
    );
    CREATE TABLE IF NOT EXISTS co_admin_actions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action_type TEXT,
      co_admin_username TEXT,
      co_admin_name TEXT,
      co_admin_phone TEXT,
      target_user_id INTEGER,
      target_user_name TEXT,
      target_user_role TEXT,
      target_user_phone TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      reviewed_by TEXT DEFAULT '',
      reviewed_at DATETIME
    );
  `);

  // Migrations for existing databases
  try {
    db.exec('ALTER TABLE users ADD COLUMN mp_exam_year INTEGER DEFAULT 2027;');
  } catch {}
  try {
    db.exec("ALTER TABLE student_doubts ADD COLUMN doubt_text TEXT DEFAULT '';");
  } catch {}
  try {
    db.exec('ALTER TABLE payments ADD COLUMN screenshot_file_name TEXT;');
  } catch {}
  try {
    db.exec('ALTER TABLE payments ADD COLUMN screenshot_file_data TEXT;');
  } catch {}
  try {
    db.exec("ALTER TABLE chapter_answer_sheets ADD COLUMN access_tier TEXT DEFAULT 'paid';");
  } catch {}
  try {
    db.exec("ALTER TABLE chapter_answer_sheets ADD COLUMN language TEXT DEFAULT 'Bengali';");
  } catch {}
  try {
    db.exec("ALTER TABLE mock_tests ADD COLUMN language TEXT DEFAULT 'Bengali';");
  } catch {}
  try {
    db.exec("ALTER TABLE users ADD COLUMN email TEXT DEFAULT '';");
  } catch {}
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS mock_exam_access_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mock_id INTEGER,
        mock_code TEXT,
        student_username TEXT,
        student_name TEXT,
        student_phone TEXT,
        ip_address TEXT,
        device_info TEXT,
        status TEXT DEFAULT 'Pending',
        admin_note TEXT DEFAULT '',
        approved_by TEXT DEFAULT '',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        approved_at DATETIME
      );
      CREATE INDEX IF NOT EXISTS idx_mock_req_student ON mock_exam_access_requests(student_username, mock_id);
    `);
  } catch {}
  try {
    db.exec('CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);');
    db.exec('CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);');
    db.exec('CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions(topic_id);');
    db.exec('CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(username);');
    db.exec('CREATE INDEX IF NOT EXISTS idx_purchases_user ON user_purchases(username);');
    db.exec('CREATE INDEX IF NOT EXISTS idx_answer_sheets_topic ON chapter_answer_sheets(topic_id);');
    db.exec('CREATE INDEX IF NOT EXISTS idx_answer_sheets_tier ON chapter_answer_sheets(topic_id, marks_type, access_tier);');
    db.exec('CREATE INDEX IF NOT EXISTS idx_answer_sheets_lang ON chapter_answer_sheets(topic_id, marks_type, access_tier, language);');
  } catch {}

  // Ensure default syllabus topics are present and durable
  try {
    const examRow = db.prepare("SELECT id FROM exams WHERE name = 'Madhyamik Geography'").get() as any;
    let examId = examRow ? examRow.id : 1;
    if (!examRow) {
      const ex = db.prepare("INSERT INTO exams (name, description) VALUES ('Madhyamik Geography', 'WBBSE Class 10 Geography Exam')").run();
      examId = ex.lastInsertRowid;
    }

    const topicCount = (db.prepare('SELECT COUNT(*) as c FROM topics').get() as any).c;
    if (topicCount === 0) {
      const defaultTopics = [
        '১ম অধ্যায়: বহির্জাত প্রক্রিয়া ও তাদের দ্বারা সৃষ্ট ভূমিরূপ',
        '২য় অধ্যায়: বায়ুমণ্ডল (Atmosphere)',
        '৩য় অধ্যায়: বারিমণ্ডল (Hydrosphere)',
        '৪র্থ অধ্যায়: বর্জ্য ব্যবস্থাপনা (Waste Management)',
        '৫ম অধ্যায়: ভারত - প্রাকৃতিক পরিবেশ',
        '৫ম অধ্যায়: ভারত - অর্থনৈতিক পরিবেশ',
        '৬ষ্ঠ অধ্যায়: উপগ্রহ চিত্র ও ভূ-বৈচিত্র্যসূচক মানচিত্র'
      ];
      for (const t of defaultTopics) {
        db.prepare('INSERT INTO topics (exam_id, name) VALUES (?, ?)').run(examId, t);
      }
    }
  } catch (e) {
    console.error('Topic seeding error:', e);
  }

  // Clear existing mock tests and suggestions per user request so numbering starts cleanly from 001
  try {
    const hasResetMock = db.prepare("SELECT value FROM system_settings WHERE key = 'mock_tests_reset_001'").get() as any;
    if (!hasResetMock) {
      db.exec('DELETE FROM mock_tests;');
      try {
        db.exec("DELETE FROM sqlite_sequence WHERE name = 'mock_tests';");
      } catch {}
      db.prepare("INSERT INTO system_settings (key, value) VALUES ('mock_tests_reset_001', 'true')").run();
      console.log('Legacy mock tests successfully cleared. Fresh consecutive numbering (001, 002...) active.');
    }
  } catch (e) {
    console.error('Mock reset error:', e);
  }

  // Auto-clean any questions where answer was concatenated into question_text
  try {
    const dirtyQuestions = db.prepare(`
      SELECT id, question_text, correct_option, model_answer, q_type, marks, option_a, option_b
      FROM questions
      WHERE question_text LIKE '%উত্তর:%' OR question_text LIKE '%উত্তর -%' OR question_text LIKE '%উঃ:%' OR question_text LIKE '%Ans:%'
    `).all() as any[];

    for (const dq of dirtyQuestions) {
      const m = /(?:[\s।\?]+)(?:সঠিক\s*উত্তর|সঠিক\s*উঃ|উত্তর|উঃ|উ|Answer|Ans)\s*[:\-–।]\s*(.+)$/i.exec(dq.question_text);
      if (m) {
        const cleanQ = dq.question_text.substring(0, m.index).trim();
        const cleanAns = m[1].trim();
        const hasOpts = Boolean((dq.option_a && dq.option_a.trim()) || (dq.option_b && dq.option_b.trim()));
        const newQType = hasOpts ? 'MCQ' : (dq.marks === 2 ? '2M' : (dq.marks === 3 ? '3M' : (dq.marks >= 5 ? '5M' : 'SAQ')));
        db.prepare(`
          UPDATE questions
          SET question_text = ?, correct_option = ?, model_answer = ?, q_type = ?
          WHERE id = ?
        `).run(cleanQ, cleanAns, cleanAns, newQType, dq.id);
      }
    }
  } catch (e) {
    console.error('Question cleanup error:', e);
  }

  // Auto-normalize all questions to canonical marks and q_type values (2M, 3M, 5M, MCQ, SAQ)
  try {
    db.exec(`
      UPDATE questions SET marks = 1, q_type = 'MCQ' WHERE (q_type = '1' OR q_type = 'MCQ') AND ((option_a IS NOT NULL AND trim(option_a) != '') OR (option_b IS NOT NULL AND trim(option_b) != ''));
      UPDATE questions SET marks = 2, q_type = '2M' WHERE q_type = '2' OR q_type = '2M' OR marks = 2;
      UPDATE questions SET marks = 3, q_type = '3M' WHERE q_type = '3' OR q_type = '3M' OR marks = 3;
      UPDATE questions SET marks = 5, q_type = '5M' WHERE q_type = '5' OR q_type = '5M' OR q_type = 'Broad' OR marks >= 5;
      UPDATE questions SET marks = 1, q_type = 'SAQ' WHERE (q_type = '1' OR q_type = 'SAQ' OR marks = 1) AND ((option_a IS NULL OR trim(option_a) = '') AND (option_b IS NULL OR trim(option_b) = '')) AND q_type NOT IN ('2', '2M', '3', '3M', '5', '5M', 'Broad');
    `);
  } catch (e) {
    console.error('Question type normalization error:', e);
  }
  } catch (schemaErr) {
    console.error('Critical initSchema error caught:', schemaErr);
  }
}

// Durable database snapshot file for zero-data-loss container persistence
const SNAPSHOT_FILE = path.resolve(process.cwd(), 'public', 'database_snapshot_persistent.json');

function savePersistentSnapshot() {
  try {
    const questions = db.prepare('SELECT * FROM questions').all();
    const topics = db.prepare('SELECT * FROM topics').all();
    const users = db.prepare('SELECT id, username, password, role, full_name, school_name, class_grade, phone, district, approved, is_admin, referral_code, referral_count, mp_exam_year, created_at FROM users').all();
    const payments = db.prepare('SELECT * FROM payments').all();
    const chapter_answer_sheets = db.prepare('SELECT * FROM chapter_answer_sheets').all();
    const user_purchases = db.prepare('SELECT * FROM user_purchases').all();
    const promo_requests = db.prepare('SELECT * FROM promo_requests').all();
    const mock_tests = db.prepare('SELECT * FROM mock_tests').all();
    const system_settings = db.prepare('SELECT * FROM system_settings').all();

    const snapshot = {
      timestamp: new Date().toISOString(),
      total_questions: questions.length,
      total_users: users.length,
      total_answer_sheets: chapter_answer_sheets.length,
      total_payments: payments.length,
      total_purchases: user_purchases.length,
      total_promo_requests: promo_requests.length,
      topics,
      questions,
      users,
      payments,
      chapter_answer_sheets,
      user_purchases,
      promo_requests,
      mock_tests,
      system_settings
    };

    fs.writeFileSync(SNAPSHOT_FILE, JSON.stringify(snapshot, null, 2), 'utf-8');
    console.log(`[Auto-Backup] Saved database snapshot to persistent JSON (${questions.length} questions, ${chapter_answer_sheets.length} answer sheets, ${user_purchases.length} purchases).`);
  } catch (err) {
    console.error('Error saving persistent database snapshot:', err);
  }
}

function autoRestoreSnapshotIfEmpty() {
  try {
    if (!fs.existsSync(SNAPSHOT_FILE)) return;
    const snap = JSON.parse(fs.readFileSync(SNAPSHOT_FILE, 'utf-8'));
    if (!snap) return;

    // 1. Questions
    const qCount = (db.prepare('SELECT count(*) as c FROM questions').get() as any).c;
    if (qCount === 0 && Array.isArray(snap.questions) && snap.questions.length > 0) {
      console.log(`[Auto-Restore] Restoring ${snap.questions.length} questions from persistent snapshot...`);
      db.exec('BEGIN IMMEDIATE;');
      const insertQ = db.prepare(`
        INSERT OR IGNORE INTO questions 
        (id, topic_id, pyq_year, is_pyq, question_text, question_text_en, option_a, option_a_en,
         option_b, option_b_en, option_c, option_c_en, option_d, option_d_en, correct_option,
         explanation, explanation_en, difficulty, is_descriptive, marks, model_answer,
         model_answer_en, marking_scheme, marking_scheme_en, q_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const q of snap.questions) {
        insertQ.run(
          q.id, q.topic_id, q.pyq_year || '', q.is_pyq || 0, q.question_text, q.question_text_en || '',
          q.option_a || '', q.option_a_en || '', q.option_b || '', q.option_b_en || '',
          q.option_c || '', q.option_c_en || '', q.option_d || '', q.option_d_en || '',
          q.correct_option || 'A', q.explanation || '', q.explanation_en || '',
          q.difficulty || 'Medium', q.is_descriptive || 0, q.marks || 1, q.model_answer || '',
          q.model_answer_en || '', q.marking_scheme || '', q.marking_scheme_en || '', q.q_type || 'MCQ'
        );
      }
      db.exec('COMMIT;');
      console.log(`[Auto-Restore] Successfully restored ${snap.questions.length} questions.`);
    }

    // 2. Answer sheets
    const sheetCount = (db.prepare('SELECT count(*) as c FROM chapter_answer_sheets').get() as any).c;
    if (sheetCount === 0 && Array.isArray(snap.chapter_answer_sheets) && snap.chapter_answer_sheets.length > 0) {
      console.log(`[Auto-Restore] Restoring ${snap.chapter_answer_sheets.length} answer sheets...`);
      const insertSheet = db.prepare(`
        INSERT OR REPLACE INTO chapter_answer_sheets (id, topic_id, marks_type, access_tier, language, title, file_name, file_data, uploaded_by, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const s of snap.chapter_answer_sheets) {
        insertSheet.run(s.id, s.topic_id, s.marks_type, s.access_tier, s.language, s.title, s.file_name, s.file_data, s.uploaded_by, s.timestamp);
      }
    }

    // 3. User Purchases
    const purchaseCount = (db.prepare('SELECT count(*) as c FROM user_purchases').get() as any).c;
    if (purchaseCount === 0 && Array.isArray(snap.user_purchases) && snap.user_purchases.length > 0) {
      console.log(`[Auto-Restore] Restoring ${snap.user_purchases.length} user purchases...`);
      const insertPurchase = db.prepare(`
        INSERT OR REPLACE INTO user_purchases (id, username, item_type, item_id, payment_id, status, activated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      for (const p of snap.user_purchases) {
        insertPurchase.run(p.id, p.username, p.item_type, p.item_id, p.payment_id, p.status, p.activated_at);
      }
    }

    // 4. Promo Requests
    const promoCount = (db.prepare('SELECT count(*) as c FROM promo_requests').get() as any).c;
    if (promoCount === 0 && Array.isArray(snap.promo_requests) && snap.promo_requests.length > 0) {
      console.log(`[Auto-Restore] Restoring ${snap.promo_requests.length} promo requests...`);
      const insertPromo = db.prepare(`
        INSERT OR REPLACE INTO promo_requests (id, username, full_name, phone, promo_code, status, admin_note, timestamp, approved_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const pr of snap.promo_requests) {
        insertPromo.run(pr.id, pr.username, pr.full_name, pr.phone, pr.promo_code, pr.status, pr.admin_note, pr.timestamp, pr.approved_at);
      }
    }
  } catch (err) {
    console.error('[Auto-Restore] Error auto-restoring snapshot:', err);
  }
}

initSchema();
autoRestoreSnapshotIfEmpty();

// OFFLINE BENGALI→ENGLISH DICTIONARY
const BN_EN_DICT: Record<string, string> = {
  "কোনটি": "Which one", "কোন": "Which", "কে": "Who", "কি": "What", "কী": "What",
  "কেন": "Why", "কোথায়": "Where", "কখন": "When", "কিভাবে": "How", "কত": "How many",
  "সর্বপ্রথম": "First", "সর্বপ্রধান": "Most important", "প্রধান": "Main", "মূল": "Main",
  "নাম": "Name", "নাম কি": "What is the name", "কি নামে পরিচিত": "known as",
  "উদাহরণ": "Example", "বিশেষ": "Special", "ভিন্ন": "Different", "একই": "Same",
  "ভূগোল": "Geography", "ভূবিজ্ঞান": "Geology", "ভূগর্ভ": "Underground",
  "ভূমিরূপ": "Landform", "ভূমিকম্প": "Earthquake", "সুনামি": "Tsunami",
  "বহির্জাত": "Exogenic", "অন্তর্জাত": "Endogenic", "প্রক্রিয়া": "Process",
  "পর্যায়ন": "Gradation", "অবক্ষয়": "Weathering", "ক্ষয়": "Erosion",
  "নদী": "River", "নদ": "River", "বদ্বীপ": "Delta", "জলপ্রপাত": "Waterfall",
  "হিমবাহ": "Glacier", "হিম": "Ice", "বায়ু": "Wind", "বাতাস": "Wind",
  "সমুদ্র": "Sea", "সাগর": "Sea", "মহাসাগর": "Ocean", "উপকূল": "Coast",
  "পাহাড়": "Mountain", "পর্বত": "Mountain", "মালভূমি": "Plateau",
  "সমভূমি": "Plain", "উপত্যকা": "Valley", "গিরিখাত": "Canyon",
  "বায়ুমণ্ডল": "Atmosphere", "বারিমণ্ডল": "Hydrosphere", "জীবমণ্ডল": "Biosphere",
  "স্থলমণ্ডল": "Lithosphere", "জলবায়ু": "Climate", "আবহাওয়া": "Weather",
  "তাপমাত্রা": "Temperature", "বৃষ্টিপাত": "Rainfall", "চাপ": "Pressure",
  "বায়ুপ্রবাহ": "Wind flow", "মৌসুমি": "Monsoon", "বর্ষা": "Monsoon",
  "শীত": "Winter", "গ্রীষ্ম": "Summer", "গ্রীষ্মকাল": "Summer season",
  "আর্দ্রতা": "Humidity", "বাষ্পীভবন": "Evaporation", "ঘনীভবন": "Condensation",
  "বর্জ্য": "Waste", "ব্যবস্থাপনা": "Management", "আবর্জনা": "Garbage",
  "দূষণ": "Pollution", "পরিবেশ": "Environment", "পরিস্থিতি": "Situation",
  "ভারত": "India", "বাংলাদেশ": "Bangladesh", "পশ্চিমবঙ্গ": "West Bengal",
  "কলকাতা": "Kolkata", "দিল্লি": "Delhi", "মুম্বাই": "Mumbai",
  "হিমালয়": "Himalaya", "গঙ্গা": "Ganga", "ব্রহ্মপুত্র": "Brahmaputra",
  "সতলুজ": "Sutlej", "যমুনা": "Yamuna", "দামোদর": "Damodar",
  "উপগ্রহ": "Satellite", "চিত্র": "Image", "মানচিত্র": "Map",
  "ভূ-বৈচিত্র্যসূচক": "Topographical", "টোপোগ্রাফিক্যাল": "Topographical",
  "স্কেল": "Scale", "দিক": "Direction", "উচ্চতা": "Height", "গভীরতা": "Depth",
  "অক্ষরেখা": "Latitude", "দ্রাঘিমারেখা": "Longitude", "নিরক্ষরেখা": "Equator",
  "মেরু": "Pole", "উত্তর": "North", "দক্ষিণ": "South", "পূর্ব": "East", "পশ্চিম": "West",
  "প্রথম": "First", "দ্বিতীয়": "Second", "তৃতীয়": "Third", "শেষ": "Last",
  "বড়": "Big", "ছোট": "Small", "উচ্চ": "High", "নিচু": "Low",
  "নতুন": "New", "পুরনো": "Old", "সর্বোচ্চ": "Highest", "সর্বনিম্ন": "Lowest",
  "সঠিক": "Correct", "ভুল": "Wrong", "সম্পূর্ণ": "Complete", "অসম্পূর্ণ": "Incomplete",
  "প্রাকৃতিক": "Natural", "কৃত্রিম": "Artificial", "মানবসৃষ্ট": "Man-made",
  "জীব": "Living", "প্রাণী": "Animal", "উদ্ভিদ": "Plant", "মানুষ": "Human",
  "থেকে": "from", "দ্বারা": "by", "জন্য": "for", "সাথে": "with", "মধ্যে": "in",
  "উপর": "on", "নিচে": "below", "পরে": "after", "আগে": "before",
  "এবং": "and", "বা": "or", "কিন্তু": "but", "তবে": "however",
  "নিচের কোনটি": "Which of the following", "নিম্নলিখিত": "Following",
  "ব্যাখ্যা করুন": "Explain", "বর্ণনা করুন": "Describe",
  "সংক্ষেপে": "Briefly", "উদাহরণ দিন": "Give example",
  "এর প্রভাব": "Its effect", "এর ফলে": "As a result of",
  "ব্যবহার করেন": "used", "আবিष्कार করেন": "discovered",
  "প্রতিষ্ঠা করেন": "established", "গবেষণা": "Research",
  "তত্ত্ব": "Theory", "সূত্র": "Formula", "নীতি": "Principle",
  "শব্দটি": "The word", "শব্দ": "Word", "অর্থ": "Meaning",
  "প্রথম কে": "Who first", "কার": "Whose", "কোথায় অবস্থিত": "located at"
};

function translateGeoSimple(text: string): string {
  if (!text) return "";
  let result = text;
  const sortedKeys = Object.keys(BN_EN_DICT).sort((a, b) => b.length - a.length);
  for (const bn of sortedKeys) {
    if (result.includes(bn)) {
      result = result.replaceAll(bn, ` ${BN_EN_DICT[bn]} `);
    }
  }
  return result.replace(/\s+/g, ' ').trim();
}

function normalizeBengali(text: string): string {
  if (!text) return "";
  return text
    .normalize('NFC')
    .replace(/[\u200B\u200C\u200D]/g, '')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function sanitizeQuestionField(val: any): string {
  if (val === undefined || val === null) return '';
  let str = String(val);
  // Replace escaped markdown punctuation: \., \), \(, \-, \*, \_, \/
  str = str.replace(/\\([.\)\]\(\[\-\*\_\\\/])/g, '$1');
  // Strip trailing backslashes or slashes
  str = str.replace(/[\\\/]+(\s|$)/g, '$1');
  // Strip leading question numbers if leftover, e.g. "1. ", "1) ", "১। ", "1\. "
  str = str.replace(/^\\?\s*(?:[০-৯\d]+)\s*\\?[\)\]\.:।–\-]\s*/, '');
  // Strip wrapping markdown bold/italics
  str = str.replace(/^[*_~`]+|[*_~`]+$/g, '');
  // Normalize whitespace
  str = str.replace(/[\r\n]+/g, ' ').replace(/[ \t]+/g, ' ');
  // Final trim of any remaining trailing slashes or backslashes
  str = str.replace(/[\\\/]+$/, '').trim();
  // Strip leading slash or backslash
  str = str.replace(/^[\\\/]+/, '').trim();
  return str;
}

function similarityRatio(s1: string, s2: string): number {
  const norm1 = s1.replace(/[^\w\s\u0980-\u09FF]/g, '').toLowerCase().trim();
  const norm2 = s2.replace(/[^\w\s\u0980-\u09FF]/g, '').toLowerCase().trim();
  if (norm1 === norm2) return 1.0;
  if (!norm1 || !norm2) return 0.0;
  
  // Bigram Dice coefficient
  const getBigrams = (str: string) => {
    const bigrams = new Set<string>();
    for (let i = 0; i < str.length - 1; i++) {
      bigrams.add(str.substring(i, i + 2));
    }
    return bigrams;
  };
  const b1 = getBigrams(norm1);
  const b2 = getBigrams(norm2);
  let intersection = 0;
  for (const item of b1) {
    if (b2.has(item)) intersection++;
  }
  return (2.0 * intersection) / (b1.size + b2.size || 1);
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Register GeoLabPortal DRM & Master PDF Protection System
  registerDrmModule(app, db, pushPaymentToCloud, pushUserPurchaseToCloud);

  // Settings
  app.get('/api/settings', (req, res) => {
    try {
      const rows = db.prepare('SELECT key, value FROM system_settings').all() as { key: string; value: string }[];
      const settings: Record<string, string> = {
        portal_url: 'https://geography-exam-app.streamlit.app',
        upi_id: 'shawonkar6466-1@oksbi',
        full_access_price: '399',
        bundle_price: '499'
      };
      for (const r of rows) {
        // STRICT PRIVACY: Never expose promo_code to public settings endpoint
        if (r.key !== 'promo_code') {
          settings[r.key] = r.value;
        }
      }
      res.json(settings);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Admin-only Promo Code Management
  app.get('/api/admin/promo_code', (req, res) => {
    try {
      const row = db.prepare("SELECT value FROM system_settings WHERE key = 'promo_code'").get() as any;
      res.json({ promo_code: row?.value || 'ShawonSir@2026' });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/admin/promo_code', (req, res) => {
    try {
      const { promo_code } = req.body;
      if (!promo_code || !promo_code.trim()) {
        return res.status(400).json({ error: 'Promo code cannot be empty' });
      }
      db.prepare("INSERT OR REPLACE INTO system_settings (key, value) VALUES ('promo_code', ?)").run(promo_code.trim());
      res.json({ success: true, promo_code: promo_code.trim() });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/settings', (req, res) => {
    try {
      const { key, value } = req.body;
      db.prepare('INSERT OR REPLACE INTO system_settings (key, value) VALUES (?, ?)').run(key, String(value));
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // 1-Click Database Backup & Restore for 100% Data Durability
  app.get('/api/admin/backup', (req, res) => {
    try {
      const questions = db.prepare('SELECT * FROM questions').all();
      const topics = db.prepare('SELECT * FROM topics').all();
      const users = db.prepare('SELECT id, username, password, role, full_name, school_name, class_grade, phone, district, approved, is_admin, referral_code, referral_count, mp_exam_year, created_at FROM users').all();
      const payments = db.prepare('SELECT * FROM payments').all();
      const mock_tests = db.prepare('SELECT * FROM mock_tests').all();
      const chapter_answer_sheets = db.prepare('SELECT * FROM chapter_answer_sheets').all();
      const system_settings = db.prepare('SELECT * FROM system_settings').all();

      res.json({
        backup_date: new Date().toISOString(),
        total_questions: questions.length,
        total_users: users.length,
        topics,
        questions,
        users,
        payments,
        mock_tests,
        chapter_answer_sheets,
        system_settings
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/admin/restore', (req, res) => {
    try {
      const backup = req.body;
      if (!backup) {
        return res.status(400).json({ error: 'No backup data received' });
      }

      // Support flexible JSON formats (wrapped object, raw array, or nested)
      let questionsList: any[] = [];
      let usersList: any[] = [];
      let paymentsList: any[] = [];
      let mockTestsList: any[] = [];
      let sheetsList: any[] = [];
      let topicsList: any[] = [];

      if (Array.isArray(backup)) {
        questionsList = backup;
      } else if (typeof backup === 'object') {
        if (Array.isArray(backup.questions)) questionsList = backup.questions;
        else if (backup.data && Array.isArray(backup.data.questions)) questionsList = backup.data.questions;
        else if (Array.isArray(backup.items)) questionsList = backup.items;

        if (Array.isArray(backup.users)) usersList = backup.users;
        if (Array.isArray(backup.payments)) paymentsList = backup.payments;
        if (Array.isArray(backup.mock_tests)) mockTestsList = backup.mock_tests;
        if (Array.isArray(backup.chapter_answer_sheets)) sheetsList = backup.chapter_answer_sheets;
        if (Array.isArray(backup.topics)) topicsList = backup.topics;
      }

      if (questionsList.length === 0 && usersList.length === 0 && paymentsList.length === 0 && sheetsList.length === 0) {
        return res.status(400).json({
          error: 'ফাইলে কোনো প্রশ্ন, ছাত্র অ্যাকাউন্ট বা পেমেন্ট রেকর্ড খুঁজে পাওয়া যায়নি। অনুগ্রহ করে সঠিক ব্যাকআপ JSON ফাইল নির্বাচন করুন।'
        });
      }

      let restoredQ = 0;
      let restoredUsers = 0;
      let restoredPayments = 0;
      let restoredSheets = 0;
      let restoredMockTests = 0;

      db.exec('BEGIN IMMEDIATE;');
      try {
        if (topicsList.length > 0) {
          const insertTopic = db.prepare('INSERT OR IGNORE INTO topics (id, exam_id, name) VALUES (?, ?, ?)');
          for (const t of topicsList) {
            insertTopic.run(t.id, t.exam_id || 1, t.name);
          }
        }

        if (questionsList.length > 0) {
          const insertQ = db.prepare(`
            INSERT OR REPLACE INTO questions 
            (id, topic_id, pyq_year, is_pyq, question_text, question_text_en, option_a, option_a_en,
             option_b, option_b_en, option_c, option_c_en, option_d, option_d_en, correct_option,
             explanation, explanation_en, difficulty, is_descriptive, marks, model_answer,
             model_answer_en, marking_scheme, marking_scheme_en, q_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);

          const maxQRow = db.prepare('SELECT MAX(id) as max_id FROM questions').get() as any;
          let autoNextId = Math.max(500, (maxQRow?.max_id || 0) + 1);

          for (const q of questionsList) {
            let qText = (q.question_text || q.text || '').trim();
            let qTextEn = (q.question_text_en || q.text_en || '').trim();
            if (!qText && !qTextEn) continue;

            const qMarks = Number(q.marks) || (q.q_type === '2M' || q.q_type === '2' ? 2 : (q.q_type === '3M' || q.q_type === '3' ? 3 : (q.q_type === '5M' || q.q_type === '5' ? 5 : 1)));
            const qType = q.q_type || (qMarks === 2 ? '2M' : (qMarks === 3 ? '3M' : (qMarks >= 5 ? '5M' : (q.option_a ? 'MCQ' : 'SAQ'))));
            const qId = q.id || autoNextId++;

            insertQ.run(
              qId, q.topic_id || 1, q.pyq_year || '', q.is_pyq || 0,
              qText, qTextEn,
              q.option_a || '', q.option_a_en || '',
              q.option_b || '', q.option_b_en || '',
              q.option_c || '', q.option_c_en || '',
              q.option_d || '', q.option_d_en || '',
              q.correct_option || (qType === 'MCQ' ? 'A' : (q.model_answer || '')),
              q.explanation || '', q.explanation_en || '',
              q.difficulty || 'Medium',
              q.is_descriptive !== undefined ? q.is_descriptive : (qMarks > 1 ? 1 : 0),
              qMarks,
              q.model_answer || '', q.model_answer_en || '',
              q.marking_scheme || '', q.marking_scheme_en || '',
              qType
            );
            restoredQ++;
          }
        }

        if (usersList.length > 0) {
          const insertUser = db.prepare(`
            INSERT OR REPLACE INTO users 
            (id, username, password, role, full_name, school_name, class_grade, phone, district, approved, is_admin, referral_code, referral_count, mp_exam_year, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);
          for (const u of usersList) {
            if (!u.username) continue;
            insertUser.run(
              u.id || null, u.username, u.password || '123456', u.role || 'student',
              u.full_name || '', u.school_name || '', u.class_grade || '10',
              u.phone || '', u.district || '', u.approved !== undefined ? u.approved : 1,
              u.is_admin || 0, u.referral_code || '', u.referral_count || 0,
              u.mp_exam_year || 2027, u.created_at || new Date().toISOString()
            );
            restoredUsers++;
          }
        }

        if (paymentsList.length > 0) {
          const insertPay = db.prepare(`
            INSERT OR REPLACE INTO payments 
            (id, username, user_name, user_role, phone, item_type, item_id, amount, upi_ref, status, admin_note, timestamp, approved_at, screenshot_file_name, screenshot_file_data)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);
          for (const p of paymentsList) {
            const pid = p.id || null;
            const uname = p.username || p.user_id || 'student';
            const fullName = p.user_name || p.student_name || uname;
            const role = p.user_role || 'student';
            const phone = p.phone || p.student_phone || '';
            const itemType = p.item_type || p.plan_type || 'full';
            const itemId = String(p.item_id || 'ALL');
            const amt = Number(p.amount) || 0;
            const upiRef = p.upi_ref || p.utr_number || '';
            const stat = p.status || 'Pending Verification';
            const note = p.admin_note || '';
            const ts = p.timestamp || p.created_at || new Date().toISOString();
            const appr = p.approved_at || null;
            const sName = p.screenshot_file_name || '';
            const sData = p.screenshot_file_data || p.screenshot_data || '';
            insertPay.run(pid, uname, fullName, role, phone, itemType, itemId, amt, upiRef, stat, note, ts, appr, sName, sData);
            restoredPayments++;
          }
        }

        if (mockTestsList.length > 0) {
          const insertMt = db.prepare(`
            INSERT OR REPLACE INTO mock_tests (id, test_type, code_num, file_name, file_data, uploader, price, is_published, timestamp)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);
          for (const m of mockTestsList) {
            insertMt.run(
              m.id || null,
              m.test_type || 'Chapter Wise Mock Test',
              m.code_num || m.title || 'mock-001',
              m.file_name || (m.title ? `${m.title}.pdf` : 'mock.pdf'),
              m.file_data || '',
              m.uploader || 'Admin',
              Number(m.price) || 0,
              m.is_published !== undefined ? m.is_published : 1,
              m.timestamp || m.created_at || new Date().toISOString()
            );
            restoredMockTests++;
          }
        }

        if (sheetsList.length > 0) {
          const insertSheet = db.prepare(`
            INSERT OR REPLACE INTO chapter_answer_sheets (id, topic_id, marks_type, access_tier, language, title, file_name, file_data, uploaded_by, timestamp)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);
          for (const sh of sheetsList) {
            insertSheet.run(
              sh.id || null,
              sh.topic_id || 1,
              sh.marks_type || '2m',
              sh.access_tier || 'free',
              sh.language || 'Bengali',
              sh.title || 'Answer Sheet',
              sh.file_name || 'answer_sheet.pdf',
              sh.file_data || '',
              sh.uploaded_by || 'Teacher/Admin',
              sh.timestamp || new Date().toISOString()
            );
            restoredSheets++;
          }
        }

        db.exec('COMMIT;');
        try {
          db.exec('PRAGMA wal_checkpoint(PASSIVE);');
        } catch {}

        savePersistentSnapshot();

        // Push restored data to Cloud Firestore asynchronously
        (async () => {
          try {
            const allQ = db.prepare('SELECT * FROM questions').all() as any[];
            for (const q of allQ) await pushQuestionToCloud(q);
            const allUsers = db.prepare('SELECT * FROM users').all() as any[];
            for (const u of allUsers) await pushUserToCloud(u);
            const allPayments = db.prepare('SELECT * FROM payments').all() as any[];
            for (const p of allPayments) await pushPaymentToCloud(p);
            const allSheets = db.prepare('SELECT * FROM chapter_answer_sheets').all() as any[];
            for (const s of allSheets) await pushAnswerSheetToCloud(s);
            console.log(`[Restore] Sync to Firestore complete: ${allQ.length} questions, ${allUsers.length} users, ${allPayments.length} payments, ${allSheets.length} answer sheets.`);
          } catch (e) {
            console.error('[Restore] Error syncing restored records to cloud:', e);
          }
        })();

        res.json({
          success: true,
          restored_questions: restoredQ,
          restored_users: restoredUsers,
          restored_payments: restoredPayments,
          restored_sheets: restoredSheets,
          restored_mock_tests: restoredMockTests,
          message: `সফলভাবে রিস্টোর সম্পন্ন হয়েছে: ${restoredQ}টি প্রশ্ন, ${restoredUsers}টি ইউজার, ${restoredPayments}টি পেমেন্ট এবং ${restoredSheets}টি উত্তরপত্র সংরক্ষিত ও ক্লাউডে সিঙ্ক হয়েছে।`
        });
      } catch (err) {
        db.exec('ROLLBACK;');
        throw err;
      }
    } catch (e: any) {
      console.error('Error during /api/admin/restore:', e);
      res.status(500).json({ error: e.message });
    }
  });

  // Auth & Users
  app.post('/api/auth/login', (req, res) => {
    try {
      const username = String(req.body.username || '').trim();
      const password = String(req.body.password || '');
      const role = String(req.body.role || '').trim();

      const isAdminLogin = 
        (role.toLowerCase() === 'admin' || role.toLowerCase() === 'head admin') &&
        (username.toLowerCase() === 'admin' || username === '7001257277') &&
        (password === 'Shawon@123msl2026' || password === 'admin123' || password === 'admin');

      if (isAdminLogin) {
        return res.json({
          success: true,
          user: {
            id: 3,
            username: 'admin',
            role: 'admin',
            full_name: 'Shawon Kar (Head Admin)',
            school_name: 'WBBSE Portal Head',
            phone: '7001257277',
            district: 'Kolkata',
            approved: 1,
            is_admin: 1,
            is_head_admin: true,
            admin_title: 'Head Admin (প্রধান অ্যাডমিন)'
          }
        });
      }

      const user = db.prepare(`
        SELECT id, password, role, full_name, school_name, phone, district, approved, is_admin, referral_code, referral_count, mp_exam_year
        FROM users WHERE (LOWER(username) = LOWER(?) OR phone = ?)
      `).get(username, username) as any;

      if (!user) {
        return res.status(404).json({ error: 'এই ব্যবহারকারী অ্যাকাউন্টটি পাওয়া যায়নি (Account not found)। অনুগ্রহ করে সঠিক তথ্য দিন বা রেজিস্টার করুন।' });
      }
      if (user.password !== password) {
        return res.status(401).json({ error: 'ভুল পাসওয়ার্ড (Wrong password)। অনুগ্রহ করে সঠিক পাসওয়ার্ড দিয়ে চেষ্টা করুন।' });
      }
      if (user.approved !== 1) {
        return res.status(403).json({
          error: '⏳ আপনার অ্যাকাউন্টটি এখনও অ্যাডমিনের অনুমোদনের অপেক্ষায় রয়েছে (Approval Pending)। অ্যাডমিন অনুমোদন করার পর আপনি প্রবেশ করতে পারবেন।'
        });
      }

      // Check validity for students based on MP Examination Year
      if (user.role === 'student' && user.mp_exam_year) {
        const today = new Date();
        const expiryDate = new Date(`${user.mp_exam_year}-03-31T23:59:59`);
        if (today > expiryDate) {
          return res.status(403).json({
            error: `আপনার মাধ্যমিক ব্যাচ (${user.mp_exam_year}) এর মেয়াদ ৩১ মার্চ ${user.mp_exam_year}-এ শেষ হয়েছে। প্রয়োজনে নতুন সেশনের জন্য পুনরায় রেজিস্ট্রেশন করুন বা অ্যাডমিনের সাথে যোগাযোগ করুন।`
          });
        }
      }

      const isUpgradedAdmin = user.is_admin === 1;
      const effectiveRole = isUpgradedAdmin ? 'admin' : user.role;
      const isHeadAdmin = user.phone === '7001257277' || user.username === 'admin';

      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.phone || username,
          role: effectiveRole,
          original_role: user.role,
          full_name: user.full_name,
          school_name: user.school_name,
          phone: user.phone,
          district: user.district,
          email: user.email || '',
          approved: user.approved,
          is_admin: user.is_admin,
          is_head_admin: isHeadAdmin,
          admin_title: isHeadAdmin ? 'Head Admin (প্রধান অ্যাডমিন)' : (isUpgradedAdmin ? 'Co-Admin (সহকারী অ্যাডমিন)' : undefined),
          referral_code: user.referral_code,
          referral_count: user.referral_count,
          mp_exam_year: user.mp_exam_year || 2027
        }
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/auth/register', (req, res) => {
    try {
      const { name, school, class_grade, phone, district, email, password, role, referral_code, mp_exam_year } = req.body;
      if (!name || !school || !phone || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const isStudent = (role || 'student') === 'student';
      const mpYear = isStudent ? (Number(mp_exam_year) || 2027) : null;
      // Admin approval is strictly required for both students and teachers before login
      const initialApproved = 0;

      const prefix = role === 'teacher' ? 'T' : '';
      const auto_ref = `GEO-REF-${prefix}${phone.slice(-4) || '10'}`;
      const userEmail = email ? String(email).trim() : '';

      try {
        db.prepare(`
          INSERT INTO users (username, password, role, full_name, school_name, class_grade, phone, district, email, approved, is_admin, referral_code, mp_exam_year)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
        `).run(phone, password, role || 'student', name, school, class_grade || 'Class 10', phone, district || '', userEmail, initialApproved, auto_ref, mpYear);

        if (referral_code && referral_code.trim()) {
          db.prepare('UPDATE users SET referral_count = referral_count + 1 WHERE referral_code = ?').run(referral_code.trim());
        }

        try {
          const registeredUser = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone) as any;
          if (registeredUser) pushUserToCloud(registeredUser);
        } catch (e) {
          console.error('Error syncing registered user to cloud:', e);
        }

        res.json({
          success: true,
          message: 'রেজিস্ট্রেশন সফলভাবে জমা হয়েছে! আপনার ডেটা নিরাপদে সেভ হয়েছে। অ্যাডমিন অনুমোদন (Admin Approval) করার পর আপনি ফোন নম্বর ও পাসওয়ার্ড দিয়ে লগইন করতে পারবেন।',
          approved: 0,
          user: null
        });
      } catch (err: any) {
        if (err.message && err.message.includes('UNIQUE')) {
          return res.status(409).json({ error: 'এই ফোন নম্বর দিয়ে ইতিমধ্যে অ্যাকাউন্ট রয়েছে। দয়া করে সাইন-ইন করুন।' });
        }
        throw err;
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get('/api/users/profile', (req, res) => {
    try {
      const username = req.query.username as string;
      if (!username) return res.status(400).json({ error: 'Username required' });
      const user = db.prepare(`
        SELECT id, username, role, full_name, school_name, class_grade, phone, district, email, approved, is_admin, referral_code, referral_count, mp_exam_year
        FROM users
        WHERE username = ? OR phone = ?
      `).get(username, username) as any;
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get('/api/users', async (req, res) => {
    try {
      // Live Cloud Firestore sync so registrations on phone show instantly on laptop
      const cdb = getCloudDb();
      if (cdb) {
        try {
          const snap = await getDocs(collection(cdb, 'users'));
          const insertOrUpdate = db.prepare(`
            INSERT OR REPLACE INTO users 
            (id, username, password, role, full_name, school_name, class_grade, phone, district, email, approved, is_admin, referral_code, referral_count, mp_exam_year, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);
          snap.forEach(d => {
            const u = d.data();
            const local = db.prepare('SELECT id, password, approved, email FROM users WHERE username = ? OR phone = ?').get(u.username, u.phone) as any;
            // Respect highest approved status
            const finalApproved = Math.max(local?.approved || 0, u.approved || 0);
            insertOrUpdate.run(
              local?.id || u.id || null, u.username || u.phone, u.password || local?.password || '123456',
              u.role || 'student', u.full_name || '', u.school_name || '', u.class_grade || '10',
              u.phone || '', u.district || '', u.email || local?.email || '', finalApproved, u.is_admin || 0,
              u.referral_code || '', u.referral_count || 0, u.mp_exam_year || 2027,
              u.created_at || new Date().toISOString()
            );
          });
        } catch (err) {}
      }

      const rows = db.prepare(`
        SELECT id, username, role, full_name, school_name, class_grade, phone, district, email, approved, is_admin, referral_code, referral_count, mp_exam_year, created_at
        FROM users
        ORDER BY is_admin DESC, approved ASC, id DESC
      `).all();
      res.json(rows);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // User Account Management & Co-Admin Actions
  app.post('/api/users/approve', (req, res) => {
    try {
      const targetId = Number(req.body.id);
      if (!targetId) return res.status(400).json({ error: 'Valid user ID required' });
      db.prepare('UPDATE users SET approved = 1 WHERE id = ?').run(targetId);
      try {
        const approvedUser = db.prepare('SELECT * FROM users WHERE id = ?').get(targetId) as any;
        if (approvedUser) pushUserToCloud(approvedUser);
      } catch (e) {
        console.error('Error syncing approved user to cloud:', e);
      }
      res.json({ success: true, message: 'User approved successfully' });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/users/upgrade_admin', (req, res) => {
    try {
      const targetId = Number(req.body.id);
      if (!targetId) return res.status(400).json({ error: 'Valid user ID required' });
      db.prepare('UPDATE users SET is_admin = 1, approved = 1 WHERE id = ?').run(targetId);
      res.json({ success: true, message: 'User upgraded to Co-Admin successfully' });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/users/downgrade_admin', (req, res) => {
    try {
      const targetId = Number(req.body.id);
      if (!targetId) return res.status(400).json({ error: 'Valid user ID required' });
      const target = db.prepare('SELECT phone, username FROM users WHERE id = ?').get(targetId) as any;
      if (target && (target.phone === '7001257277' || target.username === 'admin')) {
        return res.status(403).json({ error: 'হেড অ্যাডমিনকে ডিমোট করা যাবে না।' });
      }
      db.prepare('UPDATE users SET is_admin = 0 WHERE id = ?').run(targetId);
      res.json({ success: true, message: 'Admin downgraded to regular Teacher successfully' });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/users/revoke', (req, res) => {
    try {
      const targetId = Number(req.body.id);
      if (!targetId) return res.status(400).json({ error: 'Valid user ID required' });
      const target = db.prepare('SELECT phone, username FROM users WHERE id = ?').get(targetId) as any;
      if (target && (target.phone === '7001257277' || target.username === 'admin')) {
        return res.status(403).json({ error: 'হেড অ্যাডমিনকে সাসপেন্ড করা যাবে না।' });
      }
      db.prepare('UPDATE users SET approved = 0 WHERE id = ?').run(targetId);
      res.json({ success: true, message: 'User suspended successfully' });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/users/delete', (req, res) => {
    try {
      const targetId = Number(req.body.id || req.body.userId);
      if (!targetId) return res.status(400).json({ error: 'Valid user ID required' });
      const target = db.prepare('SELECT phone, username FROM users WHERE id = ?').get(targetId) as any;
      if (target && (target.phone === '7001257277' || target.username === 'admin')) {
        return res.status(403).json({ error: 'হেড অ্যাডমিনকে ডিলিট করা যাবে না।' });
      }
      db.prepare('DELETE FROM users WHERE id = ?').run(targetId);
      if (target && target.username) {
        try {
          const cdb = getCloudDb();
          if (cdb) {
            deleteDoc(doc(cdb, 'users', String(target.username))).catch(() => {});
          }
        } catch {}
      }
      res.json({ success: true, message: 'User deleted successfully' });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Co-Admin Queue Endpoints
  app.get('/api/co_admin_actions', (req, res) => {
    try {
      const rows = db.prepare(`
        SELECT id, action_type, co_admin_username, co_admin_name, co_admin_phone,
               target_user_id, target_user_name, target_user_role, target_user_phone,
               status, created_at, reviewed_by, reviewed_at
        FROM co_admin_actions
        ORDER BY CASE WHEN status = 'pending' THEN 0 ELSE 1 END, id DESC
      `).all();
      res.json(rows);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/co_admin_actions/submit', (req, res) => {
    try {
      const {
        action_type,
        co_admin_username,
        co_admin_name,
        co_admin_phone,
        target_user_id,
        target_user_name,
        target_user_role,
        target_user_phone
      } = req.body;

      if (!action_type || !target_user_id) {
        return res.status(400).json({ error: 'Action type and target user are required' });
      }

      // Check if trying to act on Head Admin
      const target = db.prepare('SELECT phone, username FROM users WHERE id = ?').get(Number(target_user_id)) as any;
      if (target && (target.phone === '7001257277' || target.username === 'admin')) {
        return res.status(403).json({ error: 'হেড অ্যাডমিনের উপর কোনো প্রস্তাব দেওয়া যাবে না।' });
      }

      db.prepare(`
        INSERT INTO co_admin_actions (
          action_type, co_admin_username, co_admin_name, co_admin_phone,
          target_user_id, target_user_name, target_user_role, target_user_phone, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
      `).run(
        action_type,
        co_admin_username || '',
        co_admin_name || 'Co-Admin',
        co_admin_phone || '',
        Number(target_user_id),
        target_user_name || '',
        target_user_role || '',
        target_user_phone || ''
      );

      res.json({
        success: true,
        pendingHeadApproval: true,
        message: 'প্রস্তাবটি হেড অ্যাডমিন (শাওন কর) মহাশয়ের অনুমোদনের জন্য কিউতে পাঠানো হয়েছে। হেড অ্যাডমিন অনুমোদন করলেই এটি কার্যকর হবে।'
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/co_admin_actions/resolve', (req, res) => {
    try {
      const { id, proposal_id, decision, reviewer_name, head_admin_name } = req.body;
      const targetProposalId = Number(id || proposal_id);
      const proposal = db.prepare('SELECT * FROM co_admin_actions WHERE id = ?').get(targetProposalId) as any;
      if (!proposal) {
        return res.status(404).json({ error: 'Proposal not found' });
      }

      const reviewer = reviewer_name || head_admin_name || 'Shawon Kar (Head Admin)';

      if (decision === 'approved') {
        const targetUserId = Number(proposal.target_user_id);
        if (proposal.action_type === 'approve') {
          db.prepare('UPDATE users SET approved = 1 WHERE id = ?').run(targetUserId);
        } else if (proposal.action_type === 'suspend') {
          db.prepare('UPDATE users SET approved = 0 WHERE id = ?').run(targetUserId);
        }

        db.prepare(`
          UPDATE co_admin_actions
          SET status = 'approved', reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).run(reviewer, targetProposalId);

        res.json({ success: true, message: 'প্রস্তাবটি সফলভাবে অনুমোদিত ও প্রয়োগ করা হয়েছে!' });
      } else {
        db.prepare(`
          UPDATE co_admin_actions
          SET status = 'rejected', reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).run(reviewer, targetProposalId);

        res.json({ success: true, message: 'প্রস্তাবটি বাতিল করা হয়েছে।' });
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Topics & Questions
  app.get('/api/topics', (req, res) => {
    try {
      const rows = db.prepare('SELECT id, name FROM topics ORDER BY id ASC').all();
      res.json(rows);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get('/api/questions', (req, res) => {
    try {
      const topic_id = req.query.topic_id;
      let rows;
      if (topic_id) {
        rows = db.prepare(`
          SELECT id, topic_id, question_text, question_text_en, option_a, option_a_en, option_b, option_b_en,
                 option_c, option_c_en, option_d, option_d_en, correct_option, explanation, explanation_en,
                 difficulty, is_descriptive, marks, model_answer, model_answer_en, marking_scheme, marking_scheme_en, q_type
          FROM questions WHERE topic_id = ? ORDER BY id ASC
        `).all(Number(topic_id));
      } else {
        rows = db.prepare(`
          SELECT id, topic_id, question_text, question_text_en, option_a, option_a_en, option_b, option_b_en,
                 option_c, option_c_en, option_d, option_d_en, correct_option, explanation, explanation_en,
                 difficulty, is_descriptive, marks, model_answer, model_answer_en, marking_scheme, marking_scheme_en, q_type
          FROM questions ORDER BY id ASC
        `).all();
      }
      res.json(rows);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/questions', (req, res) => {
    try {
      const {
        topic_id, question_text, question_text_en, option_a, option_a_en, option_b, option_b_en,
        option_c, option_c_en, option_d, option_d_en, correct_option, explanation, explanation_en,
        difficulty, is_descriptive, marks, model_answer, model_answer_en, marking_scheme, marking_scheme_en, q_type
      } = req.body;

      let clean_q_text = (question_text || '').trim();
      let clean_ans = (correct_option || '').trim();
      let clean_model_ans = (model_answer || '').trim();
      let clean_model_ans_en = (model_answer_en || '').trim();
      let clean_q_en = (question_text_en || '').trim();
      let clean_exp = (explanation || '').trim();
      let clean_exp_en = (explanation_en || '').trim();
      let clean_ms = (marking_scheme || '').trim();
      let clean_ms_en = (marking_scheme_en || '').trim();

      const hasOptions = Boolean((option_a && option_a.trim()) || (option_b && option_b.trim()));

      let finalMarks = Number(marks) || 1;
      let finalQType = String(q_type || '').trim();

      if (finalQType === '2' || finalQType === '2M' || finalMarks === 2) {
        finalMarks = 2;
        finalQType = '2M';
      } else if (finalQType === '3' || finalQType === '3M' || finalMarks === 3) {
        finalMarks = 3;
        finalQType = '3M';
      } else if (finalQType === '5' || finalQType === '5M' || finalQType === 'Broad' || finalMarks >= 5) {
        finalMarks = 5;
        finalQType = '5M';
      } else if (hasOptions) {
        finalMarks = 1;
        finalQType = 'MCQ';
      } else {
        finalMarks = 1;
        finalQType = 'SAQ';
      }

      const isDesc = finalQType === '2M' || finalQType === '3M' || finalQType === '5M';
      if (isDesc) {
        const descAnsMatch = /(?:[\s।\?]+|^)(?:সঠিক\s*উত্তর|সঠিক\s*উঃ|সঠিক\s*বিকল্প|উত্তর|উঃ|উ|Answer|Ans|Model\s*Answer|মডেল\s*উত্তর)\s*[:\-–।]\s*([\s\S]*)$/i.exec(clean_q_text);
        if (descAnsMatch) {
          if (!clean_model_ans) clean_model_ans = descAnsMatch[1].trim();
          clean_q_text = clean_q_text.substring(0, descAnsMatch.index).trim();
        }
      }

      const result = db.prepare(`
        INSERT INTO questions 
        (topic_id, question_text, question_text_en, option_a, option_a_en, option_b, option_b_en,
         option_c, option_c_en, option_d, option_d_en, correct_option, explanation, explanation_en,
         difficulty, is_descriptive, marks, model_answer, model_answer_en, marking_scheme, marking_scheme_en, q_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        topic_id, clean_q_text, clean_q_en,
        option_a || '', option_a_en || '',
        option_b || '', option_b_en || '',
        option_c || '', option_c_en || '',
        option_d || '', option_d_en || '',
        clean_ans || (isDesc ? clean_model_ans : 'A'),
        clean_exp, clean_exp_en,
        difficulty || 'Medium', isDesc ? 1 : 0,
        finalMarks,
        clean_model_ans, clean_model_ans_en,
        clean_ms, clean_ms_en,
        finalQType
      );

      savePersistentSnapshot();
      try {
        const newQ = db.prepare('SELECT * FROM questions WHERE id = ?').get(result.lastInsertRowid) as any;
        if (newQ) pushQuestionToCloud(newQ);
      } catch (err) {
        console.error('Error pushing question to cloud:', err);
      }
      res.json({ success: true, id: result.lastInsertRowid });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/questions/bulk', (req, res) => {
    try {
      const { questions, topic_id } = req.body;
      if (!Array.isArray(questions)) return res.status(400).json({ error: 'questions must be an array' });

      let saved = 0;
      db.exec('BEGIN IMMEDIATE;');
      try {
        const stmt = db.prepare(`
          INSERT INTO questions 
          (topic_id, question_text, question_text_en, option_a, option_a_en, option_b, option_b_en,
           option_c, option_c_en, option_d, option_d_en, correct_option, explanation, explanation_en,
           difficulty, is_descriptive, marks, model_answer, model_answer_en, marking_scheme, marking_scheme_en, q_type)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Medium', ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const q of questions) {
          let cleanQText = sanitizeQuestionField(q.question_text || q.question || '');
          let cleanQTextEn = sanitizeQuestionField(q.question_text_en || q.question_en || '');
          let cleanAnswer = sanitizeQuestionField(q.correct_option || q.answer || '');
          let cleanModelAns = sanitizeQuestionField(q.model_answer || q.answer || '');
          let cleanModelAnsEn = sanitizeQuestionField(q.model_answer_en || q.answer_en || '');
          let optA = sanitizeQuestionField(q.option_a || q.options?.A || '');
          let optAEn = sanitizeQuestionField(q.option_a_en || q.options_en?.A || '');
          let optB = sanitizeQuestionField(q.option_b || q.options?.B || '');
          let optBEn = sanitizeQuestionField(q.option_b_en || q.options_en?.B || '');
          let optC = sanitizeQuestionField(q.option_c || q.options?.C || '');
          let optCEn = sanitizeQuestionField(q.option_c_en || q.options_en?.C || '');
          let optD = sanitizeQuestionField(q.option_d || q.options?.D || '');
          let optDEn = sanitizeQuestionField(q.option_d_en || q.options_en?.D || '');
          let exp = sanitizeQuestionField(q.explanation || '');
          let expEn = sanitizeQuestionField(q.explanation_en || '');

          const hasOptions = Boolean((optA && optA.trim()) || (optB && optB.trim()));
          let finalMarks = Number(q.marks) || 1;
          let finalQType = String(q.q_type || '').trim();

          if (finalQType === '2' || finalQType === '2M' || finalMarks === 2) {
            finalMarks = 2;
            finalQType = '2M';
          } else if (finalQType === '3' || finalQType === '3M' || finalMarks === 3) {
            finalMarks = 3;
            finalQType = '3M';
          } else if (finalQType === '5' || finalQType === '5M' || finalQType === 'Broad' || finalMarks >= 5) {
            finalMarks = 5;
            finalQType = '5M';
          } else if (hasOptions) {
            finalMarks = 1;
            finalQType = 'MCQ';
          } else {
            finalMarks = 1;
            finalQType = 'SAQ';
          }

          // Strip inline answer from question text so question text is 100% clean
          const inlineAns = /(?:[\s।\?]+|^)(?:সঠিক\s*উত্তর|সঠিক\s*উঃ|সঠিক\s*বিকল্প|উত্তর|উঃ|উ|Answer|Ans|মডেল\s*উত্তর|Model\s*Answer)\s*[:\-–।]\s*([\s\S]*)$/i.exec(cleanQText);
          if (inlineAns) {
            const separatedAns = sanitizeQuestionField(inlineAns[1]);
            cleanQText = sanitizeQuestionField(cleanQText.substring(0, inlineAns.index));
            if (!cleanAnswer || cleanAnswer === 'A') {
              cleanAnswer = separatedAns;
            }
            if (!cleanModelAns) {
              cleanModelAns = separatedAns;
            }
          }

          stmt.run(
            topic_id, cleanQText, cleanQTextEn,
            optA, optAEn,
            optB, optBEn,
            optC, optCEn,
            optD, optDEn,
            cleanAnswer || (finalQType === 'MCQ' ? 'A' : cleanModelAns),
            exp, expEn,
            (finalQType === 'MCQ' || finalQType === 'SAQ') ? 0 : 1, finalMarks,
            cleanModelAns, cleanModelAnsEn,
            q.marking_scheme || '', q.marking_scheme_en || '',
            finalQType
          );
          saved++;
        }
        db.exec('COMMIT;');
        try {
          db.exec('PRAGMA wal_checkpoint(PASSIVE);');
        } catch {}
      } catch (err) {
        db.exec('ROLLBACK;');
        throw err;
      }

      savePersistentSnapshot();
      try {
        const recent = db.prepare('SELECT * FROM questions ORDER BY id DESC LIMIT ?').all(saved) as any[];
        for (const q of recent) pushQuestionToCloud(q);
      } catch (err) {
        console.error('Error pushing bulk questions to cloud:', err);
      }
      res.json({ success: true, saved });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete('/api/topics/:id/questions', (req, res) => {
    try {
      const topicId = Number(req.params.id);
      db.prepare('DELETE FROM student_doubts WHERE question_id IN (SELECT id FROM questions WHERE topic_id = ?)').run(topicId);
      db.prepare('DELETE FROM duplicate_log WHERE original_q_id IN (SELECT id FROM questions WHERE topic_id = ?) OR duplicate_q_id IN (SELECT id FROM questions WHERE topic_id = ?)').run(topicId, topicId);
      db.prepare('DELETE FROM questions WHERE topic_id = ?').run(topicId);
      savePersistentSnapshot();
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete('/api/questions/:id', (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!id) return res.status(400).json({ error: 'Valid question id required' });
      db.prepare('DELETE FROM student_doubts WHERE question_id = ?').run(id);
      db.prepare('DELETE FROM duplicate_log WHERE original_q_id = ? OR duplicate_q_id = ?').run(id, id);
      db.prepare('DELETE FROM questions WHERE id = ?').run(id);
      deleteQuestionFromCloud(id);
      savePersistentSnapshot();
      res.json({ success: true, deleted_id: id });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put('/api/questions/:id', (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!id) return res.status(400).json({ error: 'Valid question id required' });
      const {
        question_text, question_text_en,
        model_answer, model_answer_en,
        marking_scheme, marking_scheme_en,
        explanation, explanation_en,
        marks, difficulty, q_type, topic_id
      } = req.body;

      const existing = db.prepare('SELECT * FROM questions WHERE id = ?').get(id) as any;
      if (!existing) return res.status(404).json({ error: 'Question not found' });

      const finalTopicId = topic_id !== undefined ? Number(topic_id) : existing.topic_id;
      const finalQText = question_text !== undefined ? String(question_text).trim() : existing.question_text;
      const finalQTextEn = question_text_en !== undefined ? String(question_text_en).trim() : existing.question_text_en;
      const finalModelAns = model_answer !== undefined ? String(model_answer).trim() : existing.model_answer;
      const finalModelAnsEn = model_answer_en !== undefined ? String(model_answer_en).trim() : existing.model_answer_en;
      const finalMarking = marking_scheme !== undefined ? String(marking_scheme).trim() : existing.marking_scheme;
      const finalMarkingEn = marking_scheme_en !== undefined ? String(marking_scheme_en).trim() : existing.marking_scheme_en;
      const finalExp = explanation !== undefined ? String(explanation).trim() : existing.explanation;
      const finalExpEn = explanation_en !== undefined ? String(explanation_en).trim() : existing.explanation_en;
      const finalMarks = marks !== undefined ? Number(marks) : existing.marks;
      const finalDiff = difficulty !== undefined ? String(difficulty) : existing.difficulty;
      const finalQType = q_type !== undefined ? String(q_type) : existing.q_type;
      const isDesc = finalMarks > 1 || finalQType === '2M' || finalQType === '3M' || finalQType === '5M' ? 1 : 0;

      db.prepare(`
        UPDATE questions SET
          topic_id = ?, question_text = ?, question_text_en = ?,
          model_answer = ?, model_answer_en = ?,
          marking_scheme = ?, marking_scheme_en = ?,
          explanation = ?, explanation_en = ?,
          marks = ?, difficulty = ?, q_type = ?, is_descriptive = ?
        WHERE id = ?
      `).run(
        finalTopicId, finalQText, finalQTextEn,
        finalModelAns, finalModelAnsEn,
        finalMarking, finalMarkingEn,
        finalExp, finalExpEn,
        finalMarks, finalDiff, finalQType, isDesc,
        id
      );

      const updated = db.prepare('SELECT * FROM questions WHERE id = ?').get(id) as any;
      pushQuestionToCloud(updated);
      savePersistentSnapshot();
      res.json({ success: true, question: updated });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/questions/bulk_delete', (req, res) => {
    try {
      const { question_ids, topic_id, marks } = req.body;
      let deletedCount = 0;

      if (Array.isArray(question_ids) && question_ids.length > 0) {
        for (const id of question_ids) {
          db.prepare('DELETE FROM student_doubts WHERE question_id = ?').run(id);
          db.prepare('DELETE FROM duplicate_log WHERE original_q_id = ? OR duplicate_q_id = ?').run(id, id);
          db.prepare('DELETE FROM questions WHERE id = ?').run(id);
          deleteQuestionFromCloud(id);
          deletedCount++;
        }
      } else if (topic_id) {
        let sql = 'SELECT id FROM questions WHERE topic_id = ?';
        const params: any[] = [Number(topic_id)];
        if (marks && marks !== 'all') {
          sql += ' AND marks = ?';
          params.push(Number(marks));
        }
        const ids = db.prepare(sql).all(...params) as { id: number }[];
        for (const item of ids) {
          db.prepare('DELETE FROM student_doubts WHERE question_id = ?').run(item.id);
          db.prepare('DELETE FROM duplicate_log WHERE original_q_id = ? OR duplicate_q_id = ?').run(item.id, item.id);
          db.prepare('DELETE FROM questions WHERE id = ?').run(item.id);
          deleteQuestionFromCloud(item.id);
          deletedCount++;
        }
      }

      savePersistentSnapshot();
      res.json({ success: true, deleted_count: deletedCount });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get('/api/duplicate_scan', (req, res) => {
    try {
      const topic_id = req.query.topic_id;
      const all_q = db.prepare('SELECT id, question_text, marks FROM questions WHERE topic_id = ? ORDER BY id ASC').all(Number(topic_id)) as any[];

      const groups: any[] = [];
      const processed = new Set<number>();

      for (let i = 0; i < all_q.length; i++) {
        if (processed.has(all_q[i].id)) continue;
        const grp = [all_q[i]];
        for (let j = i + 1; j < all_q.length; j++) {
          if (processed.has(all_q[j].id)) continue;
          const ratio = similarityRatio(all_q[i].question_text, all_q[j].question_text);
          if (ratio >= 0.75) {
            grp.push(all_q[j]);
            processed.add(all_q[j].id);
          }
        }
        if (grp.length > 1) {
          processed.add(all_q[i].id);
          groups.push(grp);
        }
      }
      res.json(groups);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/duplicate_remove', (req, res) => {
    try {
      const { keep_id, delete_id, removed_by } = req.body;
      db.prepare('INSERT INTO duplicate_log (original_q_id, duplicate_q_id, similarity, removed_by) VALUES (?, ?, ?, ?)').run(keep_id, delete_id, 100.0, removed_by || 'Admin');
      db.prepare('DELETE FROM questions WHERE id = ?').run(delete_id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Translation & Text Extraction
  app.post('/api/translate', (req, res) => {
    const { text } = req.body;
    res.json({ translation: translateGeoSimple(text) });
  });

  function parseQuestionBlocks(inputRaw: string, targetFormat: string) {
    let text = normalizeBengali(inputRaw || '');
    if (!text.trim()) return [];

    const qStartRegex = /(?:^|\n)\s*(?:(?:Q|Question|প্রশ্ন|প্রঃ?)\s*[:\.]?\s*)?(?:[\(\[]\s*([০-৯\d]+)\s*[\)\]]|([০-৯\d]+)\s*\\?[\)\]\.:।–\-]\s*\\?)\s*/gi;
    const matches: { index: number; num: string; length: number }[] = [];
    let m: RegExpExecArray | null;
    while ((m = qStartRegex.exec(text)) !== null) {
      const num = m[1] || m[2];
      matches.push({ index: m.index, num, length: m[0].length });
    }

    const rawBlocks: string[] = [];
    if (matches.length > 0) {
      for (let i = 0; i < matches.length; i++) {
        const start = matches[i].index + matches[i].length;
        const end = i + 1 < matches.length ? matches[i + 1].index : text.length;
        rawBlocks.push(text.substring(start, end).trim());
      }
    } else {
      const paragraphs = text.split(/\n\s*\n/).map((p: string) => p.trim()).filter(Boolean);
      if (paragraphs.length > 1) {
        rawBlocks.push(...paragraphs);
      } else {
        rawBlocks.push(...text.split('\n').map((l: string) => l.trim()).filter(Boolean));
      }
    }

    const B2A: Record<string, string> = {
      'ক': 'A', 'খ': 'B', 'গ': 'C', 'ঘ': 'D',
      'A': 'A', 'B': 'B', 'C': 'C', 'D': 'D',
      'a': 'A', 'b': 'B', 'c': 'C', 'd': 'D'
    };

    const cleanExtractedText = (val: string): string => {
      return sanitizeQuestionField(val);
    };

    const selectedFormat = (targetFormat || 'auto').toLowerCase();
    const parsedItems: any[] = [];

    for (let bi = 0; bi < rawBlocks.length; bi++) {
      let block = rawBlocks[bi];
      if (!block || block.length < 2) continue;

      let explanation = '';
      let detectedMarks = 1;
      let answerText = '';
      let correctLetter = 'A';

      // 1. Extract explanation / note if present (matches at end of block or preceding other tags)
      const expEndMatch = /(?:^|\n)\s*(?:\*{1,2}|#{1,4}\s*)?(?:নোট|ব্যাখ্যা|ব্যাখ্যা\s*সহ|সংকেত|Explanation|Note|Hint)(?:\*{1,2})?\s*[:\-–।ঃ]?\s*([\s\S]*)$/i.exec(block);
      if (expEndMatch) {
        explanation = cleanExtractedText(expEndMatch[1]);
        block = block.substring(0, expEndMatch.index).trim();
      } else {
        const expMidMatch = /(?:^|\n)\s*(?:\*{1,2}|#{1,4}\s*)?(?:নোট|ব্যাখ্যা|ব্যাখ্যা\s*সহ|সংকেত|Explanation|Note|Hint)(?:\*{1,2})?\s*[:\-–।ঃ]?\s*([\s\S]+?)(?=(?:\n\s*(?:✅|✔|☑)?\s*(?:সঠিক\s*উত্তর|সঠিক\s*উঃ|সঠিক\s*বিকল্প|উত্তর|উঃ|Answer|Correct\s*Answer|Ans)\s*[:\-–।ঃ])|$)/i.exec(block);
        if (expMidMatch) {
          explanation = cleanExtractedText(expMidMatch[1]);
          block = block.replace(expMidMatch[0], ' ').trim();
        }
      }

      // 2. Extract Option Letter Answer if present (e.g., উত্তর: (খ) or Ans: B)
      const optAnsMatch = /(?:✅|✔|☑)?\s*(?:সঠিক\s*উত্তর|সঠিক\s*উঃ|সঠিক\s*বিকল্প|উত্তর|উঃ|Answer|Correct\s*Answer|Ans)\s*[:\-–।ঃ]?\s*[\(\[]?\s*\\?([কখগঘABCDabcd])\\?[\)\]\.\s\:]?(.*)(?:\n|$)/i.exec(block);
      if (optAnsMatch) {
        correctLetter = B2A[optAnsMatch[1]] || 'A';
        answerText = cleanExtractedText(optAnsMatch[2] ? optAnsMatch[2] : optAnsMatch[1]);
        block = block.replace(optAnsMatch[0], ' ').trim();
      } else {
        // 3. Extract Full Text Answer if present
        const textAnsMatch = /(?:✅|✔|☑)?\s*(?:সঠিক\s*উত্তর|সঠিক\s*উঃ|সঠিক\s*বিকল্প|উত্তর|উঃ|উ|Answer|Ans|Model\s*Answer|মডেল\s*উত্তর)\s*[:\-–।ঃ]?\s*([\s\S]*)$/i.exec(block);
        if (textAnsMatch) {
          answerText = cleanExtractedText(textAnsMatch[1]);
          block = block.substring(0, textAnsMatch.index).trim();
        }
      }

      // 4. Check for marks in text
      if (/([২2]\s*নম্বর|2\s*marks?|মান\s*[:\-–]?\s*[২2])/i.test(block)) detectedMarks = 2;
      else if (/([৩3]\s*নম্বর|3\s*marks?|মান\s*[:\-–]?\s*[৩3])/i.test(block)) detectedMarks = 3;
      else if (/([৫5]\s*নম্বর|5\s*marks?|মান\s*[:\-–]?\s*[৫5])/i.test(block)) detectedMarks = 5;

      // 5. Check options if MCQ
      let questionText = block;
      let optA = '';
      let optB = '';
      let optC = '';
      let optD = '';

      const optRegex = /(?:[\(\[]\s*([কখগঘABCDabcd])\s*\\?[\)\]]|(?:^|[\s\n])\\?([কখগঘABCDabcd])\\?\s*\\?[\.\)\]\-–]\s*\\?)/g;
      const optMatches: { index: number; opt: string; length: number }[] = [];
      let om: RegExpExecArray | null;
      while ((om = optRegex.exec(block)) !== null) {
        const optLetter = B2A[om[1] || om[2]];
        if (optLetter) {
          optMatches.push({ index: om.index, opt: optLetter, length: om[0].length });
        }
      }

      if (optMatches.length >= 2 && selectedFormat !== 'saq') {
        questionText = block.substring(0, optMatches[0].index).trim();
        for (let oi = 0; oi < optMatches.length; oi++) {
          const curOpt = optMatches[oi].opt;
          const optStart = optMatches[oi].index + optMatches[oi].length;
          const optEnd = oi + 1 < optMatches.length ? optMatches[oi + 1].index : block.length;
          const optVal = cleanExtractedText(block.substring(optStart, optEnd));

          if (curOpt === 'A' && !optA) optA = optVal;
          else if (curOpt === 'B' && !optB) optB = optVal;
          else if (curOpt === 'C' && !optC) optC = optVal;
          else if (curOpt === 'D' && !optD) optD = optVal;
        }
      }

      questionText = cleanExtractedText(questionText);

      // In-line bilingual splitting if question contains slash or [EN: ...]
      let qBn = questionText;
      let qEn = '';
      if (questionText.includes(' / ')) {
        const parts = questionText.split(' / ');
        qBn = cleanExtractedText(parts[0]);
        qEn = cleanExtractedText(parts.slice(1).join(' / '));
      } else if (/\s*[\(\[]\s*(?:EN|English)\s*:\s*([^\]\)]+)[\]\)]/i.test(questionText)) {
        const enMatch = /\s*[\(\[]\s*(?:EN|English)\s*:\s*([^\]\)]+)[\]\)]/i.exec(questionText);
        if (enMatch) {
          qEn = cleanExtractedText(enMatch[1]);
          qBn = cleanExtractedText(questionText.replace(enMatch[0], ''));
        }
      }

      // Bilingual explanation if inline
      let expBn = explanation;
      let expEn = '';
      if (explanation.includes(' / ')) {
        const parts = explanation.split(' / ');
        expBn = cleanExtractedText(parts[0]);
        expEn = cleanExtractedText(parts.slice(1).join(' / '));
      } else if (/\s*[\(\[]\s*(?:EN|English)\s*:\s*([^\]\)]+)[\]\)]/i.test(explanation)) {
        const enM = /\s*[\(\[]\s*(?:EN|English)\s*:\s*([^\]\)]+)[\]\)]/i.exec(explanation);
        if (enM) {
          expEn = cleanExtractedText(enM[1]);
          expBn = cleanExtractedText(explanation.replace(enM[0], ''));
        }
      }

      // Format determination
      let finalQType = 'SAQ';
      let finalMarks = 1;
      let isDescriptive = 0;

      if (selectedFormat === 'mcq') {
        finalQType = 'MCQ'; finalMarks = 1; isDescriptive = 0;
      } else if (selectedFormat === 'saq') {
        finalQType = 'SAQ'; finalMarks = 1; isDescriptive = 0;
        optA = ''; optB = ''; optC = ''; optD = '';
      } else if (selectedFormat === '2m') {
        finalQType = '2M'; finalMarks = 2; isDescriptive = 1;
        optA = ''; optB = ''; optC = ''; optD = '';
      } else if (selectedFormat === '3m') {
        finalQType = '3M'; finalMarks = 3; isDescriptive = 1;
        optA = ''; optB = ''; optC = ''; optD = '';
      } else if (selectedFormat === '5m') {
        finalQType = '5M'; finalMarks = 5; isDescriptive = 1;
        optA = ''; optB = ''; optC = ''; optD = '';
      } else {
        if (Boolean(optA && optB)) {
          finalQType = 'MCQ'; finalMarks = 1; isDescriptive = 0;
        } else if (detectedMarks === 2) {
          finalQType = '2M'; finalMarks = 2; isDescriptive = 1;
        } else if (detectedMarks === 3) {
          finalQType = '3M'; finalMarks = 3; isDescriptive = 1;
        } else if (detectedMarks >= 5) {
          finalQType = '5M'; finalMarks = 5; isDescriptive = 1;
        } else {
          finalQType = 'SAQ'; finalMarks = 1; isDescriptive = 0;
        }
      }

      parsedItems.push({
        question: qBn,
        question_en: qEn,
        answer: answerText,
        answer_en: '',
        correct: finalQType === 'MCQ' ? correctLetter : answerText,
        options: finalQType === 'MCQ' ? { A: optA, B: optB, C: optC, D: optD } : undefined,
        options_en: finalQType === 'MCQ' ? { A: '', B: '', C: '', D: '' } : undefined,
        opt_a: optA, opt_a_en: '',
        opt_b: optB, opt_b_en: '',
        opt_c: optC, opt_c_en: '',
        opt_d: optD, opt_d_en: '',
        marks: finalMarks,
        q_type: finalQType,
        is_descriptive: isDescriptive,
        explanation: expBn,
        explanation_en: expEn,
        model_answer: answerText,
        model_answer_en: '',
        marking_scheme: '',
        marking_scheme_en: ''
      });
    }

    return parsedItems;
  }

  app.post('/api/extract_text', async (req, res) => {
    try {
      const { raw_text, raw_text_en, url, target_format } = req.body;
      let text = raw_text || '';

      if (url && url.trim()) {
        try {
          const resp = await fetch(url.trim(), { headers: { 'User-Agent': 'Mozilla/5.0' } });
          const html = await resp.text();
          text = html.replace(/<[^>]+>/g, ' ');
        } catch (fetchErr: any) {
          return res.status(400).json({ error: `URL fetch error: ${fetchErr.message}` });
        }
      }

      // If ONLY English batch provided without Bengali:
      if (!text.trim() && raw_text_en && typeof raw_text_en === 'string' && raw_text_en.trim()) {
        const enQuestions = parseQuestionBlocks(raw_text_en, target_format);
        const mapped = enQuestions.map(q => ({
          ...q,
          question: '',
          question_en: q.question,
          options: { A: '', B: '', C: '', D: '' },
          options_en: q.options || { A: '', B: '', C: '', D: '' },
          opt_a: '', opt_a_en: q.opt_a || q.options?.A || '',
          opt_b: '', opt_b_en: q.opt_b || q.options?.B || '',
          opt_c: '', opt_c_en: q.opt_c || q.options?.C || '',
          opt_d: '', opt_d_en: q.opt_d || q.options?.D || '',
          answer: '', answer_en: q.answer,
          explanation: '', explanation_en: q.explanation,
          model_answer: '', model_answer_en: q.model_answer || q.answer
        }));
        return res.json({
          raw_text: '',
          raw_text_en,
          target_format: target_format || 'auto',
          is_mcq: mapped.some(q => q.q_type === 'MCQ'),
          parsed_questions: mapped,
          mcq_parsed: mapped.filter(q => q.q_type === 'MCQ'),
          general_parsed: mapped
        });
      }

      const parsedQuestions = parseQuestionBlocks(text, target_format);

      // If user provided a batch of English questions in raw_text_en, parse and align them:
      if (raw_text_en && typeof raw_text_en === 'string' && raw_text_en.trim()) {
        const enQuestions = parseQuestionBlocks(raw_text_en, target_format);
        for (let i = 0; i < parsedQuestions.length; i++) {
          if (enQuestions[i]) {
            parsedQuestions[i].question_en = enQuestions[i].question || enQuestions[i].question_en || '';
            if (enQuestions[i].options) {
              parsedQuestions[i].options_en = enQuestions[i].options;
              parsedQuestions[i].opt_a_en = enQuestions[i].opt_a || enQuestions[i].options.A || '';
              parsedQuestions[i].opt_b_en = enQuestions[i].opt_b || enQuestions[i].options.B || '';
              parsedQuestions[i].opt_c_en = enQuestions[i].opt_c || enQuestions[i].options.C || '';
              parsedQuestions[i].opt_d_en = enQuestions[i].opt_d || enQuestions[i].options.D || '';
            }
            parsedQuestions[i].answer_en = enQuestions[i].answer || '';
            parsedQuestions[i].model_answer_en = enQuestions[i].answer || enQuestions[i].model_answer || '';
            parsedQuestions[i].explanation_en = enQuestions[i].explanation || '';
            parsedQuestions[i].marking_scheme_en = enQuestions[i].marking_scheme || '';
          }
        }
      }

      const mcqParsed = parsedQuestions.filter(q => q.q_type === 'MCQ');

      res.json({
        raw_text: text,
        target_format: target_format || 'auto',
        is_mcq: mcqParsed.length > 0,
        parsed_questions: parsedQuestions,
        mcq_parsed: mcqParsed,
        general_parsed: parsedQuestions
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Preview English batch merge with existing chapter questions
  app.post('/api/questions/preview_merge_english', (req, res) => {
    try {
      const { topic_id, raw_text_en, target_format } = req.body;
      if (!topic_id) return res.status(400).json({ error: 'topic_id required' });
      if (!raw_text_en || !raw_text_en.trim()) return res.status(400).json({ error: 'raw_text_en required' });

      const enQuestions = parseQuestionBlocks(raw_text_en, target_format || 'mcq');
      const allExisting = db.prepare('SELECT * FROM questions WHERE topic_id = ? ORDER BY id ASC').all(Number(topic_id)) as any[];

      // Prefer MCQs if target is MCQ
      const format = (target_format || 'mcq').toLowerCase();
      let targetList = allExisting;
      if (format === 'mcq') {
        const mcqs = allExisting.filter(q => (q.q_type || '').includes('MCQ') || (q.option_a && q.option_a.trim()));
        if (mcqs.length > 0) targetList = mcqs;
      } else if (format === 'saq') {
        const saqs = allExisting.filter(q => (q.q_type || '').includes('SAQ') && (!q.option_a || !q.option_a.trim()));
        if (saqs.length > 0) targetList = saqs;
      }

      const matchedCount = Math.min(targetList.length, enQuestions.length);
      const pairs = [];
      for (let i = 0; i < matchedCount; i++) {
        const ex = targetList[i];
        const en = enQuestions[i];
        pairs.push({
          question_id: ex.id,
          index: i + 1,
          q_bn: ex.question_text,
          q_en: en.question || en.question_en || '',
          opt_a_bn: ex.option_a || '',
          opt_a_en: en.opt_a || en.options?.A || '',
          opt_b_bn: ex.option_b || '',
          opt_b_en: en.opt_b || en.options?.B || '',
          opt_c_bn: ex.option_c || '',
          opt_c_en: en.opt_c || en.options?.C || '',
          opt_d_bn: ex.option_d || '',
          opt_d_en: en.opt_d || en.options?.D || '',
          correct: ex.correct_option || 'A',
          ans_bn: ex.correct_option || ex.model_answer || '',
          ans_en: en.answer || en.model_answer || '',
          exp_bn: ex.explanation || '',
          exp_en: en.explanation || en.explanation_en || ''
        });
      }

      res.json({
        total_existing: targetList.length,
        total_english: enQuestions.length,
        matched_count: matchedCount,
        pairs
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Apply English translations to existing chapter questions
  app.post('/api/questions/merge_english', (req, res) => {
    try {
      const { topic_id, pairs } = req.body;
      if (!Array.isArray(pairs) || pairs.length === 0) {
        return res.status(400).json({ error: 'Valid pairs array required' });
      }

      let updatedCount = 0;
      db.exec('BEGIN IMMEDIATE;');
      try {
        const stmt = db.prepare(`
          UPDATE questions SET
            question_text_en = ?,
            option_a_en = ?,
            option_b_en = ?,
            option_c_en = ?,
            option_d_en = ?,
            model_answer_en = ?,
            explanation_en = ?
          WHERE id = ?
        `);

        for (const p of pairs) {
          if (!p.question_id) continue;
          stmt.run(
            sanitizeQuestionField(p.q_en),
            sanitizeQuestionField(p.opt_a_en),
            sanitizeQuestionField(p.opt_b_en),
            sanitizeQuestionField(p.opt_c_en),
            sanitizeQuestionField(p.opt_d_en),
            sanitizeQuestionField(p.ans_en),
            sanitizeQuestionField(p.exp_en),
            Number(p.question_id)
          );
          updatedCount++;
        }
        db.exec('COMMIT;');
      } catch (err) {
        db.exec('ROLLBACK;');
        throw err;
      }

      savePersistentSnapshot();
      try {
        for (const p of pairs) {
          const q = db.prepare('SELECT * FROM questions WHERE id = ?').get(Number(p.question_id)) as any;
          if (q) pushQuestionToCloud(q);
        }
      } catch (err) {
        console.error('Error syncing merged questions to cloud:', err);
      }

      res.json({ success: true, updated: updatedCount });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Student Doubts ("Ask Admin / Teacher")
  app.get('/api/student_doubts', (req, res) => {
    try {
      const { username, teacher_username } = req.query;
      let query = `
        SELECT d.id, d.student_username, d.student_name, d.question_id, d.doubt_text,
               d.assigned_teacher_username, d.teacher_answer, d.status, d.timestamp,
               q.question_text, q.question_text_en, q.marks, q.q_type
        FROM student_doubts d
        JOIN questions q ON d.question_id = q.id
      `;
      let rows;
      if (username) {
        query += ' WHERE d.student_username = ? ORDER BY d.id DESC';
        rows = db.prepare(query).all(String(username));
      } else if (teacher_username) {
        query += ' WHERE d.assigned_teacher_username = ? ORDER BY d.id DESC';
        rows = db.prepare(query).all(String(teacher_username));
      } else {
        query += " ORDER BY CASE WHEN d.status = 'Teacher Submitted (Pending Admin Approval)' THEN 0 WHEN d.status = 'Pending Admin Assignment' THEN 1 ELSE 2 END, d.id DESC";
        rows = db.prepare(query).all();
      }
      res.json(rows);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/student_doubts', (req, res) => {
    try {
      const { student_username, student_name, question_id, doubt_text } = req.body;
      const existing = db.prepare(`
        SELECT id FROM student_doubts
        WHERE student_username = ? AND question_id = ?
        AND status IN ('Pending Admin Assignment', 'Assigned to Teacher', 'Teacher Submitted (Pending Admin Approval)', 'Approved')
      `).get(student_username, question_id);

      if (existing) {
        return res.status(409).json({ error: 'Already requested! Our team is reviewing it.' });
      }

      db.prepare(`
        INSERT INTO student_doubts (student_username, student_name, question_id, doubt_text, status)
        VALUES (?, ?, ?, ?, 'Pending Admin Assignment')
      `).run(student_username, student_name, question_id, doubt_text || '');

      // Also sync to ask_corner for instant Admin visibility
      try {
        const q = db.prepare('SELECT question_text FROM questions WHERE id = ?').get(question_id) as any;
        const msg = `[Question #Q${question_id}] ${q?.question_text || ''}\n\nStudent Note: ${doubt_text || 'Explain this question'}`;
        db.prepare(`
          INSERT INTO ask_corner (submitter_username, submitter_name, submitter_role, category, message, status)
          VALUES (?, ?, 'student', 'Question Doubt', ?, 'New')
        `).run(student_username, student_name, msg);
      } catch {}

      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/student_doubts/assign', (req, res) => {
    try {
      const { id, teacher_username } = req.body;
      db.prepare(`
        UPDATE student_doubts
        SET assigned_teacher_username = ?, status = 'Assigned to Teacher'
        WHERE id = ?
      `).run(teacher_username, id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/student_doubts/teacher_submit', (req, res) => {
    try {
      const { id, solution } = req.body;
      db.prepare(`
        UPDATE student_doubts
        SET teacher_answer = ?, status = 'Teacher Submitted (Pending Admin Approval)'
        WHERE id = ?
      `).run(solution, id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/student_doubts/approve', (req, res) => {
    try {
      const { id, solution } = req.body;
      db.prepare(`
        UPDATE student_doubts
        SET teacher_answer = ?, status = 'Approved'
        WHERE id = ?
      `).run(solution, id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/student_doubts/send_back', (req, res) => {
    try {
      const { id } = req.body;
      db.prepare(`
        UPDATE student_doubts
        SET status = 'Assigned to Teacher', teacher_answer = ''
        WHERE id = ?
      `).run(id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Mock Tests
  app.get('/api/mock_tests', (req, res) => {
    try {
      const rows = db.prepare(`
        SELECT id, test_type, code_num, file_name, file_data, uploader, price, is_published, language, timestamp
        FROM mock_tests WHERE is_published = 1 ORDER BY id DESC
      `).all();
      res.json(rows);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/mock_tests', (req, res) => {
    try {
      const { test_type, file_name, file_data, uploader, price, language } = req.body;
      const count = (db.prepare('SELECT COUNT(*) as count FROM mock_tests WHERE test_type = ?').get(test_type) as any).count;
      const prefix = test_type === 'Chapter Wise Mock Test' ? 'chapter mock' : (test_type === 'Final Mock Test' ? 'final mock' : 'suggestion');
      const auto_code = `${prefix} - ${String(count + 1).padStart(3, '0')}`;
      const lang = language === 'English' ? 'English' : 'Bengali';

      db.prepare(`
        INSERT INTO mock_tests (test_type, code_num, file_name, file_data, uploader, price, is_published, language)
        VALUES (?, ?, ?, ?, ?, ?, 1, ?)
      `).run(test_type, auto_code, file_name, file_data || '', uploader, price || 0, lang);

      res.json({ success: true, code_num: auto_code, language: lang });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete('/api/mock_tests/:id', (req, res) => {
    try {
      db.prepare('DELETE FROM mock_tests WHERE id = ?').run(req.params.id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Mock Exam Access Requests & IP / Device Approval System
  app.get('/api/mock_exam_requests', (req, res) => {
    try {
      const rows = db.prepare(`
        SELECT id, mock_id, mock_code, student_username, student_name, student_phone,
               ip_address, device_info, status, admin_note, approved_by, created_at, approved_at
        FROM mock_exam_access_requests ORDER BY id DESC
      `).all();
      res.json(rows);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get('/api/mock_exam_requests/my', (req, res) => {
    try {
      const username = String(req.query.username || '').trim();
      if (!username) return res.json([]);
      const rows = db.prepare(`
        SELECT mock_id, mock_code, status, approved_at
        FROM mock_exam_access_requests WHERE student_username = ?
      `).all(username);
      res.json(rows);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/mock_exam_requests', (req, res) => {
    try {
      const { mock_id, mock_code, student_username, student_name, student_phone, device_info } = req.body;
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
      const cleanIp = Array.isArray(ip) ? ip[0] : String(ip).split(',')[0].trim();

      const existing = db.prepare(`
        SELECT id, status FROM mock_exam_access_requests
        WHERE mock_id = ? AND student_username = ?
        ORDER BY id DESC LIMIT 1
      `).get(Number(mock_id), String(student_username)) as any;

      if (existing) {
        return res.json({ success: true, request_id: existing.id, status: existing.status });
      }

      const info = db.prepare(`
        INSERT INTO mock_exam_access_requests
        (mock_id, mock_code, student_username, student_name, student_phone, ip_address, device_info, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')
      `).run(Number(mock_id), String(mock_code), String(student_username), String(student_name || ''), String(student_phone || ''), cleanIp, String(device_info || 'Browser'));

      res.json({ success: true, request_id: info.lastInsertRowid, status: 'Pending' });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/mock_exam_requests/:id/approve', (req, res) => {
    try {
      const id = Number(req.params.id);
      const adminName = String(req.body.approved_by || 'Shawon Kar (Head Admin)');
      db.prepare(`
        UPDATE mock_exam_access_requests SET
          status = 'Approved', approved_by = ?, approved_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(adminName, id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/mock_exam_requests/:id/reject', (req, res) => {
    try {
      const id = Number(req.params.id);
      const adminNote = String(req.body.admin_note || 'Rejected by Admin');
      db.prepare(`
        UPDATE mock_exam_access_requests SET
          status = 'Rejected', admin_note = ?, approved_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(adminNote, id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Chapter Official Model Answer Sheets (2M, 3M, 5M, Free / Paid, Bengali / English)
  app.get('/api/chapter_answer_sheets', (req, res) => {
    try {
      const { topic_id, marks_type, access_tier, language } = req.query;
      let query = 'SELECT id, topic_id, marks_type, access_tier, language, title, file_name, uploaded_by, timestamp FROM chapter_answer_sheets WHERE 1=1';
      const params: any[] = [];
      if (topic_id) {
        query += ' AND topic_id = ?';
        params.push(Number(topic_id));
      }
      if (marks_type && marks_type !== 'all') {
        query += " AND (marks_type = ? OR marks_type = 'all')";
        params.push(String(marks_type));
      }
      if (access_tier && access_tier !== 'all') {
        query += ' AND access_tier = ?';
        params.push(String(access_tier));
      }
      if (language && language !== 'all') {
        if (language === 'English') {
          query += " AND language = 'English'";
        } else {
          query += " AND (language = 'Bengali' OR language IS NULL)";
        }
      }
      query += ' ORDER BY id DESC';
      const rows = db.prepare(query).all(...params);
      res.json(rows);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get('/api/chapter_answer_sheets/:id/file', (req, res) => {
    try {
      const row = db.prepare('SELECT id, topic_id, marks_type, access_tier, language, title, file_name, file_data FROM chapter_answer_sheets WHERE id = ?').get(Number(req.params.id)) as any;
      if (!row) return res.status(404).json({ error: 'Answer sheet not found' });
      res.json(row);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/chapter_answer_sheets', (req, res) => {
    try {
      const { topic_id, marks_type, access_tier, language, title, file_name, file_data, uploaded_by } = req.body;
      if (!topic_id || !file_name) {
        return res.status(400).json({ error: 'topic_id and file_name are required' });
      }
      const tier = access_tier === 'free' ? 'free' : 'paid';
      const mType = (marks_type || '2m').toLowerCase();
      const lang = language === 'English' ? 'English' : 'Bengali';
      const defaultTitle = `${mType.toUpperCase()} ${tier === 'free' ? 'সাধারণ স্যাম্পল উত্তরপত্র' : 'সম্পূর্ণ মডেল উত্তরপত্র'} (${lang === 'English' ? 'English Medium' : 'বাংলা মাধ্যম'})`;
      const sheetTitle = (title && title.trim()) ? title.trim() : defaultTitle;

      // Check if an existing sheet exists for (topic_id, marks_type, access_tier, language)
      const existing = db.prepare(`
        SELECT id FROM chapter_answer_sheets 
        WHERE topic_id = ? AND marks_type = ? AND access_tier = ? 
          AND (language = ? OR (language IS NULL AND ? = 'Bengali'))
      `).get(Number(topic_id), mType, tier, lang, lang) as any;

      if (existing) {
        db.prepare(`
          UPDATE chapter_answer_sheets
          SET title = ?, file_name = ?, file_data = ?, uploaded_by = ?, language = ?, timestamp = CURRENT_TIMESTAMP
          WHERE id = ?
        `).run(sheetTitle, file_name, file_data || '', uploaded_by || 'Teacher/Admin', lang, existing.id);
        savePersistentSnapshot();
        try {
          const updatedRow = db.prepare('SELECT id, topic_id, marks_type, access_tier, language, title, file_name, file_data FROM chapter_answer_sheets WHERE id = ?').get(existing.id) as any;
          if (updatedRow) pushAnswerSheetToCloud(updatedRow);
        } catch (e) {
          console.error('Error syncing answer sheet update to cloud:', e);
        }
        return res.json({ success: true, id: existing.id, updated: true });
      }

      const result = db.prepare(`
        INSERT INTO chapter_answer_sheets (topic_id, marks_type, access_tier, language, title, file_name, file_data, uploaded_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(Number(topic_id), mType, tier, lang, sheetTitle, file_name, file_data || '', uploaded_by || 'Teacher/Admin');

      savePersistentSnapshot();
      try {
        const insertedRow = db.prepare('SELECT id, topic_id, marks_type, access_tier, language, title, file_name, file_data FROM chapter_answer_sheets WHERE id = ?').get(result.lastInsertRowid) as any;
        if (insertedRow) pushAnswerSheetToCloud(insertedRow);
      } catch (e) {
        console.error('Error syncing new answer sheet to cloud:', e);
      }
      res.json({ success: true, id: result.lastInsertRowid, updated: false });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete('/api/chapter_answer_sheets/:id', (req, res) => {
    try {
      db.prepare('DELETE FROM chapter_answer_sheets WHERE id = ?').run(Number(req.params.id));
      deleteAnswerSheetFromCloud(req.params.id);
      savePersistentSnapshot();
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Teacher Submissions (to admin)
  app.get('/api/teacher_submissions', (req, res) => {
    try {
      const { teacher_username } = req.query;
      let rows;
      if (teacher_username) {
        rows = db.prepare('SELECT * FROM teacher_submissions WHERE teacher_username = ? ORDER BY id DESC').all(String(teacher_username));
      } else {
        rows = db.prepare("SELECT * FROM teacher_submissions ORDER BY CASE WHEN status = 'Pending Admin Review' THEN 0 ELSE 1 END, id DESC").all();
      }
      res.json(rows);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/teacher_submissions', (req, res) => {
    try {
      const { teacher_username, teacher_name, sub_type, title, description, file_name, file_data, suggested_price } = req.body;
      const full_desc = description + (suggested_price ? `\n[Suggested Price: ₹${suggested_price}]` : '');
      db.prepare(`
        INSERT INTO teacher_submissions (teacher_username, teacher_name, sub_type, title, description, file_name, file_data, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending Admin Review')
      `).run(teacher_username, teacher_name, sub_type, title, full_desc, file_name, file_data || '');
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/teacher_submissions/action', (req, res) => {
    try {
      const { id, action, admin_note, price } = req.body;
      if (action === 'Publish') {
        const sub = db.prepare('SELECT * FROM teacher_submissions WHERE id = ?').get(id) as any;
        if (!sub) return res.status(404).json({ error: 'Submission not found' });

        const count = (db.prepare('SELECT COUNT(*) as count FROM mock_tests WHERE test_type = ?').get(sub.sub_type) as any).count;
        const prefix = sub.sub_type === 'Chapter Wise Mock Test' ? 'chapter mock' : (sub.sub_type === 'Final Mock Test' ? 'final mock' : 'suggestion');
        const auto_code = `${prefix} - ${String(count + 1).padStart(3, '0')}`;

        const mockRes = db.prepare(`
          INSERT INTO mock_tests (test_type, code_num, file_name, file_data, uploader, price, is_published)
          VALUES (?, ?, ?, ?, ?, ?, 1)
        `).run(sub.sub_type, auto_code, sub.file_name, sub.file_data, `${sub.teacher_name} (via Teacher)`, price || 29);

        db.prepare("UPDATE teacher_submissions SET status = 'Published', admin_note = ?, published_mock_id = ? WHERE id = ?")
          .run(admin_note || '', mockRes.lastInsertRowid, id);
      } else {
        db.prepare("UPDATE teacher_submissions SET status = 'Rejected', admin_note = ? WHERE id = ?")
          .run(admin_note || '', id);
      }
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Exam Submissions (Student Answer Sheets)
  app.get('/api/exam_submissions', (req, res) => {
    try {
      const { student_username, checker_username } = req.query;
      let rows;
      if (student_username) {
        rows = db.prepare('SELECT * FROM exam_submissions WHERE student_username = ? ORDER BY id DESC').all(String(student_username));
      } else if (checker_username) {
        rows = db.prepare('SELECT * FROM exam_submissions WHERE checker_username = ? ORDER BY id DESC').all(String(checker_username));
      } else {
        rows = db.prepare('SELECT * FROM exam_submissions ORDER BY id DESC').all();
      }
      res.json(rows);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/exam_submissions', (req, res) => {
    try {
      const { student_username, student_name, exam_type, exam_code, answer_file_name, answer_file_data } = req.body;
      db.prepare(`
        INSERT INTO exam_submissions (student_username, student_name, exam_type, exam_code, answer_file_name, answer_file_data, status)
        VALUES (?, ?, ?, ?, ?, ?, 'Submitted')
      `).run(student_username, student_name, exam_type, exam_code, answer_file_name, answer_file_data || '');
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/exam_submissions/assign', (req, res) => {
    try {
      const { id, teacher_username } = req.body;
      db.prepare("UPDATE exam_submissions SET checker_username = ?, status = 'Under Check' WHERE id = ?").run(teacher_username, id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/exam_submissions/teacher_submit', (req, res) => {
    try {
      const { id, teacher_corrected_file_name, teacher_corrected_file_data, teacher_note } = req.body;
      db.prepare(`
        UPDATE exam_submissions
        SET teacher_corrected_file_name = ?, teacher_corrected_file_data = ?, teacher_note = ?,
            teacher_submitted_at = CURRENT_TIMESTAMP, status = 'Teacher Submitted for Admin Review'
        WHERE id = ?
      `).run(teacher_corrected_file_name, teacher_corrected_file_data || '', teacher_note || '', id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/exam_submissions/return', (req, res) => {
    try {
      const { id, corrected_file_name, corrected_file_data, admin_note } = req.body;
      db.prepare(`
        UPDATE exam_submissions
        SET corrected_file_name = ?, corrected_file_data = ?, corrected_at = CURRENT_TIMESTAMP,
            status = 'Checked & Returned', admin_note = ?
        WHERE id = ?
      `).run(corrected_file_name, corrected_file_data || '', admin_note || '', id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete('/api/exam_submissions/:id', (req, res) => {
    try {
      db.prepare('DELETE FROM exam_submissions WHERE id = ?').run(req.params.id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Purchases & Payments
  app.get('/api/user_purchases', async (req, res) => {
    try {
      const uStr = String(req.query.username || '').trim();
      if (!uStr) return res.json([]);

      // 1. Resolve all aliases (username, phone) for this user
      const userRec = db.prepare('SELECT username, phone FROM users WHERE username = ? OR phone = ?').get(uStr, uStr) as any;
      const aliases = new Set<string>([uStr]);
      if (userRec) {
        if (userRec.username) aliases.add(userRec.username);
        if (userRec.phone) aliases.add(userRec.phone);
      }
      const aliasArr = Array.from(aliases);
      const placeholders = aliasArr.map(() => '?').join(',');

      // 2. Query local user_purchases
      let rows = db.prepare(`
        SELECT item_type, item_id, status FROM user_purchases 
        WHERE username IN (${placeholders}) AND status = 'Active'
      `).all(...aliasArr) as any[];

      // 3. Fallback: check if promo_requests has an Approved request for this user
      const approvedPromo = db.prepare(`
        SELECT id FROM promo_requests 
        WHERE (username IN (${placeholders}) OR phone IN (${placeholders})) AND status = 'Approved'
      `).get(...aliasArr, ...aliasArr) as any;
      if (approvedPromo && !rows.some(r => (r.item_type === 'BUNDLE' || r.item_type === 'FULL_ACCESS') && r.item_id === 'ALL')) {
        rows.push({ item_type: 'BUNDLE', item_id: 'ALL', status: 'Active' });
        try {
          db.prepare("INSERT OR REPLACE INTO user_purchases (username, item_type, item_id, payment_id, status) VALUES (?, 'BUNDLE', 'ALL', ?, 'Active')")
            .run(uStr, approvedPromo.id);
        } catch {}
      }

      // 4. Fallback: check if payments has an Approved payment for this user
      const approvedPay = db.prepare(`
        SELECT id, item_type, item_id FROM payments 
        WHERE (username IN (${placeholders}) OR phone IN (${placeholders})) AND status = 'Approved'
      `).all(...aliasArr, ...aliasArr) as any[];
      for (const ap of approvedPay) {
        if (!rows.some(r => r.item_type === ap.item_type && String(r.item_id) === String(ap.item_id))) {
          rows.push({ item_type: ap.item_type, item_id: String(ap.item_id), status: 'Active' });
        }
      }

      // 5. Cloud fallback if still empty
      if (rows.length === 0) {
        const cdb = getCloudDb();
        if (cdb) {
          try {
            const snap = await getDocs(collection(cdb, 'user_purchases'));
            snap.forEach(d => {
              const data = d.data();
              if (aliasArr.includes(data.username) && data.status === 'Active') {
                rows.push({ item_type: data.item_type, item_id: data.item_id, status: 'Active' });
              }
            });
          } catch {}
        }
      }

      res.json(rows);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get('/api/payments', (req, res) => {
    try {
      const { username } = req.query;
      let rows;
      if (username) {
        rows = db.prepare('SELECT * FROM payments WHERE username = ? ORDER BY id DESC').all(String(username));
      } else {
        rows = db.prepare("SELECT * FROM payments ORDER BY CASE WHEN status = 'Pending Verification' THEN 0 ELSE 1 END, id DESC").all();
      }
      res.json(rows);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/payments', (req, res) => {
    try {
      const { username, user_name, user_role, phone, item_type, item_id, amount, upi_ref, screenshot_file_name, screenshot_file_data } = req.body;
      const resPay = db.prepare(`
        INSERT INTO payments (username, user_name, user_role, phone, item_type, item_id, amount, upi_ref, screenshot_file_name, screenshot_file_data, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending Verification')
      `).run(username, user_name, user_role, phone, item_type, String(item_id), amount, upi_ref, screenshot_file_name || '', screenshot_file_data || '');
      
      savePersistentSnapshot();
      try {
        const lastPay = db.prepare('SELECT * FROM payments WHERE id = ?').get(resPay.lastInsertRowid) as any;
        if (lastPay) pushPaymentToCloud(lastPay);
      } catch (e) {
        console.error('Error syncing payment to cloud:', e);
      }
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/payments/verify', (req, res) => {
    try {
      const { id, action, admin_note } = req.body;
      const pay = db.prepare('SELECT * FROM payments WHERE id = ?').get(id) as any;
      if (!pay) return res.status(404).json({ error: 'Payment not found' });

      if (action === 'Approve') {
        db.prepare("UPDATE payments SET status = 'Approved', approved_at = CURRENT_TIMESTAMP, admin_note = ? WHERE id = ?")
          .run(admin_note || '', id);
        const purRes = db.prepare("INSERT INTO user_purchases (username, item_type, item_id, payment_id, status) VALUES (?, ?, ?, ?, 'Active')")
          .run(pay.username, pay.item_type, String(pay.item_id), id);

        // Also add for phone if available
        if (pay.phone && pay.phone !== pay.username) {
          try {
            db.prepare("INSERT INTO user_purchases (username, item_type, item_id, payment_id, status) VALUES (?, ?, ?, ?, 'Active')")
              .run(pay.phone, pay.item_type, String(pay.item_id), id);
          } catch {}
        }

        savePersistentSnapshot();
        try {
          const newPurchase = db.prepare('SELECT * FROM user_purchases WHERE id = ?').get(purRes.lastInsertRowid) as any;
          if (newPurchase) pushUserPurchaseToCloud(newPurchase);
        } catch (e) {
          console.error('Error syncing purchase to cloud:', e);
        }
      } else {
        db.prepare("UPDATE payments SET status = 'Rejected', admin_note = ? WHERE id = ?")
          .run(admin_note || '', id);
        savePersistentSnapshot();
      }
      try {
        const updatedPay = db.prepare('SELECT * FROM payments WHERE id = ?').get(id) as any;
        if (updatedPay) pushPaymentToCloud(updatedPay);
      } catch (e) {
        console.error('Error syncing payment status to cloud:', e);
      }
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Promo Code Requests
  app.get('/api/promo_requests', (req, res) => {
    try {
      const rows = db.prepare("SELECT * FROM promo_requests ORDER BY CASE WHEN status = 'Pending' THEN 0 ELSE 1 END, id DESC").all();
      res.json(rows);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/promo_requests', (req, res) => {
    try {
      const { username, full_name, phone, promo_code } = req.body;
      const active_code = (db.prepare("SELECT value FROM system_settings WHERE key = 'promo_code'").get() as any)?.value || 'ShawonSir@2026';

      const existing = db.prepare("SELECT status FROM promo_requests WHERE (username = ? OR phone = ?) AND status IN ('Pending', 'Approved')").get(username, phone) as any;
      if (existing) {
        return res.status(409).json({ error: `Existing request found with status: ${existing.status}` });
      }

      if (promo_code.trim() !== active_code.trim()) {
        return res.status(400).json({ error: 'Invalid Promo Code!' });
      }

      const promoRes = db.prepare(`
        INSERT INTO promo_requests (username, full_name, phone, promo_code, status)
        VALUES (?, ?, ?, ?, 'Pending')
      `).run(username, full_name, phone, promo_code.trim());

      savePersistentSnapshot();
      try {
        const newPromo = db.prepare('SELECT * FROM promo_requests WHERE id = ?').get(promoRes.lastInsertRowid) as any;
        if (newPromo) pushPromoRequestToCloud(newPromo);
      } catch (e) {
        console.error('Error pushing promo request to cloud:', e);
      }

      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/promo_requests/action', (req, res) => {
    try {
      const { id, action, admin_note } = req.body;
      const promo = db.prepare('SELECT * FROM promo_requests WHERE id = ?').get(id) as any;
      if (!promo) return res.status(404).json({ error: 'Promo request not found' });

      if (action === 'Approve') {
        db.prepare("UPDATE promo_requests SET status = 'Approved', admin_note = ?, approved_at = CURRENT_TIMESTAMP WHERE id = ?")
          .run(admin_note || '', id);

        // 1. Insert bundle purchase for promo username
        const purRes1 = db.prepare("INSERT INTO user_purchases (username, item_type, item_id, payment_id, status) VALUES (?, 'BUNDLE', 'ALL', ?, 'Active')")
          .run(promo.username, id);

        // 2. If student has phone differing from username, also insert for phone
        if (promo.phone && promo.phone !== promo.username) {
          try {
            const purRes2 = db.prepare("INSERT INTO user_purchases (username, item_type, item_id, payment_id, status) VALUES (?, 'BUNDLE', 'ALL', ?, 'Active')")
              .run(promo.phone, id);
            const p2 = db.prepare('SELECT * FROM user_purchases WHERE id = ?').get(purRes2.lastInsertRowid) as any;
            if (p2) pushUserPurchaseToCloud(p2);
          } catch {}
        }

        // 3. Sync to Firestore
        try {
          const updatedPromo = db.prepare('SELECT * FROM promo_requests WHERE id = ?').get(id) as any;
          if (updatedPromo) pushPromoRequestToCloud(updatedPromo);

          const p1 = db.prepare('SELECT * FROM user_purchases WHERE id = ?').get(purRes1.lastInsertRowid) as any;
          if (p1) pushUserPurchaseToCloud(p1);
        } catch (e) {
          console.error('Error syncing approved promo/purchase to cloud:', e);
        }

        savePersistentSnapshot();
      } else {
        db.prepare("UPDATE promo_requests SET status = 'Rejected', admin_note = ? WHERE id = ?")
          .run(admin_note || '', id);
        try {
          const updatedPromo = db.prepare('SELECT * FROM promo_requests WHERE id = ?').get(id) as any;
          if (updatedPromo) pushPromoRequestToCloud(updatedPromo);
        } catch {}
        savePersistentSnapshot();
      }
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Notifications
  app.get('/api/admin_notifications', (req, res) => {
    try {
      const { username } = req.query;
      let rows;
      if (username) {
        rows = db.prepare(`
          SELECT * FROM admin_notifications WHERE student_username = ? AND is_read = 0
          ORDER BY CASE priority WHEN 'Urgent' THEN 0 WHEN 'Important' THEN 1 ELSE 2 END, id DESC
        `).all(String(username));
      } else {
        rows = db.prepare('SELECT * FROM admin_notifications ORDER BY id DESC LIMIT 100').all();
      }
      res.json(rows);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/admin_notifications', (req, res) => {
    try {
      const { student_username, title, message, priority, created_by } = req.body;
      db.prepare(`
        INSERT INTO admin_notifications (student_username, title, message, priority, created_by)
        VALUES (?, ?, ?, ?, ?)
      `).run(student_username, title || 'Notice', message, priority || 'Info', created_by || 'Admin');
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/admin_notifications/mark_read', (req, res) => {
    try {
      const { username } = req.body;
      db.prepare('UPDATE admin_notifications SET is_read = 1 WHERE student_username = ? AND is_read = 0').run(username);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete('/api/admin_notifications/:id', (req, res) => {
    try {
      db.prepare('DELETE FROM admin_notifications WHERE id = ?').run(Number(req.params.id));
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Ask Corner
  app.get('/api/ask_corner', (req, res) => {
    try {
      const { username } = req.query;
      let rows;
      if (username) {
        rows = db.prepare('SELECT * FROM ask_corner WHERE submitter_username = ? ORDER BY id DESC LIMIT 20').all(String(username));
      } else {
        rows = db.prepare('SELECT * FROM ask_corner ORDER BY id DESC LIMIT 100').all();
      }
      res.json(rows);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/ask_corner', (req, res) => {
    try {
      const { submitter_username, submitter_name, submitter_role, category, message } = req.body;
      db.prepare(`
        INSERT INTO ask_corner (submitter_username, submitter_name, submitter_role, category, message)
        VALUES (?, ?, ?, ?, ?)
      `).run(submitter_username, submitter_name, submitter_role, category || 'Feedback', message);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/ask_corner/reply', (req, res) => {
    try {
      const { id, admin_reply } = req.body;
      db.prepare("UPDATE ask_corner SET admin_reply = ?, status = 'Replied' WHERE id = ?").run(admin_reply, id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete('/api/ask_corner/:id', (req, res) => {
    try {
      db.prepare('DELETE FROM ask_corner WHERE id = ?').run(req.params.id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Student Scores / Analytics
  app.get('/api/student_scores', (req, res) => {
    try {
      const rows = db.prepare('SELECT * FROM student_scores ORDER BY timestamp DESC LIMIT 200').all();
      res.json(rows);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/student_scores', (req, res) => {
    try {
      const { student_name, student_phone, school_name, district, exam_name, topic_name, score, total_questions, percentage } = req.body;
      db.prepare(`
        INSERT INTO student_scores (student_name, student_phone, school_name, district, exam_name, topic_name, score, total_questions, percentage)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(student_name, student_phone, school_name, district, exam_name, topic_name, score, total_questions, percentage);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // AI Studio Internal Control Plane Probe & Health Status
  app.get('/__aistudio_internal_control_plane/dev/status', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json({ status: 'ready', server: 'running', timestamp: new Date().toISOString() });
  });

  app.all('/__aistudio_internal_control_plane/*', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json({ status: 'ready' });
  });

  // Health check endpoints for Cloud Run, Nginx, AI Studio supervisor, and monitoring
  app.get(['/healthz', '/health', '/api/health', '/api/status', '/ping'], (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json({ status: 'ok', server: 'running', timestamp: new Date().toISOString() });
  });

  // Dedicated Prospectus PDF Download Endpoint with Content-Disposition attachment
  app.get(['/api/download-prospectus', '/api/download_prospectus'], (req, res) => {
    const pdfPath = path.resolve(process.cwd(), 'public', 'WBBSE_Geography_App_Prospectus_Teachers_Report.pdf');
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).send('Prospectus PDF not found');
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="WBBSE_Geography_App_Prospectus_Teachers_Report.pdf"');
    res.download(pdfPath, 'WBBSE_Geography_App_Prospectus_Teachers_Report.pdf');
  });

  app.get('/WBBSE_Geography_App_Prospectus_Teachers_Report.pdf', (req, res, next) => {
    const pdfPath = path.resolve(process.cwd(), 'public', 'WBBSE_Geography_App_Prospectus_Teachers_Report.pdf');
    if (fs.existsSync(pdfPath)) {
      if (req.query.download === '1') {
        res.setHeader('Content-Disposition', 'attachment; filename="WBBSE_Geography_App_Prospectus_Teachers_Report.pdf"');
      }
      res.setHeader('Content-Type', 'application/pdf');
      return res.sendFile(pdfPath);
    }
    next();
  });

  // API 404 Guard: ensure unmatched API calls return JSON 404 and NEVER fall through to HTML/Vite
  app.all('/api/*', (req, res) => {
    res.status(404).json({ error: `API endpoint ${req.method} ${req.path} not found` });
  });

  // Serve static assets or mount Vite
  app.use(express.static(path.resolve(process.cwd(), 'public')));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  // Cloud Run sets PORT=8080 for the outer container, where Nginx listens and proxies to localhost:3000.
  // Express must always bind to port 3000. Never bind to 8080 to prevent EADDRINUSE crash.
  let PORT = 3000;
  const portArgIdx = process.argv.indexOf('--port');
  if (portArgIdx !== -1 && process.argv[portArgIdx + 1]) {
    const parsed = parseInt(process.argv[portArgIdx + 1], 10);
    if (!isNaN(parsed) && parsed !== 8080) {
      PORT = parsed;
    }
  } else if (process.env.PORT && process.env.PORT !== '8080') {
    const parsed = parseInt(process.env.PORT, 10);
    if (!isNaN(parsed)) {
      PORT = parsed;
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WBBSE Geography Portal Server successfully running on http://0.0.0.0:${PORT}`);
    // Start continuous cloud synchronization with centralized Firestore
    initialSyncWithCloud(db).catch(err => console.error('[CloudSync] Boot sync error:', err));
    startPeriodicCloudSync(db);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
