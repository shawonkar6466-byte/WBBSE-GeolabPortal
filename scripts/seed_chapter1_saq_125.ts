// scripts/seed_chapter1_saq_125.ts
import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, writeBatch } from 'firebase/firestore';

const CHAPTER1_SAQ_125 = [
  {
    num: 1,
    bn_q: "সর্বপ্রধান বহির্জাত ভূমিরূপ প্রক্রিয়ার নাম কী?",
    en_q: "What is the most important exogenic geomorphic process?",
    ans_bn: "নদীর কাজ (নদী প্রবাহের দ্বারা ক্ষয়, বহন ও অবক্ষেপণ)।",
    ans_en: "River action (Fluvial process: erosion, transportation, and deposition by running water)."
  },
  {
    num: 2,
    bn_q: "যে প্রক্রিয়ায় ভূপৃষ্ঠের উচ্চতা বৃদ্ধি পায় তাকে কী বলে?",
    en_q: "What is the process called by which the elevation of the earth surface increases?",
    ans_bn: "আরোহণ প্রক্রিয়া (Aggradation)।",
    ans_en: "Aggradation process."
  },
  {
    num: 3,
    bn_q: "যে প্রক্রিয়ায় ক্ষয়কার্যের মাধ্যমে ভূপৃষ্ঠের উচ্চতা হ্রাস পায় তাকে কী বলে?",
    en_q: "What is the process called by which the elevation of the earth surface decreases through erosion?",
    ans_bn: "অবরোহণ প্রক্রিয়া (Degradation)।",
    ans_en: "Degradation process."
  },
  {
    num: 4,
    bn_q: "অবরোহণ ও আরোহণের সম্মিলিত রূপকে কী বলা হয়?",
    en_q: "What is the combined form of degradation and aggradation called?",
    ans_bn: "পর্যায়ন (Gradation)।",
    ans_en: "Gradation."
  },
  {
    num: 5,
    bn_q: "'পর্যায়ন' (Gradation) শব্দটি প্রথম কে এবং কত সালে ব্যবহার করেন?",
    en_q: "Who first used the term 'Gradation' and in which year?",
    ans_bn: "ভূতত্ত্ববিদ জি. কে. গিলবার্ট (G.K. Gilbert) ১৮৭৬ সালে প্রথম ব্যবহার করেন।",
    ans_en: "Geologist G.K. Gilbert first used it in 1876."
  },
  {
    num: 6,
    bn_q: "'ক্ষয়সীমা' (Base level of erosion) ধারণার প্রবর্তক কে?",
    en_q: "Who introduced the concept of 'Base level of erosion'?",
    ans_bn: "জে ডব্লিউ পাওয়েল (J.W. Powell), ১৮৭৫ সালে।",
    ans_en: "J.W. Powell in 1875."
  },
  {
    num: 7,
    bn_q: "ভূপৃষ্ঠে ক্ষয়ের শেষ সীমা বা চরম ক্ষয়সীমা কোনটি?",
    en_q: "What is the ultimate base level of erosion on the Earth's surface?",
    ans_bn: "সমুদ্রপৃষ্ঠ (Sea level)।",
    ans_en: "Sea level."
  },
  {
    num: 8,
    bn_q: "আবহবিকার, পুঞ্জিত ক্ষয় ও ক্ষয়ীভবনের সম্মিলিত ফলকে কী বলে?",
    en_q: "What is the combined result of weathering, mass wasting, and erosion called?",
    ans_bn: "নগ্নীভবন (Denudation)।",
    ans_en: "Denudation."
  },
  {
    num: 9,
    bn_q: "যে উচ্চভূমি দুটি পৃথক নদী অববাহিকাকে পৃথক করে তাকে কী বলে?",
    en_q: "What is the highland called that separates two adjacent river basins?",
    ans_bn: "জলবিভাজিকা (Water divide / Watershed)।",
    ans_en: "Water divide or Watershed."
  },
  {
    num: 10,
    bn_q: "ভারতের প্রধান জলবিভাজিকা কোনটি?",
    en_q: "Which is the principal water divide of India?",
    ans_bn: "মধ্য ভারতের বিন্ধ্য ও সাতপুরা পর্বত এবং হিমালয় পর্বতমালা।",
    ans_en: "Vindhya and Satpura ranges and the Himalayan mountain system."
  },
  {
    num: 11,
    bn_q: "পৃথিবীর বৃহত্তম নদী অববাহিকা কোনটি?",
    en_q: "Which is the largest river basin in the world?",
    ans_bn: "আমাজন নদী অববাহিকা (দক্ষিণ আমেরিকা)।",
    ans_en: "Amazon River Basin (South America)."
  },
  {
    num: 12,
    bn_q: "পৃথিবীর দীর্ঘতম নদী কোনটি?",
    en_q: "Which is the longest river in the world?",
    ans_bn: "নীলনদ (আফ্রিকা, দৈর্ঘ্য প্রায় ৬৬৫০ কিমি)।",
    ans_en: "Nile River (Africa, length approx 6650 km)."
  },
  {
    num: 13,
    bn_q: "ভারতের দীর্ঘতম নদী কোনটি?",
    en_q: "Which is the longest river in India?",
    ans_bn: "গঙ্গা নদী (দৈর্ঘ্য প্রায় ২৫২৫ কিমি)।",
    ans_en: "Ganga River (length approx 2525 km)."
  },
  {
    num: 14,
    bn_q: "নদীর জলপ্রবাহ মাপার একক কী?",
    en_q: "What are the units used to measure river discharge?",
    ans_bn: "কিউসেক (ঘনফুট/সেকেন্ড) ও কিউমেক (ঘনমিটার/সেকেন্ড)।",
    ans_en: "Cusec (cubic feet/second) and Cumec (cubic meters/second)."
  },
  {
    num: 15,
    bn_q: "উচ্চ পার্বত্য অঞ্চলে নদীর প্রধান কাজ কী?",
    en_q: "What is the primary function of a river in high mountainous upper course?",
    ans_bn: "ক্ষয়সাধন ও নিম্নাভিমুখী ক্ষয় (Vertical erosion)।",
    ans_en: "Erosion and downward vertical erosion."
  },
  {
    num: 16,
    bn_q: "নদীর নিম্ন ক্ষয়ের ফলে পার্বত্য প্রবাহে সৃষ্ট গভীর ও সংকীর্ণ উপত্যকাকে কী বলে?",
    en_q: "What is the deep narrow valley formed by downward river erosion in mountain courses called?",
    ans_bn: "গিরিখাত (Gorge)।",
    ans_en: "Gorge."
  },
  {
    num: 17,
    bn_q: "শুষ্ক ও মরুপ্রায় অঞ্চলের অত্যন্ত গভীর ও খাড়া পার্শ্বযুক্ত গিরিখাতকে কী বলে?",
    en_q: "What is an extremely deep, steep-sided gorge in arid or semi-arid regions called?",
    ans_bn: "ক্যানিয়ন (Canyon)।",
    ans_en: "Canyon."
  },
  {
    num: 18,
    bn_q: "পৃথিবীর গভীরতম গিরিখাত কোনটি?",
    en_q: "Which is the deepest gorge in the world?",
    ans_bn: "কালী গণ্ডকী গিরিখাত (অন্ধ গলচি, নেপাল) অথবা তিব্বতের ইয়ারলুং সাংপো গিরিখাত।",
    ans_en: "Kali Gandaki Gorge (Nepal) / Yarlung Tsangpo Grand Canyon (Tibet)."
  },
  {
    num: 19,
    bn_q: "পৃথিবীর বৃহত্তম বা বিখ্যাত ক্যানিয়ন কোনটি?",
    en_q: "Which is the most famous and largest canyon in the world?",
    ans_bn: "আমেরিকা যুক্তরাষ্ট্রের কলোরাডো নদীর গ্র্যান্ড ক্যানিয়ন (Grand Canyon)।",
    ans_en: "Grand Canyon formed by Colorado River (USA)."
  },
  {
    num: 20,
    bn_q: "নদীর গতিপথে কঠিন শিলা ও কোমল শিলা অনুভূমিক বা উল্লম্বভাবে অবস্থান করলে কী ধরনের ক্ষয় ঘটে?",
    en_q: "What kind of erosion takes place when hard and soft rocks lie alternately along a river course?",
    ans_bn: "বৈষম্যমূলক ক্ষয় (Differential erosion)।",
    ans_en: "Differential erosion."
  },
  {
    num: 21,
    bn_q: "নদীবক্ষে অবঘর্ষ প্রক্রিয়ায় সৃষ্ট গোলাকার ছোট ছোট গর্তগুলোকে কী বলে?",
    en_q: "What are the small circular holes formed on river beds by corrasion/abrasion called?",
    ans_bn: "মন্থকূপ (Potholes)।",
    ans_en: "Potholes."
  },
  {
    num: 22,
    bn_q: "জলপ্রপাতের পাদদেশে জলধারা পতনের তীব্র আঘাতে সৃষ্ট সুবিশাল গর্তকে কী বলে?",
    en_q: "What is the large depression formed at the base of a waterfall by the force of falling water called?",
    ans_bn: "প্রপাতকূপ (Plunge pool)।",
    ans_en: "Plunge pool."
  },
  {
    num: 23,
    bn_q: "ভারতের উচ্চতম জলপ্রপাত কোনটি?",
    en_q: "Which is the highest waterfall in India?",
    ans_bn: "কুঞ্চিকল জলপ্রপাত (বরাহী নদী, কর্ণাটক, উচ্চতা ৪৫৫ মিটার)।",
    ans_en: "Kunchikal Falls (Varahi River, Karnataka, height 455 m)."
  },
  {
    num: 24,
    bn_q: "পৃথিবীর উচ্চতম জলপ্রপাত কোনটি?",
    en_q: "Which is the highest waterfall in the world?",
    ans_bn: "অ্যাঞ্জেল ফলস (ভেনেজুয়েলা, উচ্চতা ৯৭৯ মিটার)।",
    ans_en: "Angel Falls (Venezuela, height 979 m)."
  },
  {
    num: 25,
    bn_q: "নদীর ঢালে জলরাশি সিঁড়ির ধাপের মতো দ্রুত নেমে এলে তাকে কী বলে?",
    en_q: "What is a waterfall descending in a series of rock steps or stages called?",
    ans_bn: "ক্যাসকেড (Cascade)।",
    ans_en: "Cascade."
  },
  {
    num: 26,
    bn_q: "নদীতে বিপুল পরিমাণ জলরাশি প্রবল বেগে আছড়ে পড়লে তাকে কী বলে?",
    en_q: "What is a very large volume of water plunging down with immense velocity called?",
    ans_bn: "ক্যাটারাক্ট (Cataract)।",
    ans_en: "Cataract."
  },
  {
    num: 27,
    bn_q: "নদী পার্বত্য অঞ্চল ছেড়ে সমভূমিতে প্রবেশের মুখে পলি সঞ্চিত হয়ে পাখার মতো যে ভূমিরূপ গঠন করে তাকে কী বলে?",
    en_q: "What fan-shaped alluvial landform is deposited where a river exits mountains onto a plain?",
    ans_bn: "পলল শঙ্কু বা পলল ব্যজনী (Alluvial cone / Alluvial fan)।",
    ans_en: "Alluvial cone or Alluvial fan."
  },
  {
    num: 28,
    bn_q: "নদীর বাঁকের উত্তল অংশে পলি জমার ফলে সৃষ্ট চড়া বা বাঁধকে কী বলে?",
    en_q: "What is the deposit of sediment on the convex inner bank of a river bend called?",
    ans_bn: "পয়েন্ট বার বা বিন্দু চর (Point bar)।",
    ans_en: "Point bar."
  },
  {
    num: 29,
    bn_q: "অশ্বখুরাকৃতি হ্রদ নদীর কোন গতিতে দেখতে পাওয়া যায়?",
    en_q: "In which course of a river are oxbow lakes typically formed?",
    ans_bn: "নিম্ন গতি বা সমভূমি প্রবাহে (Lower or plain course)।",
    ans_en: "Lower course or plain course."
  },
  {
    num: 30,
    bn_q: "নদীবাঁক বা মিয়েন্ডার (Meander) নামের উৎপত্তি কোন নদী থেকে হয়েছে?",
    en_q: "From which river did the term 'Meander' originate?",
    ans_bn: "তুরস্কের আঁকাবাঁকা 'মিয়েনদ্রেস' (Menderes) নদী থেকে।",
    ans_en: "From the winding Menderes River of Turkey."
  },
  {
    num: 31,
    bn_q: "বন্যা বা প্লাবনের সময় নদীর দুকূলে স্বাভাবিকভাবে গড়ে ওঠা মাটির বাঁধকে কী বলে?",
    en_q: "What are the natural earthen ridges built along river banks during floods called?",
    ans_bn: "স্বাভাবিক বাঁধ বা লিভি (Natural Levee)।",
    ans_en: "Natural Levee."
  },
  {
    num: 32,
    bn_q: "প্লাবনের ফলে নদীর উভয় কূলবর্তী নিম্নাঞ্চলে পলি জমে যে সমভূমি গড়ে ওঠে তাকে কী বলে?",
    en_q: "What plain is formed along river valleys by the deposition of flood sediments?",
    ans_bn: "প্লাবনভূমি (Flood plain)।",
    ans_en: "Flood plain."
  },
  {
    num: 33,
    bn_q: "নদীর মোহনায় গ্রিক অক্ষর ডেল্টা (Δ) বা বাংলা 'মাত্রা ছাড়া ব' এর মতো যে ভূমিরূপ গড়ে ওঠে তাকে কী বলে?",
    en_q: "What triangular deposit at a river mouth resembling Greek letter Delta (Δ) is called?",
    ans_bn: "বদ্বীপ (Delta)।",
    ans_en: "Delta."
  },
  {
    num: 34,
    bn_q: "পৃথিবীর বৃহত্তম বদ্বীপ কোনটি?",
    en_q: "Which is the largest delta in the world?",
    ans_bn: "গঙ্গা-ব্রহ্মপুত্র-মেঘনা বদ্বীপ (সুন্দরবন অঞ্চল)।",
    ans_en: "Ganga-Brahmaputra-Meghna Delta (Sundarbans region)."
  },
  {
    num: 35,
    bn_q: "পাখির পায়ের মতো বদ্বীপ ভারতের কোন নদীতে দেখা যায়?",
    en_q: "A bird's foot delta is seen in which river of India / world?",
    ans_bn: "ভারতে কৃষ্ণা নদী এবং বিশ্বে মার্কিন যুক্তরাষ্ট্রের মিসিসিপি-মিসৌরি নদীতে।",
    ans_en: "Krishna River in India and Mississippi-Missouri River in USA."
  },
  {
    num: 36,
    bn_q: "ধনুকাকৃতি বদ্বীপের একটি উদাহরণ দাও।",
    en_q: "Give an example of an Arcuate delta.",
    ans_bn: "গঙ্গা-পদ্মা নদীর বদ্বীপ এবং নীলনদের বদ্বীপ।",
    ans_en: "Ganga-Brahmaputra delta and Nile delta."
  },
  {
    num: 37,
    bn_q: "তীক্ণাগ্র বদ্বীপ কোন নদীতে দেখা যায়?",
    en_q: "In which river is a Cuspate delta observed?",
    ans_bn: "ইতালির টাইবার নদী এবং স্পেনের এব্রো নদীতে।",
    ans_en: "Tiber River of Italy and Ebro River of Spain."
  },
  {
    num: 38,
    bn_q: "ভারতের দুটি পশ্চিমবাহিনী নদীর নাম লেখো যেখানে বদ্বীপ গড়ে ওঠেনি।",
    en_q: "Name two west-flowing rivers of India where no deltas have formed.",
    ans_bn: "নর্মদা ও তাপ্তি নদী।",
    ans_en: "Narmada and Tapi rivers."
  },
  {
    num: 39,
    bn_q: "পৃথিবীর বৃহত্তম নদীদ্বীপ বা চর কোনটি?",
    en_q: "Which is the largest river island in the world?",
    ans_bn: "আমাজন নদীর মোহনায় ইলহা দো মারাজো (উপকূলীয় নদীদ্বীপ) এবং ভারতের ব্রহ্মপুত্র নদের মাজুলি (অভ্যন্তরীণ নদীদ্বীপ)।",
    ans_en: "Ilha do Marajó on Amazon (deltaic) and Majuli on Brahmaputra (inland)."
  },
  {
    num: 40,
    bn_q: "নদীর বহন ক্ষমতার সঙ্গে নদীবেগের কী সম্পর্ক? (ষষ্ঠ ঘাতের সূত্র)",
    en_q: "What is the relation between river velocity and transport capacity (Sixth Power Law)?",
    ans_bn: "নদীর বেগ দ্বিগুণ হলে বহন ক্ষমতা ৬৪ গুণ (২^৬) বৃদ্ধি পায়।",
    ans_en: "If velocity doubles, transport capacity increases by 64 times (2^6)."
  },
  {
    num: 41,
    bn_q: "ষষ্ঠ ঘাতের সূত্রটি (Sixth Power Law) কে প্রবর্তন করেন?",
    en_q: "Who formulated the Sixth Power Law of river erosion?",
    ans_bn: "ডব্লিউ. হপকিন্স (W. Hopkins), ১৮৪২ সালে।",
    ans_en: "W. Hopkins in 1842."
  },
  {
    num: 42,
    bn_q: "নদীবক্ষে একাধিক বালুচর ও জলধারা পরস্পর বিনুনি বা জটার মতো প্রবাহিত হলে তাকে কী বলে?",
    en_q: "What is a channel consisting of multiple interlaced branches separated by bars called?",
    ans_bn: "বিনুনি রূপ নদী বা বিনুনি জলধারা (Braided river / Braided channel)।",
    ans_en: "Braided river / Braided channel."
  },
  {
    num: 43,
    bn_q: "ভারতে বিনুনি জলপ্রবাহের একটি উল্লেখযোগ্য উদাহরণ দাও।",
    en_q: "Give a prominent example of a braided river in India.",
    ans_bn: "অসমের ব্রহ্মপুত্র নদ।",
    ans_en: "Brahmaputra river in Assam."
  },
  {
    num: 44,
    bn_q: "যে রেখা বরাবর নদীর ঢালের আকস্মিক পরিবর্তন ঘটে এবং জলপ্রপাত সৃষ্টি হয় তাকে কী বলে?",
    en_q: "What is a point along a river profile where sudden drop occurs called?",
    ans_bn: "নিক পয়েন্ট (Knick point)।",
    ans_en: "Knick point."
  },
  {
    num: 45,
    bn_q: "নদীবাহিত শিলাখণ্ডের সঙ্গে নদীখাতের ঘর্ষণে ক্ষয়সাধনকে কী বলা হয়?",
    en_q: "What is the erosion called where rock particles rub against river bed?",
    ans_bn: "অবঘর্ষ প্রক্রিয়া (Corrasion / Abrasion)।",
    ans_en: "Corrasion or Abrasion."
  },
  {
    num: 46,
    bn_q: "নদীবাহিত শিলাখণ্ডগুলির নিজেদের মধ্যে ঠোকাঠুকি লেগে ভেঙে যাওয়ার ক্ষয়কে কী বলে?",
    en_q: "What is the wear and tear among transported rock boulders colliding with each other called?",
    ans_bn: "ঘর্ষণ ক্ষয় (Attrition)।",
    ans_en: "Attrition."
  },
  {
    num: 47,
    bn_q: "হিমবাহের গতিবেগ পরিমাপক যন্ত্রের নাম কী?",
    en_q: "What instrument is used to measure the movement speed of glaciers?",
    ans_bn: "স্টেকিওমিটার বা ক্রায়োমিটার (Stakes measurement / Cryometer)।",
    ans_en: "Glacier Stakes method / Cryometer."
  },
  {
    num: 48,
    bn_q: "পৃথিবীর দীর্ঘতম মহাদেশীয় হিমবাহ কোনটি?",
    en_q: "Which is the longest continental glacier in the world?",
    ans_bn: "অ্যান্টার্কটিকার ল্যাম্বার্ট হিমবাহ (দৈর্ঘ্য প্রায় ৪০০ কিমি)।",
    ans_en: "Lambert Glacier in Antarctica (approx 400 km)."
  },
  {
    num: 49,
    bn_q: "পৃথিবীর দ্রুততম হিমবাহ কোনটি?",
    en_q: "Which is the fastest moving glacier in the world?",
    ans_bn: "গ্রিনল্যান্ডের জ্যাকোবশাভন (ইসুয়া) হিমবাহ।",
    ans_en: "Jakobshavn Glacier in Greenland."
  },
  {
    num: 50,
    bn_q: "ভারতের দীর্ঘতম উপত্যকা হিমবাহ কোনটি?",
    en_q: "Which is the longest valley glacier in India?",
    ans_bn: "কারাকোরাম পর্বতের সিয়াচেন হিমবাহ (দৈর্ঘ্য প্রায় ৭৬ কিমি)।",
    ans_en: "Siachen Glacier in Karakoram range (approx 76 km)."
  },
  {
    num: 51,
    bn_q: "পর্বতের ঢাল বেয়ে নেমে আসা হিমবাহকে কী ধরনের হিমবাহ বলে?",
    en_q: "What type of glacier descends down mountain valleys?",
    ans_bn: "উপত্যকা হিমবাহ বা পার্বত্য হিমবাহ (Valley glacier / Alpine glacier)।",
    ans_en: "Valley glacier or Alpine glacier."
  },
  {
    num: 52,
    bn_q: "পর্বতের পাদদেশে একাধিক উপত্যকা হিমবাহ এসে মিলিত হয়ে যে হিমবাহ সৃষ্টি করে তাকে কী বলে?",
    en_q: "What is a glacier formed by the coalescence of valley glaciers at the foot of mountains called?",
    ans_bn: "পাদদেশীয় হিমবাহ (Piedmont glacier)।",
    ans_en: "Piedmont glacier."
  },
  {
    num: 53,
    bn_q: "পৃথিবীর বৃহত্তম পাদদেশীয় হিমবাহ কোনটি?",
    en_q: "Which is the largest piedmont glacier in the world?",
    ans_bn: "আলাস্কার মালাসপিনা হিমবাহ (Malaspina Glacier)।",
    ans_en: "Malaspina Glacier in Alaska."
  },
  {
    num: 54,
    bn_q: "হিমবাহের প্রধান দুটি ক্ষয় প্রক্রিয়ার নাম কী?",
    en_q: "What are the two principal erosional processes of glaciers?",
    ans_bn: "উৎপাটন (Plucking) ও অবঘর্ষ (Abrasion)।",
    ans_en: "Plucking and Abrasion."
  },
  {
    num: 55,
    bn_q: "হিমবাহ ও উপত্যকা প্রাচীরের মধ্যে সৃষ্ট গভীর ফাটলকে কী বলে?",
    en_q: "What is the deep fissure between a moving glacier and the valley headwall called?",
    ans_bn: "বার্গস্রুন্ড (Bergschrund)।",
    ans_en: "Bergschrund."
  },
  {
    num: 56,
    bn_q: "হিমবাহের উপরিভাগে সৃষ্ট অসংখ্য গভীর সমান্তরাল বা আড়াআড়ি ফাটলকে কী বলে?",
    en_q: "What are the deep longitudinal and transverse cracks on the surface of a glacier called?",
    ans_bn: "ক্রেভাস (Crevasse)।",
    ans_en: "Crevasse."
  },
  {
    num: 57,
    bn_q: "হিমবাহের ক্ষয়কার্যে পর্বতগাত্রে সৃষ্ট হাতলওয়ালা আরামকেদারার মতো গর্তকে ফ্রান্সে কী বলা হয়?",
    en_q: "What is the armchair-like amphitheatre depression carved by glaciers called in France?",
    ans_bn: "সার্ক (Cirque)। স্কটল্যান্ডে একে 'কোরি' (Corrie) বলে।",
    ans_en: "Cirque (called 'Corrie' in Scotland)."
  },
  {
    num: 58,
    bn_q: "সার্কের মধ্যবর্তী গভীর গর্তে জল জমে যে হ্রদ সৃষ্টি হয় তাকে কী বলে?",
    en_q: "What is a lake formed within a cirque basin called?",
    ans_bn: "টর্ন বা সার্ক হ্রদ (Tarn / Cirque lake)।",
    ans_en: "Tarn or Cirque lake."
  },
  {
    num: 59,
    bn_q: "পাশাপাশি দুটি সার্কের মধ্যবর্তী সংকীর্ণ তীক্ষ্ণ পর্বত শৈলশিরাকে কী বলে?",
    en_q: "What is a sharp, narrow ridge between two adjacent cirques called?",
    ans_bn: "অ্যারেট (Arête)।",
    ans_en: "Arête."
  },
  {
    num: 60,
    bn_q: "চারিদিকের সার্ক ক্ষয়প্রাপ্ত হয়ে পর্বতের শীর্ষে পিরামিডের মতো যে তীক্ষ্ণ শৃঙ্গ গঠিত হয় তাকে কী বলে?",
    en_q: "What pointed pyramid-shaped peak is formed when cirques erode a mountain from multiple sides?",
    ans_bn: "পিরামিড চূড়া বা হর্ন (Pyramidal peak / Horn)।",
    ans_en: "Pyramidal peak or Horn."
  },
  {
    num: 61,
    bn_q: "বিশ্বের বিখ্যাত পিরামিড চূড়ার একটি উদাহরণ দাও।",
    en_q: "Give a famous example of a Pyramidal peak.",
    ans_bn: "সুইজারল্যান্ডের আল্পস পর্বতের ম্যাটারহর্ন (Matterhorn) এবং ভারতের নীলকণ্ঠ শৃঙ্গ।",
    ans_en: "Matterhorn in Swiss Alps and Nilkantha peak in India."
  },
  {
    num: 62,
    bn_q: "হিমবাহ উপত্যকার আকৃতি ইংরেজি কোন অক্ষরের মতো হয়?",
    en_q: "A glacial valley profile resembles which English letter?",
    ans_bn: "'U' অক্ষরের মতো (U-shaped valley)।",
    ans_en: "'U' letter (U-shaped valley)."
  },
  {
    num: 63,
    bn_q: "প্রধান হিমবাহ উপত্যকার ওপর ঝুলন্ত অবস্থায় থাকা উপনদী উপত্যকাকে কী বলে?",
    en_q: "What is a tributary valley perched high above the main glacial trough called?",
    ans_bn: "ঝুলন্ত উপত্যকা (Hanging valley)।",
    ans_en: "Hanging valley."
  },
  {
    num: 64,
    bn_q: "ঝুলন্ত উপত্যকায় নদী প্রবাহিত হলে সাধারণতঃ কোন ধরনের ভূমিরূপ গড়ে ওঠে?",
    en_q: "What landform typically forms where a river drops from a hanging valley?",
    ans_bn: "জলপ্রপাত (Waterfall)।",
    ans_en: "Waterfall."
  },
  {
    num: 65,
    bn_q: "হিমবাহের প্রবাহপথে একটি উঁচু ঢিবির একপাশ অবঘর্ষে মসৃণ ও বিপরীত পাশ উৎপাটনে এবড়োখেবড়ো হলে তাকে কী বলে?",
    en_q: "What is an asymmetrical rock outcrop smoothed on upstream and plucked on downstream side called?",
    ans_bn: "রূশ মোতোনে (Roche Moutonnée)।",
    ans_en: "Roche Moutonnée."
  },
  {
    num: 66,
    bn_q: "হিমবাহ বাহিত কঠিন শিলাখণ্ডের পেছনের কোমল শিলার লেজের মতো বিস্তৃত ভূমিরূপকে কী বলে?",
    en_q: "What landform consists of a steep hard rock head and a tapered soft rock tail?",
    ans_bn: "ক্র্যাগ অ্যান্ড টেল (Crag and Tail)।",
    ans_en: "Crag and Tail."
  },
  {
    num: 67,
    bn_q: "উপকূলীয় অঞ্চলে হিমবাহের ক্ষয়ে নিমজ্জিত গভীর সমুদ্র উপত্যকাকে কী বলে?",
    en_q: "What is a drowned glacial trough along a coastline called?",
    ans_bn: "ফিওর্ড (Fiord / Fjord)।",
    ans_en: "Fiord / Fjord."
  },
  {
    num: 68,
    bn_q: "'ফিওর্ডের দেশ' কাকে বলা হয়?",
    en_q: "Which country is renowned as the 'Land of Fjords'?",
    ans_bn: "নরওয়ে (Norway)।",
    ans_en: "Norway."
  },
  {
    num: 69,
    bn_q: "হিমবাহ দ্বারা বাহিত ও সঞ্চিত সমস্ত রকমের নুড়ি, পাথর, কাদা ও বালির স্তূপকে কী বলে?",
    en_q: "What are unassorted glacial sediment deposits called collectively?",
    ans_bn: "গ্রাবরেখা (Moraine)।",
    ans_en: "Moraine."
  },
  {
    num: 70,
    bn_q: "হিমবাহের শেষপ্রান্তে পলি সঞ্চিত হয়ে সৃষ্ট গ্রাবরেখাকে কী বলে?",
    en_q: "What moraine is deposited at the terminus or snout of a glacier?",
    ans_bn: "প্রান্ত গ্রাবরেখা (Terminal moraine)।",
    ans_en: "Terminal moraine."
  },
  {
    num: 71,
    bn_q: "দুটি হিমবাহের পাশাপাশি মিলনের স্থলে মধ্যভাগে সৃষ্ট গ্রাবরেখাকে কী বলে?",
    en_q: "What moraine forms along the junction where two lateral moraines meet?",
    ans_bn: "মধ্য গ্রাবরেখা (Medial moraine)।",
    ans_en: "Medial moraine."
  },
  {
    num: 72,
    bn_q: "উল্টানো নৌকো বা অর্ধেক ডিমের মতো দেখতে হিমবাহের সঞ্চয়জাত ঢিবিকে কী বলে?",
    en_q: "What oval streamlined hill resembling an inverted spoon or half egg is called?",
    ans_bn: "ড্রামলিন (Drumlin)।",
    ans_en: "Drumlin."
  },
  {
    num: 73,
    bn_q: "ড্রামলিন অধ্যুষিত অঞ্চলকে কী ধরনের ভূমিরূপ ভূদৃশ্য বলা হয়?",
    en_q: "What landscape appearance is produced by a cluster of drumlins?",
    ans_bn: "'ডিম ভরতি ঝুড়ি ভূদৃশ্য' (Basket of eggs topography)।",
    ans_en: "'Basket of eggs topography'."
  },
  {
    num: 74,
    bn_q: "হিমরেখা কাকে বলে?",
    en_q: "What is snowline (Himrekha)?",
    ans_bn: "পার্বত্য অঞ্চলে যে নির্দিষ্ট উচ্চতার ওপরে সারা বছর তুষার জমে থাকে এবং স্থায়ী তুষারস্তর দেখা যায়, সেই সীমারেখাকে হিমরেখা (Snowline) বলে।",
    ans_en: "Snowline is the altitude above which snow remains throughout the year without melting."
  },
  {
    num: 75,
    bn_q: "হিমশৈল কাকে বলে?",
    en_q: "What is an iceberg (Himsailo)?",
    ans_bn: "সমুদ্রের জলে ভাসমান সুবিশাল বরফের স্তূপকে হিমশৈল বলে, যার ১/৯ ভাগ জলের উপরে ও ৮/৯ ভাগ নিমজ্জিত থাকে।",
    ans_en: "An iceberg is a massive floating body of freshwater ice broken off from glaciers, with 1/9th part above water."
  },
  {
    num: 76,
    bn_q: "হিমবাহ গলিত জলস্রোত বাহিত বালি ও নুড়ি জমা হয়ে আঁকাবাঁকা দীর্ঘ শৈলশিরার মতো ভূমিরূপকে কী বলে?",
    en_q: "What long winding sinuous ridge of sand and gravel is deposited by meltwater tunnels?",
    ans_bn: "এসকার (Esker)।",
    ans_en: "Esker."
  },
  {
    num: 77,
    bn_q: "হিমবাহের বহির্ধৌত সমভূমিতে বরফ গলে সৃষ্টি হওয়া ছোট ছোট গর্তগুলোকে কী বলে?",
    en_q: "What circular depressions on outwash plains formed by melting stagnant ice are called?",
    ans_bn: "কেটল (Kettle)।",
    ans_en: "Kettle."
  },
  {
    num: 78,
    bn_q: "কেটল গর্তে জল জমে সৃষ্ট হ্রদকে কী বলে?",
    en_q: "What is a lake formed in a kettle hole called?",
    ans_bn: "কেটল হ্রদ (Kettle lake)।",
    ans_en: "Kettle lake."
  },
  {
    num: 79,
    bn_q: "হিমবাহ ও নদী দ্বারা যৌথভাবে গঠিত নুড়ি, বালি ও পলির সমভূমিকে কী বলে?",
    en_q: "What flat plain formed jointly by fluvio-glacial deposits of sand and gravel is called?",
    ans_bn: "বহির্ধৌত সমভূমি (Outwash plain)।",
    ans_en: "Outwash plain."
  },
  {
    num: 80,
    bn_q: "হিমবাহ দ্বারা পরিবাহিত বিশালাকৃতির অসংলগ্ন ভিন্ন জাতের শিলাখণ্ডকে কী বলে?",
    en_q: "What large erratically placed boulder transported by glacier far from source is called?",
    ans_bn: "আবদ্ধ শিলা বা এরাটিক / অসংলগ্ন শিলা (Erratic)।",
    ans_en: "Glacial Erratic."
  },
  {
    num: 81,
    bn_q: "মরুভূমি অঞ্চলে বায়ুর প্রধান ক্ষয় প্রক্রিয়াগুলি কী কী?",
    en_q: "What are the primary erosional processes of wind in arid deserts?",
    ans_bn: "অপবাহন (Deflation), অবঘর্ষ (Abrasion) ও ঘর্ষণ (Attrition)।",
    ans_en: "Deflation, Abrasion, and Attrition."
  },
  {
    num: 82,
    bn_q: "মরুভূমিতে বায়ুর অপবাহন ক্ষয়ের ফলে সৃষ্ট অবনমিত গর্তগুলোকে কী বলে?",
    en_q: "What depressions hollowed out by wind deflation in deserts are called?",
    ans_bn: "অপবাহন গর্ত বা ব্লো আউট (Blowout / Deflation hollow)।",
    ans_en: "Blowout or Deflation hollow."
  },
  {
    num: 83,
    bn_q: "মিশরের বিখ্যাত অপবাহন সৃষ্ট বিশাল অবনমিত অঞ্চলের নাম কী?",
    en_q: "What is the famous large wind deflation depression located in Egypt?",
    ans_bn: "কাত্তারা অবনমিত অঞ্চল (Qattara Depression)।",
    ans_en: "Qattara Depression in Egypt."
  },
  {
    num: 84,
    bn_q: "মরুভূমিতে বায়ুর অবঘর্ষ ক্ষয়ের ফলে ব্যাঙের ছাতার মতো ভূমিরূপকে কী বলে?",
    en_q: "What mushroom-shaped rock pillar formed by wind abrasion in deserts is called?",
    ans_bn: "গৌর বা গারা (Gour / Mushroom rock / Pedestal rock)।",
    ans_en: "Gour or Mushroom rock (Pedestal rock)."
  },
  {
    num: 85,
    bn_q: "মরুভূমিতে কঠিন ও কোমল শিলা অনুভূমিকভাবে সজ্জিত থাকলে ক্ষয়ের ফলে তৈরি টেবিলের মতো ভূমিরূপকে কী বলে?",
    en_q: "What table-shaped flat-topped ridge formed over horizontal rock beds by wind is called?",
    ans_bn: "জুগেন (Zeugen)।",
    ans_en: "Zeugen."
  },
  {
    num: 86,
    bn_q: "মরুভূমিতে কঠিন ও কোমল শিলা উল্লম্বভাবে অবস্থান করলে বায়ুর ক্ষয়ে সৃষ্ট খাঁজযুক্ত শৈলশিরাকে কী বলে?",
    en_q: "What sharp furrowed crest formed over vertically inclined alternating strata is called?",
    ans_bn: "ইয়ারদাং (Yardang)।",
    ans_en: "Yardang."
  },
  {
    num: 87,
    bn_q: "মরুভূমির সমতল ভূমিতে ক্ষয় প্রতিরোধী কঠিন শিলার তৈরি অবশিষ্ট একাকী খাড়া পাহাড়কে কী বলে?",
    en_q: "What isolated steep-sided remnant hill rising sharply from a desert plain is called?",
    ans_bn: "ইনসেলবার্জ (Inselberg)।",
    ans_en: "Inselberg."
  },
  {
    num: 88,
    bn_q: "'ইনসেলবার্জ' শব্দটির অর্থ কী?",
    en_q: "What is the literal German meaning of the word 'Inselberg'?",
    ans_bn: "দ্বীপের মতো পাহাড় (Island mountain)।",
    ans_en: "Island mountain (German word)."
  },
  {
    num: 89,
    bn_q: "অতিরিক্ত ক্ষয়প্রাপ্ত গোলাকার মাথাযুক্ত ইনসেলবার্জকে কী বলা হয়?",
    en_q: "What is a highly rounded, dome-shaped inselberg called?",
    ans_bn: "বর্নহার্ট (Bornhardt)।",
    ans_en: "Bornhardt."
  },
  {
    num: 90,
    bn_q: "মরুভূমিতে বায়ুর সঞ্চয়ের ফলে সৃষ্ট অর্ধচন্দ্রাকৃতি বালিয়াড়িকে কী বলে?",
    en_q: "What crescent-shaped mobile sand dune formed by wind deposition is called?",
    ans_bn: "বার্খান (Barchan)।",
    ans_en: "Barchan."
  },
  {
    num: 91,
    bn_q: "বায়ুপ্রবাহের সমান্তরালে গঠিত তরবারির মতো সোজা ও দীর্ঘ বালিয়াড়িকে কী বলে?",
    en_q: "What long narrow longitudinal sand dune aligned parallel to prevailing wind is called?",
    ans_bn: "সিফ বালিয়াড়ি (Seif dune)।",
    ans_en: "Seif dune."
  },
  {
    num: 92,
    bn_q: "'সিফ' (Seif) শব্দটি কোন ভাষার শব্দ এবং এর অর্থ কী?",
    en_q: "Which language does 'Seif' come from and what does it mean?",
    ans_bn: "আরবি শব্দ, যার অর্থ 'সোজা তরবারি' (Sword)।",
    ans_en: "Arabic word meaning 'straight sword'."
  },
  {
    num: 93,
    bn_q: "মরুভূমিতে দুটি সমান্তরাল বালিয়াড়ির মধ্যবর্তী বালুকাহীন করিডোর বা পথকে কী বলে?",
    en_q: "What sand-free corridor between two parallel longitudinal sand dunes is called?",
    ans_bn: "গাসি (Gassi)।",
    ans_en: "Gassi."
  },
  {
    num: 94,
    bn_q: "সাহারা মরুভূমির বালুকাময় মরুভূমিকে কী নামে ডাকা হয়?",
    en_q: "What is a vast sandy desert covered with active dunes called in the Sahara?",
    ans_bn: "আর্গ (Erg)।",
    ans_en: "Erg."
  },
  {
    num: 95,
    bn_q: "সাহারা মরুভূমির পাথুরে ও শিলাময় মরুভূমিকে কী বলে?",
    en_q: "What is a rocky, bare boulder desert known as in Sahara?",
    ans_bn: "হামাদা (Hamada)।",
    ans_en: "Hamada."
  },
  {
    num: 96,
    bn_q: "নুড়িময় বা কাঁকরময় মরুভূমিকে সাহারায় কী বলা হয়?",
    en_q: "What is a stony, pebble-covered desert called in the Sahara and Algeria?",
    ans_bn: "রেগ (Reg) বা সেরির (Serir)।",
    ans_en: "Reg or Serir."
  },
  {
    num: 97,
    bn_q: "মরু অঞ্চলের শুষ্ক নদীখাত বা অনিত্যবহ নদী উপত্যকাকে কী বলে?",
    en_q: "What dry, ephemeral river bed in arid desert regions is called?",
    ans_bn: "ওয়াদি (Wadi)।",
    ans_en: "Wadi."
  },
  {
    num: 98,
    bn_q: "মরুভূমি অঞ্চলে পর্বতের পাদদেশের মৃদু ঢালযুক্ত শিলা গঠিত ক্ষয়জাত সমভূমিকে কী বলে?",
    en_q: "What gently sloping bedrock erosion surface at the foot of desert mountains is called?",
    ans_bn: "পেডিমেন্ট (Pediment)।",
    ans_en: "Pediment."
  },
  {
    num: 99,
    bn_q: "পেডিমেন্টের নিম্নাংশে পলল সঞ্চয়ের ফলে গঠিত মৃদু ঢালু সমভূমিকে কী বলে?",
    en_q: "What broad continuous alluvial slope formed by coalescing fans below pediment is called?",
    ans_bn: "বাজাদা বা বহাদা (Bajada / Bahada)।",
    ans_en: "Bajada / Bahada."
  },
  {
    num: 100,
    bn_q: "মরু অঞ্চলের চারিপাশের উচ্চভূমি দ্বারা বেষ্টিত লবণাক্ত জলের অগভীর হ্রদকে কী বলে?",
    en_q: "What shallow ephemeral saline lake in a desert internal basin is called?",
    ans_bn: "প্লায়া (Playa)।",
    ans_en: "Playa."
  },
  {
    num: 101,
    bn_q: "রাজস্থানের থর মরুভূমির প্লায়া হ্রদগুলিকে স্থানীয় ভাষায় কী বলা হয়?",
    en_q: "What are the seasonal saline playa lakes locally called in Thar Desert of Rajasthan?",
    ans_bn: "ধান্দ (Dhand)।",
    ans_en: "Dhand."
  },
  {
    num: 102,
    bn_q: "রাজস্থানের বৃহত্তম লবণাক্ত জলের প্লায়া হ্রদ কোনটি?",
    en_q: "Which is the largest inland saline playa lake in Rajasthan?",
    ans_bn: "সম্বর হ্রদ (Sambhar Lake)।",
    ans_en: "Sambhar Lake."
  },
  {
    num: 103,
    bn_q: "থর মরুভূমির চলমান ও স্থানান্তরশীল বালিয়াড়িগুলিকে কী বলা হয়?",
    en_q: "What are the shifting, migrating sand dunes called in the Thar Desert?",
    ans_bn: "ধ্রিয়ান (Dhrian)।",
    ans_en: "Dhrian."
  },
  {
    num: 104,
    bn_q: "বায়ু ও জলধারার মিলিত কার্যে গঠিত তিনটি প্রধান ভূমিরূপের নাম লেখো।",
    en_q: "Name three major landforms formed by joint action of wind and running water in deserts.",
    ans_bn: "ওয়াদি (Wadi), পেডিমেন্ট (Pediment) ও বাজাদা (Bajada)।",
    ans_en: "Wadi, Pediment, and Bajada."
  },
  {
    num: 105,
    bn_q: "প্লায়া হ্রদের তলদেশে ক্যালসিয়াম ও সোডিয়াম লবণের স্তর জমে যে কঠিন আস্তরণ গড়ে ওঠে তাকে কী বলে?",
    en_q: "What encrustation of salts on a dry playa floor is called?",
    ans_bn: "স্যালিনা বা ক্ষারীয় সমভূমি (Salina / Salt flat)।",
    ans_en: "Salina / Salt flat."
  },
  {
    num: 106,
    bn_q: "বায়ু বাহিত অতি সূক্ষ্ম হলুদ বর্ণের পলিকণা বহুদূরে গিয়ে সঞ্চিত হলে তাকে কী বলে?",
    en_q: "What fine-grained yellowish wind-blown silt deposit transported far away is called?",
    ans_bn: "লোয়েস (Loess)।",
    ans_en: "Loess."
  },
  {
    num: 107,
    bn_q: "'লোয়েস' (Loess) শব্দটির মূল অর্থ কী?",
    en_q: "What is the literal meaning of the German origin word 'Loess'?",
    ans_bn: "স্থানচ্যুত বস্তু বা আলগা মাটি (Loose or unbonded material)।",
    ans_en: "Loose, uncompacted material (German 'Löss')."
  },
  {
    num: 108,
    bn_q: "গোবি মরুভূমির সূক্ষ্ম বালুকণা উড়ে এসে কোন নদীর অববাহিকায় সুবিশাল লোয়েস সমভূমি গঠন করেছে?",
    en_q: "Fine sand from the Gobi Desert formed a vast loess plateau in which river basin?",
    ans_bn: "চীনের হোয়াংহো নদীর অববাহিকায়।",
    ans_en: "Hwang-Ho (Yellow River) basin in China."
  },
  {
    num: 109,
    bn_q: "হোয়াংহো নদীকে 'পীত নদী' (Yellow River) বলা হয় কেন?",
    en_q: "Why is the Hwang-Ho river called the Yellow River?",
    ans_bn: "লোয়েস সমভূমির হলুদ বর্ণের সূক্ষ্ম পলি মিশ্রিত হয়ে নদীর জল হলুদ রঙ ধারণ করে।",
    ans_en: "Due to the suspension of yellow-colored loess silt in its river water."
  },
  {
    num: 110,
    bn_q: "মরুভূমি প্রসারণ রোধের জন্য সর্বাধিক কার্যকর পদক্ষেপ কোনটি?",
    en_q: "Which is the most effective measure to check desertification?",
    ans_bn: "মরুভূমির সীমানায় নিবিড় বনসৃজন বা সবুজ প্রাচীর (Shelterbelt) তৈরি করা।",
    ans_en: "Intensive afforestation / shelterbelt green wall along desert margins."
  },
  {
    num: 111,
    bn_q: "ভারতের সেন্ট্রাল অ্যারাইড জোন রিসার্চ ইনস্টিটিউট (CAZRI) কোথায় অবস্থিত?",
    en_q: "Where is the Central Arid Zone Research Institute (CAZRI) of India located?",
    ans_bn: "রাজস্থানের যোধপুরে।",
    ans_en: "Jodhpur in Rajasthan."
  },
  {
    num: 112,
    bn_q: "উপকূলবর্তী সমুদ্র তরঙ্গের প্রধান ক্ষয় প্রক্রিয়াগুলি কী কী?",
    en_q: "What are the primary erosional processes of coastal ocean waves?",
    ans_bn: "জলপ্রবাহ চাপ ক্ষয়, অবঘর্ষ ক্ষয়, দ্রবণ ক্ষয় ও ঘর্ষণ ক্ষয়।",
    ans_en: "Hydraulic action, Corrasion/Abrasion, Solution, and Attrition."
  },
  {
    num: 113,
    bn_q: "সমুদ্র তরঙ্গের ক্রমাগত আঘাতে উপকূলের খাড়া প্রাচীরকে কী বলে?",
    en_q: "What steep vertical rock wall formed by wave undercutting along coast is called?",
    ans_bn: "সমুদ্র ভৃগু (Sea cliff)।",
    ans_en: "Sea cliff."
  },
  {
    num: 114,
    bn_q: "সমুদ্র ভৃগুর পাদদেশে তরঙ্গ ক্ষয়ের ফলে সৃষ্ট মসৃণ উন্মুক্ত পাথুরে তলকে কী বলে?",
    en_q: "What flat bench cut into rock at the base of a retreating sea cliff is called?",
    ans_bn: "তরঙ্গ কর্তিত মঞ্চ (Wave-cut platform)।",
    ans_en: "Wave-cut platform."
  },
  {
    num: 115,
    bn_q: "উপকূলের নরম শিলা দ্রুত ক্ষয়প্রাপ্ত হয়ে সমুদ্রের দিকে প্রসারিত যে সংকীর্ণ জলভাগ গঠন করে তাকে কী বলে?",
    en_q: "What body of water partially enclosed by curved coast formed by softer rock erosion is called?",
    ans_bn: "উপসাগর বা কভ (Bay / Cove)।",
    ans_en: "Bay or Cove."
  },
  {
    num: 116,
    bn_q: "সমুদ্রের দিকে অভিক্ষিপ্ত খাড়া কঠিন শিলাপ্রাচীরকে কী বলে?",
    en_q: "What resistant rocky outcrop jutting out sharply into the sea is called?",
    ans_bn: "উ অন্তরীপ বা হেডল্যান্ড (Headland)।",
    ans_en: "Headland."
  },
  {
    num: 117,
    bn_q: "সমুদ্র ভৃগুর গায়ে তরঙ্গের আঘাতে সৃষ্ট সংকীর্ণ গহ্বরকে কী বলে?",
    en_q: "What hollow opening eroded into coastal headlands by wave action is called?",
    ans_bn: "সামুদ্রিক গুহা (Sea cave)।",
    ans_en: "Sea cave."
  },
  {
    num: 118,
    bn_q: "সামুদ্রিক গুহার ছাদ ধসে গিয়ে সৃষ্ট উল্লম্ব ছিদ্র যার মধ্য দিয়ে জল ফোয়ারার মতো বের হয় তাকে কী বলে?",
    en_q: "What coastal roof opening where pressurized spray spouts upward is called?",
    ans_bn: "ব্লো হোল বা গ্লুপ (Blowhole / Gloup)।",
    ans_en: "Blowhole or Gloup."
  },
  {
    num: 119,
    bn_q: "একটি হেডল্যান্ডের দুই পাশের সামুদ্রিক গুহা পরস্পর সংযুক্ত হলে খিলানের মতো যে ভূমিরূপ তৈরি হয় তাকে কী বলে?",
    en_q: "What arch-like landform is formed when two caves join through a headland?",
    ans_bn: "প্রাকৃতিক সামুদ্রিক খিলান (Sea arch)।",
    ans_en: "Sea arch."
  },
  {
    num: 120,
    bn_q: "সামুদ্রিক খিলানের ছাদ ভেঙে গিয়ে সাগরের মাঝে দাঁড়িয়ে থাকা বিচ্ছিন্ন খাড়া শিলা স্তম্ভকে কী বলে?",
    en_q: "What isolated vertical rock column left standing offshore after an arch collapses is called?",
    ans_bn: "স্ট্যাক (Stack)।",
    ans_en: "Stack."
  },
  {
    num: 121,
    bn_q: "স্ট্যাক ক্রমাগত ক্ষয়প্রাপ্ত হয়ে ক্ষুদ্র ও প্রায় জলের তলায় অবস্থান করলে তাকে কী বলে?",
    en_q: "What low wave-worn stump of an eroded stack is called?",
    ans_bn: "স্টাম্প (Stump)।",
    ans_en: "Stump."
  },
  {
    num: 122,
    bn_q: "উপকূলের সমান্তরালে বা কোণাকুণি সমুদ্র তরঙ্গের সঞ্চয়কার্যে গঠিত বাঁধকে কী বলে?",
    en_q: "What linear ridge of sand deposited parallel or oblique to coastline is called?",
    ans_bn: "রোদ্ধ সৈকত বা বালুকা বাঁধ (Bar / Spit / Barrier bar)।",
    ans_en: "Bar, Spit, or Barrier bar."
  },
  {
    num: 123,
    bn_q: "উপকূলের কোনো岬 বা অন্তরীপ থেকে সাগরের দিকে প্রসারিত একমুখ খোলা বালুকা বাঁধকে কী বলে?",
    en_q: "What narrow sand ridge projecting from land with one end attached to shore and other in sea is called?",
    ans_bn: "স্পিট (Spit)।",
    ans_en: "Spit."
  },
  {
    num: 124,
    bn_q: "পৃথিবীর বৃহত্তম লোয়েস সমভূমি কোনটি?",
    en_q: "What is the name of the largest Loess plain in the world?",
    ans_bn: "চীনের হোয়াংহো অববাহিকার লোয়েস সমভূমি (The Loess Plateau of China)।",
    ans_en: "The Loess Plateau of China is the largest loess-deposit region in the world."
  },
  {
    num: 125,
    bn_q: "কেম-এর আকার কেমন হয়?",
    en_q: "What is the shape of a Kame?",
    ans_bn: "কেম সাধারণত অসম টিলা বা ছোট শঙ্কু আকৃতির স্তূপের মতো হয়, যা হিমবাহ বাহিত বালি, কাঁকর ও পলি সঞ্চয়ের ফলে গঠিত হয়।",
    ans_en: "A Kame generally has an irregular, small hill-like or mound-like shape. It is formed by the deposition of sand, gravel and silt carried by glacial meltwater."
  }
];

async function seed() {
  const dbPath = path.resolve(process.cwd(), 'geography_exam.db');
  const db = new DatabaseSync(dbPath);

  console.log('Seeding 125 Chapter 1 SAQ questions into SQLite...');

  // Find max ID currently in questions table so we preserve every existing question
  const maxRow = db.prepare('SELECT MAX(id) as max_id FROM questions').get() as any;
  let nextId = Math.max(300, (maxRow?.max_id || 0) + 1);

  const insertStmt = db.prepare(`
    INSERT OR REPLACE INTO questions
    (id, topic_id, pyq_year, is_pyq, question_text, question_text_en, option_a, option_a_en,
     option_b, option_b_en, option_c, option_c_en, option_d, option_d_en, correct_option,
     explanation, explanation_en, difficulty, is_descriptive, marks, model_answer,
     model_answer_en, marking_scheme, marking_scheme_en, q_type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertedQuestions: any[] = [];

  db.exec('BEGIN IMMEDIATE;');
  for (const item of CHAPTER1_SAQ_125) {
    // Check if question text already exists in topic_id = 1
    const existing = db.prepare('SELECT id FROM questions WHERE topic_id = 1 AND question_text = ?').get(item.bn_q) as any;
    const qId = existing ? existing.id : nextId++;

    insertStmt.run(
      qId,
      1, // Topic 1: ১ম অধ্যায়: বহির্জাত প্রক্রিয়া ও তাদের দ্বারা সৃষ্ট ভূমিরূপ
      '',
      0,
      item.bn_q,
      item.en_q,
      '', '', '', '', '', '', '', '',
      item.ans_bn,
      `উত্তর: ${item.ans_bn}`,
      `Answer: ${item.ans_en}`,
      'Medium',
      0,
      1,
      item.ans_bn,
      item.ans_en,
      '১ নম্বরের অতিসংক্ষিপ্ত উত্তর',
      '1 mark short answer',
      'SAQ'
    );

    insertedQuestions.push({
      id: qId,
      topic_id: 1,
      pyq_year: '',
      is_pyq: 0,
      question_text: item.bn_q,
      question_text_en: item.en_q,
      option_a: '',
      option_a_en: '',
      option_b: '',
      option_b_en: '',
      option_c: '',
      option_c_en: '',
      option_d: '',
      option_d_en: '',
      correct_option: item.ans_bn,
      explanation: `উত্তর: ${item.ans_bn}`,
      explanation_en: `Answer: ${item.ans_en}`,
      difficulty: 'Medium',
      is_descriptive: 0,
      marks: 1,
      model_answer: item.ans_bn,
      model_answer_en: item.ans_en,
      marking_scheme: '১ নম্বরের অতিসংক্ষিপ্ত উত্তর',
      marking_scheme_en: '1 mark short answer',
      q_type: 'SAQ',
      updated_at: new Date().toISOString()
    });
  }
  db.exec('COMMIT;');

  const totalAfter = (db.prepare('SELECT count(*) as c FROM questions WHERE topic_id = 1').get() as any).c;
  const grandTotal = (db.prepare('SELECT count(*) as c FROM questions').get() as any).c;
  console.log(`Successfully seeded! Chapter 1 now has ${totalAfter} questions. Grand total in app: ${grandTotal}.`);

  // Now sync to Cloud Firestore
  try {
    const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
    if (fs.existsSync(configPath)) {
      console.log('Syncing all 125 SAQ questions to Cloud Firestore in batches...');
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      const app = !getApps().length ? initializeApp(config) : getApp();
      const cdb = getFirestore(app, config.firestoreDatabaseId);

      const chunkSize = 250;
      for (let i = 0; i < insertedQuestions.length; i += chunkSize) {
        const chunk = insertedQuestions.slice(i, i + chunkSize);
        const batch = writeBatch(cdb);
        for (const q of chunk) {
          const ref = doc(cdb, 'questions', String(q.id));
          batch.set(ref, q, { merge: true });
        }
        await batch.commit();
      }
      console.log('All 125 questions successfully saved and permanently verified in Cloud Firestore!');
    }
  } catch (cloudErr) {
    console.error('Firestore batch upload error:', cloudErr);
  }

  // Also update public/database_snapshot_persistent.json
  try {
    const questions = db.prepare('SELECT * FROM questions').all();
    const topics = db.prepare('SELECT * FROM topics').all();
    const users = db.prepare('SELECT id, username, password, role, full_name, school_name, class_grade, phone, district, approved, is_admin, referral_code, referral_count, mp_exam_year, created_at FROM users').all();
    const payments = db.prepare('SELECT * FROM payments').all();
    const chapter_answer_sheets = db.prepare('SELECT * FROM chapter_answer_sheets').all();
    const mock_tests = db.prepare('SELECT * FROM mock_tests').all();
    const system_settings = db.prepare('SELECT * FROM system_settings').all();

    const snapshot = {
      timestamp: new Date().toISOString(),
      total_questions: questions.length,
      total_users: users.length,
      total_answer_sheets: chapter_answer_sheets.length,
      total_payments: payments.length,
      topics,
      questions,
      users,
      payments,
      chapter_answer_sheets,
      mock_tests,
      system_settings
    };

    const snapshotPath = path.resolve(process.cwd(), 'public', 'database_snapshot_persistent.json');
    fs.writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2), 'utf-8');
    console.log(`Updated database_snapshot_persistent.json with ${questions.length} total questions.`);
  } catch (snapErr) {
    console.error('Error updating snapshot:', snapErr);
  }
}

seed().then(() => {
  console.log('Done!');
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
