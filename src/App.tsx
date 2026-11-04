/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Globe, BookOpen, HelpCircle, FileText, CheckCircle, AlertTriangle,
  Send, Share2, DollarSign, LogOut, User, School, Sparkles, Download,
  ExternalLink, Search, Trash2, Eye, EyeOff, Lock, Phone, ArrowRight,
  GraduationCap, Check, MapPin, UserPlus, LogIn, KeyRound, Shield, Info,
  ShieldCheck, UserCheck, MessageSquare, Award, RefreshCw, Upload,
  CheckSquare, Layers, Copy, Crown, X, Menu, Smartphone
} from 'lucide-react';

import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { MobileBottomNav } from './components/MobileBottomNav';
import { OfflineIndicator } from './components/OfflineIndicator';
import { SchoolProspectusSection } from './components/SchoolProspectusSection';
import { SecurePdfViewer } from './components/SecurePdfViewer';
import { AdminApprovals } from './components/AdminApprovals';
import { WhatsAppChannelModal, WhatsAppChannelBanner } from './components/WhatsAppChannelModal';
import { SecureMockReaderModal } from './components/SecureMockReaderModal';
import { testFirestoreConnection } from './firebase';


// ============================================================================
// OFFLINE BENGALI→ENGLISH DICTIONARY & HELPERS
// ============================================================================
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

function hasBengali(text: string): boolean {
  if (!text) return false;
  return /[\u0980-\u09FF]/.test(text);
}

function googleTranslateLink(text: string): string {
  return `https://translate.google.com/?sl=bn&tl=en&text=${encodeURIComponent(text.slice(0, 500))}&op=translate`;
}

interface UserSession {
  username: string;
  role: 'student' | 'teacher' | 'admin';
  full_name: string;
  school_name: string;
  phone: string;
  district: string;
  approved: number;
  is_admin: number;
  is_head_admin?: boolean;
  admin_title?: string;
  original_role?: string;
  referral_code?: string;
  referral_count?: number;
  mp_exam_year?: number;
}

const WB_DISTRICTS = [
  'Alipurduar (আলিপুরদুয়ার)',
  'Bankura (বাঁকুড়া)',
  'Birbhum (বীরভূম)',
  'Cooch Behar (কোচবিহার)',
  'Dakshin Dinajpur (দক্ষিণ দিনাজপুর)',
  'Darjeeling (দার্জিলিং)',
  'Hooghly (হুগলি)',
  'Howrah (হাওড়া)',
  'Jalpaiguri (জলপাইগুড়ি)',
  'Jhargram (ঝাড়গ্রাম)',
  'Kalimpong (কালিম্পং)',
  'Kolkata (কলকাতা)',
  'Malda (মালদা)',
  'Murshidabad (মুর্শিদাবাদ)',
  'Nadia (নদিয়া)',
  'North 24 Parganas (উত্তর ২৪ পরগনা)',
  'Paschim Bardhaman (পশ্চিম বর্ধমান)',
  'Paschim Medinipur (পশ্চিম মেদিনীপুর)',
  'Purba Bardhaman (পূর্ব বর্ধমান)',
  'Purba Medinipur (পূর্ব মেদিনীপুর)',
  'Purulia (পুরুলিয়া)',
  'South 24 Parganas (দক্ষিণ ২৪ পরগনা)',
  'Uttar Dinajpur (উত্তর দিনাজপুর)'
];

export default function App() {
  const [language, setLanguage] = useState<'Bengali' | 'English'>('Bengali');
  const [user, setUser] = useState<UserSession | null>(null);
  const [adminViewMode, setAdminViewMode] = useState<'Admin Control Panel' | 'Teacher View' | 'Student View'>('Admin Control Panel');
  const [activeNav, setActiveNav] = useState<string>('Dashboard');
  const [referredBy, setReferredBy] = useState<string>('');

  // App data state
  const [settings, setSettings] = useState<Record<string, string>>({
    portal_url: 'https://geography-exam-app.streamlit.app',
    upi_id: 'shawonkar6466-1@oksbi',
    full_access_price: '399',
    bundle_price: '499'
  });
  const [topics, setTopics] = useState<{ id: number; name: string }[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<number>(1);
  const [purchases, setPurchases] = useState<{ item_type: string; item_id: string }[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [mockTests, setMockTests] = useState<any[]>([]);
  const [myDoubts, setMyDoubts] = useState<any[]>([]);
  const [examSubmissions, setExamSubmissions] = useState<any[]>([]);
  const [askCornerList, setAskCornerList] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allDoubts, setAllDoubts] = useState<any[]>([]);
  const [teacherSubmissions, setTeacherSubmissions] = useState<any[]>([]);
  const [paymentsList, setPaymentsList] = useState<any[]>([]);
  const [promoRequests, setPromoRequests] = useState<any[]>([]);
  const [studentScores, setStudentScores] = useState<any[]>([]);

  // Selected answers state for MCQ practice
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  // Loading & notification states
  const [loading, setLoading] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Auth form states
  const [authTab, setAuthTab] = useState<'login' | 'student_reg' | 'teacher_reg'>('login');
  const [loginRole, setLoginRole] = useState<'Student' | 'Teacher' | 'Admin'>('Student');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Register form states
  const [regName, setRegName] = useState('');
  const [regSchool, setRegSchool] = useState('');
  const [regClass, setRegClass] = useState('Class 10 (Madhyamik)');
  const [regMpYear, setRegMpYear] = useState('2027');
  const [regPhone, setRegPhone] = useState('');
  const [regDistrict, setRegDistrict] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRef, setRegRef] = useState('');


  // Interactive Doubt Modal State for any question
  const [doubtModal, setDoubtModal] = useState<{
    isOpen: boolean;
    questionId: number;
    questionNumber: number;
    questionText: string;
    doubtText: string;
  } | null>(null);

  // Extract Engine state
  const [extractSrc, setExtractSrc] = useState<'Manual' | 'File' | 'URL'>('Manual');
  const [extractText, setExtractText] = useState('');
  const [extractUrl, setExtractUrl] = useState('');
  const [extractedResult, setExtractedResult] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active Chapter/Marks/Tier for DRM Reader direct routing
  const [activeChapterForDrm, setActiveChapterForDrm] = useState<number>(1);
  const [activeMarksForDrm, setActiveMarksForDrm] = useState<'2m' | '3m' | '5m'>('5m');
  const [activeTierForDrm, setActiveTierForDrm] = useState<'paid' | 'free'>('paid');

  // WhatsApp Channel Modal State
  const [showWhatsAppModal, setShowWhatsAppModal] = useState<boolean>(false);

  // In-Portal Secure Mock Reader Modal State
  const [readingMock, setReadingMock] = useState<any>(null);

  // Restore persistent login session & read URL query params on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('wbbse_geo_user_session');
      if (saved) {
        const u = JSON.parse(saved);
        if (u && u.username) {
          // Check validity for students based on MP Examination Year
          if (u.role === 'student' && u.mp_exam_year) {
            const today = new Date();
            const expiryDate = new Date(`${u.mp_exam_year}-03-31T23:59:59`);
            if (today > expiryDate) {
              localStorage.removeItem('wbbse_geo_user_session');
              setAlertMsg({
                type: 'error',
                text: `⚠️ আপনার মাধ্যমিক পরীক্ষার ব্যাচ (${u.mp_exam_year}) এর মেয়াদ ৩১ মার্চ ${u.mp_exam_year}-এ শেষ হয়েছে। দয়া করে পরবর্তী সেশনের জন্য পুনরায় রেজিস্ট্রেশন করুন বা অ্যাডমিনের সাথে যোগাযোগ করুন।`
              });
            } else {
              setUser(u);
            }
          } else {
            setUser(u);
          }
        }
      }
    } catch (e) {
      console.error('Session load error', e);
    }

    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setReferredBy(ref);
      setRegRef(ref);
    }
    fetchSettings();
    fetchTopics();
    testFirestoreConnection().catch(console.error);
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserPurchases();
      fetchNotifications();
      fetchMockTests();
      if (user.role === 'admin' || user.role === 'teacher') {
        fetchAllUsers();
      }
    }
  }, [user]);

  useEffect(() => {
    if (selectedTopicId) {
      fetchQuestions(selectedTopicId);
    }
  }, [selectedTopicId]);

  const T = (bn: string, en: string) => (language === 'Bengali' ? bn : en);

  const getQText = (bn: string, en: string) => {
    if (language === 'English') {
      return (en && en.trim()) ? en.trim() : (bn || '');
    }
    return (bn && bn.trim()) ? bn.trim() : (en || '');
  };

  const getEffectiveRole = () => {
    if (!user) return 'student';
    if (user.role === 'admin') {
      if (adminViewMode === 'Teacher View') return 'teacher';
      if (adminViewMode === 'Student View') return 'student';
      return 'admin';
    }
    return user.role;
  };

  const effectiveRole = getEffectiveRole();

  const hasFullAccess = () => {
    if (!Array.isArray(purchases)) return false;
    return purchases.some(p => (p.item_type === 'FULL_ACCESS' && p.item_id === 'ALL') || (p.item_type === 'BUNDLE' && p.item_id === 'ALL'));
  };

  const hasBundleAccess = () => {
    if (!Array.isArray(purchases)) return false;
    return purchases.some(p => p.item_type === 'BUNDLE' && p.item_id === 'ALL');
  };

  const hasMockAccess = (type: string, id: number | string) => {
    if (hasBundleAccess()) return true;
    if (!Array.isArray(purchases)) return false;
    return purchases.some(p => p.item_type === type && (p.item_id === String(id) || p.item_id === 'ALL'));
  };

  // API calls
  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data && typeof data === 'object') {
        setSettings(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchTopics = async () => {
    try {
      const res = await fetch('/api/topics');
      const data = await res.json();
      if (Array.isArray(data)) {
        setTopics(data);
        if (data.length > 0 && !selectedTopicId) {
          setSelectedTopicId(data[0].id);
        }
      } else {
        setTopics([]);
      }
    } catch (e) {
      console.error(e);
      setTopics([]);
    }
  };

  const fetchQuestions = async (topicId: number) => {
    try {
      const res = await fetch(`/api/questions?topic_id=${topicId}`);
      const data = await res.json();
      setQuestions(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setQuestions([]);
    }
  };

  const fetchUserPurchases = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/user_purchases?username=${encodeURIComponent(user.username)}`);
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setPurchases(data);
        }
      }
    } catch (e) {
      console.error('fetchUserPurchases error:', e);
    }
  };

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/admin_notifications?username=${encodeURIComponent(user.username)}`);
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setNotifications([]);
    }
  };

  const fetchMockTests = async () => {
    try {
      const res = await fetch('/api/mock_tests');
      const data = await res.json();
      setMockTests(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setMockTests([]);
    }
  };

  const fetchMyDoubts = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/student_doubts?username=${encodeURIComponent(user.username)}`);
      const data = await res.json();
      setMyDoubts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setMyDoubts([]);
    }
  };

  const fetchExamSubmissions = async () => {
    if (!user) return;
    try {
      const endpoint = user.role === 'admin'
        ? '/api/exam_submissions'
        : (user.role === 'teacher' ? `/api/exam_submissions?checker_username=${encodeURIComponent(user.username)}` : `/api/exam_submissions?student_username=${encodeURIComponent(user.username)}`);
      const res = await fetch(endpoint);
      const data = await res.json();
      setExamSubmissions(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setExamSubmissions([]);
    }
  };

  const fetchAskCorner = async () => {
    if (!user) return;
    try {
      const endpoint = user.role === 'admin' ? '/api/ask_corner' : `/api/ask_corner?username=${encodeURIComponent(user.username)}`;
      const res = await fetch(endpoint);
      const data = await res.json();
      setAskCornerList(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setAskCornerList([]);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setAllUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setAllUsers([]);
    }
  };

  const fetchAllDoubts = async () => {
    try {
      const res = await fetch('/api/student_doubts');
      const data = await res.json();
      setAllDoubts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setAllDoubts([]);
    }
  };

  const fetchTeacherSubmissions = async () => {
    if (!user) return;
    try {
      const endpoint = user.role === 'admin' ? '/api/teacher_submissions' : `/api/teacher_submissions?teacher_username=${encodeURIComponent(user.username)}`;
      const res = await fetch(endpoint);
      const data = await res.json();
      setTeacherSubmissions(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setTeacherSubmissions([]);
    }
  };

  const fetchPayments = async () => {
    if (!user) return;
    try {
      const endpoint = user.role === 'admin' ? '/api/payments' : `/api/payments?username=${encodeURIComponent(user.username)}`;
      const res = await fetch(endpoint);
      const data = await res.json();
      setPaymentsList(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setPaymentsList([]);
    }
  };

  const fetchPromoRequests = async () => {
    try {
      const res = await fetch('/api/promo_requests');
      const data = await res.json();
      setPromoRequests(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setPromoRequests([]);
    }
  };

  const fetchStudentScores = async () => {
    try {
      const res = await fetch('/api/student_scores');
      const data = await res.json();
      setStudentScores(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setStudentScores([]);
    }
  };

  // Switch tab triggers
  useEffect(() => {
    if (activeNav === '❓ My Help / Doubt Requests' || activeNav === 'My Doubts') {
      fetchMyDoubts();
    } else if (activeNav === '📝 My Exam Submissions' || activeNav === '📝 Check Assigned Answer Sheets' || activeNav === '📝 Exam Answer Sheet Checking') {
      fetchExamSubmissions();
    } else if (activeNav === '💡 Ask Corner (Suggestions)' || activeNav === '💡 Ask Corner Suggestions') {
      fetchAskCorner();
    } else if (activeNav === '❓ Student Doubt Assignment Hub') {
      fetchAllDoubts();
    } else if (activeNav === '📤 Teacher Submissions Review' || activeNav === '📤 Send Suggestions to Admin') {
      fetchTeacherSubmissions();
    } else if (activeNav === '💳 Payment Verifications' || activeNav === '💳 Pricing & Payment') {
      fetchPayments();
    } else if (activeNav === '🎟️ Promo Code Requests') {
      fetchPromoRequests();
    } else if (activeNav === '📊 Analytics & Track Records' || activeNav === '👨‍🏫 Student Track Records') {
      fetchStudentScores();
    } else if (activeNav === '🛡️ User Approvals') {
      fetchAllUsers();
    }
  }, [activeNav]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlertMsg(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: loginRole,
          username: loginUsername.trim(),
          password: loginPassword
        })
      });
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি বা সাময়িক সমস্যা হচ্ছে। অনুগ্রহ করে কয়েক সেকেন্ড পর আবার চেষ্টা করুন।');
      }
      const data = await res.json();
      if (!res.ok) {
        setAlertMsg({ type: 'error', text: data.error || 'Login failed' });
      } else {
        setUser(data.user);
        try {
          localStorage.setItem('wbbse_geo_user_session', JSON.stringify(data.user));
        } catch {}
        setAlertMsg({ type: 'success', text: `Welcome back, ${data.user.full_name}!` });
        setActiveNav(data.user.role === 'admin' ? '📢 Send Student Notifications' : (data.user.role === 'teacher' ? '📥 Assigned Student Doubts' : '🏠 Dashboard'));
      }
    } catch (e: any) {
      setAlertMsg({ type: 'error', text: e.message || 'Login error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (role: 'student' | 'teacher', e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlertMsg(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          name: regName,
          school: regSchool,
          class_grade: role === 'student' ? regClass : 'Faculty',
          mp_exam_year: role === 'student' ? Number(regMpYear) : undefined,
          phone: regPhone,
          district: regDistrict,
          password: regPassword,
          referral_code: regRef
        })
      });
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি বা সাময়িক সমস্যা হচ্ছে। অনুগ্রহ করে কয়েক সেকেন্ড পর আবার চেষ্টা করুন।');
      }
      const data = await res.json();
      if (!res.ok) {
        setAlertMsg({ type: 'error', text: data.error || 'Registration failed' });
      } else {
        // Safe database persistence: account is saved with approved = 0
        setLoginUsername(regPhone);
        setLoginRole(role === 'student' ? 'Student' : 'Teacher');
        setRegPassword('');
        setAlertMsg({
          type: 'success',
          text: role === 'student'
            ? `🎉 আপনার শিক্ষার্থী রেজিস্ট্রেশন সফল হয়েছে! ডেটা ডেটাবেজে সম্পূর্ণ সুরক্ষিতভাবে জমা হয়েছে। অ্যাডমিন অনুমোদন (Admin Approval) সম্পন্ন করলেই আপনি আপনার ফোন নম্বর (${regPhone}) ও পাসওয়ার্ড দিয়ে লগইন করতে পারবেন।`
            : `🎉 আপনার শিক্ষক রেজিস্ট্রেশন সফল হয়েছে! ডেটা ডেটাবেজে সম্পূর্ণ সুরক্ষিতভাবে জমা হয়েছে। অ্যাডমিন অনুমোদন (Admin Approval) সম্পন্ন করার পর আপনি লগইন করতে পারবেন।`
        });
        setAuthTab('login');
      }
    } catch (e: any) {
      setAlertMsg({ type: 'error', text: e.message || 'Registration error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem('wbbse_geo_user_session');
    } catch {}
    setPurchases([]);
    setNotifications([]);
    setActiveNav('🏠 Dashboard');
  };

  const openAskDoubt = (qId: number, idx: number, qText?: string) => {
    if (!user) {
      setAlertMsg({
        type: 'info',
        text: 'অনুগ্রহ করে প্রশ্ন সম্পর্কে জিজ্ঞাসা করার জন্য প্রথমে সাইন-ইন বা লগইন করুন।'
      });
      setAuthTab('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setDoubtModal({
      isOpen: true,
      questionId: qId,
      questionNumber: idx,
      questionText: qText || `Question #${idx}`,
      doubtText: ''
    });
  };

  const submitDoubtModal = async () => {
    if (!doubtModal || !user) return;
    try {
      const res = await fetch('/api/student_doubts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_username: user.username,
          student_name: user.full_name,
          question_id: doubtModal.questionId,
          doubt_text: doubtModal.doubtText.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Request failed');
      } else {
        alert(`🎉 Q${doubtModal.questionNumber} সম্পর্কে আপনার প্রশ্ন সফলভাবে অ্যাডমিন/স্যারের কাছে পাঠানো হয়েছে! ড্যাশবোর্ডের "❓ My Help / Doubt Requests" সেকশনে উত্তর পেয়ে যাবেন।`);
        setDoubtModal(null);
        fetchMyDoubts();
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  const downloadTextFile = (filename: string, textOrData: any) => {
    let blob: Blob;
    if (typeof textOrData === 'object' && textOrData !== null && !(textOrData instanceof Blob)) {
      const values = Object.values(textOrData) as number[];
      const bytes = new Uint8Array(values);
      blob = new Blob([bytes], { type: 'application/octet-stream' });
    } else if (typeof textOrData === 'string' && textOrData.startsWith('data:')) {
      const arr = textOrData.split(',');
      const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
      const bstr = atob(arr[1] || '');
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      blob = new Blob([u8arr], { type: mime });
    } else {
      blob = new Blob([String(textOrData || '')], { type: 'text/plain;charset=utf-8' });
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // Nav items per role
  const getNavItems = () => {
    if (effectiveRole === 'student') {
      return [
        '🏠 Dashboard',
        '🔒 Master 2/3/5M PDF Reader (DRM)',
        '📖 Practice Center',
        '❓ My Help / Doubt Requests',
        '📄 Mock Tests & Suggestions',
        '📝 My Exam Submissions',
        '📁 Madhyamik Drive Papers',
        '📄 School & Teacher Prospectus PDF',
        '🎁 Refer & Earn (₹3,500 Prize)',
        '💡 Ask Corner (Suggestions)',
        '💳 Pricing & Payment'
      ];
    } else if (effectiveRole === 'teacher') {
      return [
        '📥 Assigned Student Doubts',
        '🔒 Master 2/3/5M PDF Reader (DRM)',
        '📖 Question Bank Manager',
        '📝 Check Assigned Answer Sheets',
        '📤 Send Suggestions to Admin',
        '📄 School & Teacher Prospectus PDF',
        '👨‍🏫 Student Track Records',
        '📁 Madhyamik Drive Papers',
        '🎁 Referral Rewards (₹7,500 Prize)',
        '💡 Ask Corner (Suggestions)',
        '💳 Pricing & Payment'
      ];
    } else {
      return [
        '📢 Send Student Notifications',
        '🛡️ PDF Security & DRM Approvals',
        '🔒 Master 2/3/5M PDF Reader (DRM)',
        '🎟️ Promo Code Requests',
        '🛡️ User Approvals',
        '📄 School & Teacher Prospectus PDF',
        '❓ Student Doubt Assignment Hub',
        '📖 Question Bank Manager',
        '📄 Upload Mock Tests & Suggestions',
        '📤 Teacher Submissions Review',
        '💡 Ask Corner Suggestions',
        '💳 Payment Verifications',
        '📝 Exam Answer Sheet Checking',
        '📁 Madhyamik Drive Papers',
        '📊 Analytics & Track Records',
        '🎁 Referral Rewards & Links'
      ];
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-100 text-slate-900">
      {/* Offline Status Toast */}
      <OfflineIndicator language={language} />

      {/* ======================================================================== */}
      {/* MOBILE-FIRST TOP APP BAR (Visible only on mobile phones < md)            */}
      {/* ======================================================================== */}
      <header className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-3.5 py-2.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-2xl leading-none">🌍</span>
          <div>
            <h1 className="text-xs font-black text-slate-900 tracking-tight leading-tight">
              WBBSE Geo Lab
            </h1>
            <p className="text-[10px] text-blue-700 font-bold leading-tight">
              {user ? `${user.full_name?.split(' ')[0]} • ${user.role?.toUpperCase()}` : T("দশম শ্রেণি ভূগোল পোর্টাল", "Class 10 Portal")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language quick pill */}
          <button
            type="button"
            onClick={() => setLanguage(language === 'Bengali' ? 'English' : 'Bengali')}
            className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-extrabold text-slate-700 border border-slate-300 transition"
          >
            {language === 'Bengali' ? 'ENG' : 'বাংলা'}
          </button>

          {/* Mobile Drawer Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 flex items-center justify-center hover:bg-blue-100 active:scale-95 transition"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ======================================================================== */}
      {/* MOBILE SLIDE-OVER NAVIGATION DRAWER                                      */}
      {/* ======================================================================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-5/6 max-w-sm bg-white h-full shadow-2xl z-10 flex flex-col justify-between p-4 overflow-y-auto">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌍</span>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">WBBSE Geo Lab</h3>
                    <p className="text-[10px] text-slate-500 font-medium">{T("মোবাইল মেনু ও নেভিগেশন", "Mobile Menu & Navigation")}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Profile Card (if logged in) */}
              {user && (
                <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50/90 to-blue-50/90 border border-indigo-200 text-xs shadow-2xs">
                  <div className="font-extrabold text-slate-900 text-sm">{user.full_name}</div>
                  <div className="text-[11px] font-bold text-indigo-700 mt-0.5">
                    {user.is_head_admin || user.username === 'admin' || user.phone === '7001257277'
                      ? '👑 HEAD ADMIN (শাওন কর)'
                      : user.is_admin === 1
                      ? '⭐ CO-ADMIN (শিক্ষক)'
                      : user.role === 'teacher'
                      ? '👨‍🏫 শিক্ষক (Teacher)'
                      : `🎓 শিক্ষার্থী (MP ${user.mp_exam_year || 2027})`}
                  </div>
                  {user.school_name && (
                    <div className="text-[11px] text-slate-600 mt-1 truncate">
                      🏫 {user.school_name} {user.district ? `(${user.district})` : ''}
                    </div>
                  )}
                  {user.role === 'student' && (
                    <div className="mt-2 pt-1.5 border-t border-indigo-200/60 text-[10px] font-semibold text-indigo-900">
                      📅 বৈধতা: ৩১ মার্চ {user.mp_exam_year || 2027} পর্যন্ত
                    </div>
                  )}
                </div>
              )}

              {/* Language Switcher in Drawer */}
              <div className="mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  🌐 {T("ভাষা নির্বাচন করুন", "Language")}
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLanguage('Bengali')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                      language === 'Bengali' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-300'
                    }`}
                  >
                    বাংলা
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('English')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                      language === 'English' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-300'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              {/* Admin Super-Control Switcher if admin */}
              {user && user.role === 'admin' && (
                <div className="mb-4 p-2.5 rounded-xl border border-amber-300 bg-amber-50">
                  <label className="text-[10px] font-black text-amber-900 uppercase tracking-wider mb-1.5 block">
                    👑 Admin View Switcher
                  </label>
                  <div className="flex flex-col gap-1">
                    {(['Admin Control Panel', 'Teacher View', 'Student View'] as const).map(mode => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => {
                          setAdminViewMode(mode);
                          setActiveNav(mode === 'Admin Control Panel' ? '📢 Send Student Notifications' : (mode === 'Teacher View' ? '📥 Assigned Student Doubts' : '🏠 Dashboard'));
                          setMobileMenuOpen(false);
                        }}
                        className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-between ${
                          adminViewMode === mode ? 'bg-amber-600 text-white' : 'bg-white text-slate-800 border border-amber-200'
                        }`}
                      >
                        <span>{mode}</span>
                        {adminViewMode === mode && <span className="text-[9px]">ACTIVE</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* All Navigation Items (Touch-Friendly List) */}
              {user && (
                <nav className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1 mb-1 block">
                    {T('🎯 সমস্ত মেনু ও ফিচার', 'All Features')}
                  </label>
                  {getNavItems().map(item => (
                    <button
                      key={item}
                      onClick={() => {
                        setActiveNav(item);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                        activeNav === item
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-700 hover:bg-slate-100 active:bg-slate-200'
                      }`}
                    >
                      <span className="truncate">{item}</span>
                    </button>
                  ))}
                </nav>
              )}

              {!user && (
                <div className="space-y-2 mt-2">
                  <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 leading-relaxed">
                    💡 {T("লগইন বা রেজিস্টার করে দশম শ্রেণির সম্পূর্ণ ভূগোল প্রশ্ন ও মক টেস্টে অংশ নিন।", "Sign in or register to access full geography practice.")}
                  </div>
                </div>
              )}
            </div>

            {user && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full mt-4 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
              >
                <LogOut className="w-4 h-4" />
                {T("লগআউট (Logout)", "Logout")}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ======================================================================== */}
      {/* DESKTOP SIDEBAR (Hidden on phones, visible on md: screens and up)       */}
      {/* ======================================================================== */}
      <aside className="hidden md:flex md:w-80 bg-white border-r border-slate-300 p-5 shrink-0 flex-col justify-between md:sticky md:top-0 md:h-screen md:overflow-y-auto">
        <div>
          <div className="text-center mb-4">
            <span className="text-4xl block mb-1">🌍</span>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">WBBSE Geo Lab Portal</h2>
          </div>

          {/* Language Selector */}
          <div className="mb-5 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              {T("🌐 Language / ভাষা", "🌐 Language")}
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLanguage('Bengali')}
                className={`flex-1 py-1.5 px-3 rounded-md text-sm font-bold border transition ${
                  language === 'Bengali'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                বাংলা (Bengali)
              </button>
              <button
                type="button"
                onClick={() => setLanguage('English')}
                className={`flex-1 py-1.5 px-3 rounded-md text-sm font-bold border transition ${
                  language === 'English'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Features info for unauthenticated visitors */}
          {!user && (
            <div className="space-y-3.5 mb-6">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-1.5 text-blue-900 font-bold text-xs uppercase tracking-wider mb-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{T("পর্ষদ অনুমোদিত সিলেবাস", "WBBSE Approved Syllabus")}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {T(
                    "ওয়েস্ট বেঙ্গল বোর্ড (WBBSE) দশম শ্রেণির ভূগোল ও পরিবেশের সম্পূর্ণ অধ্যায়ভিত্তিক প্রশ্ন, মডেল উত্তরপত্র এবং মক টেস্ট ডিজিটাল হাব।",
                    "Complete chapter-wise practice, model answer sheets, and mock tests for WBBSE Class 10 Geography & Environment."
                  )}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs space-y-2">
                <div className="font-bold text-blue-900 flex items-center gap-1.5 text-xs">
                  <Award className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>{T("পোর্টালের বিশেষ সুবিধা", "Key Portal Highlights")}</span>
                </div>
                <div className="text-slate-700 space-y-1.5 text-[11px] leading-snug">
                  <div className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{T("MCQ ও SAQ তাৎক্ষণিক উত্তর যাচাই ও বিস্তারিত আলোচনা", "Instant MCQ/SAQ verification & explanations")}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{T("২, ৩ ও ৫ নম্বরের মডেল উত্তরপত্র PDF গাইড", "2, 3 & 5 marks official model PDF answer sheets")}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{T("শিক্ষকদের সাথে সরাসরি ডাউট সলভ ও খাতা নিরীক্ষণ", "Teacher doubt solving & answer sheet review")}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 leading-tight flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>{T("রেজিস্ট্রেশনের পর আপনার ডেটাবেজ অ্যাকাউন্ট তৈরি হবে এবং অ্যাডমিন অনুমোদনের সাথে সাথে সমস্ত ফিচার অ্যাক্সেসযোগ্য হবে।", "Your account is saved safely in the database upon registration and unlocks immediately upon admin approval.")}</span>
              </div>
            </div>
          )}

          {/* Profile card if logged in */}
          {user && (
            <div className="mb-5 p-4 rounded-xl border-l-4 border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-sm">
              <div className="mb-2">
                <span className="text-[11px] font-bold text-indigo-600 tracking-wider flex items-center gap-1">
                  <User className="w-3 h-3" /> {T('নাম', 'NAME')}
                </span>
                <p className="text-base font-bold text-indigo-950 italic">{user.full_name}</p>
              </div>
              <div className="mb-2">
                <span className="text-[11px] font-bold text-indigo-600 tracking-wider">
                  🎭 {T('ভূমিকা', 'ROLE')}
                </span>
                <p className="text-sm font-bold text-indigo-950 uppercase flex items-center gap-1.5 flex-wrap">
                  {user.is_head_admin || user.username === 'admin' || user.phone === '7001257277' ? (
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded text-xs font-black">
                      👑 HEAD ADMIN (শাওন কর)
                    </span>
                  ) : user.is_admin === 1 ? (
                    <span className="bg-indigo-100 text-indigo-950 border border-indigo-300 px-2 py-0.5 rounded text-xs font-bold">
                      ⭐ CO-ADMIN (শিক্ষক)
                    </span>
                  ) : (
                    <span>{user.role}</span>
                  )}
                </p>
              </div>
              {user.school_name && (
                <div>
                  <span className="text-[11px] font-bold text-indigo-600 tracking-wider flex items-center gap-1">
                    <School className="w-3 h-3" /> {T('বিদ্যালয়', 'SCHOOL')}
                  </span>
                  <p className="text-xs font-semibold text-indigo-900">
                    {user.school_name} {user.district ? `| ${user.district}` : ''}
                  </p>
                </div>
              )}
              {user.role === 'student' && (
                <div className="mt-2 pt-2 border-t border-indigo-200/60">
                  <span className="text-[10px] font-bold text-indigo-700 tracking-wider block">
                    🎓 {T('মাধ্যমিক সাল / বৈধতা', 'MP BATCH / VALIDITY')}
                  </span>
                  <p className="text-xs font-bold text-indigo-950">
                    MP {user.mp_exam_year || 2027} · ৩১ মার্চ {user.mp_exam_year || 2027} পর্যন্ত
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Admin Super-Control Switcher */}
          {user && user.role === 'admin' && (
            <div className="mb-5 p-3 rounded-lg border-2 border-amber-300 bg-amber-50">
              <label className="text-xs font-black text-amber-900 uppercase tracking-wider mb-2 block">
                👑 Admin Super-Control (View Mode)
              </label>
              <div className="flex flex-col gap-1.5">
                {(['Admin Control Panel', 'Teacher View', 'Student View'] as const).map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => {
                      setAdminViewMode(mode);
                      setActiveNav(mode === 'Admin Control Panel' ? '📢 Send Student Notifications' : (mode === 'Teacher View' ? '📥 Assigned Student Doubts' : '🏠 Dashboard'));
                    }}
                    className={`text-left px-2.5 py-1.5 rounded text-xs font-bold transition flex items-center justify-between ${
                      adminViewMode === mode
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-white text-slate-800 hover:bg-amber-100 border border-amber-200'
                    }`}
                  >
                    <span>{mode}</span>
                    {adminViewMode === mode && <span className="text-[10px]">ACTIVE</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Items (when logged in) */}
          {user && (
            <nav className="space-y-1 mb-6">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 mb-1 block">
                {T('🎯 Navigation', '🎯 Navigation')}
              </label>
              {getNavItems().map(item => (
                <button
                  key={item}
                  onClick={() => setActiveNav(item)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
                    activeNav === item
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate">{item}</span>
                </button>
              ))}
            </nav>
          )}
        </div>

        {user && (
          <button
            onClick={handleLogout}
            className="w-full mt-4 py-2 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-bold flex items-center justify-center gap-2 transition"
          >
            <LogOut className="w-4 h-4" />
            {T("Logout", "Logout")}
          </button>
        )}
      </aside>

      {/* ======================================================================== */}
      {/* MAIN VIEWPORT                                                            */}
      {/* ======================================================================== */}
      <main className="flex-1 p-3 sm:p-5 md:p-8 max-w-7xl mx-auto w-full pb-28 md:pb-8 min-w-0">
        {/* PWA Phone Installation Prompt Banner */}
        <PWAInstallPrompt language={language} />

        {/* Header Box */}
        <div className="header-box">
          <h1>
            {language === 'Bengali'
              ? '🌍 পশ্চিমবঙ্গ ভূগোল পরীক্ষা প্রস্তুতি ও ডিজিটাল ল্যাব'
              : '🌍 West Bengal Board Geography Portal'}
          </h1>
          <p>
            {language === 'Bengali'
              ? 'ওয়েস্ট বেঙ্গল বোর্ড (WBBSE) দশম শ্রেণী অফিসিয়াল ভূগোল সিলেবাস প্র্যাকটিস হাব'
              : 'WBBSE Class 10 Geography & Environment — Official Syllabus Practice Hub'}
          </p>
        </div>

        {/* Global Feedback Alert */}
        {alertMsg && (
          <div
            className={`p-4 rounded-xl mb-6 text-sm font-semibold flex items-center justify-between border ${
              alertMsg.type === 'error'
                ? 'bg-red-50 text-red-800 border-red-300'
                : alertMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-blue-50 text-blue-800 border-blue-300'
            }`}
          >
            <span>{alertMsg.text}</span>
            <button
              onClick={() => setAlertMsg(null)}
              className="text-xs font-bold uppercase underline ml-4 hover:opacity-75"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ==================================================================== */}
        {/* NOT LOGGED IN: MODERN AUTHENTICATION PORTAL                          */}
        {/* ==================================================================== */}
        {!user ? (
          <div className="relative max-w-3xl mx-auto my-4 px-2 sm:px-4 overflow-hidden rounded-3xl">
            {/* Ambient Aurora Orbs */}
            <div className="aurora-bg-orb1" />
            <div className="aurora-bg-orb2" />
            <div className="aurora-bg-orb3" />

            {/* Floating Highlight Badges */}
            <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 mb-4">
              <div className="auth-floating-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-blue-200/80 text-blue-900 text-xs font-bold shadow-xs">
                <GraduationCap className="w-4 h-4 text-blue-600 animate-pulse" />
                <span>{T("WBBSE দশম শ্রেণি ভূগোল পোর্টাল", "WBBSE Class 10 Geography Portal")}</span>
              </div>
              <div className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50/90 backdrop-blur-md border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>{T("অধ্যায়ভিত্তিক সাজেশন ও মডেল উত্তরপত্র", "Chapter Suggestions & Model Answers")}</span>
              </div>
              <div className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50/90 backdrop-blur-md border border-amber-200 text-amber-900 text-xs font-bold shadow-2xs">
                <Crown className="w-3.5 h-3.5 text-amber-600" />
                <span>{T("হেড অ্যাডমিন: শাওন কর (Shawon Sir)", "Head Admin: Shawon Kar")}</span>
              </div>
            </div>

            {/* School & Teacher Prospectus PDF Download Action */}
            <div className="relative z-10 text-center mb-4">
              <a
                href="/api/download-prospectus"
                download="WBBSE_Geography_App_Prospectus_Teachers_Report.pdf"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white text-xs font-bold shadow-md hover:shadow-lg active:scale-95 transition cursor-pointer border border-blue-400/40"
              >
                <Download className="w-3.5 h-3.5 text-white animate-bounce" />
                <span>{T("📄 স্কুল ও শিক্ষক ডেমো প্রস্পেক্টাস PDF ডাউনলোড", "📄 Download School & Teacher Prospectus PDF")}</span>
              </a>
            </div>

            {/* Header Title with Gradient */}
            <div className="relative z-10 text-center mb-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900">
                <span className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 bg-clip-text text-transparent">
                  {authTab === 'login'
                    ? T("আপনার অ্যাকাউন্টে লগইন করুন", "Sign in to Your Account")
                    : authTab === 'student_reg'
                    ? T("নতুন শিক্ষার্থী রেজিস্ট্রেশন", "New Student Registration")
                    : T("শিক্ষক ও কো-অ্যাডমিন রেজিস্টার", "Teacher & Co-Admin Registration")}
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl mx-auto font-medium leading-relaxed">
                {authTab === 'login'
                  ? T("মাধ্যমিক ভূগোল পরীক্ষার সেরা প্রস্তুতি নিতে আপনার ইউজার আইডি ও পাসওয়ার্ড দিন।", "Enter your registered credentials to access your geography practice hub.")
                  : authTab === 'student_reg'
                  ? T("বিনামূল্যে রেজিস্টার করে অধ্যায়ভিত্তিক MCQ, SAQ, ও মডেল উত্তরপত্র সংগ্রহ করুন।", "Register for free to access chapter-wise MCQ, SAQ, and model answer sheets.")
                  : T("শিক্ষক প্যানেলে যোগ দিয়ে ছাত্রছাত্রীদের খাতা মূল্যায়ন ও গাইডেন্স দিন। অনুমোদিত শিক্ষকবৃন্দ কো-অ্যাডমিন হিসেবেও দায়িত্ব পালন করতে পারবেন।", "Join the faculty panel to evaluate student answer sheets. Upgraded teachers also assist as Co-Admins.")}
              </p>
            </div>

            {/* Datalist for West Bengal Districts */}
            <datalist id="wb-districts">
              {WB_DISTRICTS.map(d => (
                <option key={d} value={d} />
              ))}
            </datalist>

            {/* Main Auth Card Container */}
            <div className="auth-card overflow-hidden">
              {/* Segmented Switcher Bar */}
              <div className="p-2 sm:p-2.5 bg-gradient-to-b from-slate-100/90 to-slate-200/70 border-b border-slate-200/80 backdrop-blur-sm">
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/70 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setAuthTab('login')}
                    className={`auth-tab-pill py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                      authTab === 'login'
                        ? 'auth-tab-pill-active text-blue-900 font-extrabold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    <LogIn className={`w-4 h-4 ${authTab === 'login' ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>{T("প্রবেশ (Login)", "Sign In")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthTab('student_reg')}
                    className={`auth-tab-pill py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                      authTab === 'student_reg'
                        ? 'auth-tab-pill-active text-blue-900 font-extrabold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    <GraduationCap className={`w-4 h-4 ${authTab === 'student_reg' ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="truncate">{T("শিক্ষার্থী রেজিস্টার", "Student Reg")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthTab('teacher_reg')}
                    className={`auth-tab-pill py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                      authTab === 'teacher_reg'
                        ? 'auth-tab-pill-active text-blue-900 font-extrabold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    <BookOpen className={`w-4 h-4 ${authTab === 'teacher_reg' ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="truncate">{T("শিক্ষক রেজিস্টার", "Teacher Reg")}</span>
                  </button>
                </div>
              </div>

              {/* ------------------------------------------------------------------ */}
              {/* TAB 1: LOGIN FORM                                                  */}
              {/* ------------------------------------------------------------------ */}
              {authTab === 'login' && (
                <form onSubmit={handleLogin} className="p-6 sm:p-8 space-y-5">
                  {/* Role Selector Cards */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                      {T("আপনার ভূমিকা নির্বাচন করুন (Select Role):", "Select Your Role:")}
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { role: 'Student' as const, labelBn: 'শিক্ষার্থী', labelEn: 'Student', icon: GraduationCap, color: 'blue' },
                        { role: 'Teacher' as const, labelBn: 'শিক্ষক / কো-অ্যাডমিন', labelEn: 'Teacher / Co-Admin', icon: BookOpen, color: 'purple' },
                        { role: 'Admin' as const, labelBn: 'হেড অ্যাডমিন', labelEn: 'Head Admin', icon: KeyRound, color: 'amber' }
                      ].map(item => {
                        const Icon = item.icon;
                        const isSelected = loginRole === item.role;
                        return (
                          <button
                            key={item.role}
                            type="button"
                            onClick={() => setLoginRole(item.role)}
                            className={`auth-role-pill p-3.5 rounded-2xl border text-center transition flex flex-col items-center gap-2 cursor-pointer ${
                              isSelected
                                ? item.role === 'Admin'
                                  ? 'bg-amber-50/90 border-amber-500 text-amber-950 ring-2 ring-amber-500/30 shadow-md'
                                  : item.role === 'Teacher'
                                  ? 'bg-purple-50/90 border-purple-500 text-purple-950 ring-2 ring-purple-500/30 shadow-md'
                                  : 'bg-blue-50/90 border-blue-600 text-blue-950 ring-2 ring-blue-600/30 shadow-md'
                                : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                            }`}
                          >
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                              isSelected
                                ? item.role === 'Admin'
                                  ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-xs'
                                  : item.role === 'Teacher'
                                  ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-xs'
                                  : 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xs'
                                : 'bg-slate-200/80 text-slate-600'
                            }`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className="text-xs sm:text-sm font-bold leading-tight">
                              {T(item.labelBn, item.labelEn)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Username / Phone Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {loginRole === 'Admin'
                        ? T("হেড অ্যাডমিন ইউজারনেম (Head Admin Username) *", "Head Admin Username *")
                        : loginRole === 'Teacher'
                        ? T("শিক্ষক / কো-অ্যাডমিন মোবাইল নম্বর (Phone / User ID) *", "Teacher / Co-Admin Phone / Username *")
                        : T("শিক্ষার্থীর মোবাইল নম্বর (Phone / User ID) *", "Student Phone Number (User ID) *")}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        {loginRole === 'Admin' ? <KeyRound className="w-4 h-4 text-amber-600" /> : <Phone className="w-4 h-4 text-blue-600" />}
                      </div>
                      <input
                        type="text"
                        required
                        value={loginUsername}
                        onChange={e => setLoginUsername(e.target.value)}
                        placeholder={
                          loginRole === 'Admin'
                            ? 'admin'
                            : loginRole === 'Teacher'
                            ? '9830098300'
                            : '9876543210'
                        }
                        className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-600/15 outline-none transition text-sm shadow-2xs"
                      />
                    </div>
                    {loginRole === 'Student' && (
                      <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                        <span>💡</span>
                        <span>{T("রেজিস্ট্রেশনের সময় যে মোবাইল নম্বর দিয়েছেন সেটিই লিখুন।", "Enter the phone number used during registration.")}</span>
                      </p>
                    )}
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        {T("পাসওয়ার্ড (Password) *", "Password *")}
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setAlertMsg({
                            type: 'info',
                            text: 'পাসওয়ার্ড ভুলে গেলে অনুগ্রহ করে হেড অ্যাডমিন শাওন কর বা হেল্পলাইনে যোগাযোগ করুন।'
                          });
                        }}
                        className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        {T("পাসওয়ার্ড ভুলে গেছেন?", "Forgot password?")}
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4 text-slate-500" />
                      </div>
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-3 bg-slate-50/80 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-600/15 outline-none transition text-sm shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Role Guidance & Security Notice */}
                  <div className={`p-4 rounded-2xl border text-xs transition-all duration-300 flex items-start gap-3 shadow-2xs ${
                    loginRole === 'Admin'
                      ? 'bg-amber-50/80 border-amber-200'
                      : loginRole === 'Teacher'
                      ? 'bg-purple-50/80 border-purple-200'
                      : 'bg-blue-50/80 border-blue-200'
                  }`}>
                    <div className="mt-0.5 shrink-0">
                      {loginRole === 'Admin' ? (
                        <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-700 flex items-center justify-center font-bold">👑</div>
                      ) : loginRole === 'Teacher' ? (
                        <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-700 flex items-center justify-center font-bold">👨‍🏫</div>
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-700 flex items-center justify-center font-bold">🎓</div>
                      )}
                    </div>
                    <div className="leading-relaxed">
                      {loginRole === 'Admin' ? (
                        <div>
                          <div className="text-amber-900 font-bold text-xs mb-0.5">
                            {T("প্রধান অ্যাডমিন (Head Admin - শাওন কর)", "Head Admin - Shawon Kar")}
                          </div>
                          <div className="text-amber-800 text-[11px]">
                            {T("অফিসিয়াল হেড কন্ট্রোল লগইন। সমস্ত শিক্ষক অনুমোদন, কো-অ্যাডমিন অ্যাকশন রিভিউ ও প্রশ্ন ব্যবস্থাপনা এখান থেকে পরিচালিত হয়।", "Master admin control login. Head Admin has supreme authority over all approvals and co-admin proposals.")}
                          </div>
                        </div>
                      ) : loginRole === 'Teacher' ? (
                        <div>
                          <div className="text-purple-900 font-bold text-xs mb-0.5">
                            {T("শিক্ষক ও কো-অ্যাডমিন (Teacher & Co-Admin)", "Teacher & Co-Admin Access")}
                          </div>
                          <div className="text-purple-800 text-[11px]">
                            {T(
                              "হেড অ্যাডমিন (শাওন স্যার) কর্তৃক অনুমোদিত শিক্ষকবৃন্দ এখান থেকেই প্রবেশ করবেন। যাদের কো-অ্যাডমিন হিসেবে আপগ্রেড করা হয়েছে, তারা একই শিক্ষক উইন্ডো দিয়ে প্রবেশ করে অ্যাডমিন প্যানেলে কাজ করতে পারবেন।",
                              "Registered teachers and upgraded Co-Admins log in here. Co-Admins gain access to admin features while their actions are reviewed by Head Admin."
                            )}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-blue-900 font-bold text-xs mb-0.5">
                            {T("শিক্ষার্থী পোর্টাল (Student Access)", "Student Access")}
                          </div>
                          <div className="text-blue-800 text-[11px]">
                            {T(
                              "আপনার ১০ সংখ্যার রেজিস্টার্ড ফোন নম্বর ও পাসওয়ার্ড দিয়ে প্রবেশ করুন এবং অধ্যায়ভিত্তিক ভূগোল প্রশ্নপত্র ও সাজেশনের প্রস্তুতি নিন।",
                              "Sign in with your 10-digit registered phone number and password to access chapter tests, notes, and suggestions."
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="auth-submit-gradient w-full py-3.5 px-6 rounded-2xl text-white font-bold text-base transition flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <ArrowRight className="w-5 h-5" />
                    )}
                    <span>{loading ? T("প্রবেশ করা হচ্ছে...", "Signing in...") : T("পোর্টাল এ প্রবেশ করুন (Sign In)", "Sign In to Portal")}</span>
                  </button>

                  {/* Switch to Registration Prompt */}
                  <div className="text-center pt-3 border-t border-slate-100 flex items-center justify-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-600">
                      {T("নতুন শিক্ষার্থী? এখনও কোনো অ্যাকাউন্ট নেই?", "Don't have a student account yet?")}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAuthTab('student_reg')}
                      className="text-xs font-extrabold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                    >
                      {T("বিনামূল্যে রেজিস্টার করুন →", "Register for free here →")}
                    </button>
                  </div>
                </form>
              )}

              {/* ------------------------------------------------------------------ */}
              {/* TAB 2: STUDENT REGISTRATION FORM                                   */}
              {/* ------------------------------------------------------------------ */}
              {authTab === 'student_reg' && (
                <form onSubmit={e => handleRegister('student', e)} className="p-6 md:p-8 space-y-5">
                  {/* Referral banner if present */}
                  {referredBy && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{T(`রেফারেল কোড সনাক্ত হয়েছে: ${referredBy}`, `Referral code detected: ${referredBy}`)}</span>
                    </div>
                  )}

                  {/* Section 1: Personal & School Information */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
                      <User className="w-4 h-4 text-blue-600" />
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        {T("১. শিক্ষার্থীর পরিচয় ও বিদ্যালয় (Personal & School)", "1. Personal & School Details")}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {T("পূর্ণ নাম (Full Name) *", "Full Name *")}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <User className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            required
                            value={regName}
                            onChange={e => setRegName(e.target.value)}
                            placeholder="উদাঃ অয়ন চ্যাটার্জী (Ayan Chatterjee)"
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {T("বিদ্যালয়ের নাম (School Name) *", "School Name *")}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <School className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            required
                            value={regSchool}
                            onChange={e => setRegSchool(e.target.value)}
                            placeholder="উদাঃ Hindu School / Siliguri High School"
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {T("জেলা (District) *", "District *")}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          list="wb-districts"
                          value={regDistrict}
                          onChange={e => setRegDistrict(e.target.value)}
                          placeholder="Kolkata / North 24 Parganas / Howrah..."
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Batch, Class & Phone */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
                      <GraduationCap className="w-4 h-4 text-blue-600" />
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        {T("২. মাধ্যমিক ব্যাচ ও মোবাইল নম্বর (Batch & Contact)", "2. Academic Batch & Contact")}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                      <div className="md:col-span-1">
                        <label className="block text-xs font-bold text-blue-950 mb-1">
                          🎓 {T("মাধ্যমিক পরীক্ষার সাল *", "Year of MP Exam *")}
                        </label>
                        <select
                          value={regMpYear}
                          onChange={e => setRegMpYear(e.target.value)}
                          className="w-full py-2 px-3 bg-blue-50/80 border border-blue-300 rounded-lg text-blue-950 font-bold focus:bg-white focus:border-blue-600 outline-none text-sm"
                        >
                          <option value="2026">2026 (মেয়াদ: ৩১ মার্চ ২০২৬)</option>
                          <option value="2027">2027 (মেয়াদ: ৩১ মার্চ ২০২৭) — Class 10</option>
                          <option value="2028">2028 (মেয়াদ: ৩১ মার্চ ২০২৮) — Class 9</option>
                          <option value="2029">2029 (মেয়াদ: ৩১ মার্চ ২০২৯)</option>
                          <option value="2030">2030 (মেয়াদ: ৩১ মার্চ ২০৩০)</option>
                        </select>
                        <span className="text-[11px] text-blue-800 font-semibold block mt-1">
                          ⏳ {T(`বৈধতা: ৩১ মার্চ ${regMpYear} পর্যন্ত`, `Validity: until 31st March ${regMpYear}`)}
                        </span>
                      </div>

                      <div className="md:col-span-1">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {T("বর্তমান শ্রেণি (Class) *", "Class *")}
                        </label>
                        <select
                          value={regClass}
                          onChange={e => setRegClass(e.target.value)}
                          className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:bg-white focus:border-blue-600 outline-none text-sm"
                        >
                          <option value="Class 10 (Madhyamik)">Class 10 (Madhyamik)</option>
                          <option value="Class 9 (Pre-Madhyamik)">Class 9 (Pre-Madhyamik)</option>
                        </select>
                      </div>

                      <div className="md:col-span-1">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {T("মোবাইল নম্বর (User ID) *", "Phone (User ID) *")}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Phone className="w-4 h-4" />
                          </div>
                          <input
                            type="tel"
                            required
                            pattern="[0-9]{10}"
                            value={regPhone}
                            onChange={e => setRegPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                            placeholder="9876543210"
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold focus:bg-white focus:border-blue-600 outline-none text-sm tracking-wider"
                          />
                        </div>
                        <span className="text-[10px] text-slate-500 block mt-1">
                          {T("১০ সংখ্যার ফোন নম্বর (এটিই লগইন আইডি)", "10-digit number (used as login ID)")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Password & Referral */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
                      <Lock className="w-4 h-4 text-blue-600" />
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        {T("৩. নিরাপত্তা পাসওয়ার্ড ও রেফারেল (Security & Referral)", "3. Security & Referral")}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {T("নতুন পাসওয়ার্ড সেট করুন *", "Set Password *")}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Lock className="w-4 h-4" />
                          </div>
                          <input
                            type={showRegPassword ? 'text' : 'password'}
                            required
                            value={regPassword}
                            onChange={e => setRegPassword(e.target.value)}
                            placeholder="অন্তত ৬ অক্ষরের পাসওয়ার্ড"
                            className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:bg-white focus:border-blue-600 outline-none text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegPassword(!showRegPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700"
                          >
                            {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {T("রেফারেল কোড (ঐচ্ছিক)", "Referral Code (Optional)")}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                          </div>
                          <input
                            type="text"
                            value={regRef}
                            onChange={e => setRegRef(e.target.value)}
                            placeholder="GEO-REF-XXXX"
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:bg-white focus:border-blue-600 outline-none text-sm uppercase"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trust and Data Safety Guarantee */}
                  <div className="p-4 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 rounded-2xl border border-emerald-200/80 text-xs text-slate-700 space-y-1.5 shadow-2xs">
                    <div className="flex items-center gap-2 font-bold text-emerald-950">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{T("ডেটাবেজে নিরাপদ ও সুরক্ষিত সংরক্ষণ নীতি", "Permanent Database Security Guarantee")}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-600">
                      {T(
                        "রেজিস্ট্রেশনের পর আপনার সমস্ত তথ্য সেন্ট্রাল ডেটাবেজে সুরক্ষিত থাকবে। হেড অ্যাডমিন (শাওন কর) অনুমোদন করার সঙ্গে সঙ্গেই আপনার ফোন নম্বর ও পাসওয়ার্ড দিয়ে সম্পূর্ণ অ্যাক্সেস পেয়ে যাবেন।",
                        "Your profile is permanently stored in the centralized database. You will gain instant full access upon admin approval."
                      )}
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="auth-submit-gradient w-full py-3.5 px-6 rounded-2xl text-white font-bold text-base transition flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Check className="w-5 h-5" />
                    )}
                    <span>{loading ? T("জমা দেওয়া হচ্ছে...", "Submitting...") : T("শিক্ষার্থী রেজিস্ট্রেশন সম্পন্ন করুন (Submit)", "Complete Student Registration")}</span>
                  </button>

                  {/* Switch to Login Link */}
                  <div className="text-center pt-3 border-t border-slate-100 flex items-center justify-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-600">
                      {T("ইতিমধ্যে রেজিস্টার করেছেন?", "Already registered?")}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAuthTab('login')}
                      className="text-xs font-extrabold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                    >
                      {T("এখানে সরাসরি লগইন করুন →", "Sign in directly here →")}
                    </button>
                  </div>
                </form>
              )}

              {/* ------------------------------------------------------------------ */}
              {/* TAB 3: TEACHER REGISTRATION FORM                                   */}
              {/* ------------------------------------------------------------------ */}
              {authTab === 'teacher_reg' && (
                <form onSubmit={e => handleRegister('teacher', e)} className="p-6 md:p-8 space-y-5">
                  {referredBy && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{T(`রেফারেল কোড সনাক্ত হয়েছে: ${referredBy}`, `Referral code detected: ${referredBy}`)}</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        {T("শিক্ষকের ব্যক্তিগত ও প্রাতিষ্ঠানিক তথ্য", "Teacher Personal & Institutional Details")}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {T("শিক্ষক/শিক্ষিকার পূর্ণ নাম *", "Teacher Full Name *")}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <User className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            required
                            value={regName}
                            onChange={e => setRegName(e.target.value)}
                            placeholder="উদাঃ সুকন্যা চক্রবর্তী (Sukannya Chakraborty)"
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:bg-white focus:border-blue-600 outline-none text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {T("বিদ্যালয় বা শিক্ষা প্রতিষ্ঠান *", "School / Educational Institution *")}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <School className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            required
                            value={regSchool}
                            onChange={e => setRegSchool(e.target.value)}
                            placeholder="উদাঃ South Point High School / Bethune"
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:bg-white focus:border-blue-600 outline-none text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {T("যোগাযোগ ফোন নম্বর (User ID) *", "Phone Number (User ID) *")}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Phone className="w-4 h-4" />
                          </div>
                          <input
                            type="tel"
                            required
                            pattern="[0-9]{10}"
                            value={regPhone}
                            onChange={e => setRegPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                            placeholder="9123456780"
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold focus:bg-white focus:border-blue-600 outline-none text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {T("জেলা (District) *", "District *")}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            required
                            list="wb-districts"
                            value={regDistrict}
                            onChange={e => setRegDistrict(e.target.value)}
                            placeholder="Kolkata / Hooghly / Burdwan..."
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:bg-white focus:border-blue-600 outline-none text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
                      <Lock className="w-4 h-4 text-blue-600" />
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        {T("পাসওয়ার্ড ও রেফারেল", "Security & Referral")}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {T("পাসওয়ার্ড সেট করুন *", "Set Password *")}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Lock className="w-4 h-4" />
                          </div>
                          <input
                            type={showRegPassword ? 'text' : 'password'}
                            required
                            value={regPassword}
                            onChange={e => setRegPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:bg-white focus:border-blue-600 outline-none text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegPassword(!showRegPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700"
                          >
                            {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {T("রেফারেল কোড (ঐচ্ছিক)", "Referral Code (Optional)")}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                          </div>
                          <input
                            type="text"
                            value={regRef}
                            onChange={e => setRegRef(e.target.value)}
                            placeholder="GEO-REF-TXXXX"
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:bg-white focus:border-blue-600 outline-none text-sm uppercase"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-purple-50/80 to-indigo-50/80 rounded-2xl border border-purple-200/80 text-xs text-purple-950 space-y-1.5 shadow-2xs">
                    <div className="flex items-center gap-2 font-bold text-purple-900">
                      <ShieldCheck className="w-4 h-4 text-purple-700 shrink-0" />
                      <span>{T("শিক্ষক ও কো-অ্যাডমিন অনুমোদন নীতি", "Teacher & Co-Admin Approval Hierarchy")}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-700">
                      {T(
                        "শিক্ষক রেজিস্ট্রেশন জমা হওয়ার পর হেড অ্যাডমিন (শাওন কর) আপনার অ্যাকাউন্ট যাচাই ও অনুমোদন করবেন। অনুমোদনের পর আপনি শিক্ষক হিসেবে শিক্ষার্থীদের খাতা পরীক্ষণ করতে পারবেন। হেড অ্যাডমিন প্রয়োজন অনুযায়ী আপনার অ্যাকাউন্টকে 'কো-অ্যাডমিন (Co-Admin)' হিসেবে আপগ্রেড করতে পারবেন, যার ফলে আপনি শিক্ষক উইন্ডো দিয়ে লগইন করলেও অ্যাডমিন কন্ট্রোল প্যানেলের সুবিধা পাবেন এবং আপনার প্রস্তাবিত কাজ হেড অ্যাডমিনের অনুমোদনের পর বাস্তবায়িত হবে।",
                        "Teacher accounts are reviewed by Head Admin (Shawon Kar). Upgraded Co-Admins assist the administration, with their actions subject to final Head Admin review."
                      )}
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="auth-submit-gradient w-full py-3.5 px-6 rounded-2xl text-white font-bold text-base transition flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Check className="w-5 h-5" />
                    )}
                    <span>{loading ? T("জমা দেওয়া হচ্ছে...", "Submitting...") : T("শিক্ষক রেজিস্ট্রেশন সম্পন্ন করুন (Submit)", "Complete Teacher Registration")}</span>
                  </button>

                  <div className="text-center pt-3 border-t border-slate-100 flex items-center justify-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-600">
                      {T("ইতিমধ্যে রেজিস্টার করেছেন?", "Already registered?")}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAuthTab('login')}
                      className="text-xs font-extrabold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                    >
                      {T("এখানে সরাসরি লগইন করুন →", "Sign in directly here →")}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        ) : (
          /* ==================================================================== */
          /* LOGGED IN INTERFACE VIEWS                                            */
          /* ==================================================================== */
          <div className="space-y-6">
            {/* ------------------------------------------------------------------ */}
            {/* SECURE MASTER 2/3/5M PDF DRM VIEWER                                */}
            {/* ------------------------------------------------------------------ */}
            {activeNav === '🔒 Master 2/3/5M PDF Reader (DRM)' && (
              <SecurePdfViewer
                user={user}
                language={language}
                onNavigateToPricing={() => setActiveNav('💳 Pricing & Payment')}
                initialChapter={activeChapterForDrm}
                initialMarks={activeMarksForDrm}
                initialTier={activeTierForDrm}
              />
            )}

            {/* ------------------------------------------------------------------ */}
            {/* ADMIN DRM APPROVALS & SECURITY CONTROLS                            */}
            {/* ------------------------------------------------------------------ */}
            {activeNav === '🛡️ PDF Security & DRM Approvals' && (
              <AdminApprovals
                user={user}
                language={language}
              />
            )}

            {/* ------------------------------------------------------------------ */}
            {/* SCHOOL & TEACHER PROSPECTUS / SOCIAL DEMONSTRATION VIEW            */}
            {/* ------------------------------------------------------------------ */}
            {activeNav === '📄 School & Teacher Prospectus PDF' && (
              <SchoolProspectusSection language={language} />
            )}

            {/* ------------------------------------------------------------------ */}
            {/* STUDENT VIEW: DASHBOARD                                            */}
            {/* ------------------------------------------------------------------ */}
            {activeNav === '🏠 Dashboard' && (
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">{T("🏠 Student Dashboard", "🏠 Student Dashboard")}</h2>

                {/* MP Exam Batch Validity Card */}
                {user.role === 'student' && (
                  <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-4 rounded-xl shadow-md mb-6 flex flex-wrap items-center justify-between gap-3 border border-blue-800">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-2xl border border-white/20">
                        🎓
                      </div>
                      <div>
                        <div className="font-bold text-sm text-blue-100 flex items-center gap-2">
                          <span>{T(`মাধ্যমিক ব্যাচ (MP Exam Year): ${user.mp_exam_year || 2027}`, `Madhyamik Batch: ${user.mp_exam_year || 2027}`)}</span>
                          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            ✅ Active
                          </span>
                        </div>
                        <div className="text-xs text-blue-200 mt-0.5">
                          ⏳ {T(`আপনার এই অ্যাকাউন্টের অ্যাক্সেস বৈধ থাকবে: ৩১ মার্চ ${user.mp_exam_year || 2027} পর্যন্ত`, `Account access validity: until 31st March ${user.mp_exam_year || 2027}`)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-blue-300 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 inline-block font-mono">
                        {user.school_name || 'WBBSE'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Unread Admin Notifications */}
                {notifications.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
                        🔔 {T('Admin Notifications', 'Admin Notifications')} ({notifications.length})
                      </h4>
                      <button
                        onClick={async () => {
                          await fetch('/api/admin_notifications/mark_read', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ username: user.username })
                          });
                          fetchNotifications();
                        }}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 underline"
                      >
                        {T("✅ Mark all as read", "✅ Mark all as read")}
                      </button>
                    </div>

                    <div className="space-y-3">
                      {notifications.map((n: any) => {
                        const prioColor = n.priority === 'Urgent' ? 'border-red-600 text-red-600' : (n.priority === 'Important' ? 'border-amber-500 text-amber-600' : 'border-blue-600 text-blue-600');
                        const prioBg = n.priority === 'Urgent' ? 'bg-red-600' : (n.priority === 'Important' ? 'bg-amber-500' : 'bg-blue-600');
                        return (
                          <div
                            key={n.id}
                            className={`bg-white border-l-4 ${prioColor.split(' ')[0]} p-4 rounded-xl shadow-xs border border-slate-200`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-slate-800 text-base">{n.title}</span>
                              <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-sm ${prioBg}`}>
                                {n.priority}
                              </span>
                            </div>
                            <p className="text-sm text-slate-700 my-2">{n.message}</p>
                            <span className="text-[11px] text-slate-500 block">{n.timestamp}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Master PDF DRM Feature Banner */}
                <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-5 rounded-2xl shadow-md mb-6 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-amber-300" />
                      <h3 className="font-extrabold text-base sm:text-lg">
                        {T("🔒 মাধ্যমিক ২, ৩ ও ৫ নম্বরের সুরক্ষিত মাস্টার PDF রিডার", "🔒 Master 2, 3 & 5 Marks Secure DRM Reader")}
                      </h3>
                    </div>
                    <p className="text-xs text-blue-100 max-w-xl">
                      {T(
                        "চিত্রসহ ৫ নম্বরের বড় উত্তর, ৩ নম্বরের ব্যাখ্যামূলক ছক এবং ২ নম্বরের টু-দ্য-পয়েন্ট সংজ্ঞা সম্বলিত কপিরাইট সুরক্ষিত ডিজিটাল উত্তরমালা।",
                        "Complete diagram-backed 5M answers, 3M analytical tables, and 2M definitions with dynamic watermarked DRM viewing."
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveNav('🔒 Master 2/3/5M PDF Reader (DRM)')}
                    className="px-4 py-2.5 rounded-xl bg-white text-blue-900 hover:bg-blue-50 font-extrabold text-xs sm:text-sm shadow-md transition shrink-0 cursor-pointer flex items-center gap-2"
                  >
                    <span>{T("📖 মাস্টার PDF খুলুন", "Open Master PDF Reader")}</span>
                    <span>→</span>
                  </button>
                </div>

                {/* Official WhatsApp Channel Join Banner */}
                <div className="mb-6">
                  <WhatsAppChannelBanner
                    onOpenModal={() => setShowWhatsAppModal(true)}
                    language={language}
                  />
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-xs font-bold text-slate-500 uppercase">{T("📚 Chapters", "📚 Chapters")}</span>
                    <p className="text-2xl font-black text-blue-700 mt-1">6</p>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-xs font-bold text-slate-500 uppercase">{T("👑 Full Access", "👑 Full Access")}</span>
                    <p className="text-2xl font-black mt-1">
                      {hasFullAccess() ? (
                        <span className="text-emerald-600">Active</span>
                      ) : (
                        <span className="text-amber-600">Locked</span>
                      )}
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-xs font-bold text-slate-500 uppercase">{T("❓ Total Questions", "❓ Total Questions")}</span>
                    <p className="text-2xl font-black text-indigo-700 mt-1">{questions.length || 36}+</p>
                  </div>
                </div>

                {/* Access prompt */}
                {hasFullAccess() ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 font-bold mb-6">
                    👑 {T("আপনি Full/Bundle Access User! সব প্রশ্ন ও সলিউশন আনলকড।", "You have Full/Bundle Access! All questions & solutions are unlocked.")}
                  </div>
                ) : (
                  <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 font-semibold mb-6 flex flex-col md:flex-row items-center justify-between gap-3">
                    <span>
                      💡 {T(`₹${settings.full_access_price} Full Access বা ₹${settings.bundle_price} Bundle কিনলে সব প্রশ্নের পূর্ণ উত্তর ও মক টেস্ট আনলক হবে।`,
                             `Buy Full Access (₹${settings.full_access_price}) or Bundle (₹${settings.bundle_price}) to unlock all questions & mock tests.`)}
                    </span>
                    <button
                      onClick={() => setActiveNav('💳 Pricing & Payment')}
                      className="st-btn bg-amber-600 hover:bg-amber-700 text-xs shrink-0"
                    >
                      💳 {T("Upgrade Now", "Upgrade Now")}
                    </button>
                  </div>
                )}

                {/* Quick Chapter Selector & Featured questions */}
                <h3 className="text-lg font-bold text-slate-800 mb-3">🔥 {T('Featured Questions & Chapters', 'Featured Questions & Chapters')}</h3>
                <div className="space-y-4">
                  {topics.map(t => (
                    <div key={t.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-blue-900 text-base">{t.name}</h4>
                        <button
                          onClick={() => {
                            setSelectedTopicId(t.id);
                            setActiveNav('📖 Practice Center');
                          }}
                          className="st-btn text-xs py-1.5 px-3"
                        >
                          {T("📖 Practice This Chapter", "📖 Practice This Chapter")}
                        </button>
                      </div>
                      <p className="text-xs text-slate-500">
                        {T("MCQ, SAQ, 2 নম্বর, 3 নম্বর এবং 5 নম্বরের প্রশ্নাবলি ও মডেল উত্তর প্রস্তুত।",
                           "MCQ, SAQ, 2 Marks, 3 Marks, and 5 Marks questions with model answers ready.")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------ */}
            {/* PRACTICE CENTER                                                    */}
            {/* ------------------------------------------------------------------ */}
            {activeNav === '📖 Practice Center' && (
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  {T("📖 WBBSE Class 10 Geography Practice Center", "📖 WBBSE Class 10 Geography Practice Center")}
                </h2>

                {/* Official WhatsApp Channel Join Banner */}
                <div className="mb-5">
                  <WhatsAppChannelBanner
                    onOpenModal={() => setShowWhatsAppModal(true)}
                    language={language}
                  />
                </div>

                {/* Chapter Select */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-6">
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">{T("Select Chapter:", "Select Chapter:")}</label>
                  <select
                    value={selectedTopicId}
                    onChange={e => setSelectedTopicId(Number(e.target.value))}
                    className="st-select"
                  >
                    {topics.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filter questions by type */}
                {(() => {
                  const hasOptions = (q: any) => Boolean((q.option_a && q.option_a.trim()) || (q.option_b && q.option_b.trim()));
                  const isDesc = (q: any) => q.marks >= 2 || ['2', '2M', '3', '3M', '5', '5M', 'Broad'].includes(String(q.q_type));
                  const mcqs = questions.filter(q => !isDesc(q) && (q.q_type === 'MCQ' || q.q_type === '1' || hasOptions(q)));
                  const saqs = questions.filter(q => !isDesc(q) && !hasOptions(q) && (q.q_type === 'SAQ' || q.q_type === '1' || q.marks === 1));
                  const q2 = questions.filter(q => q.marks === 2 || q.q_type === '2M' || q.q_type === '2');
                  const q3 = questions.filter(q => q.marks === 3 || q.q_type === '3M' || q.q_type === '3');
                  const q5 = questions.filter(q => q.marks >= 5 || q.q_type === '5M' || q.q_type === '5' || q.q_type === 'Broad');

                  const FREE_LIMITS = { MCQ: 50, SAQ: 25, '2M': 10, '3M': 5, '5M': 2 };
                  const isPaid = hasFullAccess();

                  const mcqView = isPaid ? mcqs : mcqs.slice(0, FREE_LIMITS.MCQ);
                  const saqView = isPaid ? saqs : saqs.slice(0, FREE_LIMITS.SAQ);
                  const q2View = isPaid ? q2 : q2.slice(0, FREE_LIMITS['2M']);
                  const q3View = isPaid ? q3 : q3.slice(0, FREE_LIMITS['3M']);
                  const q5View = isPaid ? q5 : q5.slice(0, FREE_LIMITS['5M']);

                  return (
                    <div>
                      {!isPaid && (
                        <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-xs font-bold text-amber-900 mb-4">
                          🔒 {T(
                            `Free tier: MCQ ${mcqView.length}/${mcqs.length} · SAQ ${saqView.length}/${saqs.length} · 2M ${q2View.length}/${q2.length} · 3M ${q3View.length}/${q3.length} · 5M ${q5View.length}/${q5.length} — Full Access (₹${settings.full_access_price}) কিনলে সব unlock হবে।`,
                            `Free tier: MCQ ${mcqView.length}/${mcqs.length} · SAQ ${saqView.length}/${saqs.length} · 2M ${q2View.length}/${q2.length} · 3M ${q3View.length}/${q3.length} · 5M ${q5View.length}/${q5.length} — Full Access (₹${settings.full_access_price}) unlocks all.`
                          )}
                        </div>
                      )}

                      {/* Question Category Tabs */}
                      <QuestionTabs
                        topicId={selectedTopicId}
                        mcqView={mcqView}
                        saqView={saqView}
                        q2View={q2View}
                        q3View={q3View}
                        q5View={q5View}
                        mcqTotal={mcqs.length}
                        saqTotal={saqs.length}
                        q2Total={q2.length}
                        q3Total={q3.length}
                        q5Total={q5.length}
                        selectedAnswers={selectedAnswers}
                        setSelectedAnswers={setSelectedAnswers}
                        onAskDoubt={openAskDoubt}
                        downloadTextFile={downloadTextFile}
                        T={T}
                        getQText={getQText}
                        language={language}
                        user={user}
                        effectiveRole={effectiveRole}
                        isPaid={isPaid}
                        settings={settings}
                        setActiveNav={setActiveNav}
                        onOpenDrmReader={(tId: number, mType: string, tier: 'paid' | 'free') => {
                          setActiveChapterForDrm(Number(tId) || 1);
                          setActiveMarksForDrm((mType || '5m').toLowerCase() as any);
                          setActiveTierForDrm(tier);
                          setActiveNav('🔒 Master 2/3/5M PDF Reader (DRM)');
                        }}
                      />
                    </div>
                  );
                })()}
              </div>
            )}

            {/* ------------------------------------------------------------------ */}
            {/* MY HELP / DOUBT REQUESTS                                           */}
            {/* ------------------------------------------------------------------ */}
            {activeNav === '❓ My Help / Doubt Requests' && (
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">{T("❓ My Doubt Requests", "❓ My Doubt Requests")}</h2>
                {myDoubts.length === 0 ? (
                  <div className="p-8 bg-white border border-slate-200 rounded-xl text-center text-slate-500">
                    {T("কোনো Doubt Request এখনো নেই। Practice Center থেকে '🙋 Ask Admin/Teacher' বাটনে চাপুন।",
                       "No doubt requests yet. Click '🙋 Ask Admin/Teacher' on any 2M/3M/5M question in the Practice Center.")}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myDoubts.map(d => {
                      const isApproved = d.status === 'Approved';
                      return (
                        <div key={d.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-slate-800">
                              {isApproved ? '🟢' : '🟡'} #{d.id} [{d.marks}M] — {d.status}
                            </span>
                            <span className="text-xs text-slate-500">{d.timestamp}</span>
                          </div>
                          <p className="font-bold text-slate-900 text-base mb-3">
                            <strong>{T('Question', 'Question')}:</strong> {getQText(d.question_text, d.question_text_en)}
                          </p>
                          {isApproved && d.teacher_answer ? (
                            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950">
                              <span className="font-bold block mb-1">✅ {T("Teacher / Admin Solution:", "Teacher / Admin Solution:")}</span>
                              <p className="whitespace-pre-wrap text-sm">{d.teacher_answer}</p>
                              <button
                                onClick={() => downloadTextFile(`Doubt_Solution_Q${d.question_id}.txt`, d.teacher_answer)}
                                className="st-btn bg-emerald-600 hover:bg-emerald-700 text-xs py-1.5 px-3 mt-3 flex items-center gap-1"
                              >
                                <Download className="w-3.5 h-3.5" /> {T("📥 Download Solution", "📥 Download Solution")}
                              </button>
                            </div>
                          ) : (
                            <div className="text-xs text-slate-600 p-3 bg-slate-50 rounded-lg border border-slate-200">
                              ⏳ {T("আপনার প্রশ্নটি প্রক্রিয়াধীন রয়েছে। শিক্ষক যাচাই করে উত্তর অনুমোদিত করবেন।",
                                     "Your doubt is being processed. Teacher/Admin will review and unlock solution.")}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------------ */}
            {/* MOCK TESTS & SUGGESTIONS                                           */}
            {/* ------------------------------------------------------------------ */}
            {activeNav === '📄 Mock Tests & Suggestions' && (
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">{T("📄 Mock Tests & Suggestions", "📄 Mock Tests & Suggestions")}</h2>
                {mockTests.length === 0 ? (
                  <div className="p-8 bg-white border border-slate-200 rounded-xl text-center text-slate-500">
                    {T("No mock tests published yet.", "No mock tests published yet.")}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockTests.map(m => {
                      const unlocked = hasMockAccess(m.test_type, m.id);
                      return (
                        <div key={m.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                {m.test_type}
                              </span>
                              <span className="text-xs text-slate-500">{m.timestamp?.split(' ')[0]}</span>
                            </div>
                            <h3 className="text-lg font-black text-slate-900 mb-1">{m.code_num}</h3>
                            <p className="text-xs text-slate-500 mb-3">Uploader: {m.uploader} | ₹{m.price || 0}</p>
                          </div>

                          <div className="mt-4">
                            {unlocked ? (
                              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center justify-between">
                                <span className="text-xs font-bold text-emerald-800">✅ {T("Unlocked!", "Unlocked!")}</span>
                                <button
                                  onClick={() => downloadTextFile(m.file_name || `${m.code_num}.txt`, m.file_data || `WBBSE Mock Test Paper: ${m.code_num}`)}
                                  className="st-btn text-xs py-1.5 px-3 flex items-center gap-1"
                                >
                                  <Download className="w-3.5 h-3.5" /> 📥 {m.code_num}
                                </button>
                              </div>
                            ) : (
                              <div className="lock-box">
                                <p className="text-sm font-bold mb-2">
                                  🔒 {T(`₹${m.price || 0} পেমেন্ট করে আনলক করুন`, `Pay ₹${m.price || 0} to unlock`)}
                                </p>
                                <button
                                  onClick={() => setActiveNav('💳 Pricing & Payment')}
                                  className="st-btn bg-amber-600 hover:bg-amber-700 text-xs py-1.5 px-3"
                                >
                                  💳 {T("Go to Payment", "Go to Payment")}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------------ */}
            {/* MY EXAM SUBMISSIONS                                                */}
            {/* ------------------------------------------------------------------ */}
            {activeNav === '📝 My Exam Submissions' && (
              <StudentExamSubmissionsSection
                user={user}
                mockTests={mockTests}
                hasMockAccess={hasMockAccess}
                examSubmissions={examSubmissions}
                fetchExamSubmissions={fetchExamSubmissions}
                downloadTextFile={downloadTextFile}
                T={T}
              />
            )}

            {/* ------------------------------------------------------------------ */}
            {/* MADHYAMIK DRIVE PAPERS                                             */}
            {/* ------------------------------------------------------------------ */}
            {activeNav === '📁 Madhyamik Drive Papers' && (
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  {T("📁 Official Madhyamik Google Drive Papers", "📁 Official Madhyamik Google Drive Papers")}
                </h2>
                <div className="bg-blue-50 border-2 border-blue-600 p-6 rounded-2xl shadow-sm">
                  <h3 className="text-xl font-bold text-blue-900 mb-2">
                    📥 {T('Official Madhyamik Board Question Papers', 'Official Madhyamik Board Question Papers')}
                  </h3>
                  <p className="text-sm text-slate-700 mb-4">
                    {T('২০১৭ থেকে ২০২৬ সালের সব অফিশিয়াল মাধ্যমিক ভূগোল প্রশ্নপত্র ও সমাধান সরাসরি গুগল ড্রাইভে সংরক্ষিত:',
                       'All official Madhyamik Geography question papers from 2017 to 2026 stored directly on Google Drive:')}
                  </p>
                  <a
                    href="https://drive.google.com/drive/folders/1q4cLE5sYcjElqSnZPQ4Tx4lkbrB-U-pj?usp=drive_link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="st-btn inline-flex items-center gap-2 py-3 px-6 text-base"
                  >
                    <ExternalLink className="w-5 h-5" />
                    🔗 Open Google Drive Folder
                  </a>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------ */}
            {/* SHARE & REFERRAL LINKS                                             */}
            {/* ------------------------------------------------------------------ */}
            {(activeNav === '🎁 Refer & Earn (₹3,500 Prize)' ||
              activeNav === '🎁 Referral Rewards (₹7,500 Prize)' ||
              activeNav === '🎁 Referral Rewards & Links' ||
              activeNav === '🎁 Share & Referral Links') && (
              <ShareReferralSection
                user={user}
                setUser={setUser}
                settings={settings}
                fetchSettings={fetchSettings}
                T={T}
              />
            )}

            {/* ------------------------------------------------------------------ */}
            {/* ASK CORNER (SUGGESTIONS)                                           */}
            {/* ------------------------------------------------------------------ */}
            {activeNav === '💡 Ask Corner (Suggestions)' && (
              <AskCornerSection
                user={user}
                askCornerList={askCornerList}
                fetchAskCorner={fetchAskCorner}
                T={T}
              />
            )}

            {/* ------------------------------------------------------------------ */}
            {/* PRICING & PAYMENT                                                  */}
            {/* ------------------------------------------------------------------ */}
            {activeNav === '💳 Pricing & Payment' && (
              <PricingPaymentSection
                user={user}
                settings={settings}
                mockTests={mockTests}
                hasFullAccess={hasFullAccess}
                hasBundleAccess={hasBundleAccess}
                paymentsList={paymentsList}
                fetchPayments={fetchPayments}
                fetchUserPurchases={fetchUserPurchases}
                T={T}
              />
            )}

            {/* ------------------------------------------------------------------ */}
            {/* TEACHER: ASSIGNED STUDENT DOUBTS                                   */}
            {/* ------------------------------------------------------------------ */}
            {activeNav === '📥 Assigned Student Doubts' && (
              <TeacherAssignedDoubtsSection
                user={user}
                T={T}
                getQText={getQText}
              />
            )}

            {/* ------------------------------------------------------------------ */}
            {/* TEACHER: CHECK ASSIGNED ANSWER SHEETS                              */}
            {/* ------------------------------------------------------------------ */}
            {activeNav === '📝 Check Assigned Answer Sheets' && (
              <TeacherCheckSheetsSection
                user={user}
                examSubmissions={examSubmissions}
                fetchExamSubmissions={fetchExamSubmissions}
                downloadTextFile={downloadTextFile}
                T={T}
              />
            )}

            {/* ------------------------------------------------------------------ */}
            {/* TEACHER: SEND SUGGESTIONS TO ADMIN                                 */}
            {/* ------------------------------------------------------------------ */}
            {activeNav === '📤 Send Suggestions to Admin' && (
              <TeacherSendSuggestionsSection
                user={user}
                teacherSubmissions={teacherSubmissions}
                fetchTeacherSubmissions={fetchTeacherSubmissions}
                T={T}
              />
            )}

            {/* ------------------------------------------------------------------ */}
            {/* TEACHER / ADMIN: STUDENT TRACK RECORDS                             */}
            {/* ------------------------------------------------------------------ */}
            {(activeNav === '👨‍🏫 Student Track Records' || activeNav === '📊 Analytics & Track Records') && (
              <TrackRecordsSection
                studentScores={studentScores}
                fetchStudentScores={fetchStudentScores}
                T={T}
              />
            )}

            {/* ------------------------------------------------------------------ */}
            {/* ADMIN / TEACHER: QUESTION BANK MANAGER                             */}
            {/* ------------------------------------------------------------------ */}
            {activeNav === '📖 Question Bank Manager' && (
              <QuestionBankManagerSection
                topics={topics}
                selectedTopicId={selectedTopicId}
                setSelectedTopicId={setSelectedTopicId}
                questions={questions}
                fetchQuestions={fetchQuestions}
                userRole={effectiveRole}
                downloadTextFile={downloadTextFile}
                T={T}
              />
            )}

            {/* ------------------------------------------------------------------ */}
            {/* ADMIN: SEND STUDENT NOTIFICATIONS                                  */}
            {/* ------------------------------------------------------------------ */}
            {activeNav === '📢 Send Student Notifications' && (
              <AdminSendNotificationsSection
                allUsers={allUsers}
                T={T}
              />
            )}

            {/* ------------------------------------------------------------------ */}
            {/* ADMIN: PROMO CODE REQUESTS                                         */}
            {/* ------------------------------------------------------------------ */}
            {activeNav === '🎟️ Promo Code Requests' && (
              <AdminPromoRequestsSection
                promoRequests={promoRequests}
                fetchPromoRequests={fetchPromoRequests}
                settings={settings}
                T={T}
              />
            )}

            {/* ------------------------------------------------------------------ */}
            {/* ADMIN: USER APPROVALS                                              */}
            {/* ------------------------------------------------------------------ */}
            {activeNav === '🛡️ User Approvals' && (
              <AdminUserApprovalsSection
                allUsers={allUsers}
                fetchAllUsers={fetchAllUsers}
                T={T}
                user={user}
                setAlertMsg={setAlertMsg}
              />
            )}

            {/* ------------------------------------------------------------------ */}
            {/* ADMIN: STUDENT DOUBT ASSIGNMENT HUB                                */}
            {/* ------------------------------------------------------------------ */}
            {activeNav === '❓ Student Doubt Assignment Hub' && (
              <AdminDoubtAssignmentHub
                allDoubts={allDoubts}
                allUsers={allUsers}
                fetchAllDoubts={fetchAllDoubts}
                T={T}
                getQText={getQText}
              />
            )}

            {/* ------------------------------------------------------------------ */}
            {/* ADMIN: UPLOAD MOCK TESTS & SUGGESTIONS                             */}
            {/* ------------------------------------------------------------------ */}
            {activeNav === '📄 Upload Mock Tests & Suggestions' && (
              <AdminUploadMockTestsSection
                mockTests={mockTests}
                fetchMockTests={fetchMockTests}
                T={T}
              />
            )}

            {/* ------------------------------------------------------------------ */}
            {/* ADMIN: TEACHER SUBMISSIONS REVIEW                                  */}
            {/* ------------------------------------------------------------------ */}
            {activeNav === '📤 Teacher Submissions Review' && (
              <AdminTeacherSubmissionsReview
                teacherSubmissions={teacherSubmissions}
                fetchTeacherSubmissions={fetchTeacherSubmissions}
                fetchMockTests={fetchMockTests}
                downloadTextFile={downloadTextFile}
                T={T}
              />
            )}

            {/* ------------------------------------------------------------------ */}
            {/* ADMIN: ASK CORNER SUGGESTIONS                                      */}
            {/* ------------------------------------------------------------------ */}
            {activeNav === '💡 Ask Corner Suggestions' && (
              <AdminAskCornerReview
                askCornerList={askCornerList}
                fetchAskCorner={fetchAskCorner}
                T={T}
              />
            )}

            {/* ------------------------------------------------------------------ */}
            {/* ADMIN: PAYMENT VERIFICATIONS                                       */}
            {/* ------------------------------------------------------------------ */}
            {activeNav === '💳 Payment Verifications' && (
              <AdminPaymentVerificationsSection
                paymentsList={paymentsList}
                fetchPayments={fetchPayments}
                T={T}
              />
            )}

            {/* ------------------------------------------------------------------ */}
            {/* ADMIN: EXAM ANSWER SHEET CHECKING                                  */}
            {/* ------------------------------------------------------------------ */}
            {activeNav === '📝 Exam Answer Sheet Checking' && (
              <AdminExamCheckingSection
                examSubmissions={examSubmissions}
                allUsers={allUsers}
                fetchExamSubmissions={fetchExamSubmissions}
                downloadTextFile={downloadTextFile}
                T={T}
              />
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* INTERACTIVE QUESTION DOUBT MODAL (Ask Admin / Teacher)               */}
        {/* ==================================================================== */}
        {doubtModal && doubtModal.isOpen && (
          <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg text-lg">🙋</span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      {T("অ্যাডমিন / স্যারের কাছে প্রশ্ন পাঠান", "Ask Admin / Teacher")}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {T(`প্রশ্ন #Q${doubtModal.questionNumber} সম্পর্কে সন্দেহ বা ব্যাখ্যা চান`, `Inquire about Question #Q${doubtModal.questionNumber}`)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDoubtModal(null)}
                  className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
                >
                  ✕
                </button>
              </div>

              {/* Question text preview */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 mb-4 text-xs">
                <span className="font-bold text-indigo-700 block mb-1">
                  Q{doubtModal.questionNumber}.
                </span>
                <p className="text-slate-800 line-clamp-3 font-medium">
                  {doubtModal.questionText}
                </p>
              </div>

              {/* Doubt Note Textarea */}
              <div className="mb-4">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {T("আপনার নির্দিষ্ট কোনো প্রশ্ন বা দ্বিধা থাকলে লিখুন (ঐচ্ছিক):", "What would you like explained? (Optional):")}
                </label>
                <textarea
                  value={doubtModal.doubtText}
                  onChange={e => setDoubtModal(prev => prev ? { ...prev, doubtText: e.target.value } : null)}
                  placeholder={T(
                    "যেমন: এই প্রশ্নের সঠিক উত্তর কেন হলো তা সংক্ষেপে বুঝিয়ে দিলে ভালো হয়...",
                    "e.g. Please explain why this option is correct, or clarify the concept..."
                  )}
                  rows={3}
                  className="st-input w-full text-xs"
                />

                {/* Quick suggestions */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[
                    "উত্তরের ব্যাখ্যা দিন",
                    "বিকল্পগুলো বুঝতে পারছি না",
                    "সহজ ভাষায় বুঝিয়ে দিন"
                  ].map(chip => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setDoubtModal(prev => prev ? { ...prev, doubtText: chip } : null)}
                      className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 transition"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDoubtModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  {T("বাতিল", "Cancel")}
                </button>
                <button
                  type="button"
                  onClick={submitDoubtModal}
                  className="st-btn bg-indigo-600 hover:bg-indigo-700 text-xs py-2 px-5 font-bold flex items-center gap-1.5 text-white shadow-sm"
                >
                  <span>✉️</span>
                  <span>{T("স্যারের কাছে পাঠান", "Send to Teacher")}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* FOOTER                                                               */}
        {/* ==================================================================== */}
        <div className="footer-block">
          <h3 className="text-xl font-bold mb-1">
            Prepared by - Shawon Kar, Sukannya Chakraborty
          </h3>
          <p className="text-base font-medium">M.Sc. in Geography (University Of Calcutta)</p>
          <p className="text-sm text-slate-400">B.Ed. (Baba Saheb Ambedkar Education University)</p>
          <p className="text-lg font-bold text-sky-400 mt-3">📞 Ph No - 7001257277</p>
        </div>
      </main>

      {/* ======================================================================== */}
      {/* MOBILE BOTTOM NAVIGATION BAR (Thumb Friendly on Phones)                  */}
      {/* ======================================================================== */}
      <MobileBottomNav
        user={user}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        openMobileMenu={() => setMobileMenuOpen(true)}
        language={language}
      />
    </div>
  );
}

// ============================================================================
// QUESTION TABS COMPONENT (Practice Center)
// ============================================================================
function QuestionTabs({
  topicId,
  mcqView, saqView, q2View, q3View, q5View,
  mcqTotal, saqTotal, q2Total, q3Total, q5Total,
  selectedAnswers, setSelectedAnswers, onAskDoubt, downloadTextFile,
  T, getQText, language,
  user, effectiveRole, isPaid, settings, setActiveNav
}: any) {
  const [activeTab, setActiveTab] = useState<'mcq' | 'saq' | '2m' | '3m' | '5m'>('mcq');
  const [openAnswers, setOpenAnswers] = useState<Record<number, boolean>>({});

  const fmt = (view: number, total: number) => (view >= total ? `${total}` : `${view}/${total}`);
  const fullPrice = Number(settings?.full_access_price) || 399;

  return (
    <div className="space-y-4">
      {/* Category Nav buttons */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-200 rounded-xl">
        <button
          type="button"
          onClick={() => setActiveTab('mcq')}
          className={`py-2 px-4 rounded-lg font-bold text-xs transition ${
            activeTab === 'mcq' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-700 hover:bg-slate-300'
          }`}
        >
          📝 MCQ ({fmt(mcqView.length, mcqTotal)})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('saq')}
          className={`py-2 px-4 rounded-lg font-bold text-xs transition ${
            activeTab === 'saq' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-700 hover:bg-slate-300'
          }`}
        >
          ✏️ SAQ ({fmt(saqView.length, saqTotal)})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('2m')}
          className={`py-2 px-4 rounded-lg font-bold text-xs transition ${
            activeTab === '2m' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-700 hover:bg-slate-300'
          }`}
        >
          📘 2 Marks ({fmt(q2View.length, q2Total)})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('3m')}
          className={`py-2 px-4 rounded-lg font-bold text-xs transition ${
            activeTab === '3m' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-700 hover:bg-slate-300'
          }`}
        >
          📗 3 Marks ({fmt(q3View.length, q3Total)})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('5m')}
          className={`py-2 px-4 rounded-lg font-bold text-xs transition ${
            activeTab === '5m' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-700 hover:bg-slate-300'
          }`}
        >
          📕 5 Marks ({fmt(q5View.length, q5Total)})
        </button>
      </div>

      {/* MCQs */}
      {activeTab === 'mcq' && (
        <div className="space-y-4">
          {mcqView.length === 0 ? (
            <p className="p-6 bg-white rounded-xl text-center text-slate-500">No MCQs in this chapter.</p>
          ) : (
            mcqView.map((q: any, idx: number) => {
              const qText = getQText(q.question_text, q.question_text_en);
              const userAns = selectedAnswers[q.id];
              const isCorrect = userAns === q.correct_option;

              return (
                <div key={q.id} className="card-short">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                      MCQ
                    </span>
                    <span className="text-xs text-slate-400">#Q{idx + 1}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base mb-2">
                    Q{idx + 1}. {qText}
                  </h4>

                  {/* Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                    {['A', 'B', 'C', 'D'].map(opt => {
                      const optText = getQText(q[`option_${opt.toLowerCase()}`], q[`option_${opt.toLowerCase()}_en`]);
                      const isSelected = userAns === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setSelectedAnswers((prev: any) => ({ ...prev, [q.id]: opt }))}
                          className={`text-left p-3 rounded-lg border text-sm font-semibold transition ${
                            isSelected
                              ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-300'
                              : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-800'
                          }`}
                        >
                          <strong>{opt})</strong> {optText}
                        </button>
                      );
                    })}
                  </div>

                  {/* Immediate Feedback */}
                  {userAns && (
                    <div className="mt-3 p-3 rounded-lg text-sm font-bold">
                      {isCorrect ? (
                        <div className="text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-300">
                          ✅ {T("Correct Answer!", "Correct Answer!")}
                        </div>
                      ) : (
                        <div className="text-red-700 bg-red-50 p-2.5 rounded-lg border border-red-300">
                          ❌ {T("Incorrect.", "Incorrect.")} {T("Correct option is:", "Correct option is:")} <strong>{q.correct_option}</strong>
                        </div>
                      )}
                      {(q.explanation || q.explanation_en) && (
                        <div className="mt-2 text-xs text-slate-700 bg-slate-50 p-2 rounded border border-slate-200">
                          💡 <strong>{T("Explanation", "Explanation")}:</strong> {getQText(q.explanation, q.explanation_en)}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Ask Admin / Teacher button on MCQ */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onAskDoubt(q.id, idx + 1, qText)}
                      className="st-btn bg-indigo-600 hover:bg-indigo-700 text-xs py-1.5 px-3 flex items-center gap-1.5 text-white rounded-lg font-semibold shadow-xs"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      {T(`🙋 Ask Admin / সন্দেহ জানান (Q${idx + 1})`, `🙋 Ask Admin / Doubt (Q${idx + 1})`)}
                    </button>
                    <span className="text-[11px] text-slate-400">
                      {T("এই MCQ সম্পর্কে ডাউট থাকলে সরাসরি স্যারের সাহায্য নিন", "Ask teacher about this MCQ")}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* SAQs */}
      {activeTab === 'saq' && (
        <div className="space-y-4">
          {saqView.length === 0 ? (
            <p className="p-6 bg-white rounded-xl text-center text-slate-500">No SAQs in this chapter.</p>
          ) : (
            saqView.map((q: any, idx: number) => {
              const displayQ = getQText(q.question_text, q.question_text_en);
              const displayAns = getQText(q.model_answer || q.correct_option || '', q.model_answer_en || '');
              const isOpen = openAnswers[q.id];

              return (
                <div key={q.id} className="card-short" style={{ borderLeftColor: '#059669' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                      <span>✏️</span>
                      <span>SAQ [১ নম্বর]</span>
                    </span>
                    <span className="text-xs text-slate-400">#Q{idx + 1}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base mb-2">
                    Q{idx + 1}. {displayQ}
                  </h4>

                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => setOpenAnswers(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {isOpen ? T("উত্তর লুকান (Hide Answer)", "Hide Answer") : T("👁️ উত্তর দেখুন (View Answer)", "👁️ View Answer")}
                    </button>
                    {isOpen && (
                      <div className="mt-2.5 p-3.5 bg-emerald-50 rounded-xl border border-emerald-300 text-sm shadow-xs animate-in fade-in duration-200">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-950 mb-1.5">
                          <span>✅</span>
                          <span>{T("সঠিক উত্তর (Answer):", "Correct Answer:")}</span>
                        </div>
                        <div className="font-bold text-emerald-900 bg-white p-2.5 rounded-lg border border-emerald-200 text-sm leading-relaxed">
                          {displayAns || T("উত্তর শীঘ্রই যোগ করা হবে।", "Answer will be updated soon.")}
                        </div>
                        {(q.explanation || q.explanation_en) && (
                          <div className="text-xs text-emerald-800 mt-2 bg-emerald-100/60 p-2 rounded-lg border border-emerald-200">
                            💡 <strong>{T("ব্যাখ্যা (Explanation):", "Explanation:")}</strong> {getQText(q.explanation, q.explanation_en)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Ask Admin / Teacher button on SAQ */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onAskDoubt(q.id, idx + 1, displayQ)}
                      className="st-btn bg-indigo-600 hover:bg-indigo-700 text-xs py-1.5 px-3 flex items-center gap-1.5 text-white rounded-lg font-semibold shadow-xs"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      {T(`🙋 Ask Admin / সন্দেহ জানান (Q${idx + 1})`, `🙋 Ask Admin / Doubt (Q${idx + 1})`)}
                    </button>
                    <span className="text-[11px] text-slate-400">
                      {T("এই SAQ উত্তর বুঝতে না পারলে সরাসরি সাহায্য নিন", "Get explanation from teacher for this SAQ")}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 2 Marks */}
      {activeTab === '2m' && (
        <div className="space-y-6">
          <DescriptiveList
            questions={q2View}
            marks={2}
            badgeColor="bg-purple-600"
            borderLeftColor="#7c3aed"
            onAskDoubt={onAskDoubt}
            downloadTextFile={downloadTextFile}
            T={T}
            getQText={getQText}
            language={language}
          />
          <ChapterAnswerSheetsSection
            topicId={topicId}
            marksType="2m"
            isPaid={isPaid}
            user={user}
            effectiveRole={effectiveRole}
            fullPrice={fullPrice}
            setActiveNav={setActiveNav}
            T={T}
            downloadTextFile={downloadTextFile}
            language={language}
          />
        </div>
      )}

      {/* 3 Marks */}
      {activeTab === '3m' && (
        <div className="space-y-6">
          <DescriptiveList
            questions={q3View}
            marks={3}
            badgeColor="bg-emerald-600"
            borderLeftColor="#16a34a"
            onAskDoubt={onAskDoubt}
            downloadTextFile={downloadTextFile}
            T={T}
            getQText={getQText}
            language={language}
          />
          <ChapterAnswerSheetsSection
            topicId={topicId}
            marksType="3m"
            isPaid={isPaid}
            user={user}
            effectiveRole={effectiveRole}
            fullPrice={fullPrice}
            setActiveNav={setActiveNav}
            T={T}
            downloadTextFile={downloadTextFile}
            language={language}
          />
        </div>
      )}

      {/* 5 Marks */}
      {activeTab === '5m' && (
        <div className="space-y-6">
          <DescriptiveList
            questions={q5View}
            marks={5}
            badgeColor="bg-red-600"
            borderLeftColor="#dc2626"
            onAskDoubt={onAskDoubt}
            downloadTextFile={downloadTextFile}
            T={T}
            getQText={getQText}
            language={language}
          />
          <ChapterAnswerSheetsSection
            topicId={topicId}
            marksType="5m"
            isPaid={isPaid}
            user={user}
            effectiveRole={effectiveRole}
            fullPrice={fullPrice}
            setActiveNav={setActiveNav}
            T={T}
            downloadTextFile={downloadTextFile}
            language={language}
          />
        </div>
      )}
    </div>
  );
}

function DescriptiveList({
  questions, marks, badgeColor, borderLeftColor, onAskDoubt, downloadTextFile, T, getQText, language
}: any) {
  const [openOutline, setOpenOutline] = useState<Record<number, boolean>>({});

  if (questions.length === 0) {
    return <p className="p-6 bg-white rounded-xl text-center text-slate-500">No {marks} Marks questions in this chapter.</p>;
  }

  return (
    <div className="space-y-4">
      {questions.map((q: any, idx: number) => {
        const qText = getQText(q.question_text, q.question_text_en);
        const modelAns = getQText(q.model_answer, q.model_answer_en);
        const marking = getQText(q.marking_scheme, q.marking_scheme_en);
        const isOpen = openOutline[q.id];

        return (
          <div key={q.id} className="card-broad" style={{ borderLeftColor }}>
            <div className="flex items-center justify-between mb-2">
              <span className={`${badgeColor} text-white text-xs font-bold px-2 py-0.5 rounded`}>
                {marks} Marks
              </span>
              <span className="text-xs text-slate-400">#Q{idx + 1}</span>
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-2">
              Q{idx + 1}. {qText}
            </h4>

            {/* Inline Model Outline if entered by teacher */}
            {modelAns && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => setOpenOutline(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                  className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-lg transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  {isOpen ? T("উত্তর রূপরেখা লুকান", "Hide Answer Outline") : T("👁️ মডেল উত্তর / রূপরেখা দেখুন", "👁️ View Model Outline")}
                </button>
                {isOpen && (
                  <div className="mt-2.5 p-3.5 bg-indigo-50/80 rounded-xl border border-indigo-200 text-sm shadow-xs animate-in fade-in duration-200 space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-indigo-950">
                      <span>📝</span>
                      <span>{T("মডেল উত্তর রূপরেখা (Model Outline):", "Model Solution Outline:")}</span>
                    </div>
                    <p className="whitespace-pre-wrap text-slate-800 text-xs font-medium leading-relaxed bg-white p-3 rounded-lg border border-indigo-100">
                      {modelAns}
                    </p>
                    {marking && (
                      <div className="text-xs text-indigo-900 bg-indigo-100/60 p-2 rounded-lg border border-indigo-200">
                        ⚖️ <strong>{T("নম্বর বিভাজন (Marking Scheme):", "Marking Scheme:")}</strong> {marking}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Ask Admin / Teacher button */}
            <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => onAskDoubt(q.id, idx + 1, qText)}
                className="st-btn bg-indigo-600 hover:bg-indigo-700 text-xs py-2 px-4 flex items-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                {T(`🙋 Ask Admin / Teacher (Q${idx + 1})`, `🙋 Ask Admin / Teacher (Q${idx + 1})`)}
              </button>
              {modelAns && (
                <button
                  type="button"
                  onClick={() => downloadTextFile(`Model_Answer_Q${idx + 1}.txt`, modelAns)}
                  className="text-xs text-slate-600 hover:text-slate-900 font-bold flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  {T("Download Model Outline", "Download Model Outline")}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// CHAPTER OFFICIAL MODEL ANSWER SHEETS COMPONENT (2M, 3M, 5M)
// ============================================================================
function ChapterAnswerSheetsSection({
  topicId, marksType, isPaid, user, effectiveRole, fullPrice, setActiveNav, T, downloadTextFile, language
}: any) {
  const [sheets, setSheets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingTier, setUploadingTier] = useState<string | null>(null);
  const [teacherLang, setTeacherLang] = useState<'Bengali' | 'English'>(language === 'English' ? 'English' : 'Bengali');

  const canManage = effectiveRole === 'admin' || effectiveRole === 'teacher';

  const fetchSheets = async () => {
    if (!topicId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/chapter_answer_sheets?topic_id=${topicId}&marks_type=${marksType}`);
      const data = await res.json();
      setSheets(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setSheets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSheets();
  }, [topicId, marksType]);

  const handleUploadSheet = (tier: 'free' | 'paid', file: File) => {
    if (!file) return;
    setUploadingTier(`${tier}-${teacherLang}`);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const fileData = reader.result as string;
        const res = await fetch('/api/chapter_answer_sheets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic_id: topicId,
            marks_type: marksType,
            access_tier: tier,
            language: teacherLang,
            title: `${marksType.toUpperCase()} ${tier === 'free' ? 'সাধারণ স্যাম্পল উত্তরপত্র' : 'পেইড সম্পূর্ণ মডেল উত্তরপত্র'} (${teacherLang === 'English' ? 'English Medium' : 'বাংলা মাধ্যম'})`,
            file_name: file.name,
            file_data: fileData,
            uploaded_by: user ? `${user.full_name} (${user.role})` : 'Teacher'
          })
        });
        if (res.ok) {
          alert(`🎉 সফলভাবে ${marksType.toUpperCase()} (${teacherLang === 'English' ? 'English Medium' : 'বাংলা মাধ্যম'} - ${tier === 'free' ? 'Free' : 'Paid'}) PDF উত্তরপত্র আপলোড হয়েছে!`);
          fetchSheets();
        } else {
          const err = await res.json();
          alert(err.error || 'Upload failed');
        }
      } catch (e: any) {
        alert(e.message);
      } finally {
        setUploadingTier(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadSheet = async (id: number, fallbackName: string) => {
    try {
      const res = await fetch(`/api/chapter_answer_sheets/${id}/file`);
      const data = await res.json();
      if (data && data.file_data) {
        downloadTextFile(data.file_name || fallbackName, data.file_data);
      } else {
        alert('File content not available');
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleDeleteSheet = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this answer sheet?')) return;
    try {
      await fetch(`/api/chapter_answer_sheets/${id}`, { method: 'DELETE' });
      fetchSheets();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const marksLabel = marksType === '2m' ? '২ নম্বরের' : (marksType === '3m' ? '৩ নম্বরের' : '৫ নম্বরের');
  const marksEn = marksType === '2m' ? '2 Marks' : (marksType === '3m' ? '3 Marks' : '5 Marks');

  const targetStudentLang = language === 'English' ? 'English' : 'Bengali';
  const freeSheet = canManage
    ? sheets.find(s => s.access_tier === 'free' && (s.language === teacherLang || (!s.language && teacherLang === 'Bengali')))
    : (sheets.find(s => s.access_tier === 'free' && s.language === targetStudentLang) || sheets.find(s => s.access_tier === 'free'));

  const paidSheet = canManage
    ? sheets.find(s => (s.access_tier === 'paid' || !s.access_tier) && (s.language === teacherLang || (!s.language && teacherLang === 'Bengali')))
    : (sheets.find(s => (s.access_tier === 'paid' || !s.access_tier) && s.language === targetStudentLang) || sheets.find(s => s.access_tier === 'paid' || !s.access_tier));

  // -------------------- TEACHER / ADMIN VIEW --------------------
  if (canManage) {
    return (
      <div className="mt-8 p-6 bg-gradient-to-br from-indigo-50/90 via-white to-blue-50/90 border-2 border-indigo-200 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-100 pb-3">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-indigo-600 text-white rounded-xl text-xl shadow-xs">📑</span>
            <div>
              <h4 className="font-black text-indigo-950 text-base">
                {T(`শিক্ষক / অ্যাডমিন: ${marksLabel} PDF উত্তরপত্র নিয়ন্ত্রণ`, `Teacher / Admin: ${marksEn} PDF Answer Sheets Control`)}
              </h4>
              <p className="text-xs text-indigo-700 font-medium">
                {T("বাংলা ও ইংরেজি উভয় মাধ্যমের জন্য সাধারণ (Free) ও পেইড (Paid) PDF আলাদাভাবে আপলোড করুন।",
                   "Upload separate Free & Paid PDFs for both Bengali and English medium students.")}
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-indigo-800 bg-indigo-100 border border-indigo-300 px-3 py-1 rounded-full">
            ⚙️ {T("শিক্ষক / অ্যাডমিন প্যানেল", "Teacher / Admin Mode")}
          </span>
        </div>

        {/* Medium / Language Selector for Teacher */}
        <div className="flex items-center gap-2 bg-indigo-100/70 p-1.5 rounded-xl w-fit border border-indigo-200">
          <button
            type="button"
            onClick={() => setTeacherLang('Bengali')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              teacherLang === 'Bengali' ? 'bg-indigo-600 text-white shadow-xs' : 'text-indigo-800 hover:bg-white/60'
            }`}
          >
            <span>🇧🇩</span>
            <span>বাংলা মাধ্যম উত্তরপত্র</span>
          </button>
          <button
            type="button"
            onClick={() => setTeacherLang('English')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              teacherLang === 'English' ? 'bg-indigo-600 text-white shadow-xs' : 'text-indigo-800 hover:bg-white/60'
            }`}
          >
            <span>🇬🇧</span>
            <span>English Medium Answer Sheet</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Free Sheet Manager */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>📄</span>
                  <span>{teacherLang === 'English' ? 'English Medium (Normal / Free)' : 'সাধারণ ছাত্রছাত্রীদের জন্য (বাংলা মাধ্যম)'}</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">Free Tier</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-2">
                এই PDF ফাইলটি সব সাধারণ শিক্ষার্থীরা ফ্রি-তে ডাউনলোড করতে পারবে।
              </p>

              {freeSheet ? (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <p className="text-xs font-bold text-slate-800 truncate">📎 {freeSheet.file_name}</p>
                  <p className="text-[10px] text-slate-400">
                    ভাষা: {freeSheet.language || 'Bengali'} | আপলোড: {freeSheet.timestamp?.split(' ')[0]} | By: {freeSheet.uploaded_by}
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleDownloadSheet(freeSheet.id, freeSheet.file_name)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" /> ডাউনলোড
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSheet(freeSheet.id)}
                      className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> মুছুন
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-amber-50/60 rounded-lg border border-dashed border-amber-300 text-xs text-amber-800">
                  ⚠️ {teacherLang === 'English' ? 'English Medium Free PDF এখনো আপলোড করা হয়নি।' : 'বাংলা মাধ্যম সাধারণ PDF এখনও আপলোড করা হয়নি।'}
                </div>
              )}
            </div>

            <label className="block">
              <span className="st-btn bg-slate-700 hover:bg-slate-800 text-white text-xs py-2 px-4 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer w-full text-center">
                <Upload className="w-3.5 h-3.5" />
                <span>
                  {uploadingTier === `free-${teacherLang}` ? 'আপলোড হচ্ছে...' : (freeSheet ? `ফাইল পরিবর্তন করুন (${teacherLang} Free PDF)` : `${teacherLang === 'English' ? 'English Free' : 'বাংলা সাধারণ'} PDF আপলোড করুন`)}
                </span>
              </span>
              <input
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                disabled={uploadingTier === `free-${teacherLang}`}
                onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) handleUploadSheet('free', f);
                  e.target.value = '';
                }}
                className="hidden"
              />
            </label>
          </div>

          {/* Paid Sheet Manager */}
          <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <span>🌟</span>
                  <span>{teacherLang === 'English' ? 'English Medium (Full Access / Paid)' : 'পেইড ছাত্রছাত্রীদের জন্য (বাংলা মাধ্যম)'}</span>
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-100 text-amber-800">Paid Tier</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-2">
                এই PDF ফাইলে সম্পূর্ণ পয়েন্টভিত্তিক মডেল উত্তর থাকবে, যা শুধু পেইড শিক্ষার্থীরা দেখতে পাবে।
              </p>

              {paidSheet ? (
                <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-200 space-y-1">
                  <p className="text-xs font-bold text-slate-800 truncate">⭐ {paidSheet.file_name}</p>
                  <p className="text-[10px] text-slate-400">
                    ভাষা: {paidSheet.language || 'Bengali'} | আপলোড: {paidSheet.timestamp?.split(' ')[0]} | By: {paidSheet.uploaded_by}
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleDownloadSheet(paidSheet.id, paidSheet.file_name)}
                      className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" /> ডাউনলোড
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSheet(paidSheet.id)}
                      className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> মুছুন
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-amber-50/60 rounded-lg border border-dashed border-amber-300 text-xs text-amber-800">
                  ⚠️ {teacherLang === 'English' ? 'English Medium Paid PDF এখনো আপলোড করা হয়নি।' : 'বাংলা মাধ্যম পেইড শিক্ষার্থীদের জন্য এখনও কোনো PDF আপলোড করা হয়নি।'}
                </div>
              )}
            </div>

            <label className="block">
              <span className="st-btn bg-amber-600 hover:bg-amber-700 text-white text-xs py-2 px-4 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer w-full text-center shadow-xs">
                <Upload className="w-3.5 h-3.5" />
                <span>
                  {uploadingTier === `paid-${teacherLang}` ? 'আপলোড হচ্ছে...' : (paidSheet ? `ফাইল পরিবর্তন করুন (${teacherLang} Paid PDF)` : `${teacherLang === 'English' ? 'English Paid' : 'বাংলা পেইড'} PDF আপলোড করুন`)}
                </span>
              </span>
              <input
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                disabled={uploadingTier === `paid-${teacherLang}`}
                onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) handleUploadSheet('paid', f);
                  e.target.value = '';
                }}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    );
  }

  // -------------------- NORMAL / UNPAID STUDENT VIEW --------------------
  if (!isPaid) {
    return (
      <div className="mt-8 space-y-4">
        {/* Free Sample Sheet Card */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm">📄</span>
              <span>{T(`সাধারণ ছাত্রছাত্রীদের জন্য ${marksLabel} উত্তরপত্র`, `Normal Student ${marksEn} Answer Sheet`)}</span>
            </span>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">
              Free Access
            </span>
          </div>

          {loading ? (
            <p className="text-xs text-slate-500 py-2">Loading answer sheet...</p>
          ) : freeSheet ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <h5 className="font-bold text-slate-900 text-sm">{freeSheet.title}</h5>
                <p className="text-xs text-slate-500 mt-0.5">File: {freeSheet.file_name} | By: {freeSheet.uploaded_by}</p>
              </div>
              <button
                type="button"
                onClick={() => handleDownloadSheet(freeSheet.id, freeSheet.file_name)}
                className="st-btn bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 px-4 rounded-xl font-bold flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{T("📥 স্যাম্পল PDF ডাউনলোড", "📥 Download Sample PDF")}</span>
              </button>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 italic">
              {T("এই অধ্যায়ের জন্য সাধারণ স্যাম্পল উত্তরপত্র শীঘ্রই যুক্ত করা হবে।", "Free sample answer sheet for this chapter will be added soon.")}
            </div>
          )}
        </div>

        {/* Locked Paid Complete Sheet Card */}
        <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-start gap-3">
            <span className="p-3 bg-amber-200 text-amber-950 rounded-2xl text-2xl shrink-0">🔒</span>
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-200 text-amber-900 mb-1">
                Official Full Access Model Answer Sheet
              </div>
              <h4 className="font-black text-amber-950 text-base md:text-lg">
                {T(`অফিসিয়াল সম্পূর্ণ ${marksLabel} মডেল উত্তরপত্র ও চিত্র নির্দেশিকা`, `Official Complete ${marksEn} Model Answer Sheet & Diagrams`)}
              </h4>
              <p className="text-xs md:text-sm text-amber-900/80 font-medium mt-1 leading-relaxed">
                {T(
                  `পশ্চিমবঙ্গ মধ্যশিক্ষা পর্ষদের অভিজ্ঞ ভূগোল শিক্ষকদের তৈরি প্রতিটি অধ্যায়ের সম্পূর্ণ ${marksLabel} পয়েন্ট-ভিত্তিক মডেল উত্তরপত্র ও চিত্র আঁকার নির্দেশিকা ফুল অ্যাক্সেস শিক্ষার্থীদের জন্য সংরক্ষিত। ফুল অ্যাক্সেস আনলক করলে আপনি সম্পূর্ণ PDF দেখতে ও ডাউনলোড করতে পারবেন।`,
                  `Curated by top WBBSE Geography teachers with point-wise marking schemes, model answers and diagram outlines. Unlocked with Full Access.`
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-amber-200/80">
            <span className="text-xs font-bold text-amber-950">
              {T(`Full Access (₹${fullPrice}) কিনলে প্রতিটি অধ্যায়ের সব পেইড উত্তরপত্র ও প্রশ্ন আনলক হবে।`,
                 `Full Access (₹${fullPrice}) unlocks all chapter questions & answer sheets.`)}
            </span>
            <button
              type="button"
              onClick={() => setActiveNav('💳 Pricing & Payment')}
              className="st-btn bg-amber-600 hover:bg-amber-700 text-white text-xs py-2 px-5 font-bold rounded-xl shadow-sm"
            >
              💳 {T("Full Access কিনুন ও আনলক করুন", "Unlock Full Access")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------- PAID STUDENT VIEW --------------------
  return (
    <div className="mt-8 space-y-4">
      {/* Full Access Complete Sheet Card */}
      <div className="p-6 bg-gradient-to-br from-indigo-50/90 via-white to-blue-50/90 border-2 border-indigo-200 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-100 pb-3">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-indigo-600 text-white rounded-xl text-xl shadow-xs">🌟</span>
            <div>
              <h4 className="font-black text-indigo-950 text-base">
                {T(`অফিসিয়াল সম্পূর্ণ ${marksLabel} মডেল উত্তরপত্র (Official Full Model Answer Sheet)`, `Official Complete ${marksEn} Model Answer Sheet`)}
              </h4>
              <p className="text-xs text-indigo-700 font-medium">
                {T("আপনার সম্পূর্ণ অ্যাক্সেস সক্রিয় থাকায় আপনি সরাসরি অফিশিয়াল মডেল কপি দেখতে ও ডাউনলোড করতে পারবেন।",
                   "Full access active — download or preview official model copies.")}
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full shadow-2xs">
            ✅ {T("আনলকড (Full Access)", "Unlocked (Full Access)")}
          </span>
        </div>

        {loading ? (
          <p className="text-xs text-slate-500 py-3 text-center">Loading answer sheet...</p>
        ) : paidSheet ? (
          <div className="bg-white p-4 rounded-xl border border-indigo-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h5 className="font-bold text-slate-900 text-sm mb-1">{paidSheet.title}</h5>
              <p className="text-xs text-slate-500">File: {paidSheet.file_name} | By: {paidSheet.uploaded_by}</p>
            </div>
            <button
              type="button"
              onClick={() => handleDownloadSheet(paidSheet.id, paidSheet.file_name)}
              className="st-btn text-xs py-2 px-4 flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs shrink-0 self-start sm:self-auto"
            >
              <Download className="w-4 h-4" /> {T("📥 সম্পূর্ণ উত্তরপত্র ডাউনলোড করুন", "📥 Download Complete PDF")}
            </button>
          </div>
        ) : (
          <div className="p-4 bg-white rounded-xl border border-dashed border-indigo-200 text-center text-xs text-slate-500">
            {T("এই অধ্যায়ের জন্য অফিসিয়াল মডেল উত্তরপত্র শীঘ্রই আপলোড করা হবে।", "Model answer sheets for this chapter will be uploaded soon.")}
          </div>
        )}

        {/* Free sample link if also uploaded */}
        {freeSheet && (
          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-indigo-100">
            <span>সাধারণ সংস্করণের ফাইল: {freeSheet.file_name}</span>
            <button
              type="button"
              onClick={() => handleDownloadSheet(freeSheet.id, freeSheet.file_name)}
              className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <Download className="w-3 h-3" /> স্যাম্পল ফাইল ডাউনলোড
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// STUDENT EXAM SUBMISSIONS SECTION
// ============================================================================
function StudentExamSubmissionsSection({
  user, mockTests, hasMockAccess, examSubmissions, fetchExamSubmissions, downloadTextFile, T
}: any) {
  const [selectedMock, setSelectedMock] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [fileData, setFileData] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const unlockedMocks = mockTests.filter((m: any) => hasMockAccess(m.test_type, m.id));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setFileData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMock || !fileName) {
      alert('Please select exam and choose file');
      return;
    }
    setSubmitting(true);
    try {
      const mockObj = mockTests.find((m: any) => m.code_num === selectedMock);
      const res = await fetch('/api/exam_submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_username: user.username,
          student_name: user.full_name,
          exam_type: mockObj?.test_type || 'Mock Test',
          exam_code: selectedMock,
          answer_file_name: fileName,
          answer_file_data: fileData
        })
      });
      if (res.ok) {
        alert('🎉 Answer Sheet Submitted Successfully!');
        setFileName('');
        setFileData('');
        fetchExamSubmissions();
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">{T("📝 My Exam Submissions", "📝 My Exam Submissions")}</h2>

      {unlockedMocks.length === 0 ? (
        <div className="p-6 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 font-bold">
          ⚠️ {T("First unlock a Mock Test from the Mock Tests & Suggestions section to submit your answer sheet.",
                 "First unlock a Mock Test from the Mock Tests & Suggestions section to submit your answer sheet.")}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-800">{T("Submit Answer Sheet for Evaluation", "Submit Answer Sheet for Evaluation")}</h3>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">{T("Select exam:", "Select exam:")}</label>
            <select
              value={selectedMock}
              onChange={e => setSelectedMock(e.target.value)}
              required
              className="st-select"
            >
              <option value="">-- Choose Unlocked Test --</option>
              {unlockedMocks.map((m: any) => (
                <option key={m.id} value={m.code_num}>
                  [{m.test_type}] {m.code_num}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">{T("Answer Sheet Upload (PDF/Image/Text)", "Answer Sheet Upload (PDF/Image/Text)")}</label>
            <input
              type="file"
              required
              accept=".pdf,.jpg,.jpeg,.png,.txt,.docx"
              onChange={handleFileUpload}
              className="st-input"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="st-btn w-full py-2.5"
          >
            {submitting ? 'Submitting...' : T("📤 Submit Answer Sheet", "📤 Submit Answer Sheet")}
          </button>
        </form>
      )}

      {/* History */}
      <h3 className="text-lg font-bold text-slate-800">{T("Submission History", "Submission History")}</h3>
      {examSubmissions.length === 0 ? (
        <p className="p-6 bg-white rounded-xl text-center text-slate-500 border border-slate-200">No submissions yet.</p>
      ) : (
        <div className="space-y-3">
          {examSubmissions.map((s: any) => {
            const isChecked = s.status === 'Checked & Returned';
            return (
              <div key={s.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800">
                    {isChecked ? '🟢' : '🟡'} #{s.id} — {s.exam_code}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border">
                    {s.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-2">
                  Submitted: {s.submitted_at} | File: {s.answer_file_name}
                </p>
                {s.admin_note && (
                  <p className="p-2.5 bg-blue-50 text-blue-900 border border-blue-200 rounded text-xs mb-2">
                    <strong>Note:</strong> {s.admin_note}
                  </p>
                )}
                {isChecked && s.corrected_file_data && (
                  <button
                    onClick={() => downloadTextFile(s.corrected_file_name || 'Corrected_Copy.pdf', s.corrected_file_data)}
                    className="st-btn bg-emerald-600 hover:bg-emerald-700 text-xs py-1.5 px-3 flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {T("📥 Download Corrected Copy", "📥 Download Corrected Copy")}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// SHARE & REFERRAL SECTION (Teacher: 100 students = ₹7500 | Student: 100 friends = ₹3500)
// ============================================================================
function ShareReferralSection({ user, setUser, settings, fetchSettings, T }: any) {
  const [portalUrlInput, setPortalUrlInput] = useState(settings?.portal_url || window.location.origin);
  const [refreshing, setRefreshing] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);

  const isTeacher = user?.role === 'teacher';
  const isStudent = user?.role === 'student';
  const isAdmin = user?.role === 'admin';

  const myCode = user?.referral_code || (isTeacher ? 'GEO-REF-T1001' : 'GEO-REF-1001');
  const myCount = Number(user?.referral_count || 0);
  const targetCount = 100;
  const remaining = Math.max(0, targetCount - myCount);
  const progressPercent = Math.min(100, Math.round((myCount / targetCount) * 100));

  // Determine reward amounts and role-specific copy
  const prizeAmount = isTeacher ? '₹৭,৫০০' : '₹৩,৫০০';
  const prizeAmountNum = isTeacher ? '7,500' : '3,500';
  const audienceWord = isTeacher ? 'শিক্ষার্থী (Students)' : 'বন্ধু (Friends)';

  const baseUrl = settings?.portal_url || window.location.origin;
  const refLink = `${baseUrl}?ref=${encodeURIComponent(myCode)}`;

  // Tailored invite message
  const shareMsg = isTeacher
    ? `নমস্কার! পশ্চিমবঙ্গ মধ্যশিক্ষা পর্ষদের দশম শ্রেণির ভূগোল পরীক্ষার পূর্ণাঙ্গ প্রস্তুতি ও ডিজিটাল ল্যাব পোর্টালে যুক্ত হওয়ার জন্য অনুরোধ করছি।\n\n📌 এখানে রয়েছে:\n• অধ্যায়ভিত্তিক প্রতিটি MCQ, SAQ, ২, ৩ ও ৫ নম্বরের মডেল উত্তর\n• ২০১৭-২০২৬ সালের অফিশিয়াল মাধ্যমিক প্রশ্নপত্র ও সমাধান\n• বিশেষজ্ঞদের তৈরি স্পেশাল মক টেস্ট ও খাতা চেকিং\n• লাইভ ডাউট ক্লিয়ারিং সুবিধা\n\n👉 পোর্টাল লিংক: ${refLink}\n🔑 আমার রেফারেল কোড: ${myCode}\n(রেজিস্ট্রেশনের সময় রেফারেল কোড দিন)`
    : `হাই বন্ধুরা! মাধ্যমিক ভূগোল পরীক্ষার সেরা প্রস্তুতির জন্য এই ডিজিটাল ল্যাব পোর্টালটিতে এখুনি জয়েন কর!\n\n✨ কী কী পাচ্ছিস:\n• প্রতিটি চ্যাপ্টারের MCQ, SAQ, ২/৩/৫ নম্বরের প্রশ্ন ও নির্ভুল উত্তর\n• বিগত ১০ বছরের অফিশিয়াল মাধ্যমিক প্রশ্নপত্রের সমাধান\n• অনলাইন মক টেস্ট ও সরাসরি স্যারদের সাহায্য\n\n👉 জয়েন করার লিংক: ${refLink}\n🔑 আমার রেফারেল কোড: ${myCode}\n(রেজিস্ট্রেশন করার সময় এই রেফারেল কোডটি বসিয়ে জয়েন কর!)`;

  const encodedMsg = encodeURIComponent(shareMsg);

  // Sync latest count from database
  const refreshUserStats = async () => {
    if (!user?.username) return;
    setRefreshing(true);
    try {
      const res = await fetch(`/api/users/profile?username=${encodeURIComponent(user.username)}`);
      if (res.ok) {
        const fresh = await res.json();
        if (setUser && fresh) {
          const updated = { ...user, referral_count: fresh.referral_count || 0 };
          setUser(updated);
          try {
            localStorage.setItem('wbbse_geo_user_session', JSON.stringify(updated));
          } catch {}
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  };

  const copyToClipboard = (text: string, type: 'code' | 'link' | 'msg') => {
    navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedMsg(true);
      setTimeout(() => setCopiedMsg(false), 2000);
    }
  };

  const savePortalUrl = async () => {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'portal_url', value: portalUrlInput })
    });
    alert('Portal URL updated!');
    fetchSettings();
  };

  return (
    <div className="space-y-6">
      {/* -------------------- Top Hero Prize Card -------------------- */}
      {isTeacher && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-900 via-yellow-800 to-emerald-950 p-6 md:p-8 text-white shadow-xl border-2 border-amber-400/40">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-sm">
                <span>🎁</span>
                <span>TEACHER SPECIAL REWARD PROGRAM</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-amber-200 leading-tight">
                ১০০ জন শিক্ষার্থীকে রেফার করলেই নগদ ₹৭,৫০০ টাকা ক্যাশ প্রাইজ!
              </h1>
              <p className="text-sm md:text-base text-amber-100 leading-relaxed font-medium">
                পশ্চিমবঙ্গের যেকোনো স্কুলের মাধ্যমিক পরীক্ষার্থীদের ভূগোল ডিজিটাল ল্যাব পোর্টালে যুক্ত হতে উৎসাহিত করুন। আপনার রেফারেল কোড ব্যবহার করে ১০০ জন শিক্ষার্থী যুক্ত হলেই সরাসরি <span className="underline font-bold text-white">₹৭,৫০০ ক্যাশ প্রাইজ (Direct Cash Reward)</span> আপনার ব্যাংক অ্যাকাউন্ট বা UPI-তে প্রদান করা হবে।
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-amber-200 font-bold">
                <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/20">🎯 টার্গেট: ১০০ জন শিক্ষার্থী</span>
                <span className="bg-emerald-500/30 text-emerald-300 px-3 py-1 rounded-lg border border-emerald-400/30">💰 পুরস্কার: ₹৭,৫০০ ক্যাশ প্রাইজ</span>
                <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/20">⚡ ইনস্ট্যান্ট কাউন্ট ট্র্যাকিং</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center shrink-0 min-w-[220px]">
              <span className="text-xs uppercase tracking-wider text-amber-300 font-bold block mb-1">
                নগদ পুরস্কার মূল্য
              </span>
              <div className="text-4xl md:text-5xl font-black text-amber-300 tracking-tight">
                ₹৭,৫০০
              </div>
              <div className="text-[11px] text-amber-100 font-semibold mt-1">
                Cash Prize on 100 Students
              </div>
              <div className="mt-3 pt-3 border-t border-white/15">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${myCount >= 100 ? 'bg-emerald-400 text-slate-950 animate-bounce' : 'bg-amber-400/20 text-amber-200'}`}>
                  {myCount >= 100 ? '🎉 পুরস্কার আনলকড!' : `বাকি: ${remaining} জন`}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {isStudent && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-950 p-6 md:p-8 text-white shadow-xl border-2 border-indigo-400/40">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-sm">
                <span>🎁</span>
                <span>STUDENT REFER & EARN SCHEME</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-cyan-200 leading-tight">
                ১০০ জন বন্ধুকে রেফার করলে নিশ্চিত ₹৩,৫০০ নগদ টাকা ক্যাশ প্রাইজ!
              </h1>
              <p className="text-sm md:text-base text-cyan-100 leading-relaxed font-medium">
                তোমার বন্ধুদের সাথে পশ্চিমবঙ্গ মাধ্যমিক ভূগোল ডিজিটাল পোর্টাল শেয়ার করো। তোমার রেফারেল কোড দিয়ে ১০০ জন বন্ধু সাইন আপ করলেই তুমি পেয়ে যাবে সরাসরি <span className="underline font-bold text-white">₹৩,৫০০ নগদ পুরস্কার (Direct Cash Prize)</span>!
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-cyan-200 font-bold">
                <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/20">🎯 লক্ষ্য: ১০০ জন বন্ধু</span>
                <span className="bg-emerald-500/30 text-emerald-300 px-3 py-1 rounded-lg border border-emerald-400/30">💰 ক্যাশ প্রাইজ: ₹৩,৫০০</span>
                <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/20">📱 সরাসরি UPI বা ব্যাংকে জমা</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center shrink-0 min-w-[220px]">
              <span className="text-xs uppercase tracking-wider text-cyan-300 font-bold block mb-1">
                পুরস্কার মূল্য
              </span>
              <div className="text-4xl md:text-5xl font-black text-cyan-300 tracking-tight">
                ₹৩,৫০০
              </div>
              <div className="text-[11px] text-cyan-100 font-semibold mt-1">
                Cash Prize on 100 Friends
              </div>
              <div className="mt-3 pt-3 border-t border-white/15">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${myCount >= 100 ? 'bg-emerald-400 text-slate-950 animate-bounce' : 'bg-cyan-400/20 text-cyan-200'}`}>
                  {myCount >= 100 ? '🎉 ক্যাশ প্রাইজ আনলকড!' : `বাকি: ${remaining} জন বন্ধু`}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAdmin && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-slate-700">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                🎁 রেফারেল রিওয়ার্ড সিস্টেম মাস্টার কন্ট্রোল (Referral Program Overview)
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                শিক্ষক ও শিক্ষার্থী উভয়ের জন্য ১০০ রেফারেল কমপ্লিশনে ঘোষিত ক্যাশ প্রাইজ স্কিম সক্রিয় রয়েছে।
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 block mb-1">
                👨‍🏫 Teacher Referral Scheme
              </span>
              <p className="text-xl font-black text-amber-200">
                ১০০ জন শিক্ষার্থী = ₹৭,৫০০ ক্যাশ প্রাইজ
              </p>
              <p className="text-xs text-slate-300 mt-1">
                শিক্ষকরা প্রতি ১০০ জন ভেরিফায়েড শিক্ষার্থী যুক্ত করলে ₹৭,৫০০ পাবেন।
              </p>
            </div>

            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 block mb-1">
                🎓 Student Referral Scheme
              </span>
              <p className="text-xl font-black text-cyan-200">
                ১০০ জন বন্ধু = ₹৩,৫০০ ক্যাশ প্রাইজ
              </p>
              <p className="text-xs text-slate-300 mt-1">
                শিক্ষার্থীরা প্রতি ১০০ জন বন্ধুকে যুক্ত করলে ₹৩,৫০০ পাবেন।
              </p>
            </div>
          </div>

          <div className="mt-5 p-4 rounded-xl bg-white/5 border border-white/10">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300 mb-2">🌐 Portal URL Configuration</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={portalUrlInput}
                onChange={e => setPortalUrlInput(e.target.value)}
                className="st-input flex-1 text-slate-900 bg-white"
              />
              <button onClick={savePortalUrl} className="st-btn bg-blue-600 hover:bg-blue-500 text-xs px-4">
                💾 Save URL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- Live Tracker & Progress -------------------- */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              📊 {T("আপনার রেফারেল অগ্রগতি ও লাইভ স্ট্যাটাস", "Your Referral Progress & Live Stats")}
            </h3>
            <p className="text-xs text-slate-500">
              {T(
                `১০০ জন ${audienceWord} পূর্ণ হলে সরাসরি ${prizeAmount} টাকা ক্যাশ প্রাইজ আনলক হবে`,
                `Reach 100 to unlock your ${prizeAmountNum} INR Cash Prize`
              )}
            </p>
          </div>
          <button
            onClick={refreshUserStats}
            disabled={refreshing}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
          >
            🔄 {refreshing ? 'Updating...' : T('কাউন্টার রিফ্রেশ করুন', 'Refresh Counter')}
          </button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">{T("মোট রেফারেল", "Total Referrals")}</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{myCount}</div>
            <span className="text-[10px] text-slate-400">সফল রেজিস্ট্রেশন</span>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <span className="text-[11px] font-bold text-blue-700 uppercase block">{T("টার্গেট লক্ষ্য", "Target Goal")}</span>
            <div className="text-2xl font-black text-blue-900 mt-1">১০০</div>
            <span className="text-[10px] text-blue-600">{audienceWord}</span>
          </div>
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
            <span className="text-[11px] font-bold text-amber-700 uppercase block">{T("অবশিষ্ট প্রয়োজন", "Remaining Needed")}</span>
            <div className="text-2xl font-black text-amber-900 mt-1">{remaining}</div>
            <span className="text-[10px] text-amber-600">জন বাকি রয়েছে</span>
          </div>
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
            <span className="text-[11px] font-bold text-emerald-700 uppercase block">{T("ক্যাশ প্রাইজ মূল্য", "Cash Prize")}</span>
            <div className="text-2xl font-black text-emerald-800 mt-1">{prizeAmount}</div>
            <span className="text-[10px] text-emerald-600">নগদ টাকা (UPI/Bank)</span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="pt-2">
          <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
            <span>{T("অগ্রগতি (Progress)", "Progress")}</span>
            <span className="text-blue-700 font-extrabold">{progressPercent}% ({myCount} / 100)</span>
          </div>
          <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden p-0.5 shadow-inner">
            <div
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 h-full rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${Math.max(4, progressPercent)}%` }}
            />
          </div>

          {/* Milestone markers */}
          <div className="grid grid-cols-4 gap-1 mt-2 text-center">
            <div className={`p-1.5 rounded-lg border text-[11px] font-bold ${myCount >= 25 ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
              25 {myCount >= 25 ? '✅' : '⏳'}
            </div>
            <div className={`p-1.5 rounded-lg border text-[11px] font-bold ${myCount >= 50 ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
              50 {myCount >= 50 ? '✅' : '⏳'}
            </div>
            <div className={`p-1.5 rounded-lg border text-[11px] font-bold ${myCount >= 75 ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
              75 {myCount >= 75 ? '✅' : '⏳'}
            </div>
            <div className={`p-1.5 rounded-lg border text-[11px] font-bold ${myCount >= 100 ? 'bg-emerald-100 border-emerald-400 text-emerald-900 ring-2 ring-emerald-500' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
              🎯 100 ({prizeAmount})
            </div>
          </div>

          {myCount >= 100 ? (
            <div className="mt-4 p-4 bg-emerald-100 border-2 border-emerald-500 rounded-xl text-emerald-950 font-bold flex items-center justify-between">
              <div>
                <span className="text-base block">🎉 অভিনন্দন! আপনি ১০০ জনের টার্গেট সফলভাবে পূর্ণ করেছেন!</span>
                <span className="text-xs font-normal">আপনার {prizeAmount} নগদ পুরস্কার গ্রহণের জন্য অ্যাডমিনকে মেসেজ বা কল করুন।</span>
              </div>
              <a
                href={`https://api.whatsapp.com/send?phone=919876543210&text=${encodeURIComponent(`নমস্কার অ্যাডমিন, আমি ${user?.full_name} (${user?.username})। আমি সফলভাবে ১০০ জন রেফার সম্পন্ন করেছি। আমার রেফারেল কোড: ${myCode}। আমার ${prizeAmount} ক্যাশ প্রাইজ প্রদানের অনুরোধ জানাচ্ছি।`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="st-btn bg-emerald-700 hover:bg-emerald-800 text-white text-xs px-4 py-2 shrink-0"
              >
                📲 Claim ₹{prizeAmountNum} Prize
              </a>
            </div>
          ) : (
            <p className="text-xs text-slate-600 mt-2 font-medium">
              💡 {T(`আর মাত্র ${remaining} জন ${audienceWord} রেফার করলেই আপনি সরাসরি ${prizeAmount} নগদ টাকা পেয়ে যাবেন!`, `Just ${remaining} more referrals to unlock your ${prizeAmountNum} INR prize!`)}
            </p>
          )}
        </div>
      </div>

      {/* -------------------- Share Details: Code, Link, 1-Click Copy -------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Referral Code Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            🔑 {T("আপনার ব্যক্তিগত রেফারেল কোড", "Your Personal Referral Code")}
          </span>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <span className="text-xl font-black font-mono text-blue-700 tracking-wider">
              {myCode}
            </span>
            <button
              onClick={() => copyToClipboard(myCode, 'code')}
              className="st-btn text-xs py-1.5 px-3 flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              {copiedCode ? T('কপি হয়েছে!', 'Copied!') : T('কোড কপি', 'Copy Code')}
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            {T(
              "রেজিস্ট্রেশনের সময় শিক্ষার্থীরা এই কোডটি 'Referral Code' ঘরে বসালেই সাথে সাথে আপনার কাউন্টে ১ যোগ হবে।",
              "When users enter this code at signup, your referral count increases by 1."
            )}
          </p>
        </div>

        {/* Direct Link Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            🔗 {T("ডিরেক্ট রেজিস্ট্রেশন লিংক", "Direct Auto-Referral Link")}
          </span>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2 overflow-hidden">
            <span className="text-xs font-mono text-slate-700 truncate">
              {refLink}
            </span>
            <button
              onClick={() => copyToClipboard(refLink, 'link')}
              className="st-btn bg-indigo-600 hover:bg-indigo-700 text-xs py-1.5 px-3 shrink-0 flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              {copiedLink ? T('কপি হয়েছে!', 'Copied!') : T('লিংক কপি', 'Copy Link')}
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            {T(
              "এই লিংকে ক্লিক করে কেউ পোর্টালে ঢুকলে আপনার রেফারেল কোড স্বয়ংক্রিয়ভাবে ফর্মের ঘরে বসে যাবে।",
              "When someone opens this link, your code is auto-filled into the registration form."
            )}
          </p>
        </div>
      </div>

      {/* -------------------- 1-Click Social Sharing Buttons -------------------- */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          📲 {T("১-ক্লিকে বন্ধুদের ও গ্রুপে শেয়ার করুন", "1-Click Instant Share")}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href={`https://api.whatsapp.com/send?text=${encodedMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-center shadow-xs block transition flex items-center justify-center gap-2"
          >
            <span>📱</span>
            <span>WhatsApp-এ শেয়ার করুন</span>
          </a>
          <a
            href={`sms:?body=${encodedMsg}`}
            className="p-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-center shadow-xs block transition flex items-center justify-center gap-2"
          >
            <span>💬</span>
            <span>SMS পাঠাও</span>
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(refLink)}&quote=${encodedMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-center shadow-xs block transition flex items-center justify-center gap-2"
          >
            <span>📘</span>
            <span>Facebook-এ পোস্ট করুন</span>
          </a>
        </div>
      </div>

      {/* -------------------- Ready Message Box -------------------- */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 uppercase">
            📝 {T("রেডিমেড আমন্ত্রণ বার্তা (Ready Share Message)", "Direct Share Message Template")}
          </label>
          <button
            onClick={() => copyToClipboard(shareMsg, 'msg')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <Copy className="w-3.5 h-3.5" />
            {copiedMsg ? T('কপি হয়েছে!', 'Copied!') : T('মেসেজ কপি করুন', 'Copy Full Message')}
          </button>
        </div>
        <textarea
          readOnly
          value={shareMsg}
          rows={6}
          className="st-textarea text-xs bg-slate-50 font-sans"
        />
      </div>

      {/* -------------------- Terms & Prize Disbursal Rules -------------------- */}
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2">
        <h5 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
          <span>ℹ️</span>
          <span>পুরস্কার প্রদানের নিয়মাবলী (Rules & Cash Prize Disbursal)</span>
        </h5>
        <ul className="list-disc list-inside space-y-1.5 text-slate-600 pl-1">
          <li>
            <strong>১০০ রেফারেল মাইলস্টোন:</strong> {isTeacher ? '১০০ জন শিক্ষার্থী আপনার রেফারেল কোড দিয়ে সফলভাবে রেজিস্ট্রেশন করলেই ₹৭,৫০০ নগদ পুরস্কার প্রদান করা হবে।' : '১০০ জন বন্ধু আপনার রেফারেল কোড দিয়ে রেজিস্ট্রেশন সম্পন্ন করলেই ₹৩,৫০০ ক্যাশ প্রাইজ পাবেন।'}
          </li>
          <li>
            <strong>পেমেন্ট মাধ্যম:</strong> পুরস্কারের সম্পূর্ণ অর্থ সরাসরি আপনার দেওয়া UPI ID (Google Pay, PhonePe, Paytm) অথবা যেকোনো ভারতীয় ব্যাংক একাউন্টে NEFT/IMPS মাধ্যমে পাঠিয়ে দেওয়া হবে।
          </li>
          <li>
            <strong>স্বচ্ছ ট্র্যাকিং:</strong> প্রতিটি রেজিস্ট্রেশনের সাথে সাথেই আপনার ড্যাশবোর্ডে কাউন্ট স্বয়ংক্রিয়ভাবে বৃদ্ধি পাবে। প্রয়োজনে "কাউন্টার রিফ্রেশ করুন" বাটনে চাপ দিন।
          </li>
          <li>
            <strong>বৈধতা:</strong> শুধুমাত্র আসল ও সক্রিয় ফোন নম্বর দিয়ে রেজিস্ট্রেশন করা শিক্ষার্থীদের রেফারেল হিসেবে গণনা করা হবে।
          </li>
        </ul>
      </div>
    </div>
  );
}

// ============================================================================
// ASK CORNER SECTION
// ============================================================================
function AskCornerSection({ user, askCornerList, fetchAskCorner, T }: any) {
  const [category, setCategory] = useState('💡 Feature Idea');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    try {
      await fetch('/api/ask_corner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submitter_username: user.username,
          submitter_name: user.full_name,
          submitter_role: user.role,
          category,
          message: message.trim()
        })
      });
      alert('🎉 Submitted to Admin!');
      setMessage('');
      fetchAskCorner();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">{T("💡 Ask Corner — Share Your Ideas!", "💡 Ask Corner — Share Your Ideas!")}</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">{T("Category:", "Category:")}</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="st-select"
          >
            <option value="💡 Feature Idea">💡 Feature Idea</option>
            <option value="🐛 Bug">🐛 Bug</option>
            <option value="📚 Question Bank">📚 Question Bank</option>
            <option value="🎨 Design">🎨 Design</option>
            <option value="💰 Pricing">💰 Pricing</option>
            <option value="🎯 Feedback">🎯 Feedback</option>
            <option value="❓ Other">❓ Other</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">{T("Message:", "Message:")}</label>
          <textarea
            required
            rows={5}
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Share your suggestion, feedback, or report an issue..."
            className="st-textarea"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="st-btn w-full py-2.5"
        >
          {submitting ? 'Sending...' : T("📤 Submit to Admin", "📤 Submit to Admin")}
        </button>
      </form>

      {/* List */}
      <h3 className="text-lg font-bold text-slate-800">{T("My Submissions & Replies", "My Submissions & Replies")}</h3>
      {askCornerList.length === 0 ? (
        <p className="p-6 bg-white rounded-xl text-center text-slate-500 border border-slate-200">No suggestions submitted yet.</p>
      ) : (
        <div className="space-y-3">
          {askCornerList.map((a: any) => (
            <div key={a.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-800 text-sm">
                  #{a.id} — {a.category}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  a.status === 'Replied' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                }`}>
                  {a.status}
                </span>
              </div>
              <p className="text-xs text-slate-700 my-2">{a.message}</p>
              {a.admin_reply && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-950 mt-2">
                  <strong>{T("Admin Reply:", "Admin Reply:")}</strong> {a.admin_reply}
                </div>
              )}
              <span className="text-[10px] text-slate-400 block mt-2">{a.timestamp}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// PRICING & PAYMENT SECTION
// ============================================================================
function PricingPaymentSection({
  user, settings, mockTests, hasFullAccess, hasBundleAccess, paymentsList, fetchPayments, fetchUserPurchases, T
}: any) {
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [selectedItem, setSelectedItem] = useState('-- Select --');
  const [upiRef, setUpiRef] = useState('');
  const [screenshotFileName, setScreenshotFileName] = useState('');
  const [screenshotFileData, setScreenshotFileData] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fullPrice = Number(settings.full_access_price) || 399;
  const bundlePrice = Number(settings.bundle_price) || 499;

  const isBundle = hasBundleAccess();
  const isFull = hasFullAccess();

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshotFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        const res = reader.result as string;
        setScreenshotFileData(res);
        setScreenshotPreview(res);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyPromo = async () => {
    if (!promoCodeInput.trim()) return;
    try {
      const res = await fetch('/api/promo_requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username,
          full_name: user.full_name,
          phone: user.phone,
          promo_code: promoCodeInput.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Invalid promo code');
      } else {
        alert('🎉 Promo submitted! Admin will verify and unlock your access.');
        setPromoCodeInput('');
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem === '-- Select --' || !upiRef.trim()) {
      alert('Please select item and enter UPI Transaction ID');
      return;
    }
    setSubmitting(true);
    try {
      let itemType = 'FULL_ACCESS';
      let itemId = 'ALL';
      let amount = fullPrice;

      if (selectedItem === 'BUNDLE') {
        itemType = 'BUNDLE';
        itemId = 'ALL';
        amount = bundlePrice;
      } else if (selectedItem.startsWith('MOCK_')) {
        const mockId = selectedItem.replace('MOCK_', '');
        const targetMock = mockTests.find((m: any) => String(m.id) === mockId);
        itemType = targetMock?.test_type || 'Mock Test';
        itemId = mockId;
        amount = targetMock?.price || 29;
      }

      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username,
          user_name: user.full_name,
          user_role: user.role,
          phone: user.phone,
          item_type: itemType,
          item_id: itemId,
          amount,
          upi_ref: upiRef.trim(),
          screenshot_file_name: screenshotFileName,
          screenshot_file_data: screenshotFileData
        })
      });

      if (res.ok) {
        alert('🎉 Payment submitted for verification! Admin will verify and activate your access.');
        setUpiRef('');
        setSelectedItem('-- Select --');
        setScreenshotFileName('');
        setScreenshotFileData('');
        setScreenshotPreview('');
        fetchPayments();
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">{T("💳 Pricing & Payment", "💳 Pricing & Payment")}</h2>

      {isBundle ? (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 font-bold">
          ✅ {T("আপনি BUNDLE কিনেছেন — সব প্রশ্ন ও Mock Tests আনলকড!", "You have the BUNDLE — everything is unlocked!")}
        </div>
      ) : isFull ? (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 font-bold">
          ✅ {T("আপনি Full Access কিনেছেন — সব প্রশ্ন আনলকড!", "You have Full Access — all questions unlocked!")}
        </div>
      ) : null}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="price-card">
          <h3>📄 {T('Chapter Mock', 'Chapter Mock')}</h3>
          <div className="price-tag">₹29</div>
          <p>{T('প্রতি Set', 'Per Set')}</p>
        </div>
        <div className="price-card">
          <h3>🎯 {T('Final Mock', 'Final Mock')}</h3>
          <div className="price-tag">₹49</div>
          <p>{T('প্রতি Set', 'Per Set')}</p>
        </div>
        <div className="price-card">
          <h3>💡 {T('Board Suggestions', 'Board Suggestions')}</h3>
          <div className="price-tag">₹69</div>
          <p>{T('প্রতি Set', 'Per Set')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="price-card">
          <h3>👑 {T('FULL ACCESS — সব Question', 'FULL ACCESS — All Questions')}</h3>
          <div className="price-tag">₹{fullPrice}</div>
          <p className="font-semibold">{T('MCQ + SAQ + 2/3/5 Marks + Map', 'MCQ + SAQ + 2/3/5 Marks + Map')}</p>
          <p>{T('প্রতিটি chapter-এর সব প্রশ্ন আনলক', 'Unlock all questions across all chapters')}</p>
        </div>
        <div className="price-card-premium">
          <h3>🎯 {T('BUNDLE — Everything', 'BUNDLE — Everything')}</h3>
          <div className="price-tag-premium">₹{bundlePrice}</div>
          <p className="font-bold">{T('সব প্রশ্ন + সব Mock + Suggestions', 'All questions + All Mocks + Suggestions')}</p>
          <p className="font-bold text-amber-900">{T('সেরা ভ্যালু!', 'Best value!')}</p>
        </div>
      </div>

      {/* Promo Code Form */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <h4 className="font-bold text-base text-slate-800 mb-1">🎟️ {T('গোপন প্রোমো কোড (Secret Promo Code)', 'Secret Promo Code')}</h4>
        <p className="text-xs text-slate-500 mb-3">
          {T("অ্যাডমিন বা স্যারের কাছ থেকে প্রাপ্ত বিশেষ গোপন প্রোমো কোড থাকলে এখানে দিন — ভেরিফাই হলে সম্পূর্ণ অ্যাক্সেস আনলক হবে।",
             "If you have received a confidential promo code personally from Sir/Admin, enter it here and click Apply.")}
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={promoCodeInput}
            onChange={e => setPromoCodeInput(e.target.value)}
            placeholder={T("প্রোমো কোডটি এখানে লিখুন...", "Enter confidential promo code...")}
            className="st-input flex-1"
          />
          <button
            type="button"
            onClick={handleApplyPromo}
            className="st-btn shrink-0"
          >
            🎟️ Apply
          </button>
        </div>
      </div>

      {/* UPI QR & Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col items-center justify-center text-center">
          <h4 className="font-bold text-base text-slate-800 mb-3">📱 {T('Scan & Pay via UPI', 'Scan & Pay via UPI')}</h4>
          <div className="bg-slate-50 p-2 rounded-2xl border-2 border-slate-300 shadow-md mb-3 max-w-xs w-full flex justify-center">
            <img
              src="/public/assets/aistudio/payment_qr_05d34a16.png"
              alt="Shawon Kar UPI QR Code"
              className="w-full max-h-96 object-contain rounded-xl"
              onError={(e: any) => {
                e.target.src = '/payment_qr.png';
              }}
            />
          </div>
          <p className="text-sm font-bold text-slate-800">
            UPI ID: <code className="bg-slate-100 px-2 py-1 rounded text-blue-700 font-mono">{settings.upi_id || 'shawonkar6466-1@oksbi'}</code>
          </p>
        </div>

        <div className="flex flex-col justify-center">
          <h4 className="font-bold text-base text-slate-800 mb-2">📋 {T('Payment Steps:', 'Payment Steps:')}</h4>
          <ol className="text-sm text-slate-700 space-y-2 list-decimal list-inside">
            <li>Open Google Pay / PhonePe / Paytm / bKash</li>
            <li>Scan QR code above or paste UPI ID</li>
            <li>Transfer the exact amount for the desired access</li>
            <li>Copy the 12-digit UPI Transaction / UTR ID</li>
            <li>Select your item and submit Transaction ID below</li>
            <li>Admin verifies transaction and instantly activates access!</li>
          </ol>
        </div>
      </div>

      {/* Payment Submission Form */}
      <form onSubmit={handlePaymentSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h4 className="font-bold text-base text-slate-800">📝 {T('Submit Transaction for Activation', 'Submit Transaction for Activation')}</h4>
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">{T("Which item to unlock?", "Which item to unlock?")}</label>
          <select
            value={selectedItem}
            onChange={e => setSelectedItem(e.target.value)}
            className="st-select"
          >
            <option value="-- Select --">-- Select Item --</option>
            <option value="FULL_ACCESS">👑 FULL ACCESS — All Questions (₹{fullPrice})</option>
            <option value="BUNDLE">🎯 BUNDLE — Everything (₹{bundlePrice})</option>
            {mockTests.map((m: any) => (
              <option key={m.id} value={`MOCK_${m.id}`}>
                [{m.test_type}] {m.code_num} — ₹{m.price || 0}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">{T("UPI Transaction ID / Ref:", "UPI Transaction ID / Ref:")}</label>
          <input
            type="text"
            required
            value={upiRef}
            onChange={e => setUpiRef(e.target.value)}
            placeholder="e.g. 429817263541"
            className="st-input font-mono"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            📸 {T("পেমেন্ট স্ক্রিনশট / রসিদ আপলোড (Upload Payment Screenshot):", "Upload Payment Screenshot / Receipt:")}
            <span className="text-[11px] text-slate-500 font-normal ml-1">
              {T("(ঐচ্ছিক কিন্তু দ্রুত অ্যাক্টিভেশনের জন্য বাঞ্ছনীয় - JPG, PNG বা PDF)", "(Optional but recommended for rapid activation - JPG, PNG or PDF)")}
            </span>
          </label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleScreenshotChange}
            className="st-input text-xs"
          />
          {screenshotPreview && (
            <div className="mt-2.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl inline-block max-w-sm">
              <span className="text-[11px] font-bold text-slate-700 block mb-1">
                📎 {screenshotFileName}
              </span>
              {screenshotFileData.startsWith('data:image') && (
                <img
                  src={screenshotPreview}
                  alt="Payment Screenshot Preview"
                  className="max-h-48 rounded-lg border border-slate-300 object-contain bg-white shadow-2xs"
                />
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="st-btn w-full py-2.5"
        >
          {submitting ? 'Submitting...' : T("📤 Submit Payment", "📤 Submit Payment")}
        </button>
      </form>

      {/* Payment History */}
      <h3 className="text-lg font-bold text-slate-800">{T("My Payment Submissions", "My Payment Submissions")}</h3>
      {paymentsList.length === 0 ? (
        <p className="p-6 bg-white rounded-xl text-center text-slate-500 border border-slate-200">No payment records yet.</p>
      ) : (
        <div className="space-y-3">
          {paymentsList.map((p: any) => {
            const isApproved = p.status === 'Approved';
            const isPending = p.status === 'Pending Verification';
            return (
              <div key={p.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800">
                    {isApproved ? '🟢' : isPending ? '🟡' : '🔴'} #{p.id} — {p.item_type} — ₹{p.amount}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    isApproved ? 'bg-emerald-100 text-emerald-800' : (isPending ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800')
                  }`}>
                    {p.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  UPI Ref: <code>{p.upi_ref}</code> | Date: {p.timestamp}
                </p>
                {p.admin_note && (
                  <p className="text-xs text-blue-900 bg-blue-50 p-2 rounded mt-2">
                    Note: {p.admin_note}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// TEACHER: ASSIGNED STUDENT DOUBTS
// ============================================================================
function TeacherAssignedDoubtsSection({ user, T, getQText }: any) {
  const [doubts, setDoubts] = useState<any[]>([]);
  const [solutions, setSolutions] = useState<Record<number, string>>({});

  const fetchAssigned = async () => {
    const res = await fetch(`/api/student_doubts?teacher_username=${user.username}`);
    const data = await res.json();
    setDoubts(data);
  };

  useEffect(() => {
    fetchAssigned();
  }, []);

  const handleSubmitSolution = async (dId: number) => {
    const sol = solutions[dId];
    if (!sol || !sol.trim()) return;
    try {
      await fetch('/api/student_doubts/teacher_submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: dId, solution: sol.trim() })
      });
      alert('🎉 Solution submitted to Admin for approval!');
      fetchAssigned();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">{T("📥 Doubts Assigned to You", "📥 Doubts Assigned to You")}</h2>

      {doubts.length === 0 ? (
        <p className="p-6 bg-white rounded-xl text-center text-slate-500 border border-slate-200">No doubts assigned yet.</p>
      ) : (
        <div className="space-y-4">
          {doubts.map(d => (
            <div key={d.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">
                  📌 #{d.id} [{d.marks}M] — {d.student_name}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                  {d.status}
                </span>
              </div>
              <p className="font-bold text-slate-900 text-base">
                Q: {getQText(d.question_text, d.question_text_en)}
              </p>

              {d.status === 'Teacher Submitted (Pending Admin Approval)' ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs font-bold">
                  ✅ You have submitted your solution. Waiting for Admin verification and unlock.
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">{T("Enter Detailed Solution:", "Enter Detailed Solution:")}</label>
                  <textarea
                    rows={4}
                    value={solutions[d.id] ?? (d.teacher_answer || '')}
                    onChange={e => setSolutions(prev => ({ ...prev, [d.id]: e.target.value }))}
                    placeholder="Provide full model answer for the student..."
                    className="st-textarea text-sm"
                  />
                  <button
                    onClick={() => handleSubmitSolution(d.id)}
                    className="st-btn text-xs py-2 px-4"
                  >
                    📤 {T("Submit Solution to Admin", "Submit Solution to Admin")}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// TEACHER: CHECK ASSIGNED ANSWER SHEETS
// ============================================================================
function TeacherCheckSheetsSection({ user, examSubmissions, fetchExamSubmissions, downloadTextFile, T }: any) {
  const [correctFileNames, setCorrectFileNames] = useState<Record<number, string>>({});
  const [correctFileData, setCorrectFileData] = useState<Record<number, string>>({});
  const [teacherNotes, setTeacherNotes] = useState<Record<number, string>>({});

  const handleFileUpload = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCorrectFileNames(prev => ({ ...prev, [id]: file.name }));
      const reader = new FileReader();
      reader.onload = () => {
        setCorrectFileData(prev => ({ ...prev, [id]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTeacherSubmit = async (id: number) => {
    const name = correctFileNames[id];
    const data = correctFileData[id];
    const note = teacherNotes[id] || '';
    if (!name || !data) {
      alert('Please select corrected file first');
      return;
    }
    try {
      await fetch('/api/exam_submissions/teacher_submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          teacher_corrected_file_name: name,
          teacher_corrected_file_data: data,
          teacher_note: note
        })
      });
      alert('🎉 Corrected Copy sent to Admin for final review!');
      fetchExamSubmissions();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">{T("📝 Check Assigned Answer Sheets", "📝 Check Assigned Answer Sheets")}</h2>
      {examSubmissions.length === 0 ? (
        <p className="p-6 bg-white rounded-xl text-center text-slate-500 border border-slate-200">No answer sheets assigned.</p>
      ) : (
        <div className="space-y-4">
          {examSubmissions.map((s: any) => (
            <div key={s.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">
                  📄 #{s.id} — {s.student_name} ({s.exam_code})
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border">
                  {s.status}
                </span>
              </div>
              <p className="text-xs text-slate-500">Submitted: {s.submitted_at} | File: {s.answer_file_name}</p>

              {s.answer_file_data && (
                <button
                  onClick={() => downloadTextFile(s.answer_file_name || 'Answer_Sheet.pdf', s.answer_file_data)}
                  className="st-btn bg-blue-600 hover:bg-blue-700 text-xs py-1.5 px-3 flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> 📥 Download Student Answer Sheet
                </button>
              )}

              {s.status === 'Under Check' && (
                <div className="pt-3 border-t border-slate-200 space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">Upload Corrected Copy with Marks & Comments:</label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.txt,.docx"
                    onChange={e => handleFileUpload(s.id, e)}
                    className="st-input"
                  />
                  <input
                    type="text"
                    value={teacherNotes[s.id] || ''}
                    onChange={e => setTeacherNotes(prev => ({ ...prev, [s.id]: e.target.value }))}
                    placeholder="Feedback / Comments for Student..."
                    className="st-input"
                  />
                  <button
                    onClick={() => handleTeacherSubmit(s.id)}
                    className="st-btn bg-emerald-600 hover:bg-emerald-700 text-xs py-2 px-4"
                  >
                    📤 Submit to Admin
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// TEACHER: SEND SUGGESTIONS TO ADMIN
// ============================================================================
function TeacherSendSuggestionsSection({ user, teacherSubmissions, fetchTeacherSubmissions, T }: any) {
  const [subType, setSubType] = useState('Chapter Wise Mock Test');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState(29);
  const [fileName, setFileName] = useState('');
  const [fileData, setFileData] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => setFileData(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !fileName) {
      alert('Please fill title and choose file');
      return;
    }
    setSubmitting(true);
    try {
      await fetch('/api/teacher_submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacher_username: user.username,
          teacher_name: user.full_name,
          sub_type: subType,
          title,
          description: desc,
          file_name: fileName,
          file_data: fileData,
          suggested_price: price
        })
      });
      alert('🎉 Mock Test sent to Admin for review and publishing!');
      setTitle('');
      setDesc('');
      setFileName('');
      setFileData('');
      fetchTeacherSubmissions();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">{T("📤 Send Suggestions to Admin", "📤 Send Suggestions to Admin")}</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">{T("Type:", "Type:")}</label>
          <select
            value={subType}
            onChange={e => {
              setSubType(e.target.value);
              setPrice(e.target.value === 'Chapter Wise Mock Test' ? 29 : (e.target.value === 'Final Mock Test' ? 49 : 69));
            }}
            className="st-select"
          >
            <option value="Chapter Wise Mock Test">Chapter Wise Mock Test</option>
            <option value="Final Mock Test">Final Mock Test</option>
            <option value="Board Suggestions">Board Suggestions</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">{T("Title:", "Title:")}</label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. 2026 Sure-Shot Exogenic Chapter Mock Set"
            className="st-input"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">{T("Details / Overview:", "Details / Overview:")}</label>
          <textarea
            rows={3}
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="Key syllabus covered, marks distribution..."
            className="st-textarea"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">{T("Suggested Price (₹):", "Suggested Price (₹):")}</label>
            <input
              type="number"
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
              className="st-input"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">{T("Upload File (PDF/DOCX)", "Upload File (PDF/DOCX)")}</label>
            <input
              type="file"
              required
              accept=".pdf,.docx,.txt"
              onChange={handleFileUpload}
              className="st-input"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="st-btn w-full py-2.5"
        >
          {submitting ? 'Sending...' : T("📤 Send to Admin", "📤 Send to Admin")}
        </button>
      </form>

      {/* History */}
      <h3 className="text-lg font-bold text-slate-800">{T("Your Submissions", "Your Submissions")}</h3>
      {teacherSubmissions.length === 0 ? (
        <p className="p-6 bg-white rounded-xl text-center text-slate-500 border border-slate-200">No suggestions submitted yet.</p>
      ) : (
        <div className="space-y-3">
          {teacherSubmissions.map((s: any) => (
            <div key={s.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-800">
                  #{s.id} — {s.sub_type} — {s.title}
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  s.status === 'Published' ? 'bg-emerald-100 text-emerald-800' : (s.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800')
                }`}>
                  {s.status}
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-1">{s.description}</p>
              {s.admin_note && (
                <p className="text-xs text-blue-900 bg-blue-50 p-2 rounded">
                  Admin Note: {s.admin_note}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ADMIN & TEACHER: CHAPTER 2/3/5 MARKS DUAL-TIER PDF MANAGER
// ============================================================================
function AdminChapterPdfAnswerSheetsManager({ topicId, userRole, T, downloadTextFile }: any) {
  const [sheets, setSheets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingTier, setUploadingTier] = useState<string | null>(null);
  const [sheetLang, setSheetLang] = useState<'Bengali' | 'English'>('Bengali');

  const fetchSheets = async () => {
    if (!topicId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/chapter_answer_sheets?topic_id=${topicId}`);
      const data = await res.json();
      setSheets(Array.isArray(data) ? data : []);
    } catch {
      setSheets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSheets();
  }, [topicId]);

  const handleUpload = (marksType: '2m' | '3m' | '5m', accessTier: 'free' | 'paid', file: File) => {
    if (!file) return;
    if (file.size > 40 * 1024 * 1024) {
      alert('ফাইলের সাইজ ৪০ মেগাবাইটের (40MB) বেশি। অনুগ্রহ করে ৪০MB এর কম সাইজের ফাইল আপলোড করুন।');
      return;
    }
    const targetTopicId = Number(topicId) || 1;
    setUploadingTier(`${marksType}-${accessTier}-${sheetLang}`);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const fileData = reader.result as string;
        const res = await fetch('/api/chapter_answer_sheets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic_id: targetTopicId,
            marks_type: marksType,
            access_tier: accessTier,
            language: sheetLang,
            title: `${marksType.toUpperCase()} ${sheetLang === 'English' ? (accessTier === 'free' ? 'English Medium Sample Answer Sheet' : 'English Medium Model Answer Sheet') : (accessTier === 'free' ? 'সাধারণ ছাত্রছাত্রীদের স্যাম্পল উত্তরপত্র' : 'পেইড ছাত্রছাত্রীদের সম্পূর্ণ মডেল উত্তরপত্র')}`,
            file_name: file.name,
            file_data: fileData,
            uploaded_by: userRole || 'Teacher/Admin'
          })
        });
        if (res.ok) {
          alert(`🎉 সফলভাবে ${marksType.toUpperCase()} (${sheetLang === 'English' ? 'English Medium' : 'বাংলা মাধ্যম'} - ${accessTier === 'free' ? 'Normal / Free Student' : 'Paid / Full Access'}) PDF উত্তরপত্র আপলোড হয়েছে!`);
          fetchSheets();
        } else {
          const err = await res.json();
          alert('Upload failed: ' + (err.error || 'Server error'));
        }
      } catch (e: any) {
        alert('Upload error: ' + e.message);
      } finally {
        setUploadingTier(null);
      }
    };
    reader.onerror = () => {
      alert('ফাইল রিড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      setUploadingTier(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = async (id: number, fallbackName: string) => {
    try {
      const res = await fetch(`/api/chapter_answer_sheets/${id}/file`);
      const data = await res.json();
      if (data && data.file_data) {
        downloadTextFile(data.file_name || fallbackName, data.file_data);
      } else {
        alert('File content not available');
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this PDF answer sheet?')) return;
    try {
      await fetch(`/api/chapter_answer_sheets/${id}`, { method: 'DELETE' });
      fetchSheets();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const marksSections: { type: '2m' | '3m' | '5m'; label: string; marksBadge: string; badgeColor: string }[] = [
    { type: '2m', label: '২ নম্বরের প্রশ্ন-উত্তর সেট (2 Marks Section)', marksBadge: '2 Marks', badgeColor: 'bg-purple-600' },
    { type: '3m', label: '৩ নম্বরের প্রশ্ন-উত্তর সেট (3 Marks Section)', marksBadge: '3 Marks', badgeColor: 'bg-emerald-600' },
    { type: '5m', label: '৫ নম্বরের প্রশ্ন-উত্তর সেট (5 Marks Section)', marksBadge: '5 Marks', badgeColor: 'bg-red-600' },
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-50/70 via-white to-blue-50/70 p-5 rounded-xl border border-indigo-200 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-100 pb-3">
        <div>
          <h3 className="text-base font-bold text-indigo-950 flex items-center gap-2">
            <span>📑</span>
            <span>অধ্যায়ের ২/৩/৫ নম্বরের অফিসিয়াল PDF উত্তরপত্র আপলোড (PDF Answer Sheets)</span>
          </h3>
          <p className="text-xs text-indigo-800/80 mt-0.5">
            প্রতিটি অধ্যায়ের জন্য বাংলা ও English উভয় মাধ্যমে সাধারণ ছাত্রছাত্রী (Normal/Free) এবং ফুল অ্যাক্সেস (Paid) শিক্ষার্থীদের জন্য আলাদা PDF আপলোড করুন।
          </p>
        </div>
        <span className="text-[11px] font-bold text-indigo-800 bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200 shrink-0 self-start sm:self-auto">
          {loading ? 'লোড হচ্ছে...' : `আপলোড: ${sheets.filter(s => s.language === sheetLang || (!s.language && sheetLang === 'Bengali')).length}/6 টি PDF (${sheetLang === 'Bengali' ? 'বাংলা' : 'English'})`}
        </span>
      </div>

      {/* Language / Medium Switcher for Teacher / Admin */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border border-indigo-100 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">উত্তরপত্রের মাধ্যম নির্বাচন করুন (Medium):</span>
          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100">
            <button
              type="button"
              onClick={() => setSheetLang('Bengali')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                sheetLang === 'Bengali'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              🇧🇩 বাংলা মাধ্যম (Bengali)
            </button>
            <button
              type="button"
              onClick={() => setSheetLang('English')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                sheetLang === 'English'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              🇬🇧 English Medium
            </button>
          </div>
        </div>
        <div className="text-[11px] text-slate-600">
          বর্তমান ভিউ: <span className="font-bold text-indigo-700">{sheetLang === 'Bengali' ? 'বাংলা মাধ্যম PDF' : 'English Medium PDF'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {marksSections.map(sec => {
          const freeSheet = sheets.find(s => s.marks_type === sec.type && s.access_tier === 'free' && (s.language === sheetLang || (!s.language && sheetLang === 'Bengali')));
          const paidSheet = sheets.find(s => s.marks_type === sec.type && (s.access_tier === 'paid' || !s.access_tier) && (s.language === sheetLang || (!s.language && sheetLang === 'Bengali')));

          return (
            <div key={sec.type} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className={`text-[11px] font-black text-white px-2.5 py-0.5 rounded-full ${sec.badgeColor}`}>
                  {sec.marksBadge}
                </span>
                <span className="text-xs font-bold text-slate-800">{sec.label.split('(')[0]}</span>
              </div>

              {/* Option 1: Normal Students (Free Sample) PDF */}
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <span>📄</span>
                    <span>সাধারণ ছাত্রছাত্রীদের জন্য (Normal)</span>
                  </span>
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded">
                    Free Tier
                  </span>
                </div>

                {freeSheet ? (
                  <div className="bg-white p-2.5 rounded-md border border-slate-200 space-y-1.5">
                    <p className="text-xs font-bold text-slate-800 truncate" title={freeSheet.file_name}>
                      📎 {freeSheet.file_name}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      আপলোড: {freeSheet.timestamp?.split(' ')[0]} | By: {freeSheet.uploaded_by}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => handleDownload(freeSheet.id, freeSheet.file_name)}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" /> ডাউনলোড
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(freeSheet.id)}
                        className="text-[11px] font-bold text-red-600 hover:text-red-800 flex items-center gap-0.5"
                      >
                        <Trash2 className="w-3 h-3" /> মুছুন
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 italic">কোনো {sheetLang === 'Bengali' ? 'বাংলা' : 'English'} সাধারণ PDF এখনো আপলোড করা হয়নি</p>
                )}

                <label className="block">
                  <span className="st-btn bg-slate-700 hover:bg-slate-800 text-white text-[11px] py-1.5 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 cursor-pointer w-full text-center">
                    <Upload className="w-3 h-3" />
                    <span>
                      {uploadingTier === `${sec.type}-free-${sheetLang}` ? 'আপলোড হচ্ছে...' : (freeSheet ? `ফাইল পরিবর্তন (${sheetLang})` : `সাধারণ PDF আপলোড (${sheetLang === 'Bengali' ? 'বাংলা' : 'English'})`)}
                    </span>
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,.txt"
                    disabled={uploadingTier === `${sec.type}-free-${sheetLang}`}
                    onChange={e => {
                      const f = e.target.files?.[0];
                      if (f) handleUpload(sec.type, 'free', f);
                      e.target.value = '';
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Option 2: Paid Students (Full Access) PDF */}
              <div className="p-3 rounded-lg border border-amber-200 bg-amber-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950 flex items-center gap-1">
                    <span>🌟</span>
                    <span>পেইড ছাত্রছাত্রীদের জন্য (Paid)</span>
                  </span>
                  <span className="text-[10px] font-black text-amber-900 bg-amber-200 px-2 py-0.5 rounded">
                    Full Access
                  </span>
                </div>

                {paidSheet ? (
                  <div className="bg-white p-2.5 rounded-md border border-amber-200 space-y-1.5">
                    <p className="text-xs font-bold text-slate-800 truncate" title={paidSheet.file_name}>
                      ⭐ {paidSheet.file_name}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      আপলোড: {paidSheet.timestamp?.split(' ')[0]} | By: {paidSheet.uploaded_by}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => handleDownload(paidSheet.id, paidSheet.file_name)}
                        className="text-[11px] font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" /> ডাউনলোড
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(paidSheet.id)}
                        className="text-[11px] font-bold text-red-600 hover:text-red-800 flex items-center gap-0.5"
                      >
                        <Trash2 className="w-3 h-3" /> মুছুন
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-amber-800 italic">কোনো {sheetLang === 'Bengali' ? 'বাংলা' : 'English'} পেইড PDF এখনো আপলোড করা হয়নি</p>
                )}

                <label className="block">
                  <span className="st-btn bg-amber-600 hover:bg-amber-700 text-white text-[11px] py-1.5 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 cursor-pointer w-full text-center shadow-xs">
                    <Upload className="w-3 h-3" />
                    <span>
                      {uploadingTier === `${sec.type}-paid-${sheetLang}` ? 'আপলোড হচ্ছে...' : (paidSheet ? `ফাইল পরিবর্তন (${sheetLang})` : `পেইড PDF আপলোড (${sheetLang === 'Bengali' ? 'বাংলা' : 'English'})`)}
                    </span>
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,.txt"
                    disabled={uploadingTier === `${sec.type}-paid-${sheetLang}`}
                    onChange={e => {
                      const f = e.target.files?.[0];
                      if (f) handleUpload(sec.type, 'paid', f);
                      e.target.value = '';
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// QUESTION BANK MANAGER SECTION (ADMIN & TEACHER)
// ============================================================================
function QuestionBankManagerSection({ topics, selectedTopicId, setSelectedTopicId, questions, fetchQuestions, userRole, downloadTextFile, T }: any) {
  const [subTab, setSubTab] = useState<'extract' | 'manual' | 'dups' | 'browse' | 'backup'>('extract');

  // Backup & Restore state
  const [backupLoading, setBackupLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);

  const handleDownloadBackup = async () => {
    try {
      setBackupLoading(true);
      const res = await fetch('/api/admin/backup');
      const data = await res.json();
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `WBBSE_Geography_Full_Backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setBackupLoading(false);
    }
  };

  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        setRestoreLoading(true);
        const parsed = JSON.parse(reader.result as string);
        
        // Inspect content to give user helpful instant feedback
        const qCount = Array.isArray(parsed) ? parsed.length : (parsed.questions?.length || parsed.data?.questions?.length || parsed.items?.length || 0);
        const uCount = parsed.users?.length || 0;
        const pCount = parsed.payments?.length || 0;
        const sCount = parsed.chapter_answer_sheets?.length || 0;

        if (qCount === 0 && uCount === 0 && pCount === 0 && sCount === 0) {
          alert('⚠️ এই ফাইলে কোনো সংরক্ষিত প্রশ্ন, অ্যাকাউন্ট বা পেমেন্ট তথ্য পাওয়া যায়নি। অনুগ্রহ করে সঠিক ব্যাকআপ JSON ফাইল নির্বাচন করুন।');
          return;
        }

        const res = await fetch('/api/admin/restore', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed)
        });
        const data = await res.json();
        if (res.ok) {
          alert(`🎉 ${data.message || `সফলভাবে রিস্টোর হয়েছে! মোট ${data.restored_questions || qCount} টি প্রশ্ন ও তথ্য লোকাল এবং ক্লাউড ফায়ারস্টোর উভয় স্থানেই সুরক্ষিত করা হয়েছে।`}`);
          if (fetchQuestions) {
            fetchQuestions(selectedTopicId);
          }
        } else {
          alert(`রিস্টোর ব্যর্থ হয়েছে: ${data.error || 'Server error'}`);
        }
      } catch (err: any) {
        alert('ত্রুটি: ব্যাকআপ JSON ফাইলটি সঠিক নয় (' + err.message + ')');
      } finally {
        setRestoreLoading(false);
        // Reset file input so user can re-upload if desired
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  // Manual Form
  const [qBn, setQBn] = useState('');
  const [qEn, setQEn] = useState('');
  const [qType, setQType] = useState('MCQ (1 Mark)');
  const [optA, setOptA] = useState('');
  const [optAEn, setOptAEn] = useState('');
  const [optB, setOptB] = useState('');
  const [optBEn, setOptBEn] = useState('');
  const [optC, setOptC] = useState('');
  const [optCEn, setOptCEn] = useState('');
  const [optD, setOptD] = useState('');
  const [optDEn, setOptDEn] = useState('');
  const [corrOpt, setCorrOpt] = useState('A');
  const [explanation, setExplanation] = useState('');
  const [explanationEn, setExplanationEn] = useState('');
  const [modelAnswer, setModelAnswer] = useState('');
  const [modelAnswerEn, setModelAnswerEn] = useState('');
  const [markingScheme, setMarkingScheme] = useState('');
  const [markingSchemeEn, setMarkingSchemeEn] = useState('');

  // Extract Form
  const [extractMode, setExtractMode] = useState<'text' | 'url'>('text');
  const [targetFormat, setTargetFormat] = useState<'auto' | 'saq' | 'mcq' | '2m' | '3m' | '5m'>('auto');
  const [rawText, setRawText] = useState('');
  const [rawTextEn, setRawTextEn] = useState('');
  const [fetchUrl, setFetchUrl] = useState('');
  const [parsedResult, setParsedResult] = useState<any>(null);
  const [extracting, setExtracting] = useState(false);
  const [uploadBatchMode, setUploadBatchMode] = useState<'bilingual' | 'bengali_only' | 'merge_english'>('bilingual');
  const [mergePairs, setMergePairs] = useState<any[]>([]);
  const [merging, setMerging] = useState(false);
  const [mergePreviewing, setMergePreviewing] = useState(false);

  // Duplicate Groups
  const [dupGroups, setDupGroups] = useState<any[]>([]);
  const [selectedKeeps, setSelectedKeeps] = useState<Record<number, number>>({});
  const [scanning, setScanning] = useState(false);

  const handleManualSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qBn.trim() && !qEn.trim()) {
      alert('অনুগ্রহ করে অন্তত বাংলায় বা ইংরেজিতে প্রশ্ন লিখুন (Please enter question in Bengali or English).');
      return;
    }

    let marks = 1;
    let actualType = 'MCQ';
    let isDesc = 0;

    if (qType.startsWith('MCQ')) {
      marks = 1;
      actualType = 'MCQ';
      isDesc = 0;
    } else if (qType.startsWith('SAQ')) {
      marks = 1;
      actualType = 'SAQ';
      isDesc = 0;
    } else {
      marks = qType.includes('2') ? 2 : (qType.includes('3') ? 3 : 5);
      actualType = marks === 2 ? '2M' : (marks === 3 ? '3M' : '5M');
      isDesc = 1;
    }

    try {
      await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic_id: selectedTopicId,
          question_text: qBn.trim() || qEn.trim(),
          question_text_en: qEn.trim(),
          option_a: optA.trim(),
          option_a_en: optAEn.trim(),
          option_b: optB.trim(),
          option_b_en: optBEn.trim(),
          option_c: optC.trim(),
          option_c_en: optCEn.trim(),
          option_d: optD.trim(),
          option_d_en: optDEn.trim(),
          correct_option: actualType === 'SAQ' ? (optA.trim() || modelAnswer.trim()) : corrOpt,
          explanation: explanation.trim(),
          explanation_en: explanationEn.trim(),
          marks,
          is_descriptive: isDesc,
          model_answer: actualType === 'SAQ' ? optA.trim() : modelAnswer.trim(),
          model_answer_en: actualType === 'SAQ' ? optAEn.trim() : modelAnswerEn.trim(),
          marking_scheme: markingScheme.trim(),
          marking_scheme_en: markingSchemeEn.trim(),
          q_type: actualType
        })
      });
      alert('🎉 প্রশ্ন ও উভয় ভাষার উত্তর সফলভাবে যুক্ত হয়েছে (Question saved)!');
      setQBn('');
      setQEn('');
      setOptA('');
      setOptAEn('');
      setOptB('');
      setOptBEn('');
      setOptC('');
      setOptCEn('');
      setOptD('');
      setOptDEn('');
      setExplanation('');
      setExplanationEn('');
      setModelAnswer('');
      setModelAnswerEn('');
      setMarkingScheme('');
      setMarkingSchemeEn('');
      fetchQuestions(selectedTopicId);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleRunExtract = async () => {
    setExtracting(true);
    setParsedResult(null);
    try {
      const res = await fetch('/api/extract_text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          raw_text: rawText,
          raw_text_en: rawTextEn,
          url: extractMode === 'url' ? fetchUrl : '',
          target_format: targetFormat
        })
      });
      const data = await res.json();
      setParsedResult(data);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setExtracting(false);
    }
  };

  const handlePreviewMergeEnglish = async () => {
    if (!rawTextEn.trim()) {
      alert('অনুগ্রহ করে ইংরেজি প্রশ্নমালা পেস্ট করুন (Please paste English questions batch).');
      return;
    }
    setMergePreviewing(true);
    setMergePairs([]);
    try {
      const res = await fetch('/api/questions/preview_merge_english', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic_id: selectedTopicId,
          raw_text_en: rawTextEn,
          target_format: targetFormat
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to preview merge');
      if (!data.pairs || data.pairs.length === 0) {
        alert(`কোনো প্রশ্ন মেলানো যায়নি। এই অধ্যায়ে প্রশ্ন সংখ্যা: ${data.total_existing}, পার্স করা ইংরেজি প্রশ্ন: ${data.total_english}`);
        return;
      }
      setMergePairs(data.pairs);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setMergePreviewing(false);
    }
  };

  const handleApplyMergeEnglish = async () => {
    if (!mergePairs || mergePairs.length === 0) return;
    setMerging(true);
    try {
      const res = await fetch('/api/questions/merge_english', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic_id: selectedTopicId,
          pairs: mergePairs
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to merge English');
      alert(`🎉 সফলভাবে ${data.updated}টি বিদ্যমান বাংলা প্রশ্নের সাথে ইংরেজি সংস্করণ যুক্ত করা হয়েছে!`);
      setMergePairs([]);
      setRawTextEn('');
      fetchQuestions(selectedTopicId);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setMerging(false);
    }
  };

  const updateMergePair = (index: number, field: string, value: string) => {
    setMergePairs(prev => {
      const next = [...prev];
      if (next[index]) {
        next[index] = { ...next[index], [field]: value };
      }
      return next;
    });
  };

  const updateParsedQuestion = (index: number, field: string, value: any) => {
    if (!parsedResult) return;
    const items = [...(parsedResult.parsed_questions || parsedResult.general_parsed || [])];
    if (!items[index]) return;

    if (field.startsWith('options.')) {
      const optKey = field.split('.')[1];
      const curOptions = items[index].options || {};
      items[index] = {
        ...items[index],
        options: { ...curOptions, [optKey]: value },
        [`opt_${optKey.toLowerCase()}`]: value
      };
    } else if (field.startsWith('options_en.')) {
      const optKey = field.split('.')[1];
      const curOptionsEn = items[index].options_en || {};
      items[index] = {
        ...items[index],
        options_en: { ...curOptionsEn, [optKey]: value },
        [`opt_${optKey.toLowerCase()}_en`]: value
      };
    } else {
      items[index] = { ...items[index], [field]: value };
    }

    setParsedResult({
      ...parsedResult,
      parsed_questions: items,
      general_parsed: items
    });
  };

  const removeParsedQuestion = (index: number) => {
    if (!parsedResult) return;
    const items = [...(parsedResult.parsed_questions || parsedResult.general_parsed || [])];
    items.splice(index, 1);
    setParsedResult({
      ...parsedResult,
      parsed_questions: items,
      general_parsed: items
    });
  };

  const handleBulkSaveExtracted = async () => {
    if (!parsedResult) return;
    try {
      const items = parsedResult.parsed_questions || parsedResult.general_parsed || parsedResult.mcq_parsed || [];
      if (items.length === 0) {
        alert('No questions found to save');
        return;
      }

      const payload = items.map((q: any) => {
        const hasOptions = Boolean((q.opt_a && q.opt_a.trim()) || (q.options?.A && q.options.A.trim()));
        let finalType = q.q_type;
        if (!finalType || (finalType === 'MCQ' && !hasOptions)) {
          if (q.marks === 2) finalType = '2M';
          else if (q.marks === 3) finalType = '3M';
          else if (q.marks >= 5) finalType = '5M';
          else if (!hasOptions) finalType = 'SAQ';
          else finalType = 'MCQ';
        }

        const answerText = q.answer || (finalType === 'MCQ' ? q.correct : (q.model_answer || ''));
        const answerTextEn = q.answer_en || (finalType === 'MCQ' ? (q.correct_en || q.correct) : (q.model_answer_en || ''));

        return {
          question_text: q.question || '',
          question_text_en: q.question_en || '',
          option_a: q.opt_a || q.options?.A || '',
          option_a_en: q.opt_a_en || q.options_en?.A || '',
          option_b: q.opt_b || q.options?.B || '',
          option_b_en: q.opt_b_en || q.options_en?.B || '',
          option_c: q.opt_c || q.options?.C || '',
          option_c_en: q.opt_c_en || q.options_en?.C || '',
          option_d: q.opt_d || q.options?.D || '',
          option_d_en: q.opt_d_en || q.options_en?.D || '',
          correct_option: finalType === 'MCQ' ? (q.correct || 'A') : answerText,
          model_answer: answerText,
          model_answer_en: answerTextEn,
          explanation: q.explanation || '',
          explanation_en: q.explanation_en || '',
          marking_scheme: q.marking_scheme || '',
          marking_scheme_en: q.marking_scheme_en || '',
          marks: q.marks || (finalType === '2M' ? 2 : (finalType === '3M' ? 3 : (finalType === '5M' ? 5 : 1))),
          is_descriptive: (finalType === 'MCQ' || finalType === 'SAQ') ? 0 : 1,
          q_type: finalType
        };
      });

      const res = await fetch('/api/questions/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic_id: selectedTopicId,
          questions: payload
        })
      });
      const data = await res.json();
      alert(`🎉 সফলভাবে ${data.saved}টি প্রশ্ন (বাংলা ও ইংরেজি তথ্যসহ) স্থায়ীভাবে সেভ হয়েছে!`);
      setParsedResult(null);
      setRawText('');
      setRawTextEn('');
      fetchQuestions(selectedTopicId);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleScanDuplicates = async () => {
    setScanning(true);
    try {
      const res = await fetch(`/api/duplicate_scan?topic_id=${selectedTopicId}`);
      const data = await res.json();
      setDupGroups(data);
      const initialKeeps: Record<number, number> = {};
      data.forEach((grp: any[], idx: number) => {
        initialKeeps[idx] = grp[0].id;
      });
      setSelectedKeeps(initialKeeps);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setScanning(false);
    }
  };

  const handleRemoveDuplicate = async (keepId: number, deleteId: number) => {
    try {
      await fetch('/api/duplicate_remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keep_id: keepId,
          delete_id: deleteId,
          removed_by: userRole
        })
      });
      alert(`Removed question #${deleteId}`);
      handleScanDuplicates();
      fetchQuestions(selectedTopicId);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const executeDeleteQuestion = async (id: number) => {
    try {
      setDeletingId(id);
      const res = await fetch(`/api/questions/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to delete');
      }
      setConfirmDeleteId(null);
      fetchQuestions(selectedTopicId);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setDeletingId(null);
    }
  };

  const [clearingAll, setClearingAll] = useState(false);
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [managerMessage, setManagerMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const executeClearAllQuestions = async () => {
    setClearingAll(true);
    setManagerMessage(null);
    try {
      const res = await fetch(`/api/topics/${selectedTopicId}/questions`, { method: 'DELETE' });
      if (res.ok) {
        setConfirmClearAll(false);
        setManagerMessage({ type: 'success', text: '✅ এই অধ্যায়ের সমস্ত প্রশ্ন সফলভাবে মুছে ফেলা হয়েছে। সিস্টেম নিজে থেকে কোনো ডামি বা স্যাম্পল প্রশ্ন আর ফিরিয়ে আনবে না।' });
        fetchQuestions(selectedTopicId);
      } else {
        const err = await res.json();
        setManagerMessage({ type: 'error', text: err.error || 'মুছতে ব্যর্থ হয়েছে' });
      }
    } catch (e: any) {
      setManagerMessage({ type: 'error', text: e.message });
    } finally {
      setClearingAll(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">{T("📖 Question Bank Manager", "📖 Question Bank Manager")}</h2>

      {/* Chapter Selector */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <label className="text-xs font-bold text-slate-700 block mb-1">{T("Selected Chapter:", "Selected Chapter:")}</label>
        <select
          value={selectedTopicId}
          onChange={e => setSelectedTopicId(Number(e.target.value))}
          className="st-select"
        >
          {topics.map((t: any) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Chapter 2/3/5 Marks Dual-Tier PDF Answer Sheet Manager */}
      <AdminChapterPdfAnswerSheetsManager
        topicId={selectedTopicId}
        userRole={userRole}
        T={T}
        downloadTextFile={downloadTextFile}
      />

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50 rounded-t-xl overflow-hidden">
        <button
          onClick={() => setSubTab('extract')}
          className={`flex-1 py-3 px-4 font-bold text-xs border-b-2 transition ${
            subTab === 'extract' ? 'border-blue-600 text-blue-600 bg-white' : 'text-slate-600 hover:text-slate-900 border-transparent'
          }`}
        >
          ⚡ PDF/URL Extractor
        </button>
        <button
          onClick={() => setSubTab('manual')}
          className={`flex-1 py-3 px-4 font-bold text-xs border-b-2 transition ${
            subTab === 'manual' ? 'border-blue-600 text-blue-600 bg-white' : 'text-slate-600 hover:text-slate-900 border-transparent'
          }`}
        >
          ➕ Manual Upload
        </button>
        <button
          onClick={() => setSubTab('dups')}
          className={`flex-1 py-3 px-4 font-bold text-xs border-b-2 transition ${
            subTab === 'dups' ? 'border-blue-600 text-blue-600 bg-white' : 'text-slate-600 hover:text-slate-900 border-transparent'
          }`}
        >
          🔍 Duplicate Remover
        </button>
        <button
          onClick={() => setSubTab('browse')}
          className={`flex-1 py-3 px-4 font-bold text-xs border-b-2 transition ${
            subTab === 'browse' ? 'border-blue-600 text-blue-600 bg-white' : 'text-slate-600 hover:text-slate-900 border-transparent'
          }`}
        >
          📖 Browse & Delete ({questions.length})
        </button>
        <button
          onClick={() => setSubTab('backup')}
          className={`flex-1 py-3 px-4 font-bold text-xs border-b-2 transition ${
            subTab === 'backup' ? 'border-blue-600 text-blue-600 bg-white' : 'text-slate-600 hover:text-slate-900 border-transparent'
          }`}
        >
          💾 Backup & Restore
        </button>
      </div>

      {/* -------------------- SubTab: Auto-Extract Engine -------------------- */}
      {subTab === 'extract' && (
        <div className="bg-white p-6 rounded-b-xl border border-t-0 border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span>📤</span>
                <span>অটো এক্সট্র্যাক্টর ইঞ্জিন (Auto-Extract & Bulk Upload)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                যেকোনো টেক্সট বা ওয়েব পেজ পেস্ট করে সরাসরি অধ্যায়ে প্রশ্ন যোগ করুন
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setExtractMode('text')}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition ${
                  extractMode === 'text' ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                📄 Manual Text Paste
              </button>
              <button
                type="button"
                onClick={() => setExtractMode('url')}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition ${
                  extractMode === 'url' ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                🌐 Web URL Fetch
              </button>
            </div>
          </div>

          {/* Target Question Format Selector */}
          <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
                <span>🎯</span>
                <span>আপলোড ফরম্যাট নির্বাচন করুন (Select Question Format):</span>
              </label>
              <span className="text-[11px] font-bold text-blue-700 bg-white px-2.5 py-0.5 rounded-full border border-blue-200">
                Active: {targetFormat.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {[
                { id: 'auto', label: '🪄 Auto-Detect', desc: 'স্মার্ট অটো-ডিটেকশন' },
                { id: 'saq', label: '✏️ SAQ (1 Mark)', desc: 'এক কথায় উত্তর' },
                { id: 'mcq', label: '📝 MCQ (1 Mark)', desc: '৪টি অপশনসহ' },
                { id: '2m', label: '📘 2 Marks', desc: 'সংক্ষিপ্ত ব্যাখ্যামূলক' },
                { id: '3m', label: '📗 3 Marks', desc: 'পার্থক্য / ৩ নম্বর' },
                { id: '5m', label: '📕 5 Marks', desc: 'রচনাধর্মী / ৫ নম্বর' }
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setTargetFormat(f.id as any)}
                  className={`p-2.5 rounded-xl text-left border transition ${
                    targetFormat === f.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-300'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-xs">{f.label}</div>
                  <div className={`text-[10px] mt-0.5 ${targetFormat === f.id ? 'text-blue-100' : 'text-slate-500'}`}>
                    {f.desc}
                  </div>
                </button>
              ))}
            </div>

            {/* Contextual Format Tips */}
            <div className="text-[11px] text-blue-900 bg-white/80 p-2.5 rounded-lg border border-blue-150 flex items-start gap-1.5">
              <span className="text-sm">💡</span>
              <div>
                {targetFormat === 'saq' && (
                  <span>
                    <strong>SAQ মোড সক্রিয়:</strong> যেকোনো প্রশ্ন ও উত্তর এক লাইনে থাকলেও (যেমন: <em>"১. বহির্জাত প্রক্রিয়ার শক্তির উৎস কী? উত্তর: সূর্য ও পৃথিবীর অভিকর্ষ বল।"</em>) সিস্টেম নিজে থেকেই প্রশ্ন ও উত্তর আলাদা করে দেবে। <strong>প্রশ্নটি প্রশ্নে থাকবে এবং উত্তরটি শিক্ষার্থীর 'View Answer' সেকশনে যাবে। কোনো উত্তর প্রশ্নে ফাঁস হবে না!</strong>
                  </span>
                )}
                {targetFormat === 'mcq' && (
                  <span>
                    <strong>MCQ মোড সক্রিয়:</strong> প্রশ্ন এবং ক, খ, গ, ঘ বা A, B, C, D অপশনসহ পেস্ট করুন। সঠিক বিকল্প স্বয়ংক্রিয়ভাবে অপশন ট্র্যাকিংয়ে যুক্ত হবে।
                  </span>
                )}
                {(targetFormat === '2m' || targetFormat === '3m' || targetFormat === '5m') && (
                  <span>
                    <strong>{targetFormat.toUpperCase()} বড় প্রশ্ন মোড সক্রিয়:</strong> প্রশ্ন ও উত্তর পেস্ট করুন। প্রশ্নটি শিক্ষার্থীকে দেখানো হবে এবং মডেল উত্তরটি 'View Model Answer'-এ লুকানো থাকবে।
                  </span>
                )}
                {targetFormat === 'auto' && (
                  <span>
                    <strong>অটো-ডিটেক্ট মোড:</strong> অপশন থাকলে MCQ, অপশন ছাড়া ১ নম্বর হলে SAQ, এবং নম্বর উল্লেখ থাকলে ২/৩/৫ নম্বরে স্বয়ংক্রিয়ভাবে সাজানো হবে।
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Workflow Mode Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-700 px-2 py-1">আপলোড পদ্ধতি (Workflow Mode):</span>
            <button
              type="button"
              onClick={() => { setUploadBatchMode('bilingual'); setMergePairs([]); }}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                uploadBatchMode === 'bilingual'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <span>🌐</span>
              <span>উভয় ভাষা একসাথে (Bilingual Batch)</span>
            </button>
            <button
              type="button"
              onClick={() => { setUploadBatchMode('bengali_only'); setMergePairs([]); }}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                uploadBatchMode === 'bengali_only'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <span>🇧🇩</span>
              <span>আগে শুধুমাত্র বাংলা প্রশ্ন (Bengali First)</span>
            </button>
            <button
              type="button"
              onClick={() => { setUploadBatchMode('merge_english'); setParsedResult(null); }}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                uploadBatchMode === 'merge_english'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200'
              }`}
            >
              <span>🇬🇧</span>
              <span>বিদ্যমান প্রশ্নে ইংরেজি যোগ করুন (Merge English)</span>
            </button>
          </div>

          {extractMode === 'text' ? (
            <div className="space-y-3">
              {uploadBatchMode === 'bilingual' && (
                <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                  <span className="text-base">💡</span>
                  <div>
                    <span className="font-bold">উভয় ভাষার প্রশ্ন একসাথে তোলার সুবিধা:</span> বাম পাশের বক্সে বাংলা এবং ডান পাশের বক্সে ইংরেজি প্রশ্নমালা পেস্ট করুন। প্রশ্ন, অপশন বা ব্যাখ্যার শেষে থাকা কোনো স্ল্যাশ (/) বা ব্যাকস্ল্যাশ (\) সিস্টেম স্বয়ংক্রিয়ভাবে মুছে পরিচ্ছন্নভাবে সাজিয়ে দেবে।
                  </div>
                </div>
              )}

              {uploadBatchMode === 'bengali_only' && (
                <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
                  <span className="text-base">💡</span>
                  <div>
                    <span className="font-bold">বাংলা প্রথম ধাপ:</span> প্রথমে আপনি অধ্যায়ের সমস্ত বাংলা প্রশ্ন (MCQ/SAQ/বর্ণনামূলক) পেস্ট করে সেভ করে নিন। পরবর্তীতে "বিদ্যমান প্রশ্নে ইংরেজি যোগ করুন" মোড বেছে নিয়ে অনায়াসে আলাদাভাবে ইংরেজি প্রশ্নমালা যুক্ত করতে পারবেন।
                  </div>
                </div>
              )}

              {uploadBatchMode === 'merge_english' && (
                <div className="p-3 bg-indigo-50/90 border border-indigo-200 rounded-xl text-xs text-indigo-950 flex items-start gap-2">
                  <span className="text-base">🇬🇧</span>
                  <div>
                    <span className="font-bold">আলাদাভাবে ইংরেজি প্রশ্ন যোগ করার সুবিধা:</span> এই অধ্যায়ে বর্তমানে মোট <strong>{questions.length}টি প্রশ্ন</strong> রয়েছে। আপনি নিচে শুধুমাত্র ইংরেজি প্রশ্নমালা পেস্ট করুন। সিস্টেম ক্রম অনুসারে ১ম বাংলা প্রশ্নের সাথে ১ম ইংরেজি, ২য় বাংলা প্রশ্নের সাথে ২য় ইংরেজি প্রশ্ন, অপশন ও ব্যাখ্যা সুন্দরভাবে ম্যাচ করে দেবে এবং সব স্ল্যাশ (/) স্বয়ংক্রিয়ভাবে ফিল্টার করবে।
                  </div>
                </div>
              )}

              {/* Textareas according to Mode */}
              {uploadBatchMode === 'bilingual' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      🇧🇩 বাংলা প্রশ্নমালা পেস্ট করুন (Bengali Questions Batch):
                    </label>
                    <textarea
                      rows={8}
                      value={rawText}
                      onChange={e => setRawText(e.target.value)}
                      placeholder={
                        targetFormat === 'saq'
                          ? "১. সর্বপ্রধান বহির্জাত ভূমিরূপ প্রক্রিয়ার নাম কী? উত্তর: নদীর ক্ষয়কার্য।\n২. বহির্জাত প্রক্রিয়ার শক্তির মূল উৎস কী? উত্তর: সূর্যকিরণ।"
                          : "১. বহির্জাত প্রক্রিয়ার মূল শক্তির উৎস কোনটি?\n(ক) সূর্য (খ) চাঁদ (গ) বায়ু (ঘ) নদী\nউত্তর: (ক)"
                      }
                      className="st-textarea font-sans text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      🇬🇧 ইংরেজি প্রশ্নমালা পেস্ট করুন (English Questions Batch):
                    </label>
                    <textarea
                      rows={8}
                      value={rawTextEn}
                      onChange={e => setRawTextEn(e.target.value)}
                      placeholder={
                        targetFormat === 'saq'
                          ? "1. What is the primary exogenic landform process? Ans: River erosion.\n2. What is the main source of energy for exogenic processes? Ans: Solar radiation."
                          : "1. Which is the main source of energy for exogenic processes?\n(A) Sun (B) Moon (C) Wind (D) River\nAns: (A)"
                      }
                      className="st-textarea font-sans text-xs"
                    />
                  </div>
                </div>
              )}

              {uploadBatchMode === 'bengali_only' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    🇧🇩 শুধুমাত্র বাংলা প্রশ্নমালা পেস্ট করুন (Bengali Questions Batch):
                  </label>
                  <textarea
                    rows={9}
                    value={rawText}
                    onChange={e => setRawText(e.target.value)}
                    placeholder="১. বহির্জাত প্রক্রিয়ার মূল শক্তির উৎস কোনটি?\nক) সূর্যশক্তি\nখ) ভূ-অভ্যন্তরীণ তাপ\nগ) পারমাণবিক শক্তি\nঘ) চৌম্বক শক্তি\nউত্তর: ক) সূর্যশক্তি\nব্যাখ্যা: সৌরশক্তি বায়ুমণ্ডলীয় পরিবর্তন ও জলচক্র নিয়ন্ত্রণ করে।"
                    className="st-textarea font-sans text-xs"
                  />
                </div>
              )}

              {uploadBatchMode === 'merge_english' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-indigo-950 block">
                      🇬🇧 শুধুমাত্র ইংরেজি প্রশ্নমালা পেস্ট করুন (English Questions Batch):
                    </label>
                    <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      লক্ষ্য অধ্যায়: #{selectedTopicId} ({questions.length} বিদ্যমান প্রশ্ন)
                    </span>
                  </div>
                  <textarea
                    rows={9}
                    value={rawTextEn}
                    onChange={e => setRawTextEn(e.target.value)}
                    placeholder="1. What is the main source of energy for exogenic processes?\nA) Geothermal heat\nB) Solar energy\nC) Nuclear energy\nD) Magnetic energy\nAnswer: B) Solar energy\nExplanation: Solar heat controls winds, water cycle and climate."
                    className="st-textarea font-sans text-xs border-indigo-200 focus:border-indigo-500"
                  />
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                ওয়েব পেজ ইউআরএল দিন (Enter Web Page URL):
              </label>
              <input
                type="url"
                value={fetchUrl}
                onChange={e => setFetchUrl(e.target.value)}
                placeholder="https://example.com/geography-questions"
                className="st-input"
              />
            </div>
          )}

          {uploadBatchMode === 'merge_english' ? (
            <button
              onClick={handlePreviewMergeEnglish}
              disabled={mergePreviewing || !rawTextEn.trim()}
              className="st-btn bg-indigo-600 hover:bg-indigo-700 w-full md:w-auto py-2.5 px-6 flex items-center justify-center gap-2 font-bold shadow-xs text-white"
            >
              <span>⚡</span>
              <span>{mergePreviewing ? 'ইংরেজি প্রশ্ন পার্স ও মেলানো হচ্ছে...' : 'ইংরেজি প্রশ্ন পার্স ও বিদ্যমান প্রশ্নের সাথে মিলিয়ে দেখুন (Preview & Match)'}</span>
            </button>
          ) : (
            <button
              onClick={handleRunExtract}
              disabled={extracting || (!rawText.trim() && !fetchUrl.trim())}
              className="st-btn w-full md:w-auto py-2.5 px-6 flex items-center justify-center gap-2 font-bold shadow-xs"
            >
              <span>⚡</span>
              <span>{extracting ? 'প্রসেসিং ও ক্যাটাগোরাইজ করা হচ্ছে...' : 'প্রশ্নমালা পার্স ও যাচাই করুন (Parse & Verify)'}</span>
            </button>
          )}

          {/* Merge English Preview Cards */}
          {uploadBatchMode === 'merge_english' && mergePairs.length > 0 && (
            <div className="p-4 bg-indigo-50/50 border border-indigo-200 rounded-xl space-y-4 mt-4 animate-in fade-in">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-200 pb-3">
                <div>
                  <span className="font-bold text-indigo-950 text-sm flex items-center gap-2">
                    <span>📋</span>
                    <span>মোট {mergePairs.length}টি বিদ্যমান প্রশ্নের সাথে ইংরেজি সংস্করণ মেলানো হয়েছে</span>
                  </span>
                  <p className="text-[11px] text-indigo-800 mt-0.5">
                    প্রতিটি বাংলা প্রশ্নের পাশে নতুন ইংরেজি প্রশ্ন, অপশন ও ব্যাখ্যা দেখে নিন। প্রয়োজনে এডিট করুন, তারপর সেভ বাটনে চাপ দিন।
                  </p>
                </div>
                <button
                  onClick={handleApplyMergeEnglish}
                  disabled={merging}
                  className="st-btn bg-emerald-600 hover:bg-emerald-700 text-xs py-2 px-5 flex items-center gap-1.5 shadow-sm font-bold text-white"
                >
                  <span>🚀</span>
                  <span>{merging ? 'সংরক্ষণ করা হচ্ছে...' : 'অধ্যায়ের বিদ্যমান প্রশ্নে ইংরেজি সংস্করণ সেভ করুন (Apply English)'}</span>
                </button>
              </div>

              <div className="max-h-[500px] overflow-y-auto space-y-3 pr-1">
                {mergePairs.map((p: any, i: number) => (
                  <div key={p.question_id || i} className="p-4 bg-white rounded-xl border border-indigo-150 text-xs shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-indigo-700 font-mono font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          #Q{p.index} [DB ID: #{p.question_id}]
                        </span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                          বাংলা ↔ ইংরেজি জোড়া প্রস্তুত
                        </span>
                      </div>
                    </div>

                    {/* Question text side-by-side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-600 block mb-1">🇧🇩 বিদ্যমান বাংলা প্রশ্ন:</span>
                        <p className="text-slate-900 font-medium">{p.q_bn || '-'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-indigo-900 block mb-1">🇬🇧 নতুন ইংরেজি প্রশ্ন (English):</span>
                        <textarea
                          rows={2}
                          value={p.q_en || ''}
                          onChange={e => updateMergePair(i, 'q_en', e.target.value)}
                          className="st-textarea text-xs bg-white border-indigo-300"
                        />
                      </div>
                    </div>

                    {/* Options side-by-side if options exist */}
                    {(p.opt_a_bn || p.opt_a_en) && (
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                        <span className="font-bold text-slate-800 text-[11px] block">MCQ অপশনসমূহ (বামে বিদ্যমান বাংলা, ডানে নতুন ইংরেজি):</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div className="p-1.5 bg-white rounded border text-slate-700"><strong>A)</strong> {p.opt_a_bn || '-'}</div>
                          <input
                            type="text"
                            value={p.opt_a_en || ''}
                            onChange={e => updateMergePair(i, 'opt_a_en', e.target.value)}
                            placeholder="Option A in English"
                            className="st-input text-xs py-1"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div className="p-1.5 bg-white rounded border text-slate-700"><strong>B)</strong> {p.opt_b_bn || '-'}</div>
                          <input
                            type="text"
                            value={p.opt_b_en || ''}
                            onChange={e => updateMergePair(i, 'opt_b_en', e.target.value)}
                            placeholder="Option B in English"
                            className="st-input text-xs py-1"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div className="p-1.5 bg-white rounded border text-slate-700"><strong>C)</strong> {p.opt_c_bn || '-'}</div>
                          <input
                            type="text"
                            value={p.opt_c_en || ''}
                            onChange={e => updateMergePair(i, 'opt_c_en', e.target.value)}
                            placeholder="Option C in English"
                            className="st-input text-xs py-1"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div className="p-1.5 bg-white rounded border text-slate-700"><strong>D)</strong> {p.opt_d_bn || '-'}</div>
                          <input
                            type="text"
                            value={p.opt_d_en || ''}
                            onChange={e => updateMergePair(i, 'opt_d_en', e.target.value)}
                            placeholder="Option D in English"
                            className="st-input text-xs py-1"
                          />
                        </div>
                      </div>
                    )}

                    {/* Answer & Explanation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-2.5 bg-amber-50/70 rounded-lg border border-amber-200">
                      <div>
                        <span className="text-[10px] font-bold text-amber-900 block mb-0.5">বাংলা উত্তর ও ব্যাখ্যা:</span>
                        <div className="text-slate-800">উত্তর: {p.ans_bn || '-'}</div>
                        {p.exp_bn && <div className="text-[11px] text-slate-600 mt-1">💡 {p.exp_bn}</div>}
                      </div>
                      <div className="space-y-1.5">
                        <div>
                          <span className="text-[10px] font-bold text-amber-900 block">English Answer:</span>
                          <input
                            type="text"
                            value={p.ans_en || ''}
                            onChange={e => updateMergePair(i, 'ans_en', e.target.value)}
                            className="st-input text-xs py-1"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-amber-900 block">English Explanation:</span>
                          <textarea
                            rows={2}
                            value={p.exp_en || ''}
                            onChange={e => updateMergePair(i, 'exp_en', e.target.value)}
                            placeholder="Explanation in English..."
                            className="st-textarea text-xs bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {parsedResult && (
            <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl space-y-4 mt-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span>📋</span>
                    <span>
                      মোট {(parsedResult.parsed_questions || parsedResult.general_parsed || []).length}টি প্রশ্ন প্রস্তুত করা হয়েছে
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      ফরম্যাট: {targetFormat.toUpperCase()}
                    </span>
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    নিচে প্রিভিউ দেখে নিন। প্রয়োজনে প্রতিটি প্রশ্নের বাংলা ও ইংরেজি টেক্সট সরাসরি এডিট করতে পারেন।
                  </p>
                </div>
                <button
                  onClick={handleBulkSaveExtracted}
                  className="st-btn bg-emerald-600 hover:bg-emerald-700 text-xs py-2 px-5 flex items-center gap-1.5 shadow-sm font-bold"
                >
                  <span>🚀</span>
                  <span>অধ্যায়ে সব প্রশ্ন সেভ করুন (Save All to Chapter)</span>
                </button>
              </div>

              <div className="max-h-[500px] overflow-y-auto space-y-3 pr-1">
                {(parsedResult.parsed_questions || parsedResult.general_parsed || parsedResult.mcq_parsed || []).map((q: any, i: number) => {
                  const isMCQ = q.q_type === 'MCQ';
                  const isSAQ = q.q_type === 'SAQ';

                  return (
                    <div key={i} className="p-4 bg-white rounded-xl border border-slate-200 text-xs shadow-xs space-y-3">
                      <div className="flex items-center justify-between border-b pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-700 font-mono font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            #Q{i + 1}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isSAQ ? 'bg-emerald-100 text-emerald-800' : (isMCQ ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800')
                          }`}>
                            {q.q_type || (isSAQ ? 'SAQ' : 'MCQ')} [{q.marks || 1} Mark]
                          </span>
                          {Boolean(q.explanation || q.explanation_en) && (
                            <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 shadow-2xs">
                              <span>💡</span>
                              <span>ব্যাখ্যা যুক্ত (With Explanation)</span>
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeParsedQuestion(i)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded text-[11px] font-semibold transition"
                        >
                          ✕ বাদ দিন (Remove)
                        </button>
                      </div>

                      {/* Question Text in Bengali & English */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-0.5">
                            🇧🇩 প্রশ্ন (বাংলায়):
                          </label>
                          <textarea
                            rows={2}
                            value={q.question || ''}
                            onChange={e => updateParsedQuestion(i, 'question', e.target.value)}
                            className="st-textarea text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-0.5">
                            🇬🇧 Question (in English):
                          </label>
                          <textarea
                            rows={2}
                            value={q.question_en || ''}
                            onChange={e => updateParsedQuestion(i, 'question_en', e.target.value)}
                            placeholder="Type or edit English question..."
                            className="st-textarea text-xs"
                          />
                        </div>
                      </div>

                      {/* Options if MCQ */}
                      {isMCQ && (
                        <div className="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <div className="text-[11px] font-bold text-slate-800">MCQ অপশনসমূহ (বাংলা ও ইংরেজি):</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                              <span className="text-[10px] font-bold text-slate-600 block">Option A (বাংলা):</span>
                              <input
                                type="text"
                                value={q.options?.A || q.opt_a || ''}
                                onChange={e => updateParsedQuestion(i, 'options.A', e.target.value)}
                                className="st-input text-xs py-1"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-slate-600 block">Option A (English):</span>
                              <input
                                type="text"
                                value={q.options_en?.A || q.opt_a_en || ''}
                                onChange={e => updateParsedQuestion(i, 'options_en.A', e.target.value)}
                                placeholder="Option A in English"
                                className="st-input text-xs py-1"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                              <span className="text-[10px] font-bold text-slate-600 block">Option B (বাংলা):</span>
                              <input
                                type="text"
                                value={q.options?.B || q.opt_b || ''}
                                onChange={e => updateParsedQuestion(i, 'options.B', e.target.value)}
                                className="st-input text-xs py-1"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-slate-600 block">Option B (English):</span>
                              <input
                                type="text"
                                value={q.options_en?.B || q.opt_b_en || ''}
                                onChange={e => updateParsedQuestion(i, 'options_en.B', e.target.value)}
                                placeholder="Option B in English"
                                className="st-input text-xs py-1"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                              <span className="text-[10px] font-bold text-slate-600 block">Option C (বাংলা):</span>
                              <input
                                type="text"
                                value={q.options?.C || q.opt_c || ''}
                                onChange={e => updateParsedQuestion(i, 'options.C', e.target.value)}
                                className="st-input text-xs py-1"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-slate-600 block">Option C (English):</span>
                              <input
                                type="text"
                                value={q.options_en?.C || q.opt_c_en || ''}
                                onChange={e => updateParsedQuestion(i, 'options_en.C', e.target.value)}
                                placeholder="Option C in English"
                                className="st-input text-xs py-1"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                              <span className="text-[10px] font-bold text-slate-600 block">Option D (বাংলা):</span>
                              <input
                                type="text"
                                value={q.options?.D || q.opt_d || ''}
                                onChange={e => updateParsedQuestion(i, 'options.D', e.target.value)}
                                className="st-input text-xs py-1"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-slate-600 block">Option D (English):</span>
                              <input
                                type="text"
                                value={q.options_en?.D || q.opt_d_en || ''}
                                onChange={e => updateParsedQuestion(i, 'options_en.D', e.target.value)}
                                placeholder="Option D in English"
                                className="st-input text-xs py-1"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-[11px] font-bold text-slate-700">সঠিক বিকল্প:</span>
                            <select
                              value={q.correct || 'A'}
                              onChange={e => updateParsedQuestion(i, 'correct', e.target.value)}
                              className="st-select py-1 text-xs w-28 font-bold"
                            >
                              <option value="A">Option A</option>
                              <option value="B">Option B</option>
                              <option value="C">Option C</option>
                              <option value="D">Option D</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {/* Answer / Solution display and edit */}
                      <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 space-y-3">
                        <div className="font-bold text-emerald-950 flex items-center justify-between text-[11px]">
                          <span className="flex items-center gap-1">
                            <span>✅</span>
                            <span>{isMCQ ? 'MCQ সমাধান ও ব্যাখ্যা' : (isSAQ ? 'SAQ সঠিক উত্তর' : 'মডেল উত্তরপত্র (Model Solution)')}</span>
                          </span>
                          {Boolean(q.explanation || q.explanation_en) && (
                            <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded">
                              💡 ব্যাখ্যা শনাক্ত হয়েছে (Explanation Detected)
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <span className="text-[10px] font-bold text-emerald-900 block">বাংলা উত্তর:</span>
                            <textarea
                              rows={2}
                              value={q.answer || q.model_answer || ''}
                              onChange={e => {
                                updateParsedQuestion(i, 'answer', e.target.value);
                                updateParsedQuestion(i, 'model_answer', e.target.value);
                              }}
                              className="st-textarea text-xs bg-white"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-emerald-900 block">English Answer / Model:</span>
                            <textarea
                              rows={2}
                              value={q.answer_en || q.model_answer_en || ''}
                              onChange={e => {
                                updateParsedQuestion(i, 'answer_en', e.target.value);
                                updateParsedQuestion(i, 'model_answer_en', e.target.value);
                              }}
                              placeholder="English answer outline..."
                              className="st-textarea text-xs bg-white"
                            />
                          </div>
                        </div>

                        {/* Explanation Field in Bengali & English */}
                        <div className="pt-2 border-t border-emerald-200/80">
                          <div className="font-bold text-amber-950 flex items-center gap-1 text-[11px] mb-1.5">
                            <span>💡</span>
                            <span>প্রশ্নের বিস্তারিত সমাধান ও ব্যাখ্যা (Explanation & Reasoning):</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                              <span className="text-[10px] font-bold text-amber-900 block">বাংলা ব্যাখ্যা (Explanation):</span>
                              <textarea
                                rows={2}
                                value={q.explanation || ''}
                                onChange={e => updateParsedQuestion(i, 'explanation', e.target.value)}
                                placeholder="উত্তরের নির্ভুল ব্যাখ্যা বা কারণ লিখুন..."
                                className="st-textarea text-xs bg-white border-amber-300 focus:border-amber-500"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-amber-900 block">English Explanation (Optional):</span>
                              <textarea
                                rows={2}
                                value={q.explanation_en || ''}
                                onChange={e => updateParsedQuestion(i, 'explanation_en', e.target.value)}
                                placeholder="Explanation or detailed concept in English..."
                                className="st-textarea text-xs bg-white border-amber-300 focus:border-amber-500"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* -------------------- SubTab: Manual Upload -------------------- */}
      {subTab === 'manual' && (
        <form onSubmit={handleManualSave} className="bg-white p-6 rounded-b-xl border border-t-0 border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-800">➕ বাংলা ও ইংরেজি উভয় ভাষায় প্রশ্ন আপলোড (Bilingual Manual Upload)</h3>
              <p className="text-xs text-slate-500 mt-0.5">আপনি নিজে বাংলা এবং ইংরেজি উভয় প্রশ্ন ও উত্তর লিখে আপলোড করুন। কোনো অটো-অনুবাদ হবে না। ছাত্রছাত্রীরা যে ভাষা বেছে নেবে, স্বয়ংক্রিয়ভাবে সেই ভাষায় দেখতে পাবে।</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                🇧🇩 প্রশ্ন (বাংলায় - আবশ্যক):
              </label>
              <textarea
                required
                rows={3}
                value={qBn}
                onChange={e => setQBn(e.target.value)}
                placeholder="যেমন: বহির্জাত প্রক্রিয়ার মূল শক্তির উৎস কোনটি?"
                className="st-textarea"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                🇬🇧 Question in English (ইংরেজি মাধ্যম শিক্ষার্থীদের জন্য):
              </label>
              <textarea
                rows={3}
                value={qEn}
                onChange={e => setQEn(e.target.value)}
                placeholder="e.g. Which is the primary source of energy for exogenic processes?"
                className="st-textarea"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Question Type / Marks (প্রশ্নের ধরণ ও নম্বর):</label>
            <select
              value={qType}
              onChange={e => setQType(e.target.value)}
              className="st-select"
            >
              <option value="MCQ (1 Mark)">MCQ (1 Mark) - বহুনির্বাচনী প্রশ্ন</option>
              <option value="SAQ (1 Mark)">SAQ (1 Mark) - সংক্ষিপ্ত এক কথায় উত্তর</option>
              <option value="2 Marks">2 Marks - ২ নম্বরের ব্যাখ্যাধর্মী প্রশ্ন</option>
              <option value="3 Marks">3 Marks - ৩ নম্বরের সংক্ষিপ্ত ব্যাখ্যামূলক প্রশ্ন</option>
              <option value="5 Marks">5 Marks - ৫ নম্বরের রচনাধর্মী প্রশ্ন</option>
            </select>
          </div>

          {qType.startsWith('MCQ') ? (
            <>
              <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs font-bold text-slate-800">MCQ অপশনসমূহ (বাংলা ও ইংরেজিতে):</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Option A (বাংলায়):</label>
                    <input
                      type="text"
                      required
                      value={optA}
                      onChange={e => setOptA(e.target.value)}
                      placeholder="বিকল্প ক / Option A (বাংলা)"
                      className="st-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Option A (in English):</label>
                    <input
                      type="text"
                      value={optAEn}
                      onChange={e => setOptAEn(e.target.value)}
                      placeholder="Option A in English"
                      className="st-input text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Option B (বাংলায়):</label>
                    <input
                      type="text"
                      required
                      value={optB}
                      onChange={e => setOptB(e.target.value)}
                      placeholder="বিকল্প খ / Option B (বাংলা)"
                      className="st-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Option B (in English):</label>
                    <input
                      type="text"
                      value={optBEn}
                      onChange={e => setOptBEn(e.target.value)}
                      placeholder="Option B in English"
                      className="st-input text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Option C (বাংলায়):</label>
                    <input
                      type="text"
                      required
                      value={optC}
                      onChange={e => setOptC(e.target.value)}
                      placeholder="বিকল্প গ / Option C (বাংলা)"
                      className="st-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Option C (in English):</label>
                    <input
                      type="text"
                      value={optCEn}
                      onChange={e => setOptCEn(e.target.value)}
                      placeholder="Option C in English"
                      className="st-input text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Option D (বাংলায়):</label>
                    <input
                      type="text"
                      required
                      value={optD}
                      onChange={e => setOptD(e.target.value)}
                      placeholder="বিকল্প ঘ / Option D (বাংলা)"
                      className="st-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Option D (in English):</label>
                    <input
                      type="text"
                      value={optDEn}
                      onChange={e => setOptDEn(e.target.value)}
                      placeholder="Option D in English"
                      className="st-input text-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">সঠিক বিকল্প (Correct Option):</label>
                <select
                  value={corrOpt}
                  onChange={e => setCorrOpt(e.target.value)}
                  className="st-select font-bold"
                >
                  <option value="A">Option A</option>
                  <option value="B">Option B</option>
                  <option value="C">Option C</option>
                  <option value="D">Option D</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">ব্যাখ্যা / Explanation (বাংলা):</label>
                  <textarea
                    rows={2}
                    value={explanation}
                    onChange={e => setExplanation(e.target.value)}
                    placeholder="কেন এই বিকল্পটি সঠিক তা সংক্ষেপে লিখুন..."
                    className="st-textarea text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Explanation (English):</label>
                  <textarea
                    rows={2}
                    value={explanationEn}
                    onChange={e => setExplanationEn(e.target.value)}
                    placeholder="Brief explanation in English..."
                    className="st-textarea text-xs"
                  />
                </div>
              </div>
            </>
          ) : qType.startsWith('SAQ') ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">সঠিক উত্তর (বাংলায় - এক কথায় উত্তর):</label>
                  <input
                    type="text"
                    required
                    value={optA}
                    onChange={e => setOptA(e.target.value)}
                    placeholder="যেমন: সূর্যতাপ বা সৌরশক্তি"
                    className="st-input"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Correct Answer (English):</label>
                  <input
                    type="text"
                    value={optAEn}
                    onChange={e => setOptAEn(e.target.value)}
                    placeholder="e.g. Solar Energy / Insolation"
                    className="st-input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">অতিরিক্ত নোট / ব্যাখ্যা (বাংলা):</label>
                  <textarea
                    rows={2}
                    value={explanation}
                    onChange={e => setExplanation(e.target.value)}
                    placeholder="সংক্ষিপ্ত ব্যাখ্যা (ঐচ্ছিক)..."
                    className="st-textarea text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Additional Note / Explanation (English):</label>
                  <textarea
                    rows={2}
                    value={explanationEn}
                    onChange={e => setExplanationEn(e.target.value)}
                    placeholder="Optional brief explanation in English..."
                    className="st-textarea text-xs"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-blue-950">
                  <span>💡</span>
                  <span>২/৩/৫ নম্বরের বড় প্রশ্ন ও মডেল উত্তর আউটলাইন:</span>
                </div>
                <p>
                  বড় প্রশ্নের সম্পূর্ণ পয়েন্টভিত্তিক হ্যান্ডরিটেন বা প্রিন্টেড অফিশিয়াল উত্তরপত্র ওপরের <strong>"অফিসিয়াল PDF উত্তরপত্র আপলোড"</strong> সেকশনে ফ্রি এবং পেইড ছাত্রছাত্রীদের জন্য PDF হিসেবে আপলোড করতে পারেন। এছাড়া সরাসরি অ্যাপের ভেতরে মডেল উত্তর ও মার্কিং স্কিম দেখতে নিচের বক্সে বাংলা ও ইংরেজিতে লিখে দিতে পারেন।
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Model Answer / উত্তর সংক্ষেপ (বাংলা):</label>
                  <textarea
                    rows={4}
                    value={modelAnswer}
                    onChange={e => setModelAnswer(e.target.value)}
                    placeholder="১) সংজ্ঞা ও বৈশিষ্ট্য, ২) প্রধান কারণসমূহ, ৩) উপযুক্ত উদাহরণ..."
                    className="st-textarea text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Model Answer / Outline (English):</label>
                  <textarea
                    rows={4}
                    value={modelAnswerEn}
                    onChange={e => setModelAnswerEn(e.target.value)}
                    placeholder="1) Definition & characteristics, 2) Key factors, 3) Relevant examples..."
                    className="st-textarea text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Marking Scheme (বাংলা):</label>
                  <input
                    type="text"
                    value={markingScheme}
                    onChange={e => setMarkingScheme(e.target.value)}
                    placeholder="যেমন: সংজ্ঞা: ১ নম্বর, চিত্র: ১ নম্বর, উদাহরণ: ১ নম্বর"
                    className="st-input text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Marking Scheme (English):</label>
                  <input
                    type="text"
                    value={markingSchemeEn}
                    onChange={e => setMarkingSchemeEn(e.target.value)}
                    placeholder="e.g. Definition: 1M, Diagram: 1M, Examples: 1M"
                    className="st-input text-xs"
                  />
                </div>
              </div>
            </>
          )}

          <button type="submit" className="st-btn w-full py-2.5 text-sm font-bold shadow-md">
            💾 স্থায়ীভাবে প্রশ্ন সেভ করুন (Save Question Permanently)
          </button>
        </form>
      )}

      {/* -------------------- SubTab: Duplicate Scanner -------------------- */}
      {subTab === 'dups' && (
        <div className="bg-white p-6 rounded-b-xl border border-t-0 border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800">🔍 Duplicate Question Scanner</h3>
            <button
              onClick={handleScanDuplicates}
              disabled={scanning}
              className="st-btn text-xs py-1.5 px-3 flex items-center gap-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${scanning ? 'animate-spin' : ''}`} />
              Scan Chapter
            </button>
          </div>

          {dupGroups.length === 0 ? (
            <p className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl">
              No duplicate question clusters detected in this chapter. Click Scan Chapter to scan again.
            </p>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-amber-800 font-bold">
                ⚠️ Found {dupGroups.length} duplicate group(s). Select which question to keep in each group:
              </p>
              {dupGroups.map((grp: any[], gi: number) => {
                const keepId = selectedKeeps[gi] || grp[0].id;
                return (
                  <div key={gi} className="p-4 bg-amber-50/50 rounded-xl border border-amber-200 space-y-3">
                    <span className="font-bold text-xs text-amber-900 block">Cluster #{gi + 1}</span>
                    <div className="space-y-2">
                      {grp.map(q => {
                        const isKeep = q.id === keepId;
                        return (
                          <div
                            key={q.id}
                            className={`p-3 rounded-lg border text-xs flex items-center justify-between transition ${
                              isKeep ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold' : 'bg-white border-slate-300 text-slate-700'
                            }`}
                          >
                            <label className="flex items-center gap-2 cursor-pointer flex-1">
                              <input
                                type="radio"
                                name={`grp_${gi}`}
                                checked={isKeep}
                                onChange={() => setSelectedKeeps(prev => ({ ...prev, [gi]: q.id }))}
                              />
                              <span>#{q.id} [{q.marks}M]: {q.question_text}</span>
                            </label>
                            {!isKeep && (
                              <button
                                onClick={() => handleRemoveDuplicate(keepId, q.id)}
                                className="st-btn bg-red-600 hover:bg-red-700 text-[11px] py-1 px-2.5 ml-2"
                              >
                                🗑️ Remove
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* -------------------- SubTab: Browse & Delete -------------------- */}
      {subTab === 'browse' && (
        <div className="bg-white p-6 rounded-b-xl border border-t-0 border-slate-200 shadow-xs space-y-4">
          {managerMessage && (
            <div className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-between ${
              managerMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'
            }`}>
              <span>{managerMessage.text}</span>
              <button onClick={() => setManagerMessage(null)} className="text-slate-400 hover:text-slate-600 font-bold ml-2">✕</button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Question Bank List ({questions.length} questions in this chapter)
              </h3>
              <span className="text-xs text-slate-500">বাংলা ও ইংরেজি উভয় ভাষার প্রশ্ন ও উত্তর একনজরে দেখুন ও প্রয়োজন অনুযায়ী মুছুন</span>
            </div>
          </div>

          {questions.length === 0 ? (
            <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-1">
              <p className="font-bold text-slate-700">এই অধ্যায়ে বর্তমানে কোনো প্রশ্ন নেই।</p>
              <p className="text-xs">
                ওপরের <strong>"➕ Manual Upload"</strong> বা <strong>"⚡ PDF/URL Extractor"</strong> ট্যাব থেকে আপনি আপনার নিজের তৈরি প্রশ্ন ও উত্তর স্থায়ীভাবে আপলোড করুন।
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((q: any) => {
                const isMCQ = (q.q_type || '').includes('MCQ') || (q.marks === 1 && q.options && Object.keys(q.options).length > 0);
                return (
                  <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-200 hover:shadow-xs transition space-y-2.5 text-xs">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            #{q.id}
                          </span>
                          <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                            {q.marks} Marks • {q.q_type || 'Question'}
                          </span>
                        </div>

                        {/* Bengali Question */}
                        <div className="text-slate-900 font-bold text-sm leading-relaxed">
                          <span className="text-emerald-700 mr-1.5 text-xs font-semibold uppercase tracking-wider">[বাংলা]:</span>
                          {q.question_text}
                        </div>

                        {/* English Question if present */}
                        {q.question_text_en && q.question_text_en !== q.question_text && (
                          <div className="text-slate-600 font-medium text-xs leading-relaxed pl-1 border-l-2 border-blue-300">
                            <span className="text-blue-700 mr-1.5 text-xs font-semibold uppercase tracking-wider">[English]:</span>
                            {q.question_text_en}
                          </div>
                        )}
                      </div>

                      {/* Delete Action */}
                      {confirmDeleteId === q.id ? (
                        <div className="flex items-center gap-1.5 bg-red-50 p-1.5 rounded-lg border border-red-200 shrink-0">
                          <span className="text-red-700 font-bold text-[11px]">Delete #{q.id}?</span>
                          <button
                            onClick={() => executeDeleteQuestion(q.id)}
                            disabled={deletingId === q.id}
                            className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-xs transition"
                          >
                            {deletingId === q.id ? 'Deleting...' : 'Yes'}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded text-xs transition"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(q.id)}
                          className="text-red-600 hover:text-red-800 p-1.5 rounded-lg hover:bg-red-50 transition shrink-0 flex items-center gap-1 border border-transparent hover:border-red-200"
                          title="Delete Question"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="text-xs font-semibold">Delete</span>
                        </button>
                      )}
                    </div>

                    {/* MCQ Options Display */}
                    {isMCQ && q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 p-2.5 bg-slate-50 rounded-lg text-xs text-slate-700 border border-slate-100">
                        <div><strong className="text-blue-700">A)</strong> {q.options.A || '-'} {q.options_en?.A && <span className="text-slate-500 text-[11px]">/ {q.options_en.A}</span>}</div>
                        <div><strong className="text-blue-700">B)</strong> {q.options.B || '-'} {q.options_en?.B && <span className="text-slate-500 text-[11px]">/ {q.options_en.B}</span>}</div>
                        <div><strong className="text-blue-700">C)</strong> {q.options.C || '-'} {q.options_en?.C && <span className="text-slate-500 text-[11px]">/ {q.options_en.C}</span>}</div>
                        <div><strong className="text-blue-700">D)</strong> {q.options.D || '-'} {q.options_en?.D && <span className="text-slate-500 text-[11px]">/ {q.options_en.D}</span>}</div>
                      </div>
                    )}

                    {/* Answer or Model Solution note */}
                    <div className="p-2 bg-emerald-50/70 rounded-lg border border-emerald-200 text-xs text-emerald-950 flex flex-col gap-0.5">
                      <span className="font-bold flex items-center gap-1">
                        <span>✅</span>
                        <span>{isMCQ ? `সঠিক বিকল্প: অপশন (${q.correct || 'A'})` : 'সঠিক উত্তর / মডেল উত্তরপত্র:'}</span>
                      </span>
                      <div className="pl-4 font-medium text-emerald-900">
                        {q.answer || q.correct || q.model_answer || 'উত্তর সংযুক্ত'}
                        {q.model_answer_en && (
                          <div className="text-[11px] text-emerald-800 mt-0.5 border-t border-emerald-200 pt-0.5">
                            <span className="font-bold">[English Model]:</span> {q.model_answer_en}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Explanation if available */}
                    {Boolean(q.explanation || q.explanation_en) && (
                      <div className="p-2 bg-amber-50/80 rounded-lg border border-amber-200 text-xs text-amber-950 flex flex-col gap-0.5">
                        <span className="font-bold flex items-center gap-1 text-amber-900">
                          <span>💡</span>
                          <span>ব্যাখ্যা / Explanation:</span>
                        </span>
                        <div className="pl-4 font-medium text-amber-900 leading-relaxed">
                          {q.explanation}
                          {q.explanation_en && (
                            <div className="text-[11px] text-amber-800 mt-0.5 border-t border-amber-200/80 pt-0.5">
                              <span className="font-bold">[English Explanation]:</span> {q.explanation_en}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* -------------------- SubTab: Database Backup & Restore -------------------- */}
      {subTab === 'backup' && (
        <div className="bg-white p-6 rounded-b-xl border border-t-0 border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span>🛡️</span>
                <span>ডেটাবেজ ব্যাকআপ ও ডেটা স্থায়িত্ব সুরক্ষা (Backup & Durability)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                আপনার আপলোড করা প্রতিটি প্রশ্ন, ছাত্রছাত্রীর অ্যাকাউন্ট, ফি পেমেন্ট ডিক্লেয়ারেশন (UTR ও রসিদ) ও PDF উত্তরপত্র ডেটাবেজে স্থায়ীভাবে সংরক্ষিত থাকে।
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                WAL Persistence Active
              </span>
              <span className="bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-full border border-blue-200">
                🔒 Atomic Transactions
              </span>
              <span className="bg-purple-50 text-purple-700 font-bold px-2.5 py-1 rounded-full border border-purple-200">
                ☁️ Google One / Drive Compatible
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Download Backup */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-4">
              <div>
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl mb-3">
                  📥
                </div>
                <h4 className="font-bold text-slate-800 text-base">১-ক্লিক সম্পূর্ণ ডেটাবেজ ডাউনলোড</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  বর্তমান সমস্ত অধ্যায়, বাংলা ও ইংরেজি প্রশ্নাবলি, মডেল উত্তর, সব ছাত্রছাত্রীর প্রোফাইল, সমস্ত ফি পেমেন্ট ও UTR ডিক্লেয়ারেশন এবং আপলোড করা PDF উত্তরপত্র একটি নিরাপদ JSON ফাইলে এক ক্লিকে ডাউনলোড করুন।
                </p>
              </div>
              <button
                type="button"
                onClick={handleDownloadBackup}
                disabled={backupLoading}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {backupLoading ? (
                  <span>ডাউনলোড হচ্ছে...</span>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>সম্পূর্ণ ব্যাকআপ ফাইল ডাউনলোড করুন (.json)</span>
                  </>
                )}
              </button>
            </div>

            {/* Restore Database */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-4">
              <div>
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xl mb-3">
                  📤
                </div>
                <h4 className="font-bold text-slate-800 text-base">ব্যাকআপ ফাইল থেকে ডেটা রিস্টোর</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  আগে ডাউনলোড করা কোনো ব্যাকআপ JSON ফাইল সিলেক্ট করলেই সমস্ত প্রশ্ন, ছাত্র অ্যাকাউন্ট, ফি পেমেন্ট রেকর্ড ও উত্তরপত্র স্বয়ংক্রিয়ভাবে ডেটাবেজে ফেরত আসবে। কোনো কিছু কখনো হারিয়ে যাবে না।
                </p>
              </div>
              <label className="w-full py-2.5 px-4 rounded-xl font-bold text-sm bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-center">
                <Upload className="w-4 h-4" />
                <span>{restoreLoading ? 'রিস্টোর করা হচ্ছে...' : 'ব্যাকআপ JSON ফাইল আপলোড করুন'}</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleRestoreFile}
                  disabled={restoreLoading}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Google One / Google Drive Storage Integration Guide */}
          <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-5 text-xs text-slate-700 leading-relaxed space-y-3">
            <div className="font-bold flex items-center gap-2 text-indigo-950 text-sm">
              <span className="text-lg">☁️</span>
              <span>আপনার 400 GB Google One / Google Drive স্টোরেজ কীভাবে কাজে লাগাবেন:</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-800">
              <div className="bg-white/80 p-3 rounded-lg border border-indigo-100">
                <p className="font-bold text-indigo-900 mb-1">১. সম্পূর্ণ অফসাইট ব্যাকআপ সেভ রাখুন (Weekly Offsite Backup):</p>
                <p className="text-slate-600">
                  উপরের নীল বাটনটি চেপে ব্যাকআপ JSON ফাইলটি ডাউনলোড করুন এবং আপনার Google Drive-এ একটি ফোল্ডার (যেমন: <code>WBBSE_Database_Backups</code>) বানিয়ে সেখানে আপলোড করে রাখুন। এর ফলে আপনার অ্যাপের সমস্ত প্রশ্ন ও পেমেন্ট রেকর্ড চিরকালের জন্য গুগলের ক্লাউড ড্রাইভে সংরক্ষিত থাকবে।
                </p>
              </div>
              <div className="bg-white/80 p-3 rounded-lg border border-indigo-100">
                <p className="font-bold text-indigo-900 mb-1">২. আনলিমিটেড বড় PDF ও নোটস ড্রাইভ লিঙ্ক হিসেবে শেয়ার:</p>
                <p className="text-slate-600">
                  যেহেতু আপনার কাছে ৪০০ জিবি বিশাল ক্লাউড ড্রাইভ স্টোরেজ রয়েছে, আপনি যেকোনো বড় আকারের টেস্ট পেপার, ভিডিও বা হাই-কোয়ালিটি রঙিন স্টাডি ম্যাটেরিয়াল সরাসরি ড্রাইভে রেখে শেয়ার লিঙ্ক তৈরি করে অ্যাপে যুক্ত করতে পারেন।
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 leading-relaxed space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-blue-950">
              <span>💡</span>
              <span>ডেটাবেজ ও ডেটা স্থায়িত্ব সংক্রান্ত গ্যারান্টি:</span>
            </div>
            <p>
              ১. <strong>প্রশ্ন বা পেমেন্ট রেকর্ড কি কখনো উবে যাবে?</strong> না। সার্ভার রিস্টার্ট হলেও <code>geography_exam.db</code> ডিস্কে অক্ষুণ্ণ থাকে। প্রতিটি প্রশ্ন ও পেমেন্ট ট্রানজ্যাকশনে সেভ হয়।
            </p>
            <p>
              ২. <strong>ডোমেন লিঙ্ক বা কোড আপডেট করলে কি অ্যাকাউন্ট বা প্রশ্ন মুছবে?</strong> কখনোই না। ইউজার টেবিল, স্টুডেন্ট রোল, পেমেন্ট ভেরিফিকেশন এবং প্রশ্নাবলি আলাদা স্থায়ী ডেটাবেজে সংরক্ষিত থাকে।
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ADMIN: SEND NOTIFICATIONS
// ============================================================================
function AdminSendNotificationsSection({ allUsers, T }: any) {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('Info');
  const [recentNotifs, setRecentNotifs] = useState<any[]>([]);

  const students = allUsers.filter((u: any) => u.role === 'student' && u.approved === 1);

  const fetchNotifs = async () => {
    const res = await fetch('/api/admin_notifications');
    const data = await res.json();
    setRecentNotifs(data);
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !message.trim()) return;
    try {
      await fetch('/api/admin_notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_username: selectedStudent,
          title: title.trim() || 'Notice',
          message: message.trim(),
          priority,
          created_by: 'Head Admin'
        })
      });
      alert('Notification sent!');
      setTitle('');
      setMessage('');
      fetchNotifs();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleDeleteNotif = async (id: number) => {
    await fetch(`/api/admin_notifications/${id}`, { method: 'DELETE' });
    fetchNotifs();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">{T("📢 Send Notification to a Student", "📢 Send Notification to a Student")}</h2>

      <form onSubmit={handleSend} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Select Student:</label>
          <select
            value={selectedStudent}
            onChange={e => setSelectedStudent(e.target.value)}
            required
            className="st-select"
          >
            <option value="">-- Choose Student --</option>
            {students.map((s: any) => (
              <option key={s.id} value={s.username}>
                {s.full_name} ({s.phone})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Title:</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Madhyamik Practice Schedule Update"
            className="st-input"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Message:</label>
          <textarea
            required
            rows={4}
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Important announcement, exam instructions, feedback..."
            className="st-textarea"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Priority Tag:</label>
          <select
            value={priority}
            onChange={e => setPriority(e.target.value)}
            className="st-select"
          >
            <option value="Info">Info (Blue)</option>
            <option value="Important">Important (Amber)</option>
            <option value="Urgent">Urgent (Red)</option>
          </select>
        </div>

        <button type="submit" className="st-btn w-full py-2.5">
          📤 Send Notification
        </button>
      </form>

      {/* History */}
      <h3 className="text-lg font-bold text-slate-800">Broadcast History</h3>
      <div className="space-y-3">
        {recentNotifs.map((n: any) => (
          <div key={n.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between text-xs">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-slate-900">{n.title}</span>
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">{n.priority}</span>
              </div>
              <p className="text-slate-600 mb-1">{n.message}</p>
              <span className="text-[10px] text-slate-400">To: {n.student_username} | {n.timestamp}</span>
            </div>
            <button
              onClick={() => handleDeleteNotif(n.id)}
              className="text-red-600 hover:text-red-800 p-1.5"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// ADMIN: PROMO CODE REQUESTS
// ============================================================================
function AdminPromoRequestsSection({ promoRequests, fetchPromoRequests, T }: any) {
  const [activeCode, setActiveCode] = useState<string>('');
  const [showCode, setShowCode] = useState<boolean>(false);
  const [newCodeInput, setNewCodeInput] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);

  const fetchActiveCode = async () => {
    try {
      const res = await fetch('/api/admin/promo_code');
      const data = await res.json();
      if (data?.promo_code) {
        setActiveCode(data.promo_code);
        setNewCodeInput(data.promo_code);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchActiveCode();
  }, []);

  const handleUpdateCode = async () => {
    if (!newCodeInput.trim()) {
      alert('Promo code cannot be empty');
      return;
    }
    setUpdating(true);
    try {
      const res = await fetch('/api/admin/promo_code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promo_code: newCodeInput.trim() })
      });
      const data = await res.json();
      if (res.ok) {
        setActiveCode(data.promo_code);
        setIsEditing(false);
        alert('✅ গোপন প্রোমো কোড সফলভাবে আপডেট করা হয়েছে!');
      } else {
        alert(data.error || 'Failed to update promo code');
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleCopy = () => {
    if (activeCode) {
      navigator.clipboard.writeText(activeCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAction = async (id: number, action: 'Approve' | 'Reject') => {
    try {
      await fetch('/api/promo_requests/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action, admin_note: `Handled by Admin` })
      });
      fetchPromoRequests();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{T("🎟️ Promo Code Requests", "🎟️ Promo Code Requests")}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {T("শিক্ষার্থীদের পাঠানো প্রোমো কোড রিকোয়েস্ট যাচাই ও অনুমোদন করুন", "Verify and approve student promo code requests")}
          </p>
        </div>
      </div>

      {/* Admin Secret Promo Code Control Card */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 rounded-2xl shadow-md border border-blue-800">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔒</span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
              {T("অ্যাডমিন গোপন প্রোমো কোড (Admin Confidential Code)", "Admin Confidential Promo Code")}
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {T("১০০% গোপন — শিক্ষার্থীরা দেখতে পাবে না", "100% Hidden From Students")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowCode(!showCode)}
              className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg border border-white/20 transition-colors flex items-center gap-1.5"
            >
              {showCode ? '🔒 Hide' : '👁️ Reveal Code'}
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5"
            >
              {copied ? '✅ Copied!' : '📋 Copy Code'}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-white/20 transition-colors"
            >
              {isEditing ? 'Cancel Edit' : '✏️ Change Code'}
            </button>
          </div>
        </div>

        {/* Code Display */}
        <div className="bg-black/30 p-3 rounded-xl border border-white/10 flex items-center justify-between mt-2">
          <div className="font-mono text-base tracking-wider font-bold text-amber-300">
            {showCode ? (activeCode || 'ShawonSir@2026') : '••••••••••••••••'}
          </div>
          <span className="text-[11px] text-slate-300 italic">
            {T("শুধুমাত্র আপনি দেখতে পাচ্ছেন", "Visible only to Admin")}
          </span>
        </div>

        {/* Edit promo code inline */}
        {isEditing && (
          <div className="mt-3 p-3 bg-white/10 rounded-xl border border-white/20 flex flex-wrap gap-2 items-center">
            <input
              type="text"
              value={newCodeInput}
              onChange={e => setNewCodeInput(e.target.value)}
              placeholder="নতুন প্রোমো কোড লিখুন..."
              className="bg-white text-slate-900 text-xs font-mono font-bold px-3 py-2 rounded-lg flex-1 min-w-[200px]"
            />
            <button
              type="button"
              onClick={handleUpdateCode}
              disabled={updating}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
            >
              {updating ? 'Saving...' : '💾 Save New Code'}
            </button>
          </div>
        )}

        <p className="text-[11px] text-blue-200/90 mt-3 flex items-start gap-1.5">
          <span>💡</span>
          <span>
            {T(
              "এই প্রোমো কোডটি অ্যাপের কোনো ছাত্রছাত্রী ড্যাশবোর্ডে বা প্লেসহোল্ডারে কখনো দেখানো হয় না। আপনি নিজে ব্যক্তিগতভাবে যাকে দেবেন কেবল সেই ছাত্র/ছাত্রী এটি দিয়ে আনলক রিকোয়েস্ট পাঠাতে পারবে। রিকোয়েস্ট আসার পর নিচে 'Approve' বাটনে ক্লিক করলেই তাদের অ্যাকাউন্ট সম্পূর্ণ ফ্রি-তে ফুল এক্সেস আনলক হয়ে যাবে।",
              "This promo code is never shown anywhere to students. Only students you personally provide this code to can submit it. Once approved below, their full access is instantly unlocked."
            )}
          </span>
        </p>
      </div>

      {promoRequests.length === 0 ? (
        <p className="p-6 bg-white rounded-xl text-center text-slate-500 border border-slate-200">No promo requests found.</p>
      ) : (
        <div className="space-y-3">
          {promoRequests.map((p: any) => (
            <div key={p.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900 text-sm block mb-1">
                  #{p.id} — {p.full_name} ({p.username})
                </span>
                <p className="text-slate-600">
                  Phone: {p.phone} | Entered Code: <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">{p.promo_code}</code> | Status: <strong className={p.status === 'Approved' ? 'text-emerald-700' : p.status === 'Rejected' ? 'text-red-700' : 'text-amber-700'}>{p.status}</strong>
                </p>
                <span className="text-[10px] text-slate-400">{p.timestamp}</span>
              </div>
              {p.status === 'Pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(p.id, 'Approve')}
                    className="st-btn bg-emerald-600 hover:bg-emerald-700 text-xs py-1.5 px-3"
                  >
                    ✅ Approve (Grant Bundle)
                  </button>
                  <button
                    onClick={() => handleAction(p.id, 'Reject')}
                    className="st-btn bg-red-600 hover:bg-red-700 text-xs py-1.5 px-3"
                  >
                    ❌ Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ADMIN: USER APPROVALS
// ============================================================================
function AdminUserApprovalsSection({ allUsers, fetchAllUsers, T, user, setAlertMsg }: any) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'student' | 'teacher' | 'pending' | 'coadmin'>('all');
  const [coAdminActions, setCoAdminActions] = useState<any[]>([]);
  const [loadingActions, setLoadingActions] = useState(false);
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);
  const [showResolvedHistory, setShowResolvedHistory] = useState(false);

  const isHeadAdmin = Boolean(user?.phone === '7001257277' || user?.username === 'admin' || user?.is_head_admin);
  const isCoAdmin = !isHeadAdmin && (user?.is_admin === 1 || user?.role === 'admin');

  const fetchCoAdminActions = async () => {
    try {
      setLoadingActions(true);
      const res = await fetch('/api/co_admin_actions');
      const data = await res.json();
      setCoAdminActions(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to fetch co-admin actions:', e);
    } finally {
      setLoadingActions(false);
    }
  };

  useEffect(() => {
    fetchCoAdminActions();
  }, []);

  // Approve User
  const handleApprove = async (targetUser: any) => {
    setSubmittingId(targetUser.id);
    setActionFeedback(null);
    try {
      if (isHeadAdmin) {
        const res = await fetch('/api/users/approve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: targetUser.id })
        });
        const data = await res.json();
        if (res.ok) {
          setActionFeedback({
            type: 'success',
            text: `✅ ${targetUser.full_name}-এর অ্যাকাউন্ট সফলভাবে অনুমোদিত হয়েছে।`
          });
          fetchAllUsers();
        } else {
          setActionFeedback({ type: 'error', text: data.error || 'Failed to approve user' });
        }
      } else {
        const res = await fetch('/api/co_admin_actions/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action_type: 'approve',
            co_admin_username: user?.username || '',
            co_admin_name: user?.full_name || 'Co-Admin',
            co_admin_phone: user?.phone || '',
            target_user_id: targetUser.id,
            target_user_name: targetUser.full_name || '',
            target_user_role: targetUser.role || 'student',
            target_user_phone: targetUser.phone || targetUser.username || ''
          })
        });
        const data = await res.json();
        if (res.ok) {
          setActionFeedback({
            type: 'info',
            text: `⏳ ${targetUser.full_name}-কে অনুমোদনের প্রস্তাবটি প্রধান অ্যাডমিন (শাওন কর) মহাশয়ের পর্যালোচনার জন্য জমা দেওয়া হয়েছে।`
          });
          fetchCoAdminActions();
        } else {
          setActionFeedback({ type: 'error', text: data.error || 'Failed to submit proposal' });
        }
      }
    } catch (e: any) {
      setActionFeedback({ type: 'error', text: e.message || 'Operation failed' });
    } finally {
      setSubmittingId(null);
    }
  };

  // Suspend User
  const handleRevoke = async (targetUser: any) => {
    if (targetUser.phone === '7001257277' || targetUser.username === 'admin') {
      setActionFeedback({ type: 'error', text: 'হেড অ্যাডমিনকে স্থগিত করা সম্ভব নয়।' });
      return;
    }
    setSubmittingId(targetUser.id);
    setActionFeedback(null);
    try {
      if (isHeadAdmin) {
        const res = await fetch('/api/users/revoke', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: targetUser.id })
        });
        const data = await res.json();
        if (res.ok) {
          setActionFeedback({
            type: 'success',
            text: `⏸️ ${targetUser.full_name}-এর অ্যাকাউন্ট সফলভাবে সাময়িক স্থগিত করা হয়েছে।`
          });
          fetchAllUsers();
        } else {
          setActionFeedback({ type: 'error', text: data.error || 'Failed to suspend user' });
        }
      } else {
        const res = await fetch('/api/co_admin_actions/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action_type: 'suspend',
            co_admin_username: user?.username || '',
            co_admin_name: user?.full_name || 'Co-Admin',
            co_admin_phone: user?.phone || '',
            target_user_id: targetUser.id,
            target_user_name: targetUser.full_name || '',
            target_user_role: targetUser.role || 'user',
            target_user_phone: targetUser.phone || targetUser.username || ''
          })
        });
        const data = await res.json();
        if (res.ok) {
          setActionFeedback({
            type: 'info',
            text: `⏳ ${targetUser.full_name}-কে স্থগিতাদেশের প্রস্তাবটি প্রধান অ্যাডমিন (শাওন কর) মহাশয়ের অনুমোদনের জন্য কিউতে পাঠানো হয়েছে।`
          });
          fetchCoAdminActions();
        } else {
          setActionFeedback({ type: 'error', text: data.error || 'Failed to submit proposal' });
        }
      }
    } catch (e: any) {
      setActionFeedback({ type: 'error', text: e.message || 'Operation failed' });
    } finally {
      setSubmittingId(null);
    }
  };

  // Upgrade Teacher to Co-Admin (Head Admin Exclusive)
  const handleUpgradeAdmin = async (targetUser: any) => {
    if (!isHeadAdmin) {
      setActionFeedback({ type: 'error', text: 'শুধুমাত্র প্রধান অ্যাডমিন (শাওন কর) কোনো শিক্ষককে কো-অ্যাডমিন হিসেবে উন্নীত করতে পারেন।' });
      return;
    }
    setSubmittingId(targetUser.id);
    setActionFeedback(null);
    try {
      const res = await fetch('/api/users/upgrade_admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: targetUser.id })
      });
      const data = await res.json();
      if (res.ok) {
        setActionFeedback({
          type: 'success',
          text: `👑 ${targetUser.full_name}-কে সফলভাবে কো-অ্যাডমিন হিসেবে উন্নীত করা হয়েছে!`
        });
        fetchAllUsers();
      } else {
        setActionFeedback({ type: 'error', text: data.error || 'Failed to upgrade user' });
      }
    } catch (e: any) {
      setActionFeedback({ type: 'error', text: e.message || 'Operation failed' });
    } finally {
      setSubmittingId(null);
    }
  };

  // Demote Co-Admin to Teacher (Head Admin Exclusive)
  const handleDowngradeAdmin = async (targetUser: any) => {
    if (!isHeadAdmin) {
      setActionFeedback({ type: 'error', text: 'শুধুমাত্র প্রধান অ্যাডমিন (শাওন কর) কোনো কো-অ্যাডমিনকে ডিমোট করতে পারেন।' });
      return;
    }
    setSubmittingId(targetUser.id);
    setActionFeedback(null);
    try {
      const res = await fetch('/api/users/downgrade_admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: targetUser.id })
      });
      const data = await res.json();
      if (res.ok) {
        setActionFeedback({
          type: 'success',
          text: `⬇️ ${targetUser.full_name}-কে সাধারণ শিক্ষক পদে ফিরিয়ে আনা হয়েছে।`
        });
        fetchAllUsers();
      } else {
        setActionFeedback({ type: 'error', text: data.error || 'Failed to downgrade user' });
      }
    } catch (e: any) {
      setActionFeedback({ type: 'error', text: e.message || 'Operation failed' });
    } finally {
      setSubmittingId(null);
    }
  };

  // Head Admin Resolving Co-Admin Proposal
  const handleResolveProposal = async (proposalId: number, decision: 'approved' | 'rejected') => {
    setActionFeedback(null);
    try {
      const res = await fetch('/api/co_admin_actions/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: proposalId,
          decision,
          reviewer_name: user?.full_name || 'Shawon Kar (Head Admin)'
        })
      });
      const data = await res.json();
      if (res.ok) {
        setActionFeedback({
          type: decision === 'approved' ? 'success' : 'info',
          text: decision === 'approved' ? '✅ কো-অ্যাডমিনের প্রস্তাব অনুমোদিত ও সফলভাবে কার্যকর করা হয়েছে!' : '❌ কো-অ্যাডমিনের প্রস্তাবটি বাতিল করা হয়েছে।'
        });
        fetchAllUsers();
        fetchCoAdminActions();
      } else {
        setActionFeedback({ type: 'error', text: data.error || 'Failed to resolve proposal' });
      }
    } catch (e: any) {
      setActionFeedback({ type: 'error', text: e.message || 'Operation failed' });
    }
  };

  // Download all enrolled student and teacher data as Excel-compatible CSV (with UTF-8 BOM)
  const downloadEnrolledCSV = () => {
    if (!allUsers || allUsers.length === 0) {
      alert('No user data available to download');
      return;
    }

    const headers = [
      'ID',
      'Role',
      'Full Name',
      'Phone / Username',
      'School Name',
      'District',
      'Class / Grade',
      'MP Exam Year',
      'Validity Period',
      'Account Status',
      'Referral Code',
      'Referral Count',
      'Registration Date'
    ];

    const rows = allUsers.map((u: any) => {
      const validity = u.role === 'student'
        ? `31-03-${u.mp_exam_year || 2027}`
        : 'Lifetime (Teacher/Admin)';

      return [
        u.id,
        u.role ? u.role.toUpperCase() : 'STUDENT',
        `"${(u.full_name || '').replace(/"/g, '""')}"`,
        `"${(u.phone || u.username || '').replace(/"/g, '""')}"`,
        `"${(u.school_name || '').replace(/"/g, '""')}"`,
        `"${(u.district || '').replace(/"/g, '""')}"`,
        `"${(u.class_grade || 'Class 10').replace(/"/g, '""')}"`,
        u.mp_exam_year || (u.role === 'student' ? 2027 : 'N/A'),
        `"${validity}"`,
        u.approved === 1 ? 'Approved / Active' : 'Pending Approval',
        u.referral_code || '',
        u.referral_count || 0,
        `"${u.created_at || ''}"`
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `WBBSE_Enrolled_Students_Teachers_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const studentCount = allUsers.filter((u: any) => u.role === 'student').length;
  const teacherCount = allUsers.filter((u: any) => u.role === 'teacher').length;
  const pendingCount = allUsers.filter((u: any) => u.approved === 0).length;
  const coAdminCount = allUsers.filter((u: any) => u.is_admin === 1 && u.phone !== '7001257277' && u.username !== 'admin').length;
  const pendingProposals = coAdminActions.filter((a: any) => a.status === 'pending');

  const filteredUsers = allUsers.filter((u: any) => {
    if (filterRole === 'student' && u.role !== 'student') return false;
    if (filterRole === 'teacher' && u.role !== 'teacher') return false;
    if (filterRole === 'pending' && u.approved !== 0) return false;
    if (filterRole === 'coadmin' && u.is_admin !== 1) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      const name = (u.full_name || '').toLowerCase();
      const school = (u.school_name || '').toLowerCase();
      const phone = (u.phone || u.username || '').toLowerCase();
      const year = String(u.mp_exam_year || '');
      return name.includes(q) || school.includes(q) || phone.includes(q) || year.includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 rounded-2xl text-white shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/30 text-blue-200 border border-blue-400/40">
              {isHeadAdmin ? '👑 Head Admin Control Portal' : '⭐ Co-Admin Assistance Panel'}
            </span>
            {isHeadAdmin ? (
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                শাওন কর (Head Admin)
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-indigo-400/20 text-indigo-200 border border-indigo-400/40">
                সহকারী অ্যাডমিন (Reviewer)
              </span>
            )}
          </div>
          <h2 className="text-xl md:text-2xl font-black">
            {T("🛡️ শিক্ষার্থী ও শিক্ষক অনুমোদন ও অ্যাডমিন কন্ট্রোল", "🛡️ User Approvals & Admin Role Management")}
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            {isHeadAdmin
              ? T(
                  "প্রধান অ্যাডমিন হিসেবে আপনি সরাসরি শিক্ষার্থী ও শিক্ষক অনুমোদন, স্থগিতাদেশ এবং কো-অ্যাডমিন নিয়োগ করতে পারেন। কো-অ্যাডমিনদের প্রস্তাব নিচে রিভিউ করুন।",
                  "As Head Admin, you can approve, suspend, or promote teachers to Co-Admin, and review actions proposed by Co-Admins."
                )
              : T(
                  "কো-অ্যাডমিন হিসেবে আপনি শিক্ষার্থীদের খাতা ও আবেদন পর্যবেক্ষণ করে প্রস্তাব পাঠাতে পারেন। আপনার প্রতিটি প্রস্তাব প্রধান অ্যাডমিন (শাওন কর) অনুমোদন করার পর কার্যকর হবে।",
                  "As Co-Admin, you assist the Head Admin. All your approve/suspend proposals will be submitted for Head Admin review and take effect upon approval."
                )}
          </p>
        </div>

        <button
          type="button"
          onClick={downloadEnrolledCSV}
          className="st-btn bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 shrink-0 self-start md:self-auto cursor-pointer shadow-sm transition"
        >
          <Download className="w-4 h-4" />
          <span>{T("📥 সমস্ত ইউজার ডেটা এক্সেল/CSV ডাউনলোড", "Export Users CSV")}</span>
        </button>
      </div>

      {/* Action Feedback Alert */}
      {actionFeedback && (
        <div
          className={`p-4 rounded-xl text-sm font-semibold flex items-center justify-between shadow-xs transition-all ${
            actionFeedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : actionFeedback.type === 'info'
              ? 'bg-blue-50 text-blue-900 border border-blue-200'
              : 'bg-rose-50 text-rose-900 border border-rose-200'
          }`}
        >
          <span>{actionFeedback.text}</span>
          <button
            type="button"
            onClick={() => setActionFeedback(null)}
            className="text-xs font-bold uppercase underline ml-4 hover:opacity-75"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SECTION 1: HEAD ADMIN REVIEW QUEUE FOR CO-ADMIN ACTIONS              */}
      {/* ==================================================================== */}
      {isHeadAdmin ? (
        <div className="bg-white rounded-2xl border-2 border-amber-300/80 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-xs">
                👑
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <span>{T("কো-অ্যাডমিন অ্যাকশন রিভিউ কিউ (Co-Admin Action Approval Queue)", "Co-Admin Action Approval Queue")}</span>
                  {pendingProposals.length > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-500 text-white animate-pulse">
                      {pendingProposals.length} Pending
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-500">
                  {T(
                    "সহকারী অ্যাডমিনদের দেওয়া সমস্ত অনুমোদন ও স্থগিতাদেশের প্রস্তাব এখানে জমা রয়েছে। আপনি অ্যাপ্রুভ করলেই এটি সাথে সাথে কার্যকর হবে।",
                    "Actions proposed by Co-Admins require your approval before executing on the database."
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowResolvedHistory(!showResolvedHistory)}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
              >
                {showResolvedHistory ? 'হাইড হিস্ট্রি (Hide History)' : 'আগের হিস্ট্রি দেখুন (View History)'}
              </button>
              <button
                type="button"
                onClick={fetchCoAdminActions}
                disabled={loadingActions}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingActions ? 'animate-spin' : ''}`} />
                <span>রিফ্রেশ</span>
              </button>
            </div>
          </div>

          {pendingProposals.length === 0 ? (
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-center text-xs text-emerald-900 font-semibold flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{T("কোনো অপেক্ষমাণ কো-অ্যাডমিন প্রস্তাব নেই। সমস্ত সিস্টেম আপডেট ও সুরক্ষিত রয়েছে।", "No pending co-admin proposals. Everything is up to date.")}</span>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingProposals.map((prop: any) => (
                <div
                  key={prop.id}
                  className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition hover:bg-amber-50"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-indigo-100 text-indigo-900 border border-indigo-200">
                        👨‍🏫 সহকারী অ্যাডমিন: {prop.co_admin_name} ({prop.co_admin_phone || prop.co_admin_username})
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        prop.action_type === 'approve' ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' : 'bg-rose-100 text-rose-900 border border-rose-200'
                      }`}>
                        {prop.action_type === 'approve' ? '✅ অ্যাকাউন্ট অনুমোদন প্রস্তাব' : '⏸️ অ্যাকাউন্ট স্থগিত প্রস্তাব'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {prop.created_at ? new Date(prop.created_at).toLocaleString() : ''}
                      </span>
                    </div>

                    <div className="text-sm font-bold text-slate-900">
                      লক্ষ্য: {prop.target_user_name} (ID #{prop.target_user_id}) • {prop.target_user_phone} • ভূমিকা: {prop.target_user_role?.toUpperCase()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                    <button
                      type="button"
                      onClick={() => handleResolveProposal(prop.id, 'approved')}
                      className="st-btn bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3.5 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
                      title="অনুমোদন করুন এবং সাথে সাথে সিস্টেমে প্রয়োগ করুন"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{T("অনুমোদন ও কার্যকর করুন", "Approve & Execute")}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleResolveProposal(prop.id, 'rejected')}
                      className="st-btn bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2 px-3.5 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
                      title="প্রস্তাবটি বাতিল করুন"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>{T("বাতিল করুন", "Reject")}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Resolved Proposals History */}
          {showResolvedHistory && (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {T("পূর্ববর্তী নিষ্পত্তিকৃত প্রস্তাবের তালিকা (Resolved History):", "Resolved Proposals History:")}
              </h4>
              {coAdminActions.filter((a: any) => a.status !== 'pending').length === 0 ? (
                <p className="text-xs text-slate-400">কোনো পূর্ববর্তী রেকর্ড নেই।</p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {coAdminActions.filter((a: any) => a.status !== 'pending').map((prop: any) => (
                    <div key={prop.id} className="text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div className="space-x-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          prop.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {prop.status.toUpperCase()}
                        </span>
                        <span className="font-semibold text-slate-800">
                          {prop.co_admin_name} proposed {prop.action_type} for {prop.target_user_name}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Reviewed by {prop.reviewed_by} at {prop.reviewed_at ? new Date(prop.reviewed_at).toLocaleDateString() : ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Co-Admin Mode Notice & Proposals Tracker */
        <div className="bg-white rounded-2xl border border-indigo-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
              ⭐
            </div>
            <div>
              <h3 className="font-extrabold text-indigo-950 text-base">
                {T("সহকারী অ্যাডমিন (Co-Admin) মোড", "Co-Admin Assistance Workspace")}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                {T(
                  "আপনি কো-অ্যাডমিন হিসেবে দায়িত্ব পালন করছেন। আপনার করা প্রতিটি অনুমোদন বা স্থগিতাদেশ হেড অ্যাডমিন (শাওন কর) মহাশয়ের প্যানেলে পর্যালোচনার জন্য জমা হয় এবং তিনি অনুমোদন করার পরই তা কার্যকর হয়।",
                  "You are logged in as Co-Admin. Your approval and suspension recommendations are routed to Head Admin (Shawon Kar) for final execution."
                )}
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
              <span>{T("আপনার প্রস্তাবিত অ্যাকশন ট্র্যাকার (Your Submitted Proposals)", "Your Action Proposals Tracker")}</span>
              <button
                type="button"
                onClick={fetchCoAdminActions}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>রিফ্রেশ</span>
              </button>
            </div>
            {coAdminActions.filter((a: any) => a.co_admin_username === user?.username || a.co_admin_phone === user?.phone).length === 0 ? (
              <p className="text-xs text-slate-400">আপনি এখনও কোনো নতুন প্রস্তাব পাঠাননি। নিচে টেবিল থেকে স্টুডেন্টদের অনুমোদন বা সাসপেন্ড করার প্রস্তাব পাঠাতে পারেন।</p>
            ) : (
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {coAdminActions.filter((a: any) => a.co_admin_username === user?.username || a.co_admin_phone === user?.phone).map((prop: any) => (
                  <div key={prop.id} className="text-xs p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-800">{prop.action_type === 'approve' ? '✅ অনুমোদন প্রস্তাব' : '⏸️ স্থগিত প্রস্তাব'}: </span>
                      <span className="text-slate-600">{prop.target_user_name} ({prop.target_user_phone})</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      prop.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : prop.status === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {prop.status === 'approved' ? '✅ হেড অ্যাডমিন দ্বারা অনুমোদিত' : prop.status === 'rejected' ? '❌ বাতিল' : '⏳ হেড অ্যাডমিনের অনুমোদনের অপেক্ষায়'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-blue-600 block">{T("🎒 শিক্ষার্থী (Students)", "Students")}</span>
          <span className="text-xl font-bold text-blue-900">{studentCount}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-purple-600 block">{T("👨‍🏫 শিক্ষক (Teachers)", "Teachers")}</span>
          <span className="text-xl font-bold text-purple-900">{teacherCount}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-indigo-600 block">{T("⭐ কো-অ্যাডমিন (Co-Admins)", "Co-Admins")}</span>
          <span className="text-xl font-bold text-indigo-900">{coAdminCount}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-amber-600 block">{T("⏳ অপেক্ষমাণ অনুমোদন", "Pending Approval")}</span>
          <span className="text-xl font-bold text-amber-900">{pendingCount}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'all', label: `সব (${allUsers.length})` },
            { id: 'student', label: `শিক্ষার্থী (${studentCount})` },
            { id: 'teacher', label: `শিক্ষক (${teacherCount})` },
            { id: 'coadmin', label: `কো-অ্যাডমিন (${coAdminCount})` },
            { id: 'pending', label: `পেন্ডিং (${pendingCount})` }
          ].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilterRole(f.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                filterRole === f.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder={T("নাম, স্কুল, ফোন বা সাল দিয়ে খুঁজুন...", "Search by name, school, phone, or year...")}
          className="st-input text-xs py-1.5 px-3 min-w-[240px]"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b text-slate-600 uppercase font-bold">
                <th className="p-3">ID</th>
                <th className="p-3">Role</th>
                <th className="p-3">Name</th>
                <th className="p-3">Phone / User ID</th>
                <th className="p-3">School & District</th>
                <th className="p-3">MP Exam / Validity</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    কোনো ব্যবহারকারী পাওয়া যায়নি (No users match search/filter)
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u: any) => {
                  const isUserHeadAdmin = u.phone === '7001257277' || u.username === 'admin';
                  const isUserCoAdmin = u.is_admin === 1 && !isUserHeadAdmin;
                  const isBusy = submittingId === u.id;

                  return (
                    <tr key={u.id} className="hover:bg-slate-50 transition">
                      <td className="p-3 font-bold text-slate-500">#{u.id}</td>
                      <td className="p-3">
                        {isUserHeadAdmin ? (
                          <span className="px-2.5 py-1 rounded text-[10px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center gap-1 head-admin-badge-glow">
                            👑 Head Admin
                          </span>
                        ) : isUserCoAdmin ? (
                          <span className="px-2.5 py-1 rounded text-[10px] font-black uppercase bg-indigo-100 text-indigo-900 border border-indigo-300 inline-flex items-center gap-1">
                            ⭐ Co-Admin (Teacher)
                          </span>
                        ) : u.role === 'teacher' ? (
                          <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase bg-purple-100 text-purple-800">
                            👨‍🏫 Teacher
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
                            🎓 Student
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-bold text-slate-900">
                        {u.full_name}
                      </td>
                      <td className="p-3 text-slate-600 font-mono font-medium">{u.phone || u.username}</td>
                      <td className="p-3 text-slate-600">
                        <div className="font-semibold text-slate-800">{u.school_name}</div>
                        <div className="text-[11px] text-slate-400">{u.district || 'West Bengal'}</div>
                      </td>
                      <td className="p-3">
                        {u.role === 'student' ? (
                          <div>
                            <span className="font-bold text-blue-900">MP {u.mp_exam_year || 2027}</span>
                            <div className="text-[10px] text-slate-500">
                              বৈধতা: ৩১ মার্চ {u.mp_exam_year || 2027}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500 font-medium">লাইফটাইম</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.approved === 1 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {u.approved === 1 ? 'Approved / Active' : 'Pending'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {isUserHeadAdmin ? (
                          /* Head Admin is permanent and protected */
                          <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200 inline-flex items-center gap-1">
                            🔒 সুরক্ষিত (Permanent)
                          </span>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            {/* Standard Approval or Suspend */}
                            {u.approved === 0 ? (
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() => handleApprove(u)}
                                className="st-btn bg-emerald-600 hover:bg-emerald-700 text-[11px] py-1 px-3 text-white font-bold cursor-pointer rounded-lg shadow-2xs flex items-center gap-1 transition"
                                title={isHeadAdmin ? "অ্যাকাউন্ট অনুমোদন করুন" : "হেড অ্যাডমিনের কাছে অনুমোদনের প্রস্তাব পাঠান"}
                              >
                                {isBusy ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                                <span>{isHeadAdmin ? '✅ Approve' : '📝 Propose Approve'}</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() => handleRevoke(u)}
                                className="st-btn bg-slate-600 hover:bg-slate-700 text-[11px] py-1 px-3 text-white font-bold cursor-pointer rounded-lg shadow-2xs flex items-center gap-1 transition"
                                title={isHeadAdmin ? "অনুমোদন সাময়িক স্থগিত করুন" : "হেড অ্যাডমিনের কাছে স্থগিতাদেশের প্রস্তাব পাঠান"}
                              >
                                {isBusy ? <RefreshCw className="w-3 h-3 animate-spin" /> : <span>⏸️</span>}
                                <span>{isHeadAdmin ? 'Suspend' : 'Propose Suspend'}</span>
                              </button>
                            )}

                            {/* Promotion / Demotion for Teachers (Only Head Admin can execute) */}
                            {isHeadAdmin && (u.role === 'teacher' || u.is_admin === 1) && (
                              u.is_admin === 1 ? (
                                <button
                                  type="button"
                                  disabled={isBusy}
                                  onClick={() => handleDowngradeAdmin(u)}
                                  className="st-btn bg-amber-600 hover:bg-amber-700 text-[11px] py-1 px-3 text-white font-bold cursor-pointer rounded-lg shadow-2xs flex items-center gap-1 transition"
                                  title="কো-অ্যাডমিন থেকে সাধারণ শিক্ষক পদে ফিরিয়ে দিন"
                                >
                                  {isBusy ? <RefreshCw className="w-3 h-3 animate-spin" /> : <span>⬇️</span>}
                                  <span>Demote to Teacher</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  disabled={isBusy}
                                  onClick={() => handleUpgradeAdmin(u)}
                                  className="st-btn bg-indigo-600 hover:bg-indigo-700 text-[11px] py-1 px-3 text-white font-bold cursor-pointer rounded-lg shadow-2xs flex items-center gap-1 transition"
                                  title="এই শিক্ষককে কো-অ্যাডমিন হিসেবে দায়িত্ব দিন"
                                >
                                  {isBusy ? <RefreshCw className="w-3 h-3 animate-spin" /> : <span>👑</span>}
                                  <span>Upgrade to Co-Admin</span>
                                </button>
                              )
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ADMIN: DOUBT ASSIGNMENT HUB
// ============================================================================
function AdminDoubtAssignmentHub({ allDoubts, allUsers, fetchAllDoubts, T, getQText }: any) {
  const [assignTeachers, setAssignTeachers] = useState<Record<number, string>>({});
  const [directSolutions, setDirectSolutions] = useState<Record<number, string>>({});

  const teachers = allUsers.filter((u: any) => u.role === 'teacher' && u.approved === 1);

  const handleAssign = async (id: number) => {
    const tUser = assignTeachers[id];
    if (!tUser) return;
    await fetch('/api/student_doubts/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, teacher_username: tUser })
    });
    alert('Assigned to teacher!');
    fetchAllDoubts();
  };

  const handleApprove = async (id: number, solution: string) => {
    await fetch('/api/student_doubts/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, solution })
    });
    alert('Solution approved & unlocked for student!');
    fetchAllDoubts();
  };

  const handleSendBack = async (id: number) => {
    await fetch('/api/student_doubts/send_back', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    alert('Sent back to teacher for revisions.');
    fetchAllDoubts();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">{T("❓ Student Doubt Assignment Hub", "❓ Student Doubt Assignment Hub")}</h2>
      {allDoubts.length === 0 ? (
        <p className="p-6 bg-white rounded-xl text-center text-slate-500 border border-slate-200">No student doubts logged.</p>
      ) : (
        <div className="space-y-4">
          {allDoubts.map((d: any) => (
            <div key={d.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">
                  #{d.id} [{d.marks}M] — {d.student_name}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border">
                  {d.status}
                </span>
              </div>
              <p className="font-bold text-slate-900 text-sm">
                Q: {getQText(d.question_text, d.question_text_en)}
              </p>

              {d.status === 'Teacher Submitted (Pending Admin Approval)' ? (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-3">
                  <span className="font-bold text-xs text-amber-900 block">Teacher's Proposed Solution:</span>
                  <textarea
                    rows={3}
                    value={directSolutions[d.id] ?? (d.teacher_answer || '')}
                    onChange={e => setDirectSolutions(prev => ({ ...prev, [d.id]: e.target.value }))}
                    className="st-textarea text-xs"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(d.id, directSolutions[d.id] ?? d.teacher_answer)}
                      className="st-btn bg-emerald-600 hover:bg-emerald-700 text-xs py-1.5 px-3"
                    >
                      ✅ Approve & Unlock
                    </button>
                    <button
                      onClick={() => handleSendBack(d.id)}
                      className="st-btn bg-red-600 hover:bg-red-700 text-xs py-1.5 px-3"
                    >
                      🔄 Send Back to Teacher
                    </button>
                  </div>
                </div>
              ) : d.status === 'Pending Admin Assignment' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">Assign to Teacher:</label>
                    <select
                      value={assignTeachers[d.id] || ''}
                      onChange={e => setAssignTeachers(prev => ({ ...prev, [d.id]: e.target.value }))}
                      className="st-select"
                    >
                      <option value="">-- Choose Teacher --</option>
                      {teachers.map((t: any) => (
                        <option key={t.id} value={t.username}>
                          {t.full_name} ({t.phone})
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleAssign(d.id)}
                      className="st-btn text-xs py-1.5 px-3"
                    >
                      Assign
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">Or Solve Directly:</label>
                    <input
                      type="text"
                      value={directSolutions[d.id] || ''}
                      onChange={e => setDirectSolutions(prev => ({ ...prev, [d.id]: e.target.value }))}
                      placeholder="Enter direct answer..."
                      className="st-input"
                    />
                    <button
                      onClick={() => handleApprove(d.id, directSolutions[d.id] || 'Solved')}
                      className="st-btn bg-emerald-600 hover:bg-emerald-700 text-xs py-1.5 px-3"
                    >
                      Solve & Approve
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500">Assigned to: {d.assigned_teacher_username || 'Admin'}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ADMIN: UPLOAD MOCK TESTS
// ============================================================================
function AdminUploadMockTestsSection({ mockTests, fetchMockTests, T }: any) {
  const [testType, setTestType] = useState('Chapter Wise Mock Test');
  const [price, setPrice] = useState(29);
  const [fileName, setFileName] = useState('');
  const [fileData, setFileData] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => setFileData(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/mock_tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          test_type: testType,
          file_name: fileName,
          file_data: fileData,
          uploader: 'Shawon Kar (Head Admin)',
          price
        })
      });
      const data = await res.json();
      alert(`🎉 Published successfully as: ${data.code_num}!`);
      setFileName('');
      setFileData('');
      fetchMockTests();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMock = async (id: number, codeNum: string) => {
    if (!window.confirm(`Are you sure you want to delete mock test ${codeNum}?`)) return;
    setDeletingId(id);
    try {
      await fetch(`/api/mock_tests/${id}`, { method: 'DELETE' });
      alert(`Deleted ${codeNum}`);
      fetchMockTests();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">{T("📄 Upload Mock Tests & Suggestions", "📄 Upload Mock Tests & Suggestions")}</h2>

      <form onSubmit={handlePublish} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Type:</label>
          <select
            value={testType}
            onChange={e => {
              setTestType(e.target.value);
              setPrice(e.target.value === 'Chapter Wise Mock Test' ? 29 : (e.target.value === 'Final Mock Test' ? 49 : 69));
            }}
            className="st-select"
          >
            <option value="Chapter Wise Mock Test">Chapter Wise Mock Test (Default ₹29) — Auto: chapter mock - 001...</option>
            <option value="Final Mock Test">Final Mock Test (Default ₹49) — Auto: final mock - 001...</option>
            <option value="Board Suggestions">Board Suggestions (Default ₹69) — Auto: suggestion - 001...</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Price (₹):</label>
          <input
            type="number"
            value={price}
            onChange={e => setPrice(Number(e.target.value))}
            className="st-input"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Upload File (PDF/DOCX/TXT):</label>
          <input
            type="file"
            required
            accept=".pdf,.docx,.txt"
            onChange={handleFileUpload}
            className="st-input"
          />
          {fileName && <p className="text-xs text-slate-500 mt-1">Selected: {fileName}</p>}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="st-btn w-full py-2.5 font-bold"
        >
          {submitting ? 'Publishing...' : '🚀 Publish Mock Test'}
        </button>
      </form>

      {/* Published Mock Tests Manager */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">
            📚 {T("বর্তমানে সক্রিয় Mock Tests ও Suggestions", "Currently Published Mock Tests & Suggestions")} ({mockTests?.length || 0})
          </h3>
          <span className="text-xs text-slate-500">Auto-numbered sequentially (001, 002...)</span>
        </div>

        {!mockTests || mockTests.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-2 text-center">
            বর্তমানে কোনো মক টেস্ট নেই। ওপরের ফর্ম দিয়ে আপলোড করলে স্বয়ংক্রিয়ভাবে ০১, ০২ নম্বর কোড পাবে।
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {mockTests.map((m: any) => (
              <div key={m.id} className="py-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 text-sm">{m.code_num}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                      {m.test_type}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      ₹{m.price}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    File: {m.file_name} | By: {m.uploader} | Date: {m.timestamp}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={deletingId === m.id}
                  onClick={() => handleDeleteMock(m.id, m.code_num)}
                  className="px-3 py-1.5 text-xs font-bold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 flex items-center gap-1 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" /> {deletingId === m.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// ADMIN: TEACHER SUBMISSIONS REVIEW
// ============================================================================
function AdminTeacherSubmissionsReview({ teacherSubmissions, fetchTeacherSubmissions, fetchMockTests, downloadTextFile, T }: any) {
  const [adminNotes, setAdminNotes] = useState<Record<number, string>>({});
  const [prices, setPrices] = useState<Record<number, number>>({});

  const handleAction = async (id: number, action: 'Publish' | 'Reject') => {
    try {
      await fetch('/api/teacher_submissions/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          action,
          admin_note: adminNotes[id] || '',
          price: prices[id] || 29
        })
      });
      alert(`Submission ${action}ed!`);
      fetchTeacherSubmissions();
      fetchMockTests();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">{T("📤 Teacher Submissions Review", "📤 Teacher Submissions Review")}</h2>
      {teacherSubmissions.length === 0 ? (
        <p className="p-6 bg-white rounded-xl text-center text-slate-500 border border-slate-200">No teacher submissions to review.</p>
      ) : (
        <div className="space-y-4">
          {teacherSubmissions.map((s: any) => (
            <div key={s.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-base">
                  #{s.id} — {s.teacher_name} ({s.sub_type})
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  s.status === 'Published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {s.status}
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-800">{s.title}</h4>
              <p className="text-xs text-slate-600 whitespace-pre-wrap">{s.description}</p>

              {s.file_data && (
                <button
                  onClick={() => downloadTextFile(s.file_name, s.file_data)}
                  className="st-btn bg-blue-600 hover:bg-blue-700 text-xs py-1.5 px-3 flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> 📥 Download Submission File
                </button>
              )}

              {s.status === 'Pending Admin Review' && (
                <div className="pt-3 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Set Final Price (₹):</label>
                    <input
                      type="number"
                      value={prices[s.id] ?? 29}
                      onChange={e => setPrices(prev => ({ ...prev, [s.id]: Number(e.target.value) }))}
                      className="st-input"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Admin Feedback Note:</label>
                    <input
                      type="text"
                      value={adminNotes[s.id] || ''}
                      onChange={e => setAdminNotes(prev => ({ ...prev, [s.id]: e.target.value }))}
                      placeholder="Optional remarks..."
                      className="st-input"
                    />
                  </div>
                  <div className="md:col-span-2 flex gap-2">
                    <button
                      onClick={() => handleAction(s.id, 'Publish')}
                      className="st-btn bg-emerald-600 hover:bg-emerald-700 text-xs py-2 px-4"
                    >
                      ✅ Publish to Portal
                    </button>
                    <button
                      onClick={() => handleAction(s.id, 'Reject')}
                      className="st-btn bg-red-600 hover:bg-red-700 text-xs py-2 px-4"
                    >
                      ❌ Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ADMIN: ASK CORNER REVIEW
// ============================================================================
function AdminAskCornerReview({ askCornerList, fetchAskCorner, T }: any) {
  const [replies, setReplies] = useState<Record<number, string>>({});

  const handleReply = async (id: number) => {
    const rep = replies[id];
    if (!rep) return;
    await fetch('/api/ask_corner/reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, admin_reply: rep })
    });
    alert('Reply sent!');
    fetchAskCorner();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/ask_corner/${id}`, { method: 'DELETE' });
    fetchAskCorner();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">{T("💡 Ask Corner Suggestions Review", "💡 Ask Corner Suggestions Review")}</h2>
      {askCornerList.length === 0 ? (
        <p className="p-6 bg-white rounded-xl text-center text-slate-500 border border-slate-200">No messages in Ask Corner.</p>
      ) : (
        <div className="space-y-4">
          {askCornerList.map((a: any) => (
            <div key={a.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">
                  #{a.id} — {a.category} from {a.submitter_name} ({a.submitter_role})
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  a.status === 'Replied' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {a.status}
                </span>
              </div>
              <p className="text-xs text-slate-700">{a.message}</p>
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={replies[a.id] ?? (a.admin_reply || '')}
                  onChange={e => setReplies(prev => ({ ...prev, [a.id]: e.target.value }))}
                  placeholder="Enter admin response..."
                  className="st-input flex-1"
                />
                <button
                  onClick={() => handleReply(a.id)}
                  className="st-btn text-xs py-1.5 px-3"
                >
                  Send Reply
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="text-red-600 hover:text-red-800 p-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ADMIN: PAYMENT VERIFICATIONS
// ============================================================================
function AdminPaymentVerificationsSection({ paymentsList, fetchPayments, T }: any) {
  const [adminNotes, setAdminNotes] = useState<Record<number, string>>({});
  const [viewingScreenshot, setViewingScreenshot] = useState<any>(null);

  const handleAction = async (id: number, action: 'Approve' | 'Reject') => {
    try {
      await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          action,
          admin_note: adminNotes[id] || ''
        })
      });
      alert(`Payment ${action}d!`);
      fetchPayments();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">{T("💳 Payment Verifications Dashboard", "💳 Payment Verifications Dashboard")}</h2>
      {paymentsList.length === 0 ? (
        <p className="p-6 bg-white rounded-xl text-center text-slate-500 border border-slate-200">No payment records found.</p>
      ) : (
        <div className="space-y-3">
          {paymentsList.map((p: any) => {
            const isPending = p.status === 'Pending Verification';
            return (
              <div key={p.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">
                    #{p.id} — {p.user_name} ({p.user_role}) — ₹{p.amount}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    p.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : (isPending ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800')
                  }`}>
                    {p.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Item: <strong>{p.item_type}</strong> | Phone: {p.phone} | UPI Ref: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">{p.upi_ref}</code>
                </p>
                <p className="text-[10px] text-slate-400">{p.timestamp}</p>

                {/* Screenshot view if attached */}
                {p.screenshot_file_data && (
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setViewingScreenshot({
                        name: p.screenshot_file_name || 'payment_receipt',
                        data: p.screenshot_file_data,
                        userName: p.user_name,
                        amount: p.amount,
                        upiRef: p.upi_ref
                      })}
                      className="st-btn bg-indigo-600 hover:bg-indigo-700 text-xs py-1 px-3 flex items-center gap-1.5 text-white rounded-lg font-bold shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5" /> 🖼️ View Payment Screenshot
                    </button>
                    <span className="text-[11px] text-slate-500 font-mono">
                      📎 {p.screenshot_file_name || 'screenshot'}
                    </span>
                  </div>
                )}

                {isPending && (
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <input
                      type="text"
                      value={adminNotes[p.id] || ''}
                      onChange={e => setAdminNotes(prev => ({ ...prev, [p.id]: e.target.value }))}
                      placeholder="Admin verification note..."
                      className="st-input flex-1"
                    />
                    <button
                      onClick={() => handleAction(p.id, 'Approve')}
                      className="st-btn bg-emerald-600 hover:bg-emerald-700 text-xs py-1.5 px-3"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => handleAction(p.id, 'Reject')}
                      className="st-btn bg-red-600 hover:bg-red-700 text-xs py-1.5 px-3"
                    >
                      ❌ Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Screenshot inspection modal */}
      {viewingScreenshot && (
        <div className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  🧾 Payment Verification Screenshot
                </h3>
                <p className="text-xs text-slate-500">
                  {viewingScreenshot.userName} — ₹{viewingScreenshot.amount} | Ref: {viewingScreenshot.upiRef}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewingScreenshot(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-center mb-4">
              {viewingScreenshot.data.startsWith('data:image') ? (
                <img
                  src={viewingScreenshot.data}
                  alt="Receipt"
                  className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-sm"
                />
              ) : (
                <div className="p-8 text-center text-slate-600">
                  <p className="font-bold mb-2">📄 File: {viewingScreenshot.name}</p>
                  <a
                    href={viewingScreenshot.data}
                    download={viewingScreenshot.name}
                    className="st-btn inline-flex items-center gap-1 text-xs py-2 px-4"
                  >
                    <Download className="w-4 h-4" /> Download Receipt File
                  </a>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <a
                href={viewingScreenshot.data}
                download={viewingScreenshot.name}
                className="st-btn bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs py-1.5 px-3 flex items-center gap-1 border border-slate-300"
              >
                <Download className="w-3.5 h-3.5" /> Download Screenshot
              </a>
              <button
                type="button"
                onClick={() => setViewingScreenshot(null)}
                className="st-btn bg-slate-800 hover:bg-slate-900 text-white text-xs py-1.5 px-4"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ADMIN: EXAM ANSWER SHEET CHECKING
// ============================================================================
function AdminExamCheckingSection({ examSubmissions, allUsers, fetchExamSubmissions, downloadTextFile, T }: any) {
  const [selectedTeachers, setSelectedTeachers] = useState<Record<number, string>>({});
  const [adminNotes, setAdminNotes] = useState<Record<number, string>>({});

  const teachers = allUsers.filter((u: any) => u.role === 'teacher' && u.approved === 1);

  const handleAssign = async (id: number) => {
    const t = selectedTeachers[id];
    if (!t) return;
    await fetch('/api/exam_submissions/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, teacher_username: t })
    });
    alert('Assigned to teacher!');
    fetchExamSubmissions();
  };

  const handleReturnToStudent = async (id: number, sub: any) => {
    await fetch('/api/exam_submissions/return', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        corrected_file_name: sub.teacher_corrected_file_name || sub.answer_file_name,
        corrected_file_data: sub.teacher_corrected_file_data || sub.answer_file_data,
        admin_note: adminNotes[id] || sub.teacher_note || 'Approved by Admin'
      })
    });
    alert('Corrected copy returned to student!');
    fetchExamSubmissions();
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/exam_submissions/${id}`, { method: 'DELETE' });
      setConfirmDeleteId(null);
      fetchExamSubmissions();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">{T("📝 Exam Answer Sheet Checking Hub", "📝 Exam Answer Sheet Checking Hub")}</h2>
      {examSubmissions.length === 0 ? (
        <p className="p-6 bg-white rounded-xl text-center text-slate-500 border border-slate-200">No exam submissions found.</p>
      ) : (
        <div className="space-y-4">
          {examSubmissions.map((s: any) => (
            <div key={s.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">
                  #{s.id} — {s.student_name} ({s.exam_code})
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border">
                  {s.status}
                </span>
              </div>
              <p className="text-xs text-slate-600">Submitted: {s.submitted_at} | File: {s.answer_file_name}</p>

              <div className="flex gap-2">
                {s.answer_file_data && (
                  <button
                    onClick={() => downloadTextFile(s.answer_file_name, s.answer_file_data)}
                    className="st-btn bg-blue-600 hover:bg-blue-700 text-xs py-1 px-3 flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> 📥 Student Copy
                  </button>
                )}
                {s.teacher_corrected_file_data && (
                  <button
                    onClick={() => downloadTextFile(s.teacher_corrected_file_name, s.teacher_corrected_file_data)}
                    className="st-btn bg-purple-600 hover:bg-purple-700 text-xs py-1 px-3 flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> 📥 Teacher Corrected Copy
                  </button>
                )}
              </div>

              {s.status === 'Submitted' && (
                <div className="pt-2 border-t border-slate-100 flex gap-2">
                  <select
                    value={selectedTeachers[s.id] || ''}
                    onChange={e => setSelectedTeachers(prev => ({ ...prev, [s.id]: e.target.value }))}
                    className="st-select flex-1"
                  >
                    <option value="">-- Assign to Teacher --</option>
                    {teachers.map((t: any) => (
                      <option key={t.id} value={t.username}>
                        {t.full_name} ({t.phone})
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleAssign(s.id)}
                    className="st-btn text-xs shrink-0"
                  >
                    Assign
                  </button>
                </div>
              )}

              {s.status === 'Teacher Submitted for Admin Review' && (
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <p className="text-xs text-slate-700"><strong>Teacher Note:</strong> {s.teacher_note}</p>
                  <input
                    type="text"
                    value={adminNotes[s.id] || ''}
                    onChange={e => setAdminNotes(prev => ({ ...prev, [s.id]: e.target.value }))}
                    placeholder="Final Admin Note for Student..."
                    className="st-input"
                  />
                  <button
                    onClick={() => handleReturnToStudent(s.id, s)}
                    className="st-btn bg-emerald-600 hover:bg-emerald-700 text-xs py-2 px-4"
                  >
                    ✅ Return Checked Copy to Student
                  </button>
                </div>
              )}

              <div className="text-right">
                {confirmDeleteId === s.id ? (
                  <div className="inline-flex items-center gap-2 bg-red-50 p-1.5 rounded-lg border border-red-200">
                    <span className="text-xs text-red-700 font-bold">Delete submission #{s.id}?</span>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-xs"
                    >
                      Yes, Delete
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(s.id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Delete Submission
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// TRACK RECORDS / ANALYTICS
// ============================================================================
function TrackRecordsSection({ studentScores, fetchStudentScores, T }: any) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">{T("📊 Analytics & Student Track Records", "📊 Analytics & Student Track Records")}</h2>
        <button
          onClick={fetchStudentScores}
          className="st-btn text-xs py-1.5 px-3 flex items-center gap-1"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b text-slate-600 uppercase font-bold">
              <th className="p-3">Student Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">School</th>
              <th className="p-3">District</th>
              <th className="p-3">Exam / Topic</th>
              <th className="p-3">Score</th>
              <th className="p-3">Percentage</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {studentScores.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-slate-500">
                  No scores recorded yet. Scores are logged as students complete mock examinations.
                </td>
              </tr>
            ) : (
              studentScores.map((sc: any, i: number) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">{sc.student_name}</td>
                  <td className="p-3 font-mono text-slate-600">{sc.student_phone}</td>
                  <td className="p-3 text-slate-600">{sc.school_name}</td>
                  <td className="p-3 text-slate-600">{sc.district}</td>
                  <td className="p-3 text-blue-700 font-semibold">{sc.exam_name || sc.topic_name}</td>
                  <td className="p-3 font-bold text-slate-800">{sc.score} / {sc.total_questions}</td>
                  <td className="p-3 font-bold text-emerald-700">{sc.percentage}%</td>
                  <td className="p-3 text-slate-400">{sc.timestamp}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
