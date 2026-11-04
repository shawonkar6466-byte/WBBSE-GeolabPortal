const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');
const PDFDocument = require('pdfkit');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const firebaseConfig = require('../firebase-applet-config.json');

const BENGALI_FONT = fs.existsSync('/usr/share/fonts/truetype/noto/NotoSerifBengali-Regular.ttf')
  ? '/usr/share/fonts/truetype/noto/NotoSerifBengali-Regular.ttf'
  : 'Helvetica';
const BENGALI_BOLD_FONT = fs.existsSync('/usr/share/fonts/truetype/noto/NotoSerifBengali-Bold.ttf')
  ? '/usr/share/fonts/truetype/noto/NotoSerifBengali-Bold.ttf'
  : 'Helvetica-Bold';

const dbPath = path.resolve(__dirname, '..', 'geography_exam.db');
const db = new DatabaseSync(dbPath);

const app = initializeApp(firebaseConfig);
const firestoreDb = getFirestore(app, firebaseConfig.firestoreDatabaseId);

function createPdfBuffer(options) {
  return new Promise((resolve, reject) => {
    try {
      const docPdf = new PDFDocument({ margin: 45, size: 'A4' });
      const buffers = [];
      docPdf.on('data', buffers.push.bind(buffers));
      docPdf.on('end', () => {
        resolve(Buffer.concat(buffers));
      });

      const isEn = options.language === 'English';
      const mainFont = isEn ? 'Helvetica' : BENGALI_FONT;
      const boldFont = isEn ? 'Helvetica-Bold' : BENGALI_BOLD_FONT;

      // Header Banner
      docPdf.rect(40, 40, 515, 60).fill('#1e3a8a');
      docPdf.fillColor('#ffffff');
      docPdf.font(boldFont).fontSize(16).text(
        isEn ? 'WBBSE Madhyamik Geography Portal & Digital Lab' : 'WBBSE দশম শ্রেণি ভূগোল পোর্টাল ও ডিজিটাল ল্যাব',
        50, 52, { align: 'center', width: 495 }
      );
      docPdf.font(mainFont).fontSize(10).text(
        isEn ? 'Official Model Answer Sheet & Evaluation Guide | Head Admin: Shawon Kar' : 'অফিশিয়াল মডেল উত্তরপত্র ও মূল্যায়ন নির্দেশিকা | প্রধান অ্যাডমিন: শাওন কর (7001257277)',
        50, 75, { align: 'center', width: 495 }
      );

      // Meta Box
      docPdf.fillColor('#000000');
      docPdf.rect(40, 110, 515, 45).fillAndStroke('#f8fafc', '#cbd5e1');
      docPdf.fillColor('#0f172a').font(boldFont).fontSize(11).text(
        `${isEn ? 'Chapter' : 'অধ্যায়'}: ${options.chapterName}`, 55, 120
      );
      docPdf.font(mainFont).fontSize(10).text(
        `${isEn ? 'Marks Category' : 'বিভাগ'}: ${options.marksLabel} | ${isEn ? 'Tier' : 'অ্যাক্সেস'}: ${options.tierLabel} | ${isEn ? 'Medium' : 'মাধ্যম'}: ${options.language}`,
        55, 137
      );

      let yPos = 170;

      // Section Title
      docPdf.font(boldFont).fontSize(13).fillColor('#1e40af').text(options.title, 45, yPos);
      yPos += 25;

      // Sample Q&A Content
      options.content.forEach((item, idx) => {
        if (yPos > 720) {
          docPdf.addPage();
          yPos = 50;
        }

        docPdf.font(boldFont).fontSize(10).fillColor('#b91c1c').text(
          `[Q${idx + 1}] (${options.marksLabel})`, 45, yPos
        );
        docPdf.font(boldFont).fontSize(10).fillColor('#0f172a').text(
          item.q, 95, yPos, { width: 460 }
        );
        yPos += Math.max(22, Math.ceil(item.q.length / 55) * 15);

        docPdf.font(boldFont).fontSize(9).fillColor('#15803d').text(
          isEn ? 'Model Answer:' : 'আদর্শ উত্তর:', 55, yPos
        );
        docPdf.font(mainFont).fontSize(9.5).fillColor('#334155').text(
          item.ans, 130, yPos, { width: 425 }
        );
        yPos += Math.max(35, Math.ceil(item.ans.length / 50) * 15) + 10;

        if (item.points) {
          docPdf.font(mainFont).fontSize(8.5).fillColor('#64748b').text(
            `${isEn ? 'Evaluation Key Points' : 'মূল্যায়ন নির্দেশিকা'}: ${item.points}`, 55, yPos, { width: 500 }
          );
          yPos += 20;
        }

        docPdf.moveTo(45, yPos).lineTo(555, yPos).strokeColor('#e2e8f0').stroke();
        yPos += 12;
      });

      // Footer
      docPdf.fontSize(8).fillColor('#94a3b8').text(
        `WBBSE Geography Portal - Verified & Protected Copy | Generation Date: ${new Date().toLocaleDateString()}`,
        45, 780, { align: 'center', width: 515 }
      );

      docPdf.end();
    } catch (e) {
      reject(e);
    }
  });
}

const CHAPTER_CONFIGS = [
  {
    topic_id: 1,
    chapterName: '১ম অধ্যায়: বহির্জাত প্রক্রিয়া ও তাদের দ্বারা সৃষ্ট ভূমিরূপ (Exogenic Processes)',
    content2m_bn: [
      {
        q: 'পর্যায়ন (Gradation) কাকে বলে?',
        ans: 'যে গতিশীল প্রাকৃতিক প্রক্রিয়ার মাধ্যমে ক্ষয়সাধন (অবরোহন) ও সঞ্চয়সাধন (আরোহন)-এর মাধ্যমে ভূ-পৃষ্ঠের অসম বন্ধুর ভূমিরূপ সমতল বা সামঞ্জস্যপূর্ণ সাধারণ সমতলে পরিণত হয়, তাকে পর্যায়ন বলে। চেম্বারলিন ও স্যালিসবারি সর্বপ্রথম এই ধারণা প্রবর্তন করেন।',
        points: 'সংজ্ঞা (১) + অবরোহন ও আরোহনের সমন্বয় উল্লেখ (১)'
      },
      {
        q: 'নদীর ধারণ অববাহিকা (Catchment Basin) কী?',
        ans: 'উৎস অঞ্চলে বরফগলা জল, বৃষ্টির জল ও অসংখ্য ক্ষুদ্র জলধারা যে নির্দিষ্ট পার্বত্য অঞ্চলের মধ্যে দিয়ে প্রবাহিত হয়ে প্রধান নদীতে মিলিত হয়, তাকে নদীর ধারণ অববাহিকা বলে। ধারণ অববাহিকার আয়তন নদীর জলের পরিমাণ নির্ধারণ করে।',
        points: 'সংজ্ঞা (১) + বৈশিষ্ট্য/গুরুত্ব (১)'
      },
      {
        q: 'হিমরেখা (Snowline) কাকে বলে?',
        ans: 'পার্বত্য অঞ্চলে যে নির্দিষ্ট উচ্চতার উপরে সারা বছর বরফ জমে থাকে এবং যে উচ্চতার নিচে বরফ গলে জলে পরিণত হয়, সেই কাল্পনিক সীমারেখাকে হিমরেখা বলে। নিরক্ষীয় অঞ্চলে হিমরেখার উচ্চতা সর্বাধিক (প্রায় ৫৪০০ মিটার)।',
        points: 'সংজ্ঞা (১) + অবস্থান বা উদাহরণ (১)'
      },
      {
        q: 'লোয়েস (Loess) সমভূমি কীভাবে গঠিত হয়?',
        ans: 'মরুভূমি অঞ্চলের অতিক্ষুদ্র সূক্ষ্ম বালুকণা বা পলিকণা শক্তিশালী বায়ুর মাধ্যমে বহু দূরবর্তী অঞ্চলে উড়ে গিয়ে দীর্ঘদিন ধরে সঞ্চিত হয়ে যে উর্বর সমভূমি গঠন করে তাকে লোয়েস সমভূমি বলে। উদাহরণ: চিনের হুয়াংহো নদীর অববাহিকায় সুবিশাল লোয়েস সমভূমি।',
        points: 'সৃষ্টির প্রক্রিয়া (১) + উদাহরণ (১)'
      }
    ],
    content2m_en: [
      {
        q: 'What is Gradation?',
        ans: 'Gradation is the dynamic exogenic process of leveling the Earth\'s surface through degradation (erosion) and aggradation (deposition) to achieve a graded profile. The term was introduced by Chamberlin and Salisbury.',
        points: 'Definition (1) + degradation & aggradation link (1)'
      },
      {
        q: 'What is Catchment Basin?',
        ans: 'A catchment basin is the upper mountain area from which precipitation, meltwater, and tributary rills collect to feed a river. It directly governs the discharge volume of the river system.',
        points: 'Definition (1) + Significance (1)'
      },
      {
        q: 'Define Snowline.',
        ans: 'The snowline is the imaginary boundary altitude above which snow and ice persist throughout the year and below which snow melts during summer. It is highest in equatorial regions (~5,400 m).',
        points: 'Definition (1) + Altitude/Example (1)'
      },
      {
        q: 'How is a Loess Plain formed?',
        ans: 'A loess plain is formed by the long-distance transport and deposition of ultra-fine wind-blown desert dust and silt. Example: The extensive Yellow River (Huang He) basin in China.',
        points: 'Formation process (1) + Example (1)'
      }
    ],
    content3m_bn: [
      {
        q: 'অবরোহন ও আরোহন প্রক্রিয়ার মধ্যে তিনটি প্রধান পার্থক্য লেখো।',
        ans: '১. প্রক্রিয়া: অবরোহন ক্ষয় ও অপসারণের মাধ্যমে ভূমির উচ্চতা হ্রাস করে; আরোহন সঞ্চয়ের মাধ্যমে ভূমির উচ্চতা বৃদ্ধি করে। ২. শক্তি: অবরোহনে নদী, হিমবাহ ইত্যাদির গতিশক্তি কাজ করে; আরোহনে বহন ক্ষমতা কমে যাওয়ায় স্থিতি অবস্থা কাজ করে। ৩. ভূমিরূপ: অবরোহনে গিরিখাত, ইউ-আকৃতির উপত্যকা তৈরি হয়; আরোহনে প্লাবনভূমি, বদ্বীপ, ড্রামলিন সৃষ্টি হয়।',
        points: 'প্রক্রিয়া পার্থক‍্য (১) + শক্তির ভূমিকা (১) + সৃষ্ট ভূমিরূপ (১)'
      },
      {
        q: 'নদীর মোহনায় বদ্বীপ গঠনের অনুকূল ভৌগোলিক শর্তগুলি কী কী?',
        ans: '১. নদীতে বিপুল পরিমাণ পলি ও বালির জোগান থাকতে হবে। ২. মোহনায় সমুদ্রের গভীরতা কম এবং শান্ত অগভীর উপকূল হওয়া প্রয়োজন যাতে পলি তলিয়ে না যায়। ৩. সমুদ্র স্রোত ও শক্তিশালী জোয়ার-ভাটার প্রকোপ কম থাকতে হবে যাতে সঞ্চিত পলি সমুদ্রে ভেসে না যায়।',
        points: 'পলিসম্ভার (১) + শান্ত ও অগভীর মোহনা (১) + জোয়ার-ভাটার তীব্রতাহীনতা (১)'
      },
      {
        q: 'মরু অঞ্চলে বায়ুর কার্যের প্রাধান্য বেশি কেন?',
        ans: '১. শুষ্ক ও উষ্ণ আবহাওয়া: আর্দ্রতার অভাবে শিলা চূর্ণবিচূর্ণ থাকে। ২. উদ্ভিদের অভাব: গাছপালা না থাকায় উন্মুক্ত বালুকণা ও শিলার উপর বায়ু অবলীলায় আঘাত হানতে পারে। ৩. বাধাহীন উন্মুক্ত প্রান্তর: বায়ুপ্রবাহের পথে কোনো বনভূমি বা উচ্চ বাধা না থাকায় বায়ুর গতিবেগ অত্যন্ত তীব্র হয়।',
        points: 'শুষ্কতা (১) + উদ্ভিদের অভাব (১) + তীব্র গতিবেগ (১)'
      }
    ],
    content3m_en: [
      {
        q: 'State three major differences between Degradation and Aggradation.',
        ans: '1. Process: Degradation lowers elevation via erosion and weathering; Aggradation elevates surface levels via sediment deposition. 2. Dynamics: Degradation occurs when geomorphic energy is high; Aggradation occurs when transport capacity drops. 3. Resultant Landforms: Gorges and cirques arise from degradation; floodplains, deltas, and moraines from aggradation.',
        points: 'Process comparison (1) + Energy conditions (1) + Landforms (1)'
      },
      {
        q: 'What are the favorable conditions for delta formation at a river mouth?',
        ans: '1. Heavy sediment load transported from upper and middle courses. 2. Shallow and quiet sea/lake mouth avoiding dispersion. 3. Minimal tidal currents and wave action preventing rapid removal of deposited silt.',
        points: 'Sediment load (1) + Shallow sea (1) + Calm current (1)'
      },
      {
        q: 'Why is wind erosion predominant in arid and desert regions?',
        ans: '1. Extreme dryness causing rapid physical weathering into loose particles. 2. Sparse vegetation leaving topsoil completely unprotected. 3. Wide open obstruction-free terrain enabling winds to reach gale-force speeds.',
        points: 'Aridity (1) + Sparse vegetation (1) + Wind velocity (1)'
      }
    ],
    content5m_bn: [
      {
        q: 'নদীর ক্ষয়কার্যের ফলে সৃষ্ট প্রধান তিনটি ভূমিরূপ চিত্রসহ আলোচনা করো।',
        ans: '১. আই (I) ও ভি (V) আকৃতির উপত্যকা বা গিরিখাত ও ক্যানিয়ন: উচ্চ পার্বত্য গতিতে নদীর প্রবল নিম্নক্ষয়ের কারণে নদী উপত্যকা অত্যন্ত গভীর ও সংকীর্ণ হয়। শুষ্ক অঞ্চলে বৃষ্টিহীনতার জন্য গভীর ক্যানিয়ন (যেমন আমেরিকার কলোরাডো নদীর গ্র্যান্ড ক্যানিয়ন) তৈরি হয়। ২. জলপ্রপাত ও প্রপাতকূপ (Waterfall & Plunge Pool): কঠিন ও কোমল শিলাস্তরের উলম্ব বিন্যাসে কোমল শিলা দ্রুত ক্ষয় পেয়ে জলধারা খাড়া ঢালে সশব্দে নিচে আছড়ে পড়ে জলপ্রপাত তৈরি করে এবং তলদেশে প্রপাতকূপ সৃষ্টি হয় (যেমন কর্ণাটকের গেরসোপ্পা বা জোগ জলপ্রপাত)। ৩. মন্থকূপ (Pot Holes): নদীর তলদেশে ঘূর্ণমান জলপ্রবাহ ও প্রস্তরখণ্ডের অবঘর্ষের ফলে সৃষ্টি হওয়া গোলাকার গর্ত। [চিত্র নির্দেশনা: উপত্যকার প্রস্থচ্ছেদ ও জলপ্রপাতের স্তরবিন্যাস চিহ্নিতকরণ আবশ্যক]।',
        points: 'ভূমিকা ও পয়েন্টভিত্তিক বর্ণনা (৩) + যথাযথ ভৌগোলিক উদাহরণ (১) + চিহ্নিত চিত্র ও ডায়াগ্রাম (১)'
      },
      {
        q: 'হিমবাহের ক্ষয়কার্যের ফলে সৃষ্ট প্রধান তিনটি ভূমিরূপ সচিত্র বর্ণনা করো।',
        ans: '১. সার্ক বা করি (Cirque / Corrie): পর্বতের শীর্ষদেশে হিমবাহের উৎপাটন ও অবঘর্ষ ক্ষয়ের ফলে সৃষ্টি হওয়া খাড়া পাড়বিশিষ্ট চামচ বা হাতলওয়ালা চেয়ারের মতো বিশালাকার গর্ত। ২. পিরামিড চূড়া (Pyramidal Peak): কোনো পর্বতের চারপাশ থেকে একাধিক সার্কের পশ্চাদ্মুখী ক্ষয়ের ফলে মধ্যবর্তী চূড়াটি চোখা পিরামিডের আকার ধারণ করে (যেমন আল্পস পর্বতের ম্যাটারহর্ন)। ৩. ঝুলন্ত উপত্যকা (Hanging Valley): প্রধান হিমবাহের বৃহৎ উপত্যকার উপর অপেক্ষাকৃত কম ক্ষয়প্রাপ্ত ছোট উপনদী উপত্যকাগুলি খাড়া ঢালে ঝুলে থাকা মনে হয়। বরফ গলে গেলে এখান থেকে জলপ্রপাত সৃষ্টি হয়।',
        points: 'প্রতিটি ভূমিরূপের উৎপত্তি ও বৈশিষ্ট্য (৩) + উদাহরণ (১) + স্পষ্ট স্কেচ ডায়াগ্রাম (১)'
      }
    ],
    content5m_en: [
      {
        q: 'Explain with diagrams three major landforms produced by river erosion.',
        ans: '1. Gorges and Canyons (I and V shaped valleys): In the upper steep gradient, intense vertical erosion carves deep, narrow gorges with steep valley walls (e.g., Grand Canyon of Colorado River). 2. Waterfalls and Plunge Pools: Formed where a river cascades over hard cap-rock onto weaker soft rock, developing a deep amphitheater basin at the base (e.g., Jog Falls on Sharavati river). 3. Potholes: Circular depressions drilled into bedrock by the abrasive grinding of pebbles caught in swirling eddy currents.',
        points: 'Detailed formation (3) + World-class examples (1) + Labeled sketch diagram (1)'
      },
      {
        q: 'Describe three prominent erosional landforms created by glaciers.',
        ans: '1. Cirque / Corrie: Steep-walled amphitheater-like basin carved into mountain crests by glacial plucking and abrasion. 2. Pyramidal Peak / Horn: Sharp, pointed peak formed when three or more cirques erode backwards towards a central mountain summit (e.g., the Matterhorn in Swiss Alps). 3. Hanging Valley: Tributary glacier valleys that are shallower than the deeply carved main U-shaped trunk valley, terminating abruptly at cliff faces to form waterfalls upon glacial retreat.',
        points: 'Landform characteristics (3) + Real-world examples (1) + Diagrammatic representation (1)'
      }
    ]
  }
];

async function seed() {
  console.log('[AnswerSheetSeeder] Starting official model answer sheet generation...');

  const insertSheet = db.prepare(`
    INSERT OR REPLACE INTO chapter_answer_sheets 
    (id, topic_id, marks_type, access_tier, language, title, file_name, file_data, uploaded_by, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `);

  let sheetIdCounter = 1;

  for (const chap of CHAPTER_CONFIGS) {
    const topicId = chap.topic_id;

    const sections = [
      // 2 Marks
      { marks_type: '2m', access_tier: 'free', language: 'Bengali', content: chap.content2m_bn.slice(0, 2), title: '২ নম্বরের প্রশ্ন-উত্তর: সাধারণ স্যাম্পল কপি' },
      { marks_type: '2m', access_tier: 'paid', language: 'Bengali', content: chap.content2m_bn, title: '২ নম্বরের প্রশ্ন-উত্তর: সম্পূর্ণ মডেল উত্তরপত্র ও ডায়াগ্রাম গাইড' },
      { marks_type: '2m', access_tier: 'free', language: 'English', content: chap.content2m_en.slice(0, 2), title: '2 Marks Question-Answer: Free Sample Copy' },
      { marks_type: '2m', access_tier: 'paid', language: 'English', content: chap.content2m_en, title: '2 Marks Question-Answer: Full Premium Model Key' },

      // 3 Marks
      { marks_type: '3m', access_tier: 'free', language: 'Bengali', content: chap.content3m_bn.slice(0, 2), title: '৩ নম্বরের প্রশ্ন-উত্তর: সাধারণ স্যাম্পল কপি' },
      { marks_type: '3m', access_tier: 'paid', language: 'Bengali', content: chap.content3m_bn, title: '৩ নম্বরের প্রশ্ন-উত্তর: সম্পূর্ণ মডেল উত্তরপত্র ও পয়েন্ট বিভাজন' },
      { marks_type: '3m', access_tier: 'free', language: 'English', content: chap.content3m_en.slice(0, 2), title: '3 Marks Question-Answer: Free Sample Copy' },
      { marks_type: '3m', access_tier: 'paid', language: 'English', content: chap.content3m_en, title: '3 Marks Question-Answer: Full Premium Model Key' },

      // 5 Marks
      { marks_type: '5m', access_tier: 'free', language: 'Bengali', content: chap.content5m_bn.slice(0, 1), title: '৫ নম্বরের প্রশ্ন-উত্তর: সাধারণ স্যাম্পল কপি' },
      { marks_type: '5m', access_tier: 'paid', language: 'Bengali', content: chap.content5m_bn, title: '৫ নম্বরের প্রশ্ন-উত্তর: সম্পূর্ণ চিত্রসংবলিত মডেল উত্তরপত্র' },
      { marks_type: '5m', access_tier: 'free', language: 'English', content: chap.content5m_en.slice(0, 1), title: '5 Marks Question-Answer: Free Sample Copy' },
      { marks_type: '5m', access_tier: 'paid', language: 'English', content: chap.content5m_en, title: '5 Marks Question-Answer: Full Premium Model Key' },
    ];

    for (const sec of sections) {
      const marksLabel = sec.marks_type === '2m' ? '2 Marks' : (sec.marks_type === '3m' ? '3 Marks' : '5 Marks');
      const tierLabel = sec.access_tier === 'paid' ? 'Paid Full Access' : 'Free Normal Tier';
      const fileName = `WBBSE_Ch${topicId}_${sec.marks_type.toUpperCase()}_${sec.access_tier.toUpperCase()}_${sec.language}.pdf`;

      const pdfBuf = await createPdfBuffer({
        chapterName: chap.chapterName,
        marksLabel,
        tierLabel,
        language: sec.language,
        title: sec.title,
        content: sec.content
      });

      const base64Data = `data:application/pdf;base64,${pdfBuf.toString('base64')}`;

      // Insert into SQLite
      insertSheet.run(
        sheetIdCounter,
        topicId,
        sec.marks_type,
        sec.access_tier,
        sec.language,
        sec.title,
        fileName,
        base64Data,
        'Head Admin Shawon Kar'
      );

      // Push to Firestore
      try {
        const ref = doc(firestoreDb, 'chapter_answer_sheets', String(sheetIdCounter));
        await setDoc(ref, {
          id: sheetIdCounter,
          topic_id: topicId,
          marks_type: sec.marks_type,
          access_tier: sec.access_tier,
          language: sec.language,
          title: sec.title,
          file_name: fileName,
          file_data: base64Data,
          uploaded_by: 'Head Admin Shawon Kar',
          updated_at: new Date().toISOString()
        }, { merge: true });
        console.log(`Synced answer sheet ${sheetIdCounter} (${sec.marks_type} ${sec.access_tier} ${sec.language}) to Firestore.`);
      } catch (e) {
        console.error(`Error pushing sheet ${sheetIdCounter} to Firestore:`, e.message);
      }

      sheetIdCounter++;
    }
  }

  // Update snapshot JSON file
  const snapshotPath = path.resolve(__dirname, '..', 'public', 'database_snapshot_persistent.json');
  if (fs.existsSync(snapshotPath)) {
    const snap = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
    const allSheets = db.prepare('SELECT * FROM chapter_answer_sheets').all();
    snap.chapter_answer_sheets = allSheets;
    snap.total_answer_sheets = allSheets.length;
    snap.updated_at = new Date().toISOString();
    fs.writeFileSync(snapshotPath, JSON.stringify(snap, null, 2), 'utf8');
    console.log(`[AnswerSheetSeeder] Updated database_snapshot_persistent.json with ${allSheets.length} answer sheets!`);
  }

  console.log('[AnswerSheetSeeder] Finished successfully!');
  process.exit(0);
}

seed().catch(err => {
  console.error('[AnswerSheetSeeder] Fatal error:', err);
  process.exit(1);
});
