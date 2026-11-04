const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outputPath = path.resolve(__dirname, 'public', 'WBBSE_Geography_App_Prospectus_Teachers_Report.pdf');
const altOutputPath = path.resolve(__dirname, 'public', 'WBBSE_Geography_Complete_Demonstration_Slides.pdf');

// Create Landscape A4 Document (841.89 x 595.28 pt) - PowerPoint / Presentation Style
// Set margins to 0 and autoPageBreak to false to prevent accidental blank/corrupt pages
const doc = new PDFDocument({
  size: 'A4',
  layout: 'landscape',
  margins: { top: 0, bottom: 0, left: 0, right: 0 },
  autoFirstPage: true,
  bufferPages: true
});

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// Register Bengali TrueType Fonts
const fontBengaliRegular = '/usr/share/fonts/truetype/noto/NotoSansBengali-Regular.ttf';
const fontBengaliBold = '/usr/share/fonts/truetype/noto/NotoSansBengali-Bold.ttf';
let hasBengaliFont = false;
try {
  if (fs.existsSync(fontBengaliRegular) && fs.existsSync(fontBengaliBold)) {
    doc.registerFont('NotoBengali', fontBengaliRegular);
    doc.registerFont('NotoBengaliBold', fontBengaliBold);
    hasBengaliFont = true;
  }
} catch (e) {
  hasBengaliFont = false;
}

// Color Palette
const cNavy = '#0a192f';
const cRoyal = '#1e3a8a';
const cBlue = '#2563eb';
const cLightBlue = '#eff6ff';
const cIndigo = '#4338ca';
const cPurple = '#6b21a8';
const cLightPurple = '#faf5ff';
const cAmber = '#b45309';
const cLightAmber = '#fffbeb';
const cGold = '#d97706';
const cEmerald = '#065f46';
const cLightGreen = '#ecfdf5';
const cDarkText = '#0f172a';
const cMuted = '#475569';
const cBorder = '#cbd5e1';

// Helper: Start New Slide
function startNewSlide(slideNum) {
  if (slideNum > 1) {
    doc.addPage({
      size: 'A4',
      layout: 'landscape',
      margins: { top: 0, bottom: 0, left: 0, right: 0 }
    });
  }
}

// Helper: Slide Header
function renderSlideHeader(slideNum, categoryBadge, titleEn, subtitle) {
  // Top Banner
  doc.rect(30, 20, 782, 58).fill(cNavy);
  
  // Category Pill
  doc.rect(42, 28, 175, 18).fillAndStroke(cBlue, '#60a5fa');
  doc.fillColor('#ffffff').fontSize(7.5).font('Helvetica-Bold')
     .text(categoryBadge.toUpperCase(), 42, 33, { width: 175, align: 'center', lineBreak: false });

  // Slide Number
  doc.fillColor('#94a3b8').fontSize(8.5).font('Helvetica-Bold')
     .text(`SLIDE ${slideNum} / 8`, 710, 33, { width: 90, align: 'right', lineBreak: false });

  // Main Slide Title
  doc.fillColor('#ffffff').fontSize(13.5).font('Helvetica-Bold')
     .text(titleEn, 42, 49, { width: 560, lineBreak: false });

  // Subtitle
  doc.fillColor('#93c5fd').fontSize(8.5).font('Helvetica')
     .text(subtitle, 42, 64, { width: 750, lineBreak: false });
}

// Helper: Slide Footer
function renderSlideFooter() {
  doc.rect(30, 555, 782, 22).fill(cRoyal);
  doc.fillColor('#ffffff').fontSize(7.5).font('Helvetica-Bold')
     .text('WBBSE Class 10 Geography Portal & Digital Lab  |  Academic Directors: Shawon Kar (Ph: 7001257277) & Sukannya Chakraborty  |  Calcutta University Faculty', 40, 562, { width: 760, align: 'center', lineBreak: false });
}

// Helper: Card Container
function renderCard(x, y, w, h, title, tag, borderColor, bg = '#ffffff') {
  doc.rect(x, y, w, h).fillAndStroke(bg, borderColor);
  doc.rect(x, y, w, 22).fill(borderColor);
  doc.fillColor('#ffffff').fontSize(8.5).font('Helvetica-Bold')
     .text(`[${tag}]  ${title}`, x + 8, y + 6, { width: w - 16, lineBreak: false });
}

// ============================================================================
// SLIDE 1: COVER & EXECUTIVE MASTER PROSPECTUS
// ============================================================================
startNewSlide(1);
doc.rect(0, 0, 842, 595).fill(cNavy);

// Central card
doc.rect(35, 30, 772, 535).fillAndStroke('#ffffff', '#3b82f6');

// Header Block
doc.rect(35, 30, 772, 102).fill(cRoyal);
doc.fillColor('#fbbf24').fontSize(10.5).font('Helvetica-Bold')
   .text('WEST BENGAL BOARD OF SECONDARY EDUCATION (WBBSE)  •  MADHYAMIK CLASS 10 CURRICULUM', 35, 44, { width: 772, align: 'center', lineBreak: false });
doc.fillColor('#ffffff').fontSize(21).font('Helvetica-Bold')
   .text('GEOGRAPHY DIGITAL LAB & EXAM PREPARATION PORTAL', 35, 60, { width: 772, align: 'center', lineBreak: false });
doc.fillColor('#e0e7ff').fontSize(9.5).font('Helvetica')
   .text('Comprehensive Institutional Demonstration, System Architecture & Candidate Mobilization Handbook', 35, 90, { width: 772, align: 'center', lineBreak: false });

// Academic Directors / Founders Card
doc.rect(60, 142, 722, 80).fillAndStroke('#f8fafc', '#94a3b8');
doc.fillColor(cAmber).fontSize(9.5).font('Helvetica-Bold')
   .text('CHIEF ACADEMIC ARCHITECTS & MASTER MENTORS:', 75, 152, { lineBreak: false });

doc.fillColor(cDarkText).fontSize(9).font('Helvetica-Bold')
   .text('1. SHAWON KAR', 75, 170, { lineBreak: false })
   .text('2. SUKANNYA CHAKRABORTY', 435, 170, { lineBreak: false });

doc.fillColor(cMuted).fontSize(8).font('Helvetica')
   .text('M.Sc. in Geography (University of Calcutta)  |  B.Ed. (BSAEU)', 75, 184, { lineBreak: false })
   .text('Head Admin & Chief Faculty  |  Helpline: +91 7001257277', 75, 196, { lineBreak: false })
   .text('M.Sc. in Geography (University of Calcutta)  |  B.Ed.', 435, 184, { lineBreak: false })
   .text('Senior Academic Faculty & Evaluation Coordinator', 435, 196, { lineBreak: false });

// 3 Key Pillars
const pillarW = 230;
// Pillar 1: Students
renderCard(60, 235, pillarW, 215, 'STUDENT LEARNING HUB', '1', cBlue, '#f0fdf4');
doc.fillColor(cDarkText).fontSize(7.5).font('Helvetica')
   .text('• 100% WBBSE Class 10 Syllabus Aligned', 70, 265, { lineBreak: false })
   .text('• Chapter-wise MCQ (with instant scoring)', 70, 280, { lineBreak: false })
   .text('• SAQ, 2M, 3M & 5M Model Answer Keys', 70, 295, { lineBreak: false })
   .text('• 3 Free Preview PDFs + 3 Enrolled Master PDFs', 70, 310, { lineBreak: false })
   .text('• 90-Marks Board Simulation Mock Exams', 70, 325, { lineBreak: false })
   .text('• Private Student-to-Teacher Doubt Resolver', 70, 340, { lineBreak: false })
   .text('• Mobile-First PWA (Works without Play Store)', 70, 355, { lineBreak: false })
   .text('• MP Batch Validity until 31st March of exam year', 70, 370, { lineBreak: false })
   .text('• Refer & Win: Up to Rs. 7,500 Cash Awards', 70, 385, { lineBreak: false })
   .text('• Real-time doubt submission status tracking', 70, 400, { lineBreak: false });

// Pillar 2: Teachers
renderCard(306, 235, pillarW, 215, 'TEACHER & CO-ADMIN SYSTEM', '2', cPurple, '#faf5ff');
doc.fillColor(cDarkText).fontSize(7.5).font('Helvetica')
   .text('• School Teacher Institutional Registration', 316, 265, { lineBreak: false })
   .text('• Evaluates Assigned Student Answer Scripts', 316, 280, { lineBreak: false })
   .text('• Direct Doubt Routing & Voice/Text Solutions', 316, 295, { lineBreak: false })
   .text('• Question Bank & Suggestion Upload to Admin', 316, 310, { lineBreak: false })
   .text('• Two-Tier Co-Admin Institutional Promotion', 316, 325, { lineBreak: false })
   .text('• Safe Queue: Proposals confirmed by Head Admin', 316, 340, { lineBreak: false })
   .text('• District & School Student Performance Tracker', 316, 355, { lineBreak: false })
   .text('• Access to 10-Yr Madhyamik Question Drive', 316, 370, { lineBreak: false })
   .text('• Educator Mobilization Bonus: Rs. 100/student', 316, 385, { lineBreak: false })
   .text('• Student marks export for staff meetings', 316, 400, { lineBreak: false });

// Pillar 3: Admins
renderCard(552, 235, pillarW, 215, 'HEAD ADMIN CONTROL (SHAWON KAR)', '3', cAmber, '#fffbeb');
doc.fillColor(cDarkText).fontSize(7.5).font('Helvetica')
   .text('• Master Protected Authority (Non-degradable)', 562, 265, { lineBreak: false })
   .text('• Broadcast Announcements to All Students', 562, 280, { lineBreak: false })
   .text('• Central Student & Teacher Approval Engine', 562, 295, { lineBreak: false })
   .text('• Co-Admin Review Queue (Approve / Reject)', 562, 310, { lineBreak: false })
   .text('• Payment & UTR Transaction Verification', 562, 325, { lineBreak: false })
   .text('• Question Bank Authoring & PDF Dispatch', 562, 340, { lineBreak: false })
   .text('• Full Database Export: Excel / CSV (UTF-8 BOM)', 562, 355, { lineBreak: false })
   .text('• State-Wide Pass %, Score & Accuracy Analytics', 562, 370, { lineBreak: false })
   .text('• Official Helpline: +91 7001257277', 562, 385, { lineBreak: false })
   .text('• Real-time candidate search by district', 562, 400, { lineBreak: false });

// Slide 1 Bottom Action Strip
doc.rect(60, 462, 722, 85).fillAndStroke('#eff6ff', '#2563eb');
doc.fillColor(cRoyal).fontSize(8.5).font('Helvetica-Bold')
   .text('PURPOSE OF THIS HANDBOOK FOR SCHOOLS & REPRESENTATIVES:', 75, 474, { lineBreak: false });
doc.fillColor(cDarkText).fontSize(7.5).font('Helvetica')
   .text('This presentation provides school Headmasters, Geography faculty, and coaching administrators a complete walkthrough of every navigation menu and automated workflow in the portal. Use this document to demonstrate the platform at school staff meetings, tuition assemblies, and social media campaigns to gather candidates for Madhyamik 2026-2027.', 75, 489, { width: 690, lineGap: 2.5 });

// ============================================================================
// SLIDE 2: ARCHITECTURE & SECURITY HIERARCHY
// ============================================================================
startNewSlide(2);
renderSlideHeader(2, 'CORE GOVERNANCE', 'PORTAL ARCHITECTURE & TWO-TIER HIERARCHY', 'Understanding user roles, registration verification, database persistence, and safety protocols');
renderSlideFooter();

// Left Box: Role Comparison
renderCard(30, 90, 375, 450, 'PORTAL ROLES & ACCESS MATRIX', 'ROLES', cBlue);
const matrixItems = [
  { role: 'Student (Candidate)', auth: 'Phone + Password', desc: 'Full access to 6 chapters, practice tests, 90-marks mock exams, model PDF downloads, doubt submissions, and referral dashboard.', badge: 'ENROLLED' },
  { role: 'Registered Teacher', auth: 'Institutional Phone + Pwd', desc: 'Reviewed and verified by Head Admin. Evaluates assigned student answer sheets, answers chapter doubts, and tracks school candidates.', badge: 'VERIFIED' },
  { role: 'Co-Admin (Assistant Admin)', auth: 'Upgraded Teacher Account', desc: 'Senior teacher promoted by Head Admin Shawon Kar. Can inspect user registrations and submit approve/suspend proposals via safe queue.', badge: 'CO-ADMIN' },
  { role: 'Head Admin (Shawon Kar)', auth: 'admin / 7001257277', desc: 'Permanent supreme administrator. Has final execution rights over all approvals, payment confirmations, content uploads, and database exports.', badge: 'SUPREME' }
];

let myY = 125;
matrixItems.forEach((m, idx) => {
  doc.rect(42, myY, 350, 95).fillAndStroke('#f8fafc', '#cbd5e1');
  doc.fillColor(cRoyal).fontSize(8.5).font('Helvetica-Bold').text(`[${idx+1}] ${m.role}`, 50, myY + 8, { lineBreak: false });
  doc.rect(315, myY + 6, 70, 14).fill(cBlue);
  doc.fillColor('#ffffff').fontSize(7).font('Helvetica-Bold').text(m.badge, 315, myY + 9, { width: 70, align: 'center', lineBreak: false });
  
  doc.fillColor(cAmber).fontSize(7.5).font('Helvetica-Bold').text(`Auth: ${m.auth}`, 50, myY + 24, { lineBreak: false });
  doc.fillColor(cDarkText).fontSize(7.5).font('Helvetica').text(m.desc, 50, myY + 38, { width: 335, lineGap: 2 });
  myY += 105;
});

// Right Box: Two-Tier Governance Workflow
renderCard(420, 90, 392, 450, 'TWO-TIER CO-ADMIN REVIEW HIERARCHY', 'WORKFLOW', cPurple);
doc.fillColor(cDarkText).fontSize(8.5).font('Helvetica')
   .text('To ensure 100% academic integrity and prevent accidental or unauthorized student suspensions, the platform enforces an enterprise-grade two-tier approval hierarchy:', 432, 122, { width: 368, lineGap: 2.5 });

const workflowSteps = [
  { step: 'Step 1: Teacher Registration & Head Admin Vetting', text: 'Any Geography educator registers with their school name and district. The account remains inactive until Head Admin Shawon Kar validates credentials.' },
  { step: 'Step 2: Promotion to Co-Admin (Assistant Administrator)', text: 'Experienced faculty members are upgraded to "Co-Admin". This allows them to monitor student enrollments, inspect question banks, and suggest actions.' },
  { step: 'Step 3: Safe Co-Admin Proposal Queue (No Direct Risk)', text: 'When a Co-Admin clicks "Approve Student" or "Suspend", the action does NOT apply immediately. Instead, it enters the Head Admin Review Queue as a proposal.' },
  { step: 'Step 4: Supreme Review & Instant Execution by Shawon Kar', text: 'Head Admin Shawon Kar reviews pending co-admin proposals with one click: [Approve & Execute] or [Reject]. Full audit log records who proposed and who approved.' },
  { step: 'Step 5: Head Admin Protection Guarantee', text: 'Head Admin Shawon Kar (7001257277 / admin) cannot be suspended, demoted, or altered by any Co-Admin, guaranteeing continuous portal stability.' }
];

let wfY = 168;
workflowSteps.forEach(s => {
  doc.rect(432, wfY, 368, 65).fillAndStroke('#faf5ff', '#c084fc');
  doc.fillColor(cPurple).fontSize(8).font('Helvetica-Bold').text(s.step, 440, wfY + 6, { lineBreak: false });
  doc.fillColor(cDarkText).fontSize(7.5).font('Helvetica').text(s.text, 440, wfY + 20, { width: 352, lineGap: 1.5 });
  wfY += 72;
});

// ============================================================================
// SLIDE 3: STUDENT PANEL (PART 1) — DASHBOARD & PRACTICE CENTER
// ============================================================================
startNewSlide(3);
renderSlideHeader(3, 'STUDENT PANEL • PART 1', 'DASHBOARD, CHAPTER PRACTICE & DUAL-TIER PDF SYSTEM', 'Every navigation option detailed for student exam preparation and revision');
renderSlideFooter();

// Left: Dashboard Options
renderCard(30, 90, 375, 450, 'OPTION 1: [DASHBOARD] COCKPIT', 'DASHBOARD', cBlue);
doc.fillColor(cDarkText).fontSize(8).font('Helvetica')
   .text('The Student Dashboard acts as the primary cockpit for the candidate upon logging in:', 42, 122, { width: 350, lineBreak: false });

const dashWidgets = [
  { title: 'MP Examination Batch Validity Card', text: 'Displays student name, school name, district, and exact validity date (e.g., Active until 31st March 2027 for Madhyamik 2027 batch). Prevents expired access confusion.' },
  { title: 'Admin Live Notification Hub', text: 'Real-time alert banner showing urgent updates, routine changes, suggestion releases, and tips from Shawon Sir.' },
  { title: 'Quick Start Chapter Launchpad', text: 'One-tap jump buttons directly into Chapter 1 through 6, displaying current question completion status.' },
  { title: 'Recent Mock Exam Performance Summary', text: 'Shows marks scored in the latest 90-marks mock test, percentage, and teacher feedback highlights.' },
  { title: 'Active Doubt Resolution Tracker', text: 'Displays counts of questions where student has asked doubts and notifies when the teacher replies.' }
];

let dwY = 144;
dashWidgets.forEach(w => {
  doc.rect(42, dwY, 350, 70).fillAndStroke('#f8fafc', '#93c5fd');
  doc.fillColor(cRoyal).fontSize(8).font('Helvetica-Bold').text(w.title, 50, dwY + 6, { lineBreak: false });
  doc.fillColor(cDarkText).fontSize(7.5).font('Helvetica').text(w.text, 50, dwY + 20, { width: 334, lineGap: 1.5 });
  dwY += 78;
});

// Right: Practice Center
renderCard(420, 90, 392, 450, 'OPTION 2: [PRACTICE CENTER] (ALL 6 CHAPTERS)', 'PRACTICE', cEmerald);
doc.fillColor(cDarkText).fontSize(8).font('Helvetica')
   .text('The comprehensive practice engine covering all six chapters of WBBSE Class 10 Geography:', 432, 122, { width: 368, lineBreak: false });

const practiceFeatures = [
  { bn: '১. বহির্জাত প্রক্রিয়া ও ভূমিরূপ', en: 'Chapter 1: Exogenic Processes & Landforms', desc: 'Rivers, Glaciers, Wind action, delta formation, waterfalls, yardangs, mushroom rocks with diagrams.' },
  { bn: '২. বায়ুমণ্ডল', en: 'Chapter 2: Atmosphere & Climatology', desc: 'Layers of atmosphere, insolation heat budget, planetary wind belts, cyclones, monsoon circulation.' },
  { bn: '৩. বারিমণ্ডল', en: 'Chapter 3: Hydrosphere & Ocean Currents', desc: 'Atlantic, Pacific & Indian ocean currents, tidal cycle (Spring & Neap tides), Gulf stream effects.' },
  { bn: '৪. বর্জ্য ব্যবস্থাপনা', en: 'Chapter 4: Waste Management', desc: 'Organic, toxic, industrial, e-waste, 4R concepts, composting, segregation, environmental impact.' },
  { bn: '৫. ভারত - প্রাকৃতিক ও অর্থনৈতিক পরিবেশ', en: 'Chapter 5: India Physical & Economic Environment', desc: 'Himalayas, Northern Plains, Peninsular plateau, rivers, soils, natural vegetation, agriculture, industry, population.' },
  { bn: '৬. উপগ্রহ চিত্র ও ভূ-বৈচিত্র্যসূচক মানচিত্র', en: 'Chapter 6: Satellite Imagery & Topographic Maps', desc: 'FCC false color composites, IRS satellites, topo sheet scale (1:50,000), grid reading, contours.' }
];

let pfY = 140;
practiceFeatures.forEach(p => {
  doc.rect(432, pfY, 368, 48).fillAndStroke('#ecfdf5', '#6ee7b7');
  if (hasBengaliFont) {
    doc.fillColor(cEmerald).fontSize(8).font('NotoBengaliBold').text(p.bn, 440, pfY + 5, { lineBreak: false });
    doc.fillColor(cRoyal).fontSize(7).font('Helvetica-Bold').text(` (${p.en})`, 440 + doc.widthOfString(p.bn) + 6, pfY + 6, { lineBreak: false });
  } else {
    doc.fillColor(cEmerald).fontSize(7.5).font('Helvetica-Bold').text(p.en, 440, pfY + 5, { lineBreak: false });
  }
  doc.fillColor(cDarkText).fontSize(7).font('Helvetica').text(p.desc, 440, pfY + 20, { width: 352, lineGap: 1 });
  pfY += 54;
});

// Dual Tier PDF highlight box
doc.rect(432, 470, 368, 60).fillAndStroke('#eff6ff', '#2563eb');
doc.fillColor(cRoyal).fontSize(8).font('Helvetica-Bold').text('DUAL-TIER PDF REPOSITORY PER CHAPTER:', 440, 477, { lineBreak: false });
doc.fillColor(cDarkText).fontSize(7).font('Helvetica')
   .text('• 3 Free Sample PDFs: Open to all registered students to test question quality and clarity.', 440, 492, { lineBreak: false })
   .text('• 3 Enrolled Master PDFs: Unlocks complete verified 2M, 3M, 5M answers and diagram guide for paid candidates.', 440, 507, { width: 352 });

// ============================================================================
// SLIDE 4: STUDENT PANEL (PART 2) — MOCK TESTS, DOUBTS & REWARDS
// ============================================================================
startNewSlide(4);
renderSlideHeader(4, 'STUDENT PANEL • PART 2', 'MOCK TESTS, EXAM SUBMISSIONS, DOUBTS & SCHOLARSHIPS', 'Madhyamik 90-marks simulation, teacher evaluation workflow, and referral incentives');
renderSlideFooter();

// Col 1: Mock Tests & Suggestions
renderCard(30, 90, 245, 450, 'MOCK TESTS & SUGGESTIONS', 'MOCK', cBlue);
doc.fillColor(cDarkText).fontSize(7.5).font('Helvetica')
   .text('Full-length 90-Marks Madhyamik examination simulation strictly conforming to Board blueprint:', 38, 120, { width: 228 })
   .text('• Group A: 14 MCQ (Mandatory)', 38, 150, { lineBreak: false })
   .text('• Group B: 22 SAQ (True/False, Blanks, Match, 1-word)', 38, 170, { lineBreak: false })
   .text('• Group C: 6 x 2 Marks = 12 Marks (Short Explanations)', 38, 200, { lineBreak: false })
   .text('• Group D: 4 x 3 Marks = 12 Marks (Analytical/Comparative)', 38, 230, { lineBreak: false })
   .text('• Group E: 4 x 5 Marks = 20 Marks (2 Physical, 2 Regional)', 38, 260, { lineBreak: false })
   .text('• Group F: 10 x 1 Mark = 10 Marks (India Map Pointing)', 38, 298, { lineBreak: false });

doc.rect(38, 335, 228, 92).fillAndStroke('#eff6ff', '#93c5fd');
doc.fillColor(cRoyal).fontSize(8).font('Helvetica-Bold').text('Timed Board Environment:', 46, 345, { lineBreak: false });
doc.fillColor(cDarkText).fontSize(7).font('Helvetica')
   .text('Built-in 3 Hour 15 Minute countdown timer simulating real Board hall pressure. Instant calculation of objective marks.', 46, 360, { width: 212, lineGap: 1.5 });

doc.rect(38, 437, 228, 92).fillAndStroke('#fffbeb', '#f59e0b');
doc.fillColor(cAmber).fontSize(8).font('Helvetica-Bold').text('Subjective Answer Upload:', 46, 447, { lineBreak: false });
doc.fillColor(cDarkText).fontSize(7).font('Helvetica')
   .text('Students take photos of their handwritten answer sheets and upload them directly for teacher checking.', 46, 462, { width: 212, lineGap: 1.5 });

// Col 2: Doubt Clearing & Submissions
renderCard(295, 90, 245, 450, 'DOUBTS & SUBMISSIONS', 'HELP', cPurple);
doc.fillColor(cDarkText).fontSize(7.5).font('Helvetica')
   .text('Two dedicated navigation tabs connecting student directly with faculty:', 303, 120, { width: 228, lineBreak: false });

doc.rect(303, 144, 228, 185).fillAndStroke('#faf5ff', '#c084fc');
doc.fillColor(cPurple).fontSize(8).font('Helvetica-Bold').text('❓ My Help / Doubt Requests Tab:', 311, 154, { lineBreak: false });
doc.fillColor(cDarkText).fontSize(7).font('Helvetica')
   .text('• In any question across Practice Center or Mocks, students can click "Ask Sir a Doubt".', 311, 172, { width: 212 })
   .text('• Opens an interactive query box with prompt chips ("Explain why this option is correct", "Clarify concept in simple terms").', 311, 204, { width: 212 })
   .text('• Query routes to designated faculty member.', 311, 250, { width: 212 })
   .text('• Teacher response appears directly inside student portal.', 311, 275, { width: 212 });

doc.rect(303, 340, 228, 190).fillAndStroke('#f0fdf4', '#86efac');
doc.fillColor(cEmerald).fontSize(8).font('Helvetica-Bold').text('📝 My Exam Submissions Tab:', 311, 350, { lineBreak: false });
doc.fillColor(cDarkText).fontSize(7).font('Helvetica')
   .text('• Real-time tracking of every submitted paper.', 311, 368, { width: 212 })
   .text('• Status tags: [PENDING REVIEW] -> [CHECKED BY TEACHER].', 311, 393, { width: 212 })
   .text('• Breakdown of Marks obtained vs Total Marks.', 311, 423, { width: 212 })
   .text('• Teacher qualitative remarks, point additions, and diagram corrections.', 311, 448, { width: 212 });

// Col 3: Referrals & Drive Papers
renderCard(560, 90, 252, 450, 'REFERRALS & DRIVE PAPERS', 'REWARDS', cAmber);
doc.fillColor(cDarkText).fontSize(7.5).font('Helvetica')
   .text('Candidate empowerment and resource repository navigation options:', 568, 120, { width: 236, lineBreak: false });

doc.rect(568, 144, 236, 185).fillAndStroke('#fffbeb', '#fcd34d');
doc.fillColor(cAmber).fontSize(8).font('Helvetica-Bold').text('🎁 Refer & Earn (Rs. 7,500 Prize):', 576, 154, { lineBreak: false });
doc.fillColor(cDarkText).fontSize(7).font('Helvetica')
   .text('• Unique student code: GEO-REF-XXXX.', 576, 172, { width: 220 })
   .text('• Shareable 1-click WhatsApp referral link.', 576, 197, { width: 220 })
   .text('• Real-time referral count and leaderboard.', 576, 222, { width: 220 })
   .text('• Direct Rs. 100 reward per referred friend upon enrollment.', 576, 247, { width: 220 })
   .text('• Grand Cash Prize of Rs. 7,500 awarded to top candidate ambassadors statewide.', 576, 282, { width: 220 });

doc.rect(568, 340, 236, 190).fillAndStroke('#f8fafc', '#94a3b8');
doc.fillColor(cNavy).fontSize(8).font('Helvetica-Bold').text('📁 Madhyamik Drive Papers Tab:', 576, 350, { lineBreak: false });
doc.fillColor(cDarkText).fontSize(7).font('Helvetica')
   .text('• Cloud repository of past 10 years Madhyamik Board question papers.', 576, 368, { width: 220 })
   .text('• ABTA, WBHA, and top Kolkata school test paper compilations.', 576, 403, { width: 220 })
   .text('• Downloadable high-resolution PDFs.', 576, 438, { width: 220 })
   .text('• Official WBBSE syllabus notices and blueprint changes archive.', 576, 463, { width: 220 });

// ============================================================================
// SLIDE 5: TEACHER PANEL & CO-ADMIN CENTER
// ============================================================================
startNewSlide(5);
renderSlideHeader(5, 'TEACHER & CO-ADMIN PANEL', 'ALL TEACHER NAVIGATION TOOLS & WORKFLOWS', 'Assigned doubts, question bank management, answer script checking, and Co-Admin review');
renderSlideFooter();

const tCols = [
  {
    title: 'Assigned Student Doubts',
    tag: 'DOUBTS',
    color: cPurple,
    bg: '#faf5ff',
    bullets: [
      'Central queue of all doubts raised by students across schools.',
      'Displays exact question, student name, school, and selected option.',
      'Teacher inputs structured explanation, mnemonic, or diagram tip.',
      'Mark as "Resolved" to notify the student instantly.'
    ]
  },
  {
    title: 'Question Bank Manager',
    tag: 'QUESTIONS',
    color: cBlue,
    bg: '#eff6ff',
    bullets: [
      'Filter questions by chapter (1 to 6) and marks weightage (MCQ, SAQ, 2M, 3M, 5M).',
      'Preview questions exactly as students see them.',
      'Inspect student success rates and frequently failed question items.',
      'Search question text in Bengali and English.'
    ]
  },
  {
    title: 'Check Assigned Answer Sheets',
    tag: 'EVALUATE',
    color: cEmerald,
    bg: '#ecfdf5',
    bullets: [
      'Evaluates student subjective scripts uploaded for 90-marks mock exams.',
      'Review Group C, D, E, and F answers against Board rubric.',
      'Enter section-by-section marks and overall feedback score.',
      'Students receive instant notifications upon script completion.'
    ]
  },
  {
    title: 'Send Suggestions to Admin',
    tag: 'SUBMIT',
    color: cAmber,
    bg: '#fffbeb',
    bullets: [
      'Teachers submit new questions, test papers, or notes.',
      'Head Admin Shawon Kar reviews submissions for portal inclusion.',
      'Recognizes contributing faculty members with author credits.',
      'Fosters collaborative academic development across districts.'
    ]
  },
  {
    title: 'Student Track Records',
    tag: 'RECORDS',
    color: cRoyal,
    bg: '#f1f5f9',
    bullets: [
      'School-wise performance tracker for teachers own batches.',
      'Inspect students who have completed mock tests vs inactive ones.',
      'Download student marks list for school faculty meetings.',
      'Identify weak chapters requiring classroom reinforcement.'
    ]
  },
  {
    title: 'Co-Admin Action Proposals',
    tag: 'CO-ADMIN',
    color: cIndigo,
    bg: '#eef2ff',
    bullets: [
      'Available to teachers upgraded to Co-Admin by Head Admin.',
      'Can inspect candidate approvals and submit approve/suspend actions.',
      'Safe Queue: Actions automatically route to Shawon Kar for review.',
      'Status tracker: Shows pending, approved, or rejected proposals.'
    ]
  }
];

let tx = 30;
let ty = 90;
tCols.forEach((t, i) => {
  renderCard(tx, ty, 245, 215, t.title, t.tag, t.color, t.bg);
  let by = ty + 30;
  t.bullets.forEach(b => {
    doc.fillColor(cDarkText).fontSize(7.5).font('Helvetica')
       .text(`• ${b}`, tx + 10, by, { width: 225, lineGap: 1.5 });
    by += 38;
  });

  if (i % 3 === 2) {
    tx = 30;
    ty += 230;
  } else {
    tx += 268;
  }
});

// ============================================================================
// SLIDE 6: HEAD ADMIN CONTROL PANEL (SHAWON KAR)
// ============================================================================
startNewSlide(6);
renderSlideHeader(6, 'ADMIN CONTROL PANEL', 'HEAD ADMIN SUPER-CONTROL ENGINE (SHAWON KAR)', 'Central approvals, co-admin queue resolution, payment verification, and CSV exports');
renderSlideFooter();

// Top Banner: Head Admin Authority
doc.rect(30, 90, 782, 42).fillAndStroke('#fffbeb', '#f59e0b');
doc.fillColor(cAmber).fontSize(9.5).font('Helvetica-Bold')
   .text('HEAD ADMIN (SHAWON KAR) EXCLUSIVE CONTROL & OVERSIGHT', 45, 99, { lineBreak: false });
doc.fillColor(cDarkText).fontSize(8).font('Helvetica')
   .text('Head Admin Shawon Kar possesses immutable supreme credentials. Co-Admins cannot suspend, demote, or modify Head Admin. All critical institutional decisions remain permanently secure.', 45, 113, { width: 750, lineBreak: false });

const aCols = [
  {
    title: 'Send Student Notifications',
    tag: 'NOTIFY',
    bullets: [
      'Broadcast instant notices to all registered students.',
      'Set notification category: Routine, Exam Alert, Suggestion.',
      'Shows up prominently on every student dashboard upon login.'
    ]
  },
  {
    title: 'User Approvals & Role Hierarchy',
    tag: 'APPROVALS',
    bullets: [
      'Approve newly registered students and teachers with 1-click.',
      'Promote qualified teachers to "Co-Admin" status.',
      'Demote or suspend accounts if required with instant state update.',
      'Search users by phone, school name, district, or exam year.'
    ]
  },
  {
    title: 'Co-Admin Proposal Review Queue',
    tag: 'QUEUE',
    bullets: [
      'Live queue of actions proposed by Co-Admins.',
      'Details: Co-Admin Name, Target Candidate, Action Type, Timestamp.',
      '1-Click [Approve & Execute] or [Reject] with instant database write.'
    ]
  },
  {
    title: 'Payment & UTR Verifications',
    tag: 'PAYMENTS',
    bullets: [
      'Inspect candidate UPI payment submission screenshots and UTR numbers.',
      'Verify transaction authenticity and grant Instant Full Access.',
      'Audit log of all verified and pending subscription fees.'
    ]
  },
  {
    title: 'Export Full Candidate Database (CSV)',
    tag: 'CSV EXPORT',
    bullets: [
      '1-Click export of all enrolled student & teacher records.',
      'Includes Full Name, Phone, School, District, MP Batch, Status.',
      'Encodes with UTF-8 BOM for 100% flawless Bengali text in Excel.'
    ]
  },
  {
    title: 'State-Wide Analytics & Metrics',
    tag: 'METRICS',
    bullets: [
      'State-wide candidate participation, test scores, and chapter accuracy.',
      'Identify top scoring schools and high-performing districts.',
      'Real-time metrics supporting institutional accreditation.'
    ]
  }
];

let ax = 30;
let ay = 145;
aCols.forEach((a, i) => {
  renderCard(ax, ay, 245, 195, a.title, a.tag, cRoyal, '#f8fafc');
  let aby = ay + 32;
  a.bullets.forEach(b => {
    doc.fillColor(cDarkText).fontSize(7.5).font('Helvetica')
       .text(`• ${b}`, ax + 10, aby, { width: 225, lineGap: 2 });
    aby += 45;
  });

  if (i % 3 === 2) {
    ax = 30;
    ay += 205;
  } else {
    ax += 268;
  }
});

// ============================================================================
// SLIDE 7: MOBILE PWA & OFFLINE ARCHITECTURE
// ============================================================================
startNewSlide(7);
renderSlideHeader(7, 'TECHNOLOGY & MOBILE PWA', 'NATIVE SMARTPHONE EXPERIENCE & OFFLINE RESILIENCE', 'Designed for single-hand mobile usage, offline caching, and zero app store barrier');
renderSlideFooter();

// Left Box: PWA Features
renderCard(30, 90, 375, 450, 'PROGRESSIVE WEB APP (PWA) ON PHONES', 'MOBILE APP', cBlue);
const pwaBenefits = [
  { title: 'Zero App Store Barrier (Instant 1-Tap Install)', text: 'Students do not need to download heavy 100MB apps from Google Play Store or Apple App Store. Tapping "Install App" creates a native home-screen app icon in 2 seconds.' },
  { title: 'Offline Study & Caching Engine', text: 'Important chapter questions, notes, and practiced mock tests are cached locally. Students in remote village areas with intermittent mobile network can revise without interruption.' },
  { title: 'Thumb-Friendly Bottom Navigation Bar', text: 'Fixed bottom bar with large 44px tap targets: [Home] [Practice] [Mock Tests] [Suggestions] [Menu], enabling comfortable one-handed use during travel.' },
  { title: 'Safe Area Insets & Notch Compliance', text: 'Fully compliant with modern iPhone and Android screen notches and bottom home-pill bars (pb-safe, pt-safe).' },
  { title: 'Ultra-Lightweight Data Consumption', text: 'Optimized vector graphics and compact payloads consume less than 15MB mobile data per month, making it affordable for rural students.' }
];

let pwaY = 125;
pwaBenefits.forEach(p => {
  doc.rect(42, pwaY, 350, 70).fillAndStroke('#eff6ff', '#bfdbfe');
  doc.fillColor(cRoyal).fontSize(8).font('Helvetica-Bold').text(p.title, 50, pwaY + 6, { lineBreak: false });
  doc.fillColor(cDarkText).fontSize(7.5).font('Helvetica').text(p.text, 50, pwaY + 20, { width: 334, lineGap: 1.5 });
  pwaY += 80;
});

// Right Box: Installation Steps for Teachers & Candidates
renderCard(420, 90, 392, 450, 'STEP-BY-STEP PHONE SETUP GUIDE', 'SETUP', cEmerald);
doc.fillColor(cDarkText).fontSize(8).font('Helvetica')
   .text('Easy 3-step setup for schools, teachers, and students across both Android and iOS:', 432, 122, { width: 368, lineBreak: false });

doc.rect(432, 146, 368, 115).fillAndStroke('#ecfdf5', '#86efac');
doc.fillColor(cEmerald).fontSize(8.5).font('Helvetica-Bold').text('ANDROID (CHROME / BRAVE / SAMSUNG INTERNET):', 442, 156, { lineBreak: false });
doc.fillColor(cDarkText).fontSize(7.5).font('Helvetica')
   .text('1. Open portal URL in Google Chrome browser.', 442, 174, { lineBreak: false })
   .text('2. An in-app banner appears: "Install Phone App".', 442, 191, { lineBreak: false })
   .text('3. Tap [Install]. The WBBSE Geography icon installs immediately onto the home screen.', 442, 208, { lineBreak: false })
   .text('4. Opens without browser address bar like a native application.', 442, 231, { lineBreak: false });

doc.rect(432, 276, 368, 125).fillAndStroke('#faf5ff', '#c084fc');
doc.fillColor(cPurple).fontSize(8.5).font('Helvetica-Bold').text('APPLE IPHONE / IPAD (SAFARI BROWSER):', 442, 286, { lineBreak: false });
doc.fillColor(cDarkText).fontSize(7.5).font('Helvetica')
   .text('1. Open portal URL in Safari on iPhone / iPad.', 442, 304, { lineBreak: false })
   .text('2. Tap the Safari [Share] icon (square with upward arrow) in the bottom toolbar.', 442, 321, { lineBreak: false })
   .text('3. Scroll down and select "Add to Home Screen".', 442, 338, { lineBreak: false })
   .text('4. Tap [Add] in the top right. High-resolution Apple Touch Icon is created.', 442, 361, { lineBreak: false });

doc.rect(432, 416, 368, 110).fillAndStroke('#fffbeb', '#f59e0b');
doc.fillColor(cAmber).fontSize(8.5).font('Helvetica-Bold').text('INSTITUTIONAL QR CODE SCANNING:', 442, 426, { lineBreak: false });
doc.fillColor(cDarkText).fontSize(7.5).font('Helvetica')
   .text('School teachers can print the portal QR code on school noticeboards. Students point their camera and get instant access without typing lengthy web addresses.', 442, 444, { width: 348, lineGap: 1.5 });

// ============================================================================
// SLIDE 8: MOBILIZATION TOOLKIT & SOCIAL MEDIA CAMPAIGN
// ============================================================================
startNewSlide(8);
renderSlideHeader(8, 'CANDIDATE MOBILIZATION', 'SCHOOL DEMONSTRATION & SOCIAL MEDIA CAMPAIGN TOOLKIT', 'Ready-to-post announcements, teacher incentives, and direct contact helpline');
renderSlideFooter();

// Left Box: Candidate Gathering Strategies
renderCard(30, 90, 375, 450, 'STRATEGIES TO GATHER CANDIDATES IN SCHOOLS', 'ACTION PLAN', cBlue);
const stratSteps = [
  { title: '1. Staff Room & Subject Committee Presentation', text: 'Present this PDF to the Headmaster / Geography faculty. Emphasize that student doubts and mock scripts are handled systematically, reducing teacher workload.' },
  { title: '2. 15-Minute Morning Assembly Announcement', text: 'Inform Class 10 Madhyamik students about the chapter-wise 2M, 3M, 5M model answers and 90-marks mock simulations aligned with West Bengal Board pattern.' },
  { title: '3. Special Coaching & Tuition Batch Enrollment', text: 'Coaching centers can enroll entire batches. School representatives receive unique referral codes earning Rs. 100 per enrolled student + Rs. 7,500 grand prize pool.' },
  { title: '4. WhatsApp & Telegram Broadcast Campaign', text: 'Copy the ready-to-post message (shown on right) into school class groups, tuition circles, and parent associations.' }
];

let stY = 125;
stratSteps.forEach(s => {
  doc.rect(42, stY, 350, 95).fillAndStroke('#f8fafc', '#93c5fd');
  doc.fillColor(cRoyal).fontSize(8).font('Helvetica-Bold').text(s.title, 50, stY + 6, { lineBreak: false });
  doc.fillColor(cDarkText).fontSize(7.5).font('Helvetica').text(s.text, 50, stY + 22, { width: 334, lineGap: 2 });
  stY += 105;
});

// Right Box: Social Media Broadcast Copy
renderCard(420, 90, 392, 450, 'READY-TO-POST SOCIAL MEDIA BROADCAST MESSAGE', 'BROADCAST', cEmerald);
doc.fillColor(cDarkText).fontSize(8).font('Helvetica')
   .text('Copy and paste this formatted announcement directly into WhatsApp groups and Facebook:', 432, 122, { width: 368, lineBreak: false });

const socialMsgCard = 
  'পশ্চিমবঙ্গ মধ্যশিক্ষা পর্ষদ (WBBSE) দশম শ্রেণি ভূগোল পোর্টাল ও ডিজিটাল ল্যাব\n' +
  'মাধ্যমিক ২০২৬-২০২৭ ভূগোল পরীক্ষার সেরা প্রস্তুতি হাব!\n\n' +
  'শ্রদ্ধেয় শিক্ষক-শিক্ষিকা, প্রধান শিক্ষক ও অভিভাবকবৃন্দের জন্য সুখবর!\n' +
  'মাধ্যমিক ভূগোল বিষয়ে ৯০%+ নম্বর নিশ্চিত করতে আমাদের ডিজিটাল পোর্টাল উন্মুক্ত:\n\n' +
  'প্রধান সুবিধাসমূহ:\n' +
  '১. অধ্যায়ভিত্তিক প্রশ্নভান্ডার: MCQ (তাৎক্ষণিক রেজাল্ট সহ), SAQ এবং ২, ৩ ও ৫ নম্বরের মডেল উত্তরপত্র।\n' +
  '২. আলাদা PDF গাইড: সাধারণ শিক্ষার্থীদের জন্য ৩টি ফ্রি এবং পেইড শিক্ষার্থীদের জন্য বিশেষ ৩টি মাস্টার PDF।\n' +
  '৩. ৯০ নম্বরের পূর্ণাঙ্গ মক টেস্ট: পর্ষদের ব্লুপ্রিন্ট ও টাইমার অনুযায়ী টেস্ট দিয়ে খাতা জমার সুবিধা।\n' +
  '৪. শিক্ষকদের খাতা পরীক্ষণ: অভিজ্ঞ শিক্ষকবৃন্দ সরাসরি ছাত্রছাত্রীদের লেখা খাতা নিরীক্ষণ ও নম্বর প্রদান করবেন।\n' +
  '৫. মোবাইল ফ্রেন্ডলি অ্যাপ (PWA): ফোনে সরাসরি ইনস্টল করে অফলাইনেও রিভিশন সম্ভব।\n\n' +
  'শিক্ষকদের জন্য বিশেষ সুযোগ: শিক্ষক ও কো-অ্যাডমিন হিসেবে যুক্ত হয়ে খাতা মূল্যায়ন করতে পারেন।\n' +
  'স্কলারশিপ ও পুরস্কার: ছাত্রছাত্রীদের জন্য সর্বোচ্চ ৭,৫০০ টাকা নগদ পুরস্কার!\n\n' +
  'পরিচালনায়: শাওন কর (M.Sc., B.Ed. - Ph: 7001257277) ও সুকন্যা চক্রবর্তী\n' +
  'ওয়েবসাইট: https://ais-pre-u34vh32wi7n4ihmdhg5bxg-366315673383.asia-southeast1.run.app\n' +
  'যোগাযোগ ও স্কুল প্রেজেন্টেশন: 7001257277';

doc.rect(432, 138, 368, 310).fillAndStroke('#0f172a', '#334155');
if (hasBengaliFont) {
  doc.fillColor('#93c5fd').fontSize(6.5).font('NotoBengali')
     .text(socialMsgCard, 442, 146, { width: 348, lineGap: 1.2, height: 295, ellipsis: false });
} else {
  doc.fillColor('#93c5fd').fontSize(7.5).font('Helvetica')
     .text('WBBSE Class 10 Geography Portal - Madhyamik 2026-2027\n\nContact Shawon Kar (7001257277) for admissions & school presentations.', 442, 146, { width: 348 });
}

// Bottom Contact Box on Slide 8
doc.rect(432, 458, 368, 75).fillAndStroke(cEmerald, '#10b981');
doc.fillColor('#ffffff').fontSize(9).font('Helvetica-Bold')
   .text('DIRECT ADMISSION & SCHOOL DEMONSTRATION HELPLINE', 442, 468, { width: 348, align: 'center', lineBreak: false });
doc.fillColor('#d1fae5').fontSize(8.5).font('Helvetica')
   .text('Call / WhatsApp: +91 7001257277  |  Email: shawonkar2612@gmail.com', 442, 486, { width: 348, align: 'center', lineBreak: false })
   .text('Chief Academic Mentor: Shawon Kar (University of Calcutta)', 442, 502, { width: 348, align: 'center', lineBreak: false });

doc.end();

writeStream.on('finish', () => {
  // Also copy to altOutputPath so both names are accessible
  try {
    fs.copyFileSync(outputPath, altOutputPath);
  } catch(e) {}
  const stats = fs.statSync(outputPath);
  console.log(`Master 8-Slide Prospectus PDF generated successfully at: ${outputPath} (${(stats.size / 1024).toFixed(1)} KB)`);
});
