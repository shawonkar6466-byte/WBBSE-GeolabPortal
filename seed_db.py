import sqlite3
import unicodedata
import re

DB_NAME = "geography_exam.db"

BN_EN_DICT = {
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
    "মেরু": "Pole", "উত্তর": "North", "দক্ষিণ": "South", "পূর্ব": "East", "পশ্চিম": "West"
}

def translate_geo_simple(bn_text):
    if not bn_text:
        return ""
    result = bn_text
    sorted_keys = sorted(BN_EN_DICT.keys(), key=len, reverse=True)
    for bn in sorted_keys:
        if bn in result:
            result = result.replace(bn, " " + BN_EN_DICT[bn] + " ")
    return re.sub(r'\s+', ' ', result).strip()

def safe_add_column(cursor, table_name, column_name, column_def):
    try:
        cursor.execute(f"PRAGMA table_info({table_name})")
        cols = [row[1] for row in cursor.fetchall()]
        if column_name not in cols:
            cursor.execute(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {column_def}")
    except Exception:
        pass

def init_and_seed():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""CREATE TABLE IF NOT EXISTS exams (
        id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, description TEXT)""")
    cursor.execute("""CREATE TABLE IF NOT EXISTS topics (
        id INTEGER PRIMARY KEY AUTOINCREMENT, exam_id INTEGER, name TEXT,
        FOREIGN KEY(exam_id) REFERENCES exams(id))""")
    cursor.execute("""CREATE TABLE IF NOT EXISTS questions (
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
        FOREIGN KEY(topic_id) REFERENCES topics(id))""")
    cursor.execute("""CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE,
        password TEXT, role TEXT DEFAULT 'student', full_name TEXT,
        school_name TEXT, class_grade TEXT, phone TEXT, district TEXT,
        approved INTEGER DEFAULT 0, is_admin INTEGER DEFAULT 0,
        referral_code TEXT DEFAULT '', referral_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP)""")
    cursor.execute("""CREATE TABLE IF NOT EXISTS student_scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT, student_name TEXT,
        student_phone TEXT, school_name TEXT, district TEXT, exam_name TEXT,
        topic_name TEXT, score INTEGER, total_questions INTEGER,
        percentage REAL, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)""")
    cursor.execute("""CREATE TABLE IF NOT EXISTS student_doubts (
        id INTEGER PRIMARY KEY AUTOINCREMENT, student_username TEXT,
        student_name TEXT, question_id INTEGER,
        assigned_teacher_username TEXT DEFAULT '',
        teacher_answer TEXT DEFAULT '', status TEXT DEFAULT 'Pending',
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)""")
    cursor.execute("""CREATE TABLE IF NOT EXISTS mock_tests (
        id INTEGER PRIMARY KEY AUTOINCREMENT, test_type TEXT, code_num TEXT,
        file_name TEXT, file_data BLOB, uploader TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)""")
    cursor.execute("""CREATE TABLE IF NOT EXISTS system_settings (
        key TEXT PRIMARY KEY, value TEXT)""")
    cursor.execute("""CREATE TABLE IF NOT EXISTS duplicate_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT, original_q_id INTEGER,
        duplicate_q_id INTEGER, similarity REAL, removed_by TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)""")
    cursor.execute("""CREATE TABLE IF NOT EXISTS ask_corner (
        id INTEGER PRIMARY KEY AUTOINCREMENT, submitter_username TEXT,
        submitter_name TEXT, submitter_role TEXT, category TEXT,
        message TEXT, admin_reply TEXT DEFAULT '',
        status TEXT DEFAULT 'New',
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)""")
    cursor.execute("""CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, user_name TEXT,
        user_role TEXT, phone TEXT, item_type TEXT, item_id TEXT,
        amount INTEGER, upi_ref TEXT,
        status TEXT DEFAULT 'Pending Verification',
        admin_note TEXT DEFAULT '',
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        approved_at DATETIME)""")
    cursor.execute("""CREATE TABLE IF NOT EXISTS user_purchases (
        id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, item_type TEXT,
        item_id TEXT, payment_id INTEGER, status TEXT DEFAULT 'Active',
        activated_at DATETIME DEFAULT CURRENT_TIMESTAMP)""")
    cursor.execute("""CREATE TABLE IF NOT EXISTS exam_submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT, student_username TEXT,
        student_name TEXT, exam_type TEXT, exam_code TEXT,
        answer_file_name TEXT, answer_file_data BLOB,
        submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        checker_username TEXT DEFAULT '', status TEXT DEFAULT 'Submitted',
        corrected_file_name TEXT DEFAULT '', corrected_file_data BLOB,
        corrected_at DATETIME, admin_note TEXT DEFAULT '')""")
    cursor.execute("""CREATE TABLE IF NOT EXISTS teacher_submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT, teacher_username TEXT,
        teacher_name TEXT, sub_type TEXT, title TEXT, description TEXT,
        file_name TEXT, file_data BLOB,
        status TEXT DEFAULT 'Pending Admin Review',
        admin_note TEXT DEFAULT '',
        published_mock_id INTEGER DEFAULT 0,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)""")
    cursor.execute("""CREATE TABLE IF NOT EXISTS admin_notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT, student_username TEXT,
        title TEXT, message TEXT, priority TEXT DEFAULT 'Info',
        is_read INTEGER DEFAULT 0, created_by TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)""")
    cursor.execute("""CREATE TABLE IF NOT EXISTS promo_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, full_name TEXT,
        phone TEXT, promo_code TEXT, status TEXT DEFAULT 'Pending',
        admin_note TEXT DEFAULT '',
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, approved_at DATETIME)""")

    safe_add_column(cursor, 'mock_tests', 'price', 'INTEGER DEFAULT 0')
    safe_add_column(cursor, 'mock_tests', 'is_published', 'INTEGER DEFAULT 1')
    safe_add_column(cursor, 'questions', 'q_type', "TEXT DEFAULT 'MCQ'")
    safe_add_column(cursor, 'exam_submissions', 'teacher_corrected_file_name', 'TEXT DEFAULT ""')
    safe_add_column(cursor, 'exam_submissions', 'teacher_corrected_file_data', 'BLOB')
    safe_add_column(cursor, 'exam_submissions', 'teacher_note', 'TEXT DEFAULT ""')
    safe_add_column(cursor, 'exam_submissions', 'teacher_submitted_at', 'DATETIME')

    cursor.execute("INSERT OR IGNORE INTO system_settings (key, value) VALUES ('portal_url', 'https://geography-exam-app.streamlit.app')")
    cursor.execute("INSERT OR IGNORE INTO system_settings (key, value) VALUES ('upi_id', 'shawonkar6466-1@oksbi')")
    cursor.execute("INSERT OR IGNORE INTO system_settings (key, value) VALUES ('full_access_price', '399')")
    cursor.execute("UPDATE system_settings SET value = '399' WHERE key = 'full_access_price' AND value = '100'")
    cursor.execute("INSERT OR IGNORE INTO system_settings (key, value) VALUES ('bundle_price', '499')")
    cursor.execute("INSERT OR IGNORE INTO system_settings (key, value) VALUES ('promo_code', 'ShawonSir@2026')")

    cursor.execute("INSERT OR IGNORE INTO exams (id, name, description) VALUES (1, 'Madhyamik Class 10', 'WBBSE Class 10 Geography')")
    
    default_topics = [
        "১. বহির্জাত প্রক্রিয়া ও তাদের দ্বারা সৃষ্ট ভূমিরূপ / Exogenic Processes and Created Landforms",
        "২. বায়ুমণ্ডল / Atmosphere",
        "৩. বারিমণ্ডল / Hydrosphere",
        "৪. বর্জ্য ব্যবস্থাপনা / Waste Management",
        "৫. ভারত / India",
        "৬. উপগ্রহ চিত্র ও ভূ-বৈচিত্র্যসূচক মানচিত্র / Satellite Imagery and Topographical Maps"
    ]
    for idx, t_name in enumerate(default_topics, 1):
        cursor.execute("INSERT OR IGNORE INTO topics (id, exam_id, name) VALUES (?, 1, ?)", (idx, t_name))

    # Seed demo users if empty
    cursor.execute("INSERT OR IGNORE INTO users (id, username, password, role, full_name, school_name, class_grade, phone, district, approved, is_admin, referral_code) VALUES (1, '9876543210', 'student123', 'student', 'অয়ন ব্যানার্জি (Ayan Banerjee)', 'Hindu School, Kolkata', 'Class 10 (Madhyamik)', '9876543210', 'Kolkata', 1, 0, 'GEO-REF-3210')")
    cursor.execute("INSERT OR IGNORE INTO users (id, username, password, role, full_name, school_name, class_grade, phone, district, approved, is_admin, referral_code) VALUES (2, '9123456780', 'teacher123', 'teacher', 'সুকন্যা চক্রবর্তী (Sukannya Chakraborty)', 'South Point High School', 'Faculty', '9123456780', 'Kolkata', 1, 0, 'GEO-REF-T6780')")
    cursor.execute("INSERT OR IGNORE INTO users (id, username, password, role, full_name, school_name, class_grade, phone, district, approved, is_admin, referral_code) VALUES (3, 'admin', 'admin123', 'admin', 'শাওন কর (Shawon Kar)', 'WBBSE Portal Head', 'Headmaster/Admin', '7001257277', 'Kolkata', 1, 1, 'GEO-REF-HEAD')")

    # Seed standard sample questions if not seeded
    cursor.execute("SELECT COUNT(*) FROM questions")
    if cursor.fetchone()[0] == 0:
        questions_data = [
            # Topic 1: Exogenic
            (1, "বহির্জাত প্রক্রিয়ার মূল শক্তির উৎস কোনটি?", "Which one is the main source of energy for exogenic processes?", 
             "সূর্যকিরণ (Solar Radiation)", "Solar Radiation", "ভূ-অভ্যন্তরীণ তাপ", "Internal heat", "বায়ুপ্রবাহ", "Wind", "সমুদ্রস্রোত", "Ocean current",
             "A", "বহির্জাত সমস্ত প্রাকৃতিক প্রক্রিয়ার চালিকাশক্তি হলো প্রত্যক্ষ বা পরোক্ষভাবে সৌরশক্তি।", 1, 0, 1, "MCQ"),
            (1, "নদীর গতিপথে গঠিত অশ্বক্ষুরাকৃতি হ্রদ নদীর কোন প্রবাহে দেখা যায়?", "In which flow of a river is an ox-bow lake formed?",
             "উচ্চপ্রবাহ", "Upper course", "মধ্য ও নিম্ন প্রবাহ", "Middle and lower course", "কেবলমাত্র বদ্বীপ প্রবাহ", "Only delta course", "পার্বত্য প্রবাহ", "Mountain course",
             "B", "নদীর মধ্য ও নিম্ন প্রবাহে আঁকাবাঁকা গতিপথ বা নদীবাঁক (Meander) বেশি হলে অশ্বক্ষুরাকৃতি হ্রদ গঠিত হয়।", 1, 0, 1, "MCQ"),
            (1, "দুটি নদী উপত্যকার মধ্যবর্তী উচ্চভূমিকে কী বলা হয়?", "What is the highland between two river valleys called?",
             "", "", "", "", "", "", "", "", "জলবিভাজিকা (Water divide)", "দুটি নদী অববাহিকা বা উপত্যকাকে পৃথককারী উচ্চভূমিকে জলবিভাজিকা বলে। যেমন- বিন্ধ্য পর্বত।", 1, 1, 1, "SAQ"),
            (1, "গিরিখাত ও ক্যানিয়নের মধ্যে দুটি প্রধান পার্থক্য লেখো।", "Write two main differences between a canyon and a gorge.",
             "", "", "", "", "", "", "", "", "", "", 2, 1, 2, "Broad"),
            (1, "নদীর ক্ষয়কাজের ফলে সৃষ্ট তিনটি প্রধান ভূমিরূপ সচিত্র বর্ণনা করো।", "Describe three major landforms produced by river erosion with diagrams.",
             "", "", "", "", "", "", "", "", "", "", 3, 1, 3, "Broad"),
            (1, "হিমবাহের ক্ষয়কার্যের ফলে সৃষ্ট প্রধান ভূমিরূপগুলির বিবরণ দাও।", "Describe the major erosional landforms created by glaciers.",
             "", "", "", "", "", "", "", "", "", "", 5, 1, 5, "Broad"),

            # Topic 2: Atmosphere
            (2, "বায়ুমণ্ডলের কোন্ স্তরে বেতার তরঙ্গ প্রতিফলিত হয়ে ফিরে আসে?", "In which layer of atmosphere are radio waves reflected back?",
             "ট্রপোস্ফিয়ার", "Troposphere", "স্ট্র্যাটোস্ফিয়ার", "Stratosphere", "আয়নোস্ফিয়ার (থার্মোস্ফিয়ার)", "Ionosphere", "মেসোস্ফিয়ার", "Mesosphere",
             "C", "আয়নোস্ফিয়ার স্তরে উপস্থিত আয়নগুলি বেতার তরঙ্গকে পৃথিবীতে প্রতিফলিত করে পাঠায়।", 1, 0, 1, "MCQ"),
            (2, "চীন সাগরে গ্রীষ্মকালে সৃষ্ট বিধ্বংসী ক্রান্তীয় ঘূর্ণিঝড়কে কী বলা হয়?", "What is the destructive tropical cyclone in China Sea called?",
             "টাইফুন (Typhoon)", "Typhoon", "হ্যারিকেন", "Hurricane", "টর্নেডো", "Tornado", "উইলি উইলি", "Willy Willy",
             "A", "চীন সাগরে শক্তিশালী ক্রান্তীয় ঘূর্ণিঝড় টাইফুন নামে পরিচিত।", 1, 0, 1, "MCQ"),
            (2, "বায়ুর আর্দ্রতা পরিমাপক যন্ত্রের নাম কী?", "What is the name of the instrument used to measure atmospheric humidity?",
             "", "", "", "", "", "", "", "", "হাইগ্রোমিটার (Hygrometer)", "হাইগ্রোমিটার দ্বারা বায়ুর আপেক্ষিক আর্দ্রতা নির্ণয় করা হয়।", 1, 1, 1, "SAQ"),
            (2, "বৈপরীত্য উত্তাপ (Inversion of Temperature) বলতে কী বোঝো?", "What is meant by inversion of temperature?",
             "", "", "", "", "", "", "", "", "", "", 2, 1, 2, "Broad"),
            (2, "বায়ুর চাপের তারতম্যের প্রধান কারণগুলি সংক্ষেপে ব্যাখ্যা করো।", "Explain briefly the causes of variation in atmospheric pressure.",
             "", "", "", "", "", "", "", "", "", "", 3, 1, 3, "Broad"),
            (2, "উষ্ণতার ভিত্তিতে বায়ুমণ্ডলের বিভিন্ন স্তরের স্তরবিন্যাস আলোচনা করো।", "Discuss the vertical thermal structure/stratification of atmosphere.",
             "", "", "", "", "", "", "", "", "", "", 5, 1, 5, "Broad"),

            # Topic 3: Hydrosphere
            (3, "যে তিথিতে সর্বোচ্চ জোয়ার বা মরা কোটাল হয় না বরং ভরা কোটাল সংঘটিত হয়?", "On which tithi does spring tide occur?",
             "অমাবস্যা ও পূর্ণিমা", "New Moon and Full Moon", "সপ্তমী ও অষ্টমী", "7th and 8th tithi", "একাদশী", "Ekadashi", "চতুর্দশী", "Chaturdashi",
             "A", "অমাবস্যা ও পূর্ণিমা তিথিতে সূর্য, পৃথিবী ও চাঁদ একই সরলরেখায় (সিজিগি) এলে তেজকোটাল বা ভরা জোয়ার হয়।", 1, 0, 1, "MCQ"),
            (3, "সমুদ্র স্রোত সৃষ্টির প্রধান কারণ কোনটি?", "Which one is the primary cause of ocean currents?",
             "নিয়ত বায়ুপ্রবাহ", "Planetary winds", "ভূমিকম্প", "Earthquake", "নদীর জলপ্রবাহ", "River flow", "বায়ুর চাপ", "Air pressure",
             "A", "নিয়ত বায়ুপ্রবাহ সমুদ্রের উপরিভাগের জলরাশিকে নির্দিষ্ট দিকে প্রবাহিত করে।", 1, 0, 1, "MCQ"),
            (3, "দুটি মুখ্য জোয়ারের মধ্যে সময়ের ব্যবধান কত?", "What is the time interval between two primary high tides?",
             "", "", "", "", "", "", "", "", "২৪ ঘণ্টা ৫২ মিনিট", "পৃথিবীর আবর্তন এবং চাঁদের পরিক্রমণ গতির কারণে ব্যবধান ২৪ ঘণ্টা ৫২ মিনিট।", 1, 1, 1, "SAQ"),
            (3, "মগ্নচড়া (Grand Bank) কী এবং এটি বাণিজ্যিক মৎস্য আহরণের জন্য বিখ্যাত কেন?", "What is Grand Bank and why is it famous for commercial fishing?",
             "", "", "", "", "", "", "", "", "", "", 2, 1, 2, "Broad"),
            (3, "জোয়ার-ভাঁটা সৃষ্টির প্রধান কারণগুলি আলোচনা করো।", "Discuss the primary causes for the occurrence of tides.",
             "", "", "", "", "", "", "", "", "", "", 3, 1, 3, "Broad"),
            (3, "মানবজীবনে ও আন্তর্জাতিক বাণিজ্যে সমুদ্রস্রোতের অনুকূল ও প্রতিকূল প্রভাব বিশ্লেষণ করো।", "Analyze the favorable and unfavorable effects of ocean currents on human life and trade.",
             "", "", "", "", "", "", "", "", "", "", 5, 1, 5, "Broad"),

            # Topic 4: Waste Management
            (4, "নিচের কোনটি জৈব ভঙ্গুর (Biodegradable) বর্জ্যের উদাহরণ?", "Which of the following is an example of biodegradable waste?",
             "প্লাস্টিক ব্যাগ", "Plastic bag", "শাকসবজির খোসা", "Vegetable peels", "কাঁচের টুকরো", "Broken glass", "ডিডিটি", "DDT",
             "B", "শাকসবজির খোসা ব্যাকটেরিয়ার দ্বারা সহজে বিশ্লিষ্ট হয়ে পরিবেশে মিশে যায়।", 1, 0, 1, "MCQ"),
            (4, "স্ক্রাবার (Scrubber) যন্ত্রটি কোন্ দূষণ রোধে ব্যবহৃত হয়?", "Which pollution control is scrubber machine used for?",
             "বায়ু দূষণ", "Air pollution", "জল দূষণ", "Water pollution", "মৃত্তিকা দূষণ", "Soil pollution", "শব্দ দূষণ", "Noise pollution",
             "A", "কলকারখানার ধোঁয়ায় উপস্থিত বিষাক্ত গ্যাস ও ধূলিকণা অপসারণে স্ক্রাবার ব্যবহৃত হয়।", 1, 0, 1, "MCQ"),
            (4, "বর্জ্য ব্যবস্থাপনায় '4R' পদ্ধতির পুরো অর্থ কী?", "What does 4R stand for in waste management?",
             "", "", "", "", "", "", "", "", "Reduce, Reuse, Recycle, Refuse", "বর্জ্যের পরিমাণ হ্রাস, পুনর্ব্যবহার, পুনর্নবীকরণ এবং প্রত্যাখ্যান।", 1, 1, 1, "SAQ"),
            (4, "ইউট্রোফিকেশন (Eutrophication) বলতে কী বোঝো?", "What is meant by Eutrophication?",
             "", "", "", "", "", "", "", "", "", "", 2, 1, 2, "Broad"),
            (4, "পরিবেশের ওপর বর্জ্যের মারাত্মক প্রভাবগুলি আলোচনা করো।", "Discuss the severe impacts of waste on the environment.",
             "", "", "", "", "", "", "", "", "", "", 3, 1, 3, "Broad"),
            (4, "বর্জ্য ব্যবস্থাপনায় শিক্ষার্থীদের ভূমিকা ও নাগরিক দায়িত্ব সম্পর্কে আলোকপাত করো।", "Highlight the role of students and civic duties in waste management.",
             "", "", "", "", "", "", "", "", "", "", 5, 1, 5, "Broad"),

            # Topic 5: India
            (5, "ভারতের মূল ভূখণ্ডের দক্ষিণতম বিন্দু কোনটি?", "Which is the southernmost point of mainland India?",
             "ইন্দিরা পয়েন্ট", "Indira Point", "কন্যাকুমারিকা (Cape Comorin)", "Kanyakumari", "কিলিক পাস", "Kilik Pass", "কচ্ছের রণ", "Rann of Kutch",
             "B", "মূল ভূখণ্ডের দক্ষিণতম বিন্দু কন্যাকুমারিকা। আর ভারতের সামগ্রিক দক্ষিণতম বিন্দু ইন্দিরা পয়েন্ট।", 1, 0, 1, "MCQ"),
            (5, "ভারতের বৃহত্তম কয়লা খনি অঞ্চল কোনটি?", "Which is the largest coal mining region in India?",
             "ঝরিয়া", "Jharia", "রানিগঞ্জ", "Raniganj", "বোকারো", "Bokaro", "তালচের", "Talcher",
             "A", "ঝাড়খণ্ডের ঝরিয়া হলো ভারতের সর্ববৃহৎ কয়লা উত্তোলক অঞ্চল।", 1, 0, 1, "MCQ"),
            (5, "ভারতের ডেট্রয়েট নামে কোন্ শহরটি পরিচিত?", "Which city is known as the Detroit of India?",
             "", "", "", "", "", "", "", "", "চেন্নাই (Chennai)", "স্বয়ংক্রিয় মোটরগাড়ি নির্মাণ শিল্পের অগ্রগতির জন্য চেন্নাইকে ডেট্রয়েট বলা হয়।", 1, 1, 1, "SAQ"),
            (5, "পশ্চিমঘাট পর্বতের পশ্চিম ঢালে প্রচুর বৃষ্টিপাত হয় কেন?", "Why does the western slope of Western Ghats receive heavy rainfall?",
             "", "", "", "", "", "", "", "", "", "", 2, 1, 2, "Broad"),
            (5, "পূর্ব ও মধ্য ভারতে লৌহ-ইস্পাত শিল্প গড়ে ওঠার অনুকূল ভৌগোলিক কারণগুলি লেখো।", "Write the favorable geographical factors for the growth of iron and steel industry in Eastern and Central India.",
             "", "", "", "", "", "", "", "", "", "", 3, 1, 3, "Broad"),
            (5, "ভারতের ধান চাষের অনুকূল ভৌগোলিক ও অর্থনৈতিক পরিবেশ বিশ্লেষণ করো।", "Analyze the favorable geographical and economic conditions for paddy cultivation in India.",
             "", "", "", "", "", "", "", "", "", "", 5, 1, 5, "Broad"),

            # Topic 6: Satellite Imagery
            (6, "উপগ্রহ চিত্রে বনভূমিকে সাধারণত কোন্ রঙে চিহ্নিত করা হয়?", "In what color is vegetation/forest usually shown in satellite imagery (FCC)?",
             "সবুজ", "Green", "লাল (Red)", "Red", "নীল", "Blue", "হলুদ", "Yellow",
             "B", "মিথ্যা রং সমন্বয় বা FCC (False Color Composite) চিত্রে উদ্ভিদ ও বনভূমিকে উজ্জ্বল লাল রঙে দেখানো হয়।", 1, 0, 1, "MCQ"),
            (6, "ভারতের প্রথম প্রেরিত কৃত্রিম উপগ্রহের নাম কী?", "What was the name of India's first satellite launched?",
             "ইনস্যাট", "INSAT", "আর্যভট্ট (Aryabhata)", "Aryabhata", "আইআরএস", "IRS", "ভাস্কর", "Bhaskara",
             "B", "১৯৭৫ সালে ভারতের প্রথম কৃত্রিম উপগ্রহ আর্যভট্ট মহাকাশে উৎক্ষেপিত হয়।", 1, 0, 1, "MCQ"),
            (6, "ভূ-বৈচিত্র্যসূচক মানচিত্রে ১:৫০,০০০ স্কেলের টোপোশিটের বিস্তার কত?", "What is the latitudinal and longitudinal extent of a 1:50,000 toposheet?",
             "", "", "", "", "", "", "", "", "১৫ মিনিট × ১৫ মিনিট (15' x 15')", "১:৫০,০০০ স্কেলের ডিগ্রি শিট উপবিভাজিত হয়ে ১৫ মিনিট বাই ১৫ মিনিট গ্রিড তৈরি করে।", 1, 1, 1, "SAQ"),
            (6, "উপগ্রহ চিত্রের দুটি প্রধান সুবিধা ও উপযোগিতা উল্লেখ করো।", "Mention two major advantages and uses of satellite imagery.",
             "", "", "", "", "", "", "", "", "", "", 2, 1, 2, "Broad"),
            (6, "ভূ-বৈচিত্র্যসূচক মানচিত্র (Toposheet) ও উপগ্রহ চিত্রের (Satellite Imagery) মধ্যে তিনটি প্রধান পার্থক্য লেখো।", "Write three major differences between a topographical map and satellite imagery.",
             "", "", "", "", "", "", "", "", "", "", 3, 1, 3, "Broad"),
            (6, "উপগ্রহ চিত্র তোলার পর্যায়গুলি ও আধুনিক ভৌগোলিক সমীক্ষায় এর গুরুত্ব বিস্তারিত আলোচনা করো।", "Discuss in detail the stages of satellite image capture and its significance in modern geographical surveys.",
             "", "", "", "", "", "", "", "", "", "", 5, 1, 5, "Broad")
        ]

        for q in questions_data:
            (top_id, q_bn, q_en, oa_bn, oa_en, ob_bn, ob_en, oc_bn, oc_en, od_bn, od_en,
             corr, expl, is_desc, marks, qtype) = (
                q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9], q[10],
                q[11], q[12], q[13], q[14], q[15]
            )
            model_ans = q_bn if marks > 1 else ""
            ms = f"Madhyamik {marks} Marks Marking Scheme: Key points & clarity" if marks > 1 else ""
            cursor.execute("""INSERT INTO questions 
                (topic_id, question_text, question_text_en, option_a, option_a_en, option_b, option_b_en,
                 option_c, option_c_en, option_d, option_d_en, correct_option, explanation, explanation_en,
                 difficulty, is_descriptive, marks, model_answer, marking_scheme, q_type)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Medium', ?, ?, ?, ?, ?)""",
                (top_id, q_bn, q_en, oa_bn, oa_en, ob_bn, ob_en, oc_bn, oc_en, od_bn, od_en,
                 corr, expl, expl, is_desc, marks, model_ans, ms, qtype))

    # Seed mock tests if empty
    cursor.execute("SELECT COUNT(*) FROM mock_tests")
    if cursor.fetchone()[0] == 0:
        sample_pdf_text = b"%PDF-1.4 sample mock test paper for WBBSE Madhyamik Geography by Shawon Kar"
        cursor.execute("""INSERT INTO mock_tests (test_type, code_num, file_name, file_data, uploader, price, is_published)
            VALUES ('Chapter Wise Mock Test', 'chapter mock - 001', 'Chapter1_Exogenic_Mock_2026.pdf', ?, 'Shawon Kar', 29, 1)""", (sample_pdf_text,))
        cursor.execute("""INSERT INTO mock_tests (test_type, code_num, file_name, file_data, uploader, price, is_published)
            VALUES ('Final Mock Test', 'final mock - 001', 'Madhyamik_Full_Mock_90Marks_2026.pdf', ?, 'Shawon Kar', 49, 1)""", (sample_pdf_text,))
        cursor.execute("""INSERT INTO mock_tests (test_type, code_num, file_name, file_data, uploader, price, is_published)
            VALUES ('Board Suggestions', 'suggestion - 001', 'Madhyamik_2026_Top_Sure_Shot_Suggestions.pdf', ?, 'Sukannya Chakraborty', 69, 1)""", (sample_pdf_text,))

    # Seed sample broadcast notification for students
    cursor.execute("SELECT COUNT(*) FROM admin_notifications")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""INSERT INTO admin_notifications (student_username, title, message, priority, created_by)
            VALUES ('9876543210', 'Welcome to Geography Lab!', 'Welcome to WBBSE Class 10 Geography Portal. Practice chapter-wise questions, submit mock answer sheets for correction, and unlock all solutions!', 'Important', 'Shawon Kar')""")

    conn.commit()
    conn.close()
    print("Database verified and seeded successfully!")

if __name__ == "__main__":
    init_and_seed()
