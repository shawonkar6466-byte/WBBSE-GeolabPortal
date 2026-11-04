const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outputPath = path.resolve(__dirname, 'public', 'WBBSE_Geography_App_Prospectus_Teachers_Report.pdf');
const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 40, bottom: 40, left: 45, right: 45 },
  bufferPages: true
});

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

const bengaliFontRegular = '/usr/share/fonts/truetype/noto/NotoSansBengali-Regular.ttf';
const bengaliFontBold = '/usr/share/fonts/truetype/noto/NotoSansBengali-Bold.ttf';

const hasBengaliFont = fs.existsSync(bengaliFontRegular);

// Palette
const primaryNavy = '#0f172a';
const royalBlue = '#1e3a8a';
const accentBlue = '#2563eb';
const textDark = '#1e293b';
const textMuted = '#475569';
const borderGray = '#cbd5e1';
const cardBg = '#f8fafc';
const goldAccent = '#d97706';
const emeraldGreen = '#059669';

function drawHeaderBanner(title, subtitle) {
  doc.rect(45, 40, 505, 75).fillAndStroke(royalBlue, royalBlue);
  
  doc.fillColor('#ffffff').fontSize(16);
  if (hasBengaliFont) {
    doc.font(bengaliFontBold).text(title, 55, 52, { width: 485, align: 'center' });
  } else {
    doc.font('Helvetica-Bold').text(title, 55, 52, { width: 485, align: 'center' });
  }

  doc.fillColor('#e0e7ff').fontSize(9.5);
  doc.font('Helvetica').text(subtitle, 55, 82, { width: 485, align: 'center' });
  doc.y = 125;
}

function drawSectionHeading(num, titleEn, titleBn) {
  doc.moveDown(0.6);
  const currentY = doc.y;
  doc.rect(45, currentY, 505, 24).fill('#eff6ff');
  doc.rect(45, currentY, 4, 24).fill(accentBlue);
  
  doc.fillColor(royalBlue).fontSize(11).font('Helvetica-Bold');
  const headingText = `${num}. ${titleEn} ${titleBn ? `| ${titleBn}` : ''}`;
  doc.text(headingText, 55, currentY + 6, { width: 485 });
  doc.y = currentY + 30;
}

function drawFeatureBox(title, text, bulletPoints = []) {
  const boxTop = doc.y;
  doc.rect(45, boxTop, 505, 1).fill('#e2e8f0');
  doc.y = boxTop + 6;

  doc.fillColor(primaryNavy).fontSize(10).font('Helvetica-Bold');
  doc.text(`• ${title}`, 50, doc.y);
  
  doc.fillColor(textDark).fontSize(8.5).font('Helvetica');
  doc.text(text, 65, doc.y + 2, { width: 470, lineGap: 2 });
  
  if (bulletPoints.length > 0) {
    bulletPoints.forEach(bp => {
      doc.fillColor(textMuted).fontSize(8).font('Helvetica');
      doc.text(`   - ${bp}`, 75, doc.y + 2, { width: 460 });
    });
  }
  doc.moveDown(0.4);
}

// ============================================================================
// PAGE 1: EXECUTIVE OVERVIEW & CORE CREDENTIALS
// ============================================================================
drawHeaderBanner(
  'WBBSE CLASS 10 GEOGRAPHY PORTAL & DIGITAL LAB',
  'OFFICIAL INSTITUTIONAL PROSPECTUS & TEACHER DEMONSTRATION REPORT'
);

doc.fillColor(goldAccent).fontSize(9).font('Helvetica-Bold')
   .text('ACADEMIC DIRECTORS & FOUNDERS:', 45, doc.y);
doc.fillColor(textDark).fontSize(8.5).font('Helvetica')
   .text('1. SHAWON KAR  |  M.Sc. in Geography (University of Calcutta), B.Ed. (BSAEU)  |  Head Admin & Chief Mentor', 45, doc.y + 3)
   .text('2. SUKANNYA CHAKRABORTY  |  M.Sc. in Geography (University of Calcutta), B.Ed.  |  Senior Academic Coordinator', 45, doc.y + 2)
   .text('Contact Helpline: +91 7001257277  |  Email: shawonkar2612@gmail.com  |  Session: Madhyamik 2026 - 2027', 45, doc.y + 2);

doc.moveDown(0.5);

drawSectionHeading('1', 'EXECUTIVE OVERVIEW FOR SCHOOLS & EDUCATORS', 'উদ্দেশ্য ও সারসংক্ষেপ');
doc.fillColor(textDark).fontSize(8.5).font('Helvetica').text(
  'The WBBSE Geography Portal is a dedicated digital learning hub tailored strictly to the West Bengal Board Class 10 (Madhyamik) Geography and Environment curriculum. It provides high-yield chapter-wise practice, verified model answers, standard 90-marks mock exams, and teacher review infrastructure. Designed to assist schools, coaching academies, and subject teachers, the platform enables comprehensive monitoring of students with zero operational friction.',
  45, doc.y, { width: 505, lineGap: 2 }
);

drawSectionHeading('2', 'KEY ACADEMIC CAPABILITIES FOR CANDIDATES', 'শিক্ষার্থীদের সুবিধাসমূহ');

drawFeatureBox(
  'Chapter-Wise Practice Engine (MCQ, SAQ, 2M, 3M, 5M)',
  'Structured questions across all 6 official WBBSE chapters (বহির্জাত প্রক্রিয়া ও ভূমিরূপ, বায়ুমণ্ডল, বারিমণ্ডল, বর্জ্য ব্যবস্থাপনা, ভারত - প্রাকৃতিক ও অর্থনৈতিক পরিবেশ, উপগ্রহ চিত্র ও ভূ-বৈচিত্র্যসূচক মানচিত্র).',
  [
    'Instant feedback on MCQs with correct options, explanation notes, and mark calculation.',
    'Verified model answer keys for 2-mark, 3-mark conceptual, and 5-mark broad analytical questions.',
    'Diagrammatic illustrations and high-scoring point-by-point presentation techniques.'
  ]
);

drawFeatureBox(
  'Dual Tier PDF Repository (Free Preview & Full Access Master PDFs)',
  'Every chapter contains 3 dedicated PDFs for general students and 3 comprehensive master PDFs for full-access students.',
  [
    'Normal access students receive standard question sheets to build foundational confidence.',
    'Enrolled full-access students unlock complete model answers, marking rubrics, and examiner tips.',
    'Ensures high conversion when introduced to school batches.'
  ]
);

drawFeatureBox(
  'Full-Length 90-Marks Madhyamik Simulation Exams',
  'Mock tests created strictly conforming to the official WBBSE Madhyamik Board blueprint (Group A to F).',
  [
    'Automated objective scoring combined with subjective script upload capabilities.',
    'Real-time timer and exam countdown replicating actual Board examination pressure.'
  ]
);

drawFeatureBox(
  'Interactive Student Doubt & Query Resolution Hub',
  'Students can highlight any confusing question and submit doubts directly to the teacher panel.',
  [
    'Eliminates student hesitation through private, structured query submissions.',
    'Teachers reply with focused voice/text conceptual explanations.'
  ]
);

// Footer Page 1
doc.fillColor(borderGray).rect(45, 785, 505, 1).fill();
doc.fillColor(textMuted).fontSize(7.5).font('Helvetica')
   .text('WBBSE Geography Digital Lab  •  Confidential Institutional Prospectus  •  Page 1 of 2', 45, 792, { align: 'center', width: 505 });

// ============================================================================
// PAGE 2: TEACHER GOVERNANCE, PWA, REFERRALS & SOCIAL POST
// ============================================================================
doc.addPage();

drawHeaderBanner(
  'FACULTY COLLABORATION & CANDIDATE MOBILIZATION',
  'TEACHER CO-ADMIN NETWORK, MOBILE PWA & SOCIAL MEDIA REPORT'
);

drawSectionHeading('3', 'TEACHER & CO-ADMIN HIERARCHY WORKFLOW', 'শিক্ষক ও সহকারী অ্যাডমিন প্যানেল');

drawFeatureBox(
  'Institutional Role for School Teachers & Tutors',
  'Educators register through the teacher portal with institutional affiliations and school name.',
  [
    'Direct access to evaluate assigned student doubts and examine submitted mock exam papers.',
    'Track performance trends for their own school students across districts.'
  ]
);

drawFeatureBox(
  'Two-Tier Co-Admin Governance & Safe Review Queue',
  'Senior educators are promoted to Co-Admin by Head Admin Shawon Kar.',
  [
    'Co-Admins assist in approving student registrations and managing academic submissions.',
    'Every critical action (approval, suspension) is queued for final Head Admin review, guaranteeing data integrity.'
  ]
);

drawSectionHeading('4', 'MOBILE-FIRST PROGRESSIVE WEB APP (PWA)', 'মোবাইল অপ্টিমাইজড প্রযুক্তি');

drawFeatureBox(
  'Zero-Install Friction (Native Smartphone Experience)',
  'Built with PWA standards, allowing students in rural and urban areas to use the portal like a mobile app.',
  [
    '1-Tap Add to Home Screen prompt for Android Chrome and iOS Safari.',
    'Offline caching allows revision even in areas with intermittent connectivity.',
    'Safe-area thumb navigation designed for 100% single-hand smartphone use.'
  ]
);

drawSectionHeading('5', 'CANDIDATE GATHERING, SCHOLARSHIPS & REFERRAL AWARDS', 'রেফারেল ও পুরস্কার');

drawFeatureBox(
  'Grand Scholarship & Institutional Incentives',
  'Transparent reward system for student representatives, coaching mentors, and youth ambassadors.',
  [
    '₹7,500 Grand Cash Prize for leading ambassadors mobilising student batches.',
    'Instant ₹100 direct cash incentives per student referral.',
    'Subsidized bundle access codes for economically underprivileged school students.'
  ]
);

drawSectionHeading('6', 'READY-TO-POST SOCIAL MEDIA BROADCAST COPY', 'সোশ্যাল মিডিয়া প্রচার মেসেজ');

const socialBoxY = doc.y;
doc.rect(45, socialBoxY, 505, 95).fillAndStroke('#f1f5f9', '#94a3b8');

doc.fillColor(primaryNavy).fontSize(8).font('Helvetica-Bold')
   .text('📱 COPY & SHARE ON WHATSAPP / FACEBOOK TEACHER GROUPS:', 55, socialBoxY + 8);

const broadcastMsg = 
  '🌍 পশ্চিমবঙ্গ মধ্যশিক্ষা পর্ষদ (WBBSE) দশম শ্রেণি ভূগোল পরীক্ষা প্রস্তুতি পোর্টাল!\n' +
  '📌 শিক্ষক ও শিক্ষার্থীদের জন্য বিশেষ সুবিধা: অধ্যায়ভিত্তিক MCQ, SAQ ও ২/৩/৫ নম্বরের মডেল উত্তরপত্র PDF।\n' +
  '📝 মাধ্যমিক পরীক্ষার আদলে ৯০ নম্বরের পূর্ণাঙ্গ মক টেস্ট ও শিক্ষকদের খাতা পরীক্ষণ প্যানেল।\n' +
  '📲 মোবাইলে সরাসরি অ্যাপের মতো ব্যবহারযোগ্য (PWA)। শিক্ষক ও কো-অ্যাডমিন হিসেবে যুক্ত হতে পারেন এখনই।\n' +
  '📞 প্রধান পরিচালক: শাওন কর (M.Sc., B.Ed., University of Calcutta) — Ph: 7001257277\n' +
  '🌐 পোর্টাল লিঙ্ক: https://ais-pre-u34vh32wi7n4ihmdhg5bxg-366315673383.asia-southeast1.run.app';

doc.fillColor(textDark).fontSize(7.5).font('Helvetica')
   .text(broadcastMsg, 55, socialBoxY + 22, { width: 485, lineGap: 1.5 });

doc.y = socialBoxY + 105;

// Contact Banner
doc.rect(45, doc.y, 505, 30).fill(emeraldGreen);
doc.fillColor('#ffffff').fontSize(9).font('Helvetica-Bold')
   .text('For School Presentations, Batch Enrollments & Teacher Credentials: Call / WhatsApp 7001257277', 45, doc.y + 10, { width: 505, align: 'center' });

// Footer Page 2
doc.fillColor(borderGray).rect(45, 785, 505, 1).fill();
doc.fillColor(textMuted).fontSize(7.5).font('Helvetica')
   .text('WBBSE Geography Digital Lab  •  Confidential Institutional Prospectus  •  Page 2 of 2', 45, 792, { align: 'center', width: 505 });

doc.end();

writeStream.on('finish', () => {
  const stats = fs.statSync(outputPath);
  console.log(`Prospectus PDF generated successfully at: ${outputPath} (${(stats.size / 1024).toFixed(1)} KB)`);
});
