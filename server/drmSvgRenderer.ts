// Server-side High-Resolution SVG DRM Page Renderer for WBBSE Class 10 Geography
// Covers 6 chapters with 2, 3, and 5 marks questions, diagrams, comparison tables, and dynamic watermark.

interface PageContent {
  chapterNum: number;
  chapterTitle: string;
  marksType: '2M' | '3M' | '5M' | 'OVERVIEW';
  pageHeading: string;
  question: string;
  questionEn?: string;
  answerHtml: string;
  hasDiagram?: boolean;
  diagramSvg?: string;
  examTips: string;
}

export function escapeXml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function sanitizeXmlEntities(str: string): string {
  if (!str) return '';
  return str.replace(/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;)/g, '&amp;');
}

// Registry of rich question-and-answer pages for all 6 chapters
export function getChapterPageContent(materialId: string, pageNum: number): PageContent {
  // Determine chapter from materialId or fallback
  let chNum = 1;
  if (materialId.includes('ch1') || materialId === 'chap_1') chNum = 1;
  else if (materialId.includes('ch2') || materialId === 'chap_2') chNum = 2;
  else if (materialId.includes('ch3') || materialId === 'chap_3') chNum = 3;
  else if (materialId.includes('ch4') || materialId === 'chap_4') chNum = 4;
  else if (materialId.includes('ch5') || materialId === 'chap_5') chNum = 5;
  else if (materialId.includes('ch6') || materialId === 'chap_6') chNum = 6;
  else if (materialId.includes('bundle') || materialId === 'full_syllabus_bundle') {
    // Distribute pages 1-24 across chapters (approx 4 pages per chapter)
    chNum = Math.min(6, Math.max(1, Math.ceil(pageNum / 4)));
  }

  let effectivePage = ((pageNum - 1) % 4) + 1; // default 1 to 4
  if (materialId.includes('2m')) {
    effectivePage = pageNum === 1 ? 3 : (((pageNum - 1) % 4) + 1);
  } else if (materialId.includes('3m')) {
    effectivePage = pageNum === 1 ? 2 : (((pageNum - 1) % 4) + 1);
  } else if (materialId.includes('5m')) {
    effectivePage = pageNum === 1 ? 1 : (((pageNum - 1) % 4) + 1);
  }

  if (chNum === 1) {
    if (effectivePage === 1) {
      return {
        chapterNum: 1,
        chapterTitle: '১ম অধ্যায়: বহির্জাত প্রক্রিয়া ও তাদের দ্বারা সৃষ্ট ভূমিরূপ',
        marksType: '5M',
        pageHeading: '৫ নম্বরের রচনাধর্মী প্রশ্ন ও সচিত্র বিশ্লেষণ (Madhyamik Standard)',
        question: 'প্রশ্ন: নদীর উচ্চগতিতে ক্ষয়কার্যের ফলে সৃষ্ট প্রধান তিনটি ভূমিরূপ চিত্রসহ বর্ণনা করো।',
        questionEn: 'Q: Describe with diagrams three major landforms produced by river erosion in upper course.',
        hasDiagram: true,
        diagramSvg: `
          <g transform="translate(480, 220)">
            <rect x="0" y="0" width="280" height="180" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
            <!-- Waterfall & Plunge Pool Diagram -->
            <path d="M 20 40 L 100 40 L 100 130 Q 120 160 160 140 L 260 140" fill="none" stroke="#2563eb" stroke-width="4"/>
            <path d="M 20 45 L 98 45 L 98 120 L 20 120 Z" fill="#64748b" opacity="0.6"/>
            <!-- Hard Rock & Soft Rock -->
            <rect x="20" y="45" width="80" height="25" fill="#475569"/>
            <text x="30" y="62" font-family="Arial" font-size="10" fill="#ffffff" font-weight="bold">কঠিন শিলা (Hard)</text>
            <rect x="20" y="70" width="80" height="50" fill="#94a3b8"/>
            <text x="30" y="95" font-family="Arial" font-size="10" fill="#1e293b" font-weight="bold">কোমল শিলা (Soft)</text>
            <!-- Plunge Pool -->
            <ellipse cx="130" cy="145" rx="25" ry="12" fill="#93c5fd" opacity="0.7"/>
            <text x="110" y="148" font-family="Arial" font-size="9" fill="#1e3a8a" font-weight="bold">প্রপাতকূপ</text>
            <text x="140" y="85" font-family="Arial" font-size="11" fill="#dc2626" font-weight="bold">জলপ্রপাত (Waterfall)</text>
            <!-- Label -->
            <text x="60" y="172" font-family="Arial" font-size="10" fill="#334155" font-weight="bold">চিত্র: জলপ্রপাত ও প্রপাতকূপ সৃষ্টি</text>
          </g>
        `,
        answerHtml: `
          <p><b>ভূমিকা:</b> নদীর উচ্চগতি বা পার্বত্য প্রবাহে ভূমির ঢাল ও গতিবেগ তীব্র থাকায় নদীর প্রধান কাজ হয় নিম্নক্ষয় (Vertical Erosion)। এর ফলে সৃষ্ট ৩টি ভূমিরূপ হলো:</p>
          <p><b>১. 'I' ও 'V' আকৃতির উপত্যকা এবং গিরিখাত:</b> পার্বত্য অঞ্চলে নদী প্রবল বেগে নিম্নাভিমুখে ক্ষয় করে গভীর ও সংকীর্ণ 'I' আকৃতির গিরিখাত গঠন করে। পরবর্তীতে পার্শ্বক্ষয় ও আবহবিকারের প্রভাবে এটি 'V' আকৃতির উপত্যকায় রূপান্তরিত হয়।<br/><i>উদাহরণ:</i> পেরুর কলকা নদীর গিরিখাত (বিশ্বের গভীরতম) এবং তিব্বতের ইয়ারলুং সাংপো ক্যানিয়ন।</p>
          <p><b>২. জলপ্রপাত (Waterfall):</b> নদীর গতিপথে কঠিন ও কোমল শিলা উল্লম্বভাবে পাশাপাশি থাকলে কোমল শিলা দ্রুত ক্ষয়প্রাপ্ত হয় এবং নদী সশব্দে নিচে আছড়ে পড়ে জলপ্রপাত সৃষ্টি করে।<br/><i>উদাহরণ:</i> কর্ণাটকের শরাবতী নদীর যোগ জলপ্রপাত (গেরসোপ্পা), ভেনেজুয়েলার এঞ্জেল ফলস।</p>
          <p><b>৩. প্রপাতকূপ ও মন্থকূপ (Plunge Pool & Potholes):</b> জলপ্রপাতের পাদদেশে জল ও পাথরের আঘাতে সৃষ্ট বিশাল জলাশয়কে প্রপাতকূপ বলে। এছাড়া নদীর তলদেশে ঘূর্ণায়মান জলস্রোতের অবঘর্ষ ক্ষয়ে গোলাকার গর্ত তৈরি হলে তাকে মন্থকূপ (Potholes) বলে।</p>
        `,
        examTips: 'পরীক্ষার টিপস: এই প্রশ্নে পূর্ণ ৫/৫ পাওয়ার জন্য গিরিখাত ও জলপ্রপাতের চিত্র পেন্সিল দিয়ে পরিষ্কারভাবে লেবেলিং করতে হবে এবং বাস্তব ভৌগোলিক উদাহরণ অবশ্যই দিতে হবে।'
      };
    } else if (effectivePage === 2) {
      return {
        chapterNum: 1,
        chapterTitle: '১ম অধ্যায়: বহির্জাত প্রক্রিয়া ও তাদের দ্বারা সৃষ্ট ভূমিরূপ',
        marksType: '3M',
        pageHeading: '৩ নম্বরের তুলনামূলক পার্থক্য ও কারণ ব্যাখ্যা (Analytical 3-Marks)',
        question: 'প্রশ্ন: নদী উপত্যকা ও হিমবাহ উপত্যকার প্রধান তিনটি পার্থক্য লেখো।',
        questionEn: 'Q: Distinguish between River Valley and Glacial Valley (3 Points).',
        hasDiagram: false,
        answerHtml: `
          <p><b>পার্থক্যের তুলনামূলক সারণি (Comparison Table):</b></p>
          <table border="1" cellpadding="6" style="border-collapse:collapse; width:100%;">
            <tr style="background:#f1f5f9;">
              <th><b>পার্থক্যের ভিত্তি</b></th>
              <th><b>নদী উপত্যকা (River Valley)</b></th>
              <th><b>হিমবাহ উপত্যকা (Glacial Valley)</b></th>
            </tr>
            <tr>
              <td><b>১. আকার ও আকৃতি</b></td>
              <td>নদীর উচ্চগতিতে নিম্নক্ষয়ের কারণে উপত্যকার আকার ইংরেজি <b>'V'</b> অথবা <b>'I'</b> অক্ষরের মতো হয়।</td>
              <td>হিমবাহের নিম্নক্ষয় ও পার্শ্বক্ষয় উভয়ই তীব্র হওয়ায় উপত্যকার আকার চওড়া <b>'U'</b> অক্ষরের মতো হয়।</td>
            </tr>
            <tr>
              <td><b>২. ঢাল ও গভীরতা</b></td>
              <td>নদী উপত্যকার তলদেশ অসমান ও খাঁড়া সোপানযুক্ত হতে পারে, কিন্তু ঢাল ক্রমশ নিম্নাভিমুখী।</td>
              <td>হিমবাহ উপত্যকার তলদেশ চওড়া, মসৃণ এবং পার্শ্বদেশ প্রায় খাড়া দেওয়ালের মতো হয় (Trough)।</td>
            </tr>
            <tr>
              <td><b>৩. শাখা উপত্যকা</b></td>
              <td>শাখা নদীর উপত্যকাগুলি মূল নদীর সাথে একই সমতলে এসে মিলিত হয়।</td>
              <td>উপহিমবাহের উপত্যকা মূল হিমবাহ উপত্যকার ওপর ঝুলন্ত অবস্থায় থাকে, যাকে <b>ঝুলন্ত উপত্যকা</b> বলে।</td>
            </tr>
          </table>
          <p style="margin-top:10px;"><b>মূল্যায়ন সূত্র:</b> পার্থক্য লেখার সময় অবশ্যই 'পার্থক্যের ভিত্তি' কলামটি অন্তর্ভুক্ত করবে। এতে পরীক্ষকের কাছে উপস্থাপনা আকর্ষণীয় হয় এবং পূর্ণ ৩ নম্বর নিশ্চিত হয়।</p>
        `,
        examTips: 'পার্থক্য লেখার সময় আকৃতি, ক্ষয়ের ধরন এবং ঝুলন্ত উপত্যকার উপস্থিতি পয়েন্ট ৩টি উল্লেখ করা বাধ্যতামূলক।'
      };
    } else if (effectivePage === 3) {
      return {
        chapterNum: 1,
        chapterTitle: '১ম অধ্যায়: বহির্জাত প্রক্রিয়া ও তাদের দ্বারা সৃষ্ট ভূমিরূপ',
        marksType: '2M',
        pageHeading: '২ নম্বরের সংজ্ঞা ও টু-দ্য-পয়েন্ট ধারণামূলক প্রশ্ন (Definition & Core Concept)',
        question: 'প্রশ্ন: (ক) পর্যায়ন (Gradation) কাকে বলে? (খ) বার্খান বলতে কী বোঝো?',
        questionEn: 'Q: (a) Define Gradation. (b) What is a Barchan Dune?',
        hasDiagram: false,
        answerHtml: `
          <p><b>(ক) পর্যায়ন (Gradation):</b><br/>
          <b>সংজ্ঞা:</b> ভূমিরূপ বিজ্ঞানী চেম্বারলিন ও স্যালিসবারির মতে, বহির্জাত শক্তিসমূহ (নদী, বায়ু, হিমবাহ ইত্যাদি) অবরোহণ (ক্ষয়) ও আরোহণ (সঞ্চয়) প্রক্রিয়ার মাধ্যমে ভূপৃষ্ঠের বন্ধুরতাকে দূর করে একটি সাধারণ ভারসাম্য তলে নিয়ে আসার প্রক্রিয়াকে <b>পর্যায়ন</b> বলে।<br/>
          <b>সূত্র:</b> <i>পর্যায়ন = অবরোহণ (ক্ষয়) + আরোহণ (সঞ্চয়)</i></p>
          <hr style="border:0;border-top:1px dashed #cbd5e1;margin:12px 0;"/>
          <p><b>(খ) বার্খান (Barchan):</b><br/>
          <b>সংজ্ঞা:</b> মরুভূমিতে বায়ুর সঞ্চয়কার্যের ফলে গঠিত অর্ধচন্দ্রাকার চলনশীল বালিয়াড়িকে <b>বার্খান</b> বলে।<br/>
          <b>বৈশিষ্ট্য:</b><br/>
          ১. এর বায়ুমুখী ঢাল মৃদু ও উত্তল কিন্তু বিপরীতমুখী ঢাল খাড়া ও অবতল হয়।<br/>
          ২. বায়ুর প্রবাহের দিকে দুটি ধারালো শিং (Crescents) অবস্থান করে।<br/>
          <i>উদাহরণ:</i> সাহারা ও থর মরুভূমিতে প্রচুর বার্খান দেখা যায়।</p>
        `,
        examTips: '২ নম্বরের প্রশ্নে অনর্থক বড় না করে সংজ্ঞা, মূল বৈশিষ্ট্য এবং একটি উদাহরণ অবশ্যই দেবে।'
      };
    } else {
      return {
        chapterNum: 1,
        chapterTitle: '১ম অধ্যায়: বহির্জাত প্রক্রিয়া ও তাদের দ্বারা সৃষ্ট ভূমিরূপ',
        marksType: '5M',
        pageHeading: '৫ নম্বরের হিমবাহ ও বায়ুর সঞ্চয়কার্যের বিশ্লেষণ',
        question: 'প্রশ্ন: হিমবাহ ও জলধারার যৌথ কার্যের ফলে সৃষ্ট ভূমিরূপগুলি চিত্রসহ আলোচনা করো।',
        questionEn: 'Q: Describe fluvio-glacial landforms with suitable diagrams.',
        hasDiagram: true,
        diagramSvg: `
          <g transform="translate(480, 220)">
            <rect x="0" y="0" width="280" height="180" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
            <!-- Esker & Kame Diagram -->
            <path d="M 30 140 Q 80 80 140 130 T 250 100" fill="none" stroke="#059669" stroke-width="12" stroke-linecap="round"/>
            <text x="130" y="75" font-family="Arial" font-size="11" fill="#065f46" font-weight="bold">এস্কার (Esker)</text>
            <!-- Drumlin basket of eggs -->
            <ellipse cx="60" cy="110" rx="25" ry="12" fill="#d97706" opacity="0.8"/>
            <ellipse cx="90" cy="100" rx="20" ry="10" fill="#d97706" opacity="0.8"/>
            <text x="50" y="145" font-family="Arial" font-size="10" fill="#92400e" font-weight="bold">ড্রামলিন (Drumlin)</text>
            <text x="55" y="170" font-family="Arial" font-size="10" fill="#334155" font-weight="bold">চিত্র: ফ্লুভিও-গ্লেসিয়াল ভূমিরূপ</text>
          </g>
        `,
        answerHtml: `
          <p><b>১. বহিঃধৌত সমভূমি (Outwash Plain):</b> হিমবাহ গলে সৃষ্ট জলধারা নুড়ি, বালি, পলি প্রভৃতি দূরবর্তী অঞ্চলে সঞ্চয় করে যে বিস্তৃত মৃদু ঢালু সমভূমি গড়ে তোলে, তাকে আউটওয়াশ প্লেইন বলে।</p>
          <p><b>২. এস্কার (Esker):</b> হিমবাহের তলদেশ দিয়ে প্রবাহিত জলস্রোতের সাথে বাহিত বালি ও নুড়ি জমা হয়ে দীর্ঘ, আঁকাবাঁকা ও সংকীর্ণ শৈলশিরার ন্যায় ভূমিরূপ তৈরি করে, যাকে এস্কার বলে। এটি দেখতে রেললাইনের বাঁধের মতো।</p>
          <p><b>৩. কেম ও কেম সোপান (Kame & Kame Terrace):</b> হিমবাহের গলনজলে বাহিত নুড়ি-বালি হিমবাহ উপত্যকার প্রান্তে ত্রিকোণাকার বদ্বীপের মতো স্তূপাকারে জমা হয়ে কেম সৃষ্টি করে।</p>
          <p><b>৪. কেট্‌ল ও কেট্‌ল হ্রদ (Kettle & Kettle Lake):</b> আউটওয়াশ সমভূমিতে বরফের বিশাল খণ্ড চাপা পড়ে পরবর্তীতে গলে যে গর্তের সৃষ্টি হয় তাকে কেট্‌ল বলে। এতে জল জমে তৈরি হয় কেট্‌ল হ্রদ।</p>
        `,
        examTips: 'ড্রামলিনকে উল্টানো নৌকার মতো বা ডিমভর্তি ঝুড়ির মতো দেখায় (Basket of eggs topography) - এই কি-ওয়ার্ডটি খাতায় লিখলে নিশ্চিত পূর্ণ নম্বর।'
      };
    }
  }

  if (chNum === 2) {
    return {
      chapterNum: 2,
      chapterTitle: '২য় অধ্যায়: বায়ুমণ্ডল (Atmosphere)',
      marksType: '5M',
      pageHeading: 'বায়ুমণ্ডলের স্তরবিন্যাস ও উষ্ণতার তারতম্যের কারণ (5 Marks Master Guide)',
      question: 'প্রশ্ন: বায়ুমণ্ডলের উষ্ণতার তারতম্যের প্রধান তিনটি নিয়ন্ত্রক বা কারণ সবিস্তারে আলোচনা করো।',
      questionEn: 'Q: Discuss the three major factors controlling the variation of atmospheric temperature.',
      hasDiagram: true,
      diagramSvg: `
        <g transform="translate(480, 220)">
          <rect x="0" y="0" width="280" height="180" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
          <!-- Earth & Sun Angle Diagram -->
          <circle cx="140" cy="90" r="60" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
          <line x1="20" y1="90" x2="260" y2="90" stroke="#ef4444" stroke-width="2" stroke-dasharray="4"/>
          <text x="145" y="85" font-family="Arial" font-size="10" fill="#dc2626" font-weight="bold">নিরক্ষরেখা (লম্বরশ্মি)</text>
          <text x="145" y="45" font-family="Arial" font-size="9" fill="#0369a1">মেরু অঞ্চল (তির্যক রশ্মি)</text>
          <text x="50" y="165" font-family="Arial" font-size="10" fill="#334155" font-weight="bold">চিত্র: অক্ষাংশভেদে সূর্যরশ্মির পতন কোণ</text>
        </g>
      `,
      answerHtml: `
        <p><b>ভূমিকা:</b> ভূপৃষ্ঠের সর্বত্র সূর্যরশ্মির তাপীয় ফল সমান হয় না। বায়ুমণ্ডলের উষ্ণতার পার্থক্যের প্রধান ৩টি নিয়ন্ত্রক হলো:</p>
        <p><b>১. অক্ষাংশ বা সূর্যরশ্মির পতন কোণ (Angle of Sun Rays):</b> নিরক্ষরেখায় সারাবছর সূর্যরশ্মি লম্বভাবে (৯০°) পড়ায় কম বায়ুস্তর ভেদ করে অল্প স্থানে তীব্র উত্তাপ ছড়ায়। ফলে নিরক্ষীয় অঞ্চল অত্যন্ত উষ্ণ হয়। কিন্তু মেরু অঞ্চলের দিকে সূর্যরশ্মি তির্যকভাবে পড়ায় উষ্ণতা ক্রমশ হ্রাস পায়।</p>
        <p><b>২. উচ্চতা (Altitude & Normal Lapse Rate):</b> ভূপৃষ্ঠ থেকে প্রতি ১০০০ মিটার (১ কিমি) উচ্চতা বৃদ্ধিতে তাপমাত্রা গড়ে ৬.৪° সেলসিয়াস হারে হ্রাস পায়। একে <b>স্বাভাবিক উষ্ণতা হ্রাসের হার (Normal Lapse Rate)</b> বলে। এই কারণে একই অক্ষাংশে অবস্থিত হওয়া সত্ত্বেও আগ্রার চেয়ে শৈলশহর দার্জিলিং অনেক শীতল।</p>
        <p><b>৩. সমুদ্র থেকে দূরত্ব ও জল-স্থলভাগের বণ্টন:</b> জলভাগ দ্রুত উত্তপ্ত বা দ্রুত শীতল হয় না, কিন্তু স্থলভাগ দ্রুত গরম ও দ্রুত ঠাণ্ডা হয়। ফলে সমুদ্রের নিকটবর্তী অঞ্চলে সমভাবাপন্ন (Moderate) জলবায়ু এবং সমুদ্র থেকে দূরবর্তী অভ্যন্তরীণ অংশে চরমভাবাপন্ন (Extreme) জলবায়ু বিরাজ করে।</p>
      `,
      examTips: 'Normal Lapse Rate (6.4°C / 1000m) মানটি অঙ্কে ও কথায় উভয়ভাবেই উল্লেখ করবে।'
    };
  }

  if (chNum === 3) {
    return {
      chapterNum: 3,
      chapterTitle: '৩য় অধ্যায়: বারিমণ্ডল (Hydrosphere)',
      marksType: '5M',
      pageHeading: 'জোয়ার-ভাটার কারণ ও প্রক্রিয়া (5 Marks Core Question)',
      question: 'প্রশ্ন: চিত্রসহ পৃথিবীতে জোয়ার-ভাটা সৃষ্টির প্রধান কারণগুলি ব্যাখ্যা করো।',
      questionEn: 'Q: Explain with diagram the primary causes of Tides on Earth.',
      hasDiagram: true,
      diagramSvg: `
        <g transform="translate(480, 220)">
          <rect x="0" y="0" width="280" height="180" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
          <!-- Earth & Moon Tide Diagram -->
          <ellipse cx="110" cy="90" rx="50" ry="38" fill="#93c5fd" stroke="#1d4ed8" stroke-width="1.5"/>
          <circle cx="110" cy="90" r="32" fill="#22c55e"/>
          <circle cx="230" cy="90" r="16" fill="#cbd5e1" stroke="#64748b" stroke-width="1.5"/>
          <text x="95" y="94" font-family="Arial" font-size="10" fill="#ffffff" font-weight="bold">পৃথিবী</text>
          <text x="218" y="94" font-family="Arial" font-size="9" fill="#1e293b" font-weight="bold">চাঁদ</text>
          <text x="145" y="70" font-family="Arial" font-size="9" fill="#1e40af" font-weight="bold">মুখ্য জোয়ার</text>
          <text x="35" y="70" font-family="Arial" font-size="9" fill="#1e40af" font-weight="bold">গৌণ জোয়ার</text>
          <text x="60" y="165" font-family="Arial" font-size="10" fill="#334155" font-weight="bold">চিত্র: চন্দ্রের আকর্ষণে মুখ্য ও গৌণ জোয়ার</text>
        </g>
      `,
      answerHtml: `
        <p><b>জোয়ার-ভাটা সৃষ্টির কারণসমূহ:</b></p>
        <p><b>১. চাঁদ ও সূর্যের মহাকর্ষ আকর্ষণ (Gravitational Pull):</b> নিউটনের সূত্র অনুযায়ী মহাকর্ষ বল দূরত্বের ওপর নির্ভরশীল। সূর্য চাঁদের চেয়ে প্রায় ২ কোটি ৬০ লক্ষ গুণ ভারী হলেও পৃথিবী থেকে চাঁদের দূরত্ব সূর্যের তুলনায় অনেক কম (মাত্র ৩ লক্ষ ৮৪ হাজার কিমি)। ফলে পৃথিবীতে জোয়ার সৃষ্টির ক্ষেত্রে চন্দ্রের আকর্ষণ ক্ষমতা সূর্যের চেয়ে দ্বিগুণেরও বেশি (২.১৭ গুণ)। চাঁদের সম্মুখীন স্থানে জলরাশি প্রবলভাবে ফুলে উঠে <b>মুখ্য জোয়ার</b> ঘটায়।</p>
        <p><b>২. পৃথিবীর আবর্তনজনিত কেন্দ্রাতিগ বল (Centrifugal Force):</b> পৃথিবী নিজের অক্ষের ওপর পশ্চিম থেকে পূর্ব দিকে অবিরাম আবর্তন করায় ভূ-পৃষ্ঠে একটি অপকেন্দ্রিক বা কেন্দ্রাতিগ শক্তির সৃষ্টি হয়। মুখ্য জোয়ারের ঠিক বিপরীত প্রান্তে (প্রতিপাদ স্থানে) চাঁদের আকর্ষণ অপেক্ষা কেন্দ্রাতিগ বল বেশি সক্রিয় হওয়ায় সেখানে জলরাশি স্ফীত হয়ে <b>গৌণ জোয়ার</b> সৃষ্টি করে।</p>
        <p><b>৩. সিজিগি ও কোটাল:</b> অমাবস্যা ও পূর্ণিমায় চাঁদ, পৃথিবী ও সূর্য একই সরলরেখায় এলে <b>ভরা কোটাল (Spring Tide)</b> হয়, এবং শুক্ল ও কৃষ্ণপক্ষের অষ্টমীতে সমকোণে অবস্থান করলে <b>মরা কোটাল (Neap Tide)</b> সৃষ্টি হয়।</p>
      `,
      examTips: 'চন্দ্রের আকর্ষণ ক্ষমতা সূর্যের চেয়ে ২.১৭ গুণ বেশি - এই বৈজ্ঞানিক অনুপাতটি লিখলে উত্তরের মান বহুগুণ বেড়ে যায়।'
    };
  }

  if (chNum === 4) {
    return {
      chapterNum: 4,
      chapterTitle: '৪র্থ অধ্যায়: বর্জ্য ব্যবস্থাপনা (Waste Management)',
      marksType: '3M',
      pageHeading: 'বর্জ্য ব্যবস্থাপনায় 4R পদ্ধতি ও পরিবেশ সংরক্ষণ (3 Marks Special)',
      question: 'প্রশ্ন: বর্জ্য ব্যবস্থাপনায় ' + "'4R'" + ' পদ্ধতির প্রয়োগ ও গুরুত্ব লেখো।',
      questionEn: 'Q: Explain the application and significance of 4R method in Waste Management.',
      hasDiagram: false,
      answerHtml: `
        <p><b>'4R' পদ্ধতির অর্থ ও বাস্তব প্রয়োগ:</b> আধুনিক বিজ্ঞানভিত্তিক বর্জ্য ব্যবস্থাপনায় 4R অত্যন্ত ফলপ্রসূ একটি কৌশল:</p>
        <p><b>১. Reduce (বর্জ্য হ্রাসকরণ):</b> অপ্রয়োজনীয় জিনিস কেনা বা ব্যবহার কমানো। যেমন: প্লাস্টিক ব্যাগের বদলে চটের বা কাপড়ের ব্যাগ ব্যবহার করে কঠিন বর্জ্যের পরিমাণ শুরুতেই নিয়ন্ত্রণ করা।</p>
        <p><b>২. Reuse (পুনর্ব্যবহার):</b> কোনো জিনিস একবার ব্যবহার করে ফেলে না দিয়ে তাকে একাধিকবার কাজে লাগানো। যেমন: কাঁচের শিশি বা প্লাস্টিকের পাত্রে মশলা রাখা, খাতার পেছনের ফাঁকা পাতা রাফ কাজের জন্য ব্যবহার করা।</p>
        <p><b>৩. Recycle (পুনর্নবীকরণ):</b> পরিত্যাক্ত বর্জ্যকে বিশেষ প্রক্রিয়াকরণের মাধ্যমে নতুন ব্যবহারযোগ্য সম্পদে রূপান্তর করা। যেমন: পুরোনো কাগজ গলিয়ে নতুন বোর্ড তৈরি, ভাঙা লোহা বা কাঁচ গলিয়ে নতুন পাত্র প্রস্তুত করা।</p>
        <p><b>৪. Refuse (প্রত্যাখ্যান):</b> পরিবেশের পক্ষে ক্ষতিকর এমন কোনো সামগ্রী যেমন থার্মোকল বা সিঙ্গেল-ইউজ প্লাস্টিক সম্পূর্ণ বর্জন বা ব্যবহারে অস্বীকার করা।</p>
      `,
      examTips: '4R এর প্রতিটি R এর সম্পূর্ণ নাম ও বাংলা অর্থসহ একটি করে বাস্তব জীবনের উদাহরণ অবশ্যই লিখবে।'
    };
  }

  if (chNum === 5) {
    return {
      chapterNum: 5,
      chapterTitle: '৫ম অধ্যায়: ভারত - প্রাকৃতিক ও অর্থনৈতিক পরিবেশ',
      marksType: '5M',
      pageHeading: 'ভারতের কৃষি ও ভূপ্রকৃতির মডেল উত্তর (5 Marks High Scoring)',
      question: 'প্রশ্ন: ভারতে গম অথবা চা চাষের অনুকূল ভৌগোলিক পরিবেশ বর্ণনা করো।',
      questionEn: 'Q: Describe the favorable geographical conditions for Wheat or Tea cultivation in India.',
      hasDiagram: false,
      answerHtml: `
        <p><b>ভারতে গম চাষের অনুকূল ভৌগোলিক পরিবেশ (Favourable Conditions for Wheat):</b> গম ভারতের দ্বিতীয় প্রধান খাদ্যশস্য এবং প্রধান রবি শস্য।</p>
        <p><b>ক. প্রাকৃতিক পরিবেশ (Physical Conditions):</b><br/>
        ১. <b>উষ্ণতা:</b> গম বপনের সময় মৃদু শীতল আবহাওয়া (১০° - ১৫° সে.) এবং পাকার সময় উজ্জ্বল রৌদ্রকরোজ্জ্বল আবহাওয়া (২০° - ২৫° সে.) প্রয়োজন।<br/>
        ২. <b>বৃষ্টিপাত:</b> বার্ষিক ৫০ - ১০০ সেমি বৃষ্টিপাত প্রয়োজন। অতিরিক্ত বৃষ্টিপাত গমের ক্ষেত্রে ক্ষতিকর। শিশির ও হালকা কুয়াশা বাড়ন্ত গমের পক্ষে উপকারি।<br/>
        ৩. <b>মৃত্তিকা:</b> চুনযুক্ত উর্বর দোআঁশ মাটি বা হালকা এঁটেল মাটি গম চাষের জন্য সর্বাপেক্ষা উপযোগী।<br/>
        ৪. <b>ভূমির প্রকৃতি:</b> গাছের গোড়ায় জল জমলে শিকড় পচে যায়, তাই জলনিকাশি সুবিধাযুক্ত মৃদু ঢালু জমি আদর্শ।</p>
        <p><b>খ. অর্থনৈতিক পরিবেশ (Economic Conditions):</b><br/>
        ১. <b>শ্রমিক:</b> জমিতে সার দেওয়া, আগাছা দমন ও ফসল কাটার জন্য প্রচুর দক্ষ ও সস্তা শ্রমিকের প্রয়োজন।<br/>
        ২. <b>জলসেচ:</b> শীতকালীন রবি শস্য হওয়ায় ভারতে গম উৎপাদনে জলসেচ (খাল ও নলকূপ) অপরিহার্য।<br/>
        <i>প্রধান উৎপাদক রাজ্য:</i> উত্তরপ্রদেশ (প্রথম), পাঞ্জাব ও হরিয়ানা (হেক্টর প্রতি উৎপাদনে প্রথম)।</p>
      `,
      examTips: 'প্রাকৃতিক ও অর্থনৈতিক পরিবেশ দুটি আলাদা শিরোনামে বুলেট পয়েন্ট দিয়ে লিখলে শিক্ষক এক নজরে পূর্ণ নম্বর দেন।'
    };
  }

  // Chapter 6 fallback
  return {
    chapterNum: 6,
    chapterTitle: '৬ষ্ঠ অধ্যায়: উপগ্রহ চিত্র ও ভূ-বৈচিত্র্যসূচক মানচিত্র',
    marksType: '3M',
    pageHeading: 'উপগ্রহ চিত্র ও টোপো মানচিত্রের বিশ্লেষণ (3 Marks Distinction)',
    question: 'প্রশ্ন: উপগ্রহ চিত্র ও ভূ-বৈচিত্র্যসূচক মানচিত্রের (টোপো মানচিত্র) তিনটি প্রধান পার্থক্য লেখো।',
    questionEn: 'Q: Distinguish between Satellite Imagery and Topographical Map (3 Points).',
    hasDiagram: false,
    answerHtml: `
      <p><b>পার্থক্যের তুলনামূলক সারণি:</b></p>
      <table border="1" cellpadding="6" style="border-collapse:collapse; width:100%;">
        <tr style="background:#f1f5f9;">
          <th><b>পার্থক্যের ভিত্তি</b></th>
          <th><b>উপগ্রহ চিত্র (Satellite Imagery)</b></th>
          <th><b>ভূ-বৈচিত্র্যসূচক মানচিত্র (Toposheet)</b></th>
        </tr>
        <tr>
          <td><b>১. উপাত্ত সংগ্রহের পদ্ধতি</b></td>
          <td>কৃত্রিম উপগ্রহে স্থাপিত সেন্সরের সাহায্যে প্রতিফলিত ইলেক্ট্রোম্যাগনেটিক রেডিয়েশন (EMR) গ্রহণ করে ডিজিটাল পদ্ধতিতে তৈরি হয়।</td>
          <td>সরাসরি ভূ-পৃষ্ঠে জরিপকার্য (Surveying) চালিয়ে প্রচলিত প্রতীকচিহ্ন ও রঙ ব্যবহারের মাধ্যমে প্রস্তুত করা হয়।</td>
        </tr>
        <tr>
          <td><b>২. সময়ের পরিবর্তনশীলতা</b></td>
          <td>খুব অল্প সময়ের ব্যবধানে (রিয়েল টাইম) ভূ-পৃষ্ঠের তাৎক্ষণিক ছবি পাওয়া যায়। বন্যা, ঘূর্ণিঝড় বা অগ্নিকাণ্ডের মতো দুর্যোগ শনাক্ত করা সহজ।</td>
          <td>এটি একটি নির্দিষ্ট সময়ে প্রস্তুত স্থায়ী নথি। এটি বারবার দ্রুত আপডেট করা সম্ভব হয় না (সাধারণত বহু বছর পর সংশোধিত হয়)।</td>
        </tr>
        <tr>
          <td><b>৩. রঙের ব্যবহার</b></td>
          <td>সাধারণত ফলস কালার কম্পোজিট (FCC) বা ছদ্ম রঙ ব্যবহার করা হয় (যেমন: স্বাভাবিক উদ্ভিদ লাল রঙে দেখানো হয়)।</td>
          <td>প্রচলিত প্রতীকচিহ্ন ও নির্দিষ্ট আন্তর্জাতিক রঙ ব্যবহার করা হয় (যেমন: গাছপালা সবুজ, জল নীল রঙে দেখানো হয়)।</td>
        </tr>
      </table>
    `,
    examTips: 'FCC তে স্বাভাবিক উদ্ভিদ লাল রঙে প্রদর্শিত হয় - এই স্পেসিফিক পয়েন্টটি অবশ্যই পার্থক্যে লিখবে।'
  };
}

/**
 * Builds a pristine, sharp, publication-grade SVG page rendered to exact A4 aspect ratio (900x1270).
 */
export function generatePageSvg(
  materialId: string,
  pageNum: number,
  studentName: string,
  maskedPhone: string,
  username: string,
  clientIp: string
): string {
  const content = getChapterPageContent(materialId, pageNum);
  const now = new Date();
  const timestamp = now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'short', timeStyle: 'short' });

  const safeName = escapeXml(studentName || 'GeoLab Student');
  const safePhone = escapeXml(maskedPhone || 'XXXXX***XXX');
  const safeUsername = escapeXml(username || 'STUDENT');
  const safeIp = escapeXml(clientIp || '127.0.0.1');

  const width = 900;
  const height = 1270;

  // Render SVG with clean typography, diagram slot, header, and multi-layer dynamic security watermark
  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Repeating Diagonal Watermark Grid -->
        <pattern id="diagonalWatermark" width="460" height="280" patternUnits="userSpaceOnUse" patternTransform="rotate(-28)">
          <text x="20" y="80" font-family="'Hind Siliguri', Arial, sans-serif" font-size="19" font-weight="bold" fill="rgba(220, 38, 38, 0.13)" letter-spacing="0.5">
            GeoLabPortal • ${safeName}
          </text>
          <text x="35" y="115" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="rgba(30, 64, 175, 0.13)" letter-spacing="1">
            ${safePhone} • IP: ${safeIp}
          </text>
          <text x="20" y="210" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="rgba(220, 38, 38, 0.10)" letter-spacing="1">
            LICENSED COPY • ${timestamp} • DO NOT SHARE
          </text>
        </pattern>

        <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#0f172a" />
          <stop offset="50%" stop-color="#1e1b4b" />
          <stop offset="100%" stop-color="#172554" />
        </linearGradient>

        <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#d97706" />
          <stop offset="100%" stop-color="#b45309" />
        </linearGradient>
      </defs>

      <!-- Clean A4 White Page Background -->
      <rect width="${width}" height="${height}" fill="#ffffff" />
      <rect x="25" y="25" width="${width - 50}" height="${height - 50}" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" rx="6"/>

      <!-- TOP OFFICIAL HEADER BAR -->
      <g>
        <rect x="25" y="25" width="${width - 50}" height="70" fill="url(#headerGrad)" rx="6"/>
        <!-- App Title & Branding -->
        <text x="45" y="55" font-family="'Hind Siliguri', Arial, sans-serif" font-size="19" font-weight="bold" fill="#38bdf8">
          পশ্চিমবঙ্গ মাধ্যমিক ভূগোল ডিজিটাল মাস্টার রিডার (WBBSE)
        </text>
        <text x="45" y="78" font-family="'Hind Siliguri', Arial, sans-serif" font-size="12" fill="#cbd5e1">
          হেড অ্যাডমিন: শাওন কর (Shawon Sir) • দশম শ্রেণি সম্পূর্ণ সিলেবাস মডেল সলিউশন
        </text>

        <!-- Chapter & Mark Badge -->
        <rect x="${width - 240}" y="38" width="195" height="42" fill="url(#badgeGrad)" rx="8" />
        <text x="${width - 142}" y="65" font-family="'Hind Siliguri', Arial, sans-serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">
          ★ ${content.marksType} মাস্টার উত্তরপত্র
        </text>
      </g>

      <!-- CHAPTER TITLE & PAGE TOPIC -->
      <g transform="translate(45, 115)">
        <rect x="0" y="0" width="${width - 90}" height="40" fill="#f8fafc" stroke="#e2e8f0" rx="6" />
        <text x="15" y="25" font-family="'Hind Siliguri', Arial, sans-serif" font-size="14" font-weight="bold" fill="#1e293b">
          ${escapeXml(content.chapterTitle)}
        </text>
        <text x="${width - 110}" y="25" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#64748b" text-anchor="end">
          পৃষ্ঠা ${pageNum} / ৪
        </text>
      </g>

      <!-- MAIN QUESTION BOX -->
      <g transform="translate(45, 170)">
        <rect x="0" y="0" width="${width - 90}" height="55" fill="#eff6ff" stroke="#bfdbfe" rx="8"/>
        <text x="18" y="26" font-family="'Hind Siliguri', Arial, sans-serif" font-size="15" font-weight="bold" fill="#1d4ed8">
          ${escapeXml(content.question)}
        </text>
        <text x="18" y="45" font-family="Arial, sans-serif" font-size="11" fill="#475569" font-style="italic">
          ${escapeXml(content.questionEn || '')}
        </text>
      </g>

      <!-- OPTIONAL INLINE DIAGRAM IF PRESENT -->
      ${content.hasDiagram && content.diagramSvg ? sanitizeXmlEntities(content.diagramSvg) : ''}

      <!-- STRUCTURED MODEL ANSWER BODY (FOREIGN OBJECT FOR CLEAN TEXT FORMATTING) -->
      <foreignObject x="45" y="${content.hasDiagram ? 415 : 240}" width="${width - 90}" height="${content.hasDiagram ? 680 : 850}">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:'Hind Siliguri', Arial, sans-serif; font-size:14px; line-height:1.75; color:#1e293b; padding-right:15px;">
          ${sanitizeXmlEntities(content.answerHtml)}
        </div>
      </foreignObject>

      <!-- EXAM PRO-TIP BOX -->
      <g transform="translate(45, ${height - 145})">
        <rect x="0" y="0" width="${width - 90}" height="45" fill="#fef3c7" stroke="#fcd34d" rx="8" />
        <text x="18" y="27" font-family="'Hind Siliguri', Arial, sans-serif" font-size="12" font-weight="bold" fill="#92400e">
          💡 ${escapeXml(content.examTips)}
        </text>
      </g>

      <!-- BOTTOM SECURITY FOOTER -->
      <g transform="translate(25, ${height - 75})">
        <rect x="0" y="0" width="${width - 50}" height="50" fill="#0f172a" rx="0 0 6 6" />
        <text x="25" y="23" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff">
          SECURITY VERIFIED • LICENSED TO: ${safeName} (${safePhone})
        </text>
        <text x="25" y="38" font-family="Arial, sans-serif" font-size="10" fill="#94a3b8">
          STUDENT ID: ${safeUsername} • IP: ${safeIp} • TIME: ${timestamp}
        </text>
        <text x="${width - 75}" y="30" font-family="'Hind Siliguri', Arial, sans-serif" font-size="11" fill="#fde047" font-weight="bold" text-anchor="end">
          🔒 GeoLabPortal DRM Protected • অননুমোদিত শেয়ার সম্পূর্ণ নিষিদ্ধ
        </text>
      </g>

      <!-- TOP FORENSIC ANTI-CAPTURE WATERMARK OVERLAY -->
      <rect x="25" y="25" width="${width - 50}" height="${height - 50}" fill="url(#diagonalWatermark)" pointer-events="none"/>
    </svg>
  `;
}
