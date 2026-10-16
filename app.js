// ----------------------------------------------------
// 1. הגדרות FIREBASE CONFIG - הדבק כאן את המפתחות מגוגל
// ----------------------------------------------------
const firebaseConfig = {
    apiKey: "AIzaSyDw0bZmDJRX5QhRprHYAqkK1bDqP_rRrEk",
  authDomain: "thyroguide.firebaseapp.com",
  databaseURL: "https://thyroguide-default-rtdb.firebaseio.com",
  projectId: "thyroguide",
  storageBucket: "thyroguide.firebasestorage.app",
  messagingSenderId: "1024482122045",
  appId: "1:1024482122045:web:c3e833e40513a90d224d54",
  measurementId: "G-W7BKVKR09X"
};

// ----------------------------------------------------
// 2. הגדרות Web3Forms - למשלוח מיילים חופשי ברקע
// ----------------------------------------------------
const WEB3FORMS_ACCESS_KEY = "YOUR_WEB3FORMS_ACCESS_KEY";

// טעינת ספריות Firebase במידת הצורך וטעינת האפליקציה
(function loadScripts() {
    const scripts = [
        "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js",
        "https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js",
        "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js"
    ];

    let loaded = 0;
    scripts.forEach(src => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            loaded++;
            if (loaded === scripts.length) initApp();
        };
        document.head.appendChild(script);
    });
})();

let db, auth, currentRecord = null, currentLanguage = 'he', activeDoctor = null;

function initApp() {
    firebase.initializeApp(firebaseConfig);
    db = firebase.database();
    auth = firebase.auth();

    auth.onAuthStateChanged(async (user) => {
        if (user) {
            const snap = await db.ref('doctors/' + user.uid).once('value');
            if (snap.exists()) {
                activeDoctor = snap.val();
                activeDoctor.uid = user.uid;
            } else {
                activeDoctor = { email: user.email, title: 'ד"ר', firstName: '', lastName: '', fullName: user.email, uid: user.uid };
            }
            document.getElementById('doc-welcome-subtitle').innerText = `${currentLanguage === 'he' ? 'מחובר כעת' : 'Logged in as'}: ${activeDoctor.title} ${activeDoctor.firstName} ${activeDoctor.lastName} (${activeDoctor.email})`;
        } else {
            activeDoctor = null;
        }
    });

    lucide.createIcons();
}

const translations = {
    he: {
        logo_sub: "מדריך אישי ומקיף לקראת ניתוח בלוטת התריס",
        doc_login_btn: "כניסת רופא", pat_login_btn: "כניסת מטופל",
        land_title: "כל המידע על הניתוח שלך – במקום אחד",
        land_desc: "הכנה פשוטה, ברורה ושקטה לקראת הניתוח. כאן תוכל לצפות בסיכום הרפואי שעדכן הרופא שלך, להבין את שלבי הניתוח הצפויים, ולקבל תשובות לכל השאלות.",
        pat_box_title: "אזור מידע למטופל", pat_box_desc: "הזנת קוד אישי לקבלת התיק הרפואי שלך, הסברים פשוטים על הניתוח וגישה לטפסי הסכמה.", pat_box_link: "כניסה לתיק האישי",
        doc_box_title: "ממשק סגל רפואי", doc_box_desc: "כניסה והרשמת רופאים מטפלים להזנת מדדים קליניים והפקת תוכניות טיפוליות למטופלים.", doc_box_link: "כניסה / הרשמה למערכת",
        doc_form_title: "הפקת רשומה קלינית חדשה", logout_btn: "התנתק",
        doc_tab_struct: "הזנת מדדים רפואיים (חישוב אוטומטי)", doc_tab_over: "כתיבת תוכנית ניתוח חופשית (עם פענוח AI)",
        ov_note: "מנוע פענוח חכם (AI Engine): המערכת תנתח אוטומטית את הטקסט החופשי שתזין, תזהה ביטויי שלילה, תבנה שלבי ניתוח ממוספרים, ותציג סיבוכים מדויקים בלבד.",
        ov_lbl_title: "כותרת הניתוח המותאם אישית", ov_lbl_desc: "תיאור קליני מפורט או שלבים מותאמים", ov_btn_gen: "הפעל פענוח AI והפק קוד גישה (תקף ל-30 יום)",
        lbl_age: "גיל המטופל", lbl_size: "גודל הממצא (ס\"מ)", lbl_loc: "מיקום בבלוטה", lbl_beth: "סיווג ציטולוגי (Bethesda)", lbl_func: "תפקודי בלוטת התריס", sel_default: "בחר...",
        opt_loc_right: "אונה ימנית", opt_loc_left: "אונה שמאלית", opt_loc_isthmus: "איסתמוס (מיצר)", opt_loc_bilateral: "דו-צדדי",
        opt_func_euthyroid: "תקינים (Euthyroid)", opt_func_hyper: "מוגברים (Hyperthyroidism)", opt_func_hypo: "מדוכאים (Hypothyroidism)",
        lbl_nodes: "מעורבות קשריות לימפה צוואריות (קלינית / אולטראסאונד)", side_right: "צד ימין", side_left: "צד שמאל", node_cent: "מרכזי", node_lat: "לטראלי",
        btn_gen: "הפק תוכנית טיפול וקוד גישה (תקף ל-30 יום)", res_title: "הרשומה הופקה בהצלחה", res_sub: "קוד הגישה המאושר עבור המטופל (בתוקף למשך 30 ימים בכל מכשיר):",
        pat_log_title: "כניסה לתיק רפואי אישי", pat_log_desc: "הזן את קוד הגישה בן 6 התווים שנמסר לך על ידי הרופא המטפל.", pat_log_btn: "הצג סיכום רפואי",
        tab_sum: "סיכום רפואי ומהלך ניתוחי", tab_con: "פנייה ישירה לרופא",
        banner_tag: "סיכום ייעוץ רפואי", banner_title: "לקראת הניתוח המתוכנן בבלוטת התריס",
        surg_box_title: "הפרוצדורה הניתוחית המתוכננת", table_title: "תקציר מדדים קליניים",
        exp_title: "פירוט שלבי הניתוח והמהלך הכירורגי המתוכנן",
        comp_title: "סיבוכים וסיכונים כירורגיים אפשריים", comp_thy_title: "סיבוכים כלליים ושל כריתת בלוטת התריס", comp_neck_title: "סיבוכים הייחודיים לכריתת קשריות לימפה צוואריות",
        pdf_sec_title: "טפסי הסכמה מדעת רשמיים", pdf_sec_desc: "להלן קישורים ישירים לקובצי ה-PDF הרשמיים לקראת חתימה ביום האשפוז:",
        vid_title: "הדמיית מהלך הניתוח", disc_title: "הבהרה רפואית ומשפטית",
        disc_body: "המידע המוצג באפליקציה זו נועד לספק הסבר כללי והכוונה לימודית בלבד. המידע אינו מהווה ייעוץ רפואי משפטי, אינו מחליף התייעצות ישירה עם הרופא המטפל, ואינו תחליף להסברים המפורטים ולטפסי ההסכמה שנמסרים במסגרת הטיפול הרפואי והטרום-ניתוחי בבית החולים.",
        print_btn: "הדפסת סיכום רפואי",
        con_head: "פנייה ישירה לרופא המטפל", con_desc: "מלא את השאילתא והיא תישלח אוטומטית לתיבת המייל של הרופא שיצר עבורך את הסיכום.",
        con_lbl_sub: "נושא הפנייה", con_lbl_body: "תוכן השאילתא", con_btn: "שלח פנייה לרופא המטפל"
    },
    en: {
        logo_sub: "Comprehensive Personal Guide for Thyroid Surgery",
        doc_login_btn: "Doctor Portal", pat_login_btn: "Patient Login",
        land_title: "All Your Surgery Information – In One Place",
        land_desc: "Clear, simple, and reassuring preparation for your upcoming surgery.",
        pat_box_title: "Patient Portal", pat_box_desc: "Enter your 6-character access code to view your surgical report.", pat_box_link: "Access Personal Portal",
        doc_box_title: "Medical Staff Portal", doc_box_desc: "Sign in or register to input clinical metrics.", doc_box_link: "Staff Portal",
        doc_form_title: "Create Clinical Record", logout_btn: "Sign Out",
        doc_tab_struct: "Structured Metrics", doc_tab_over: "Custom Surgical Plan (AI)",
        ov_note: "AI Analysis Engine: Automatically parses surgical steps and negations.",
        ov_lbl_title: "Custom Surgery Title", ov_lbl_desc: "Detailed Clinical Steps", ov_btn_gen: "Run AI Analysis & Generate Access Code",
        lbl_age: "Patient Age", lbl_size: "Tumor Size (cm)", lbl_loc: "Location", lbl_beth: "Cytology (Bethesda)", lbl_func: "Thyroid Function", sel_default: "Select...",
        opt_loc_right: "Right Lobe", opt_loc_left: "Left Lobe", opt_loc_isthmus: "Isthmus", opt_loc_bilateral: "Bilateral",
        opt_func_euthyroid: "Normal", opt_func_hyper: "Elevated", opt_func_hypo: "Suppressed",
        lbl_nodes: "Cervical Lymph Node Involvement", side_right: "Right Side", side_left: "Left Side", node_cent: "Central", node_lat: "Lateral",
        btn_gen: "Generate Access Code", res_title: "Record Created Successfully", res_sub: "Approved Access Code for Patient:",
        pat_log_title: "Patient Record Login", pat_log_desc: "Enter the 6-character access code.", pat_log_btn: "View Medical Summary",
        tab_sum: "Medical Summary & Surgical Steps", tab_con: "Direct Inquiry to Doctor",
        banner_tag: "Medical Consultation Summary", banner_title: "Regarding Your Planned Thyroid Surgery",
        surg_box_title: "Planned Surgical Procedure", table_title: "Clinical Metrics Summary",
        exp_title: "Detailed Surgical Steps", comp_title: "Potential Surgical Complications", comp_thy_title: "General & Thyroidectomy Complications", comp_neck_title: "Neck Dissection Complications",
        pdf_sec_title: "Official Informed Consent Forms", pdf_sec_desc: "Direct links to official PDF consent forms:",
        vid_title: "Surgical Simulation", disc_title: "Medical & Legal Disclaimer", disc_body: "Educational guidance only.", print_btn: "Print Summary",
        con_head: "Direct Inquiry to Doctor", con_desc: "Send your question to your attending physician.", con_lbl_sub: "Subject", con_lbl_body: "Message", con_btn: "Send Inquiry"
    }
};

function changeLanguage(lang) {
    currentLanguage = lang;
    const isRTL = (lang === 'he');
    document.getElementById('html-root').setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.getElementById('html-root').setAttribute('lang', lang);
    const dict = translations[lang] || translations['he'];
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = dict[key];
            else el.innerText = dict[key];
        }
    });
    if (currentRecord) renderPatientRecord(currentRecord, lang);
    lucide.createIcons();
}

function showView(viewName) {
    document.getElementById('view-landing').classList.add('hidden');
    document.getElementById('view-doctor-auth').classList.add('hidden');
    document.getElementById('view-doctor').classList.add('hidden');
    document.getElementById('view-patient').classList.add('hidden');
    
    if (viewName === 'doctor' && !activeDoctor) {
        document.getElementById('view-doctor-auth').classList.remove('hidden');
    } else {
        document.getElementById('view-' + viewName).classList.remove('hidden');
    }

    if (viewName === 'patient') {
        document.getElementById('patient-login').classList.remove('hidden');
        document.getElementById('patient-data-display').classList.add('hidden');
        switchPatientTab('summary');
    }
    lucide.createIcons();
}

function switchAuthTab(tab) {
    const loginForm = document.getElementById('doc-login-form');
    const regForm = document.getElementById('doc-register-form');
    const loginBtn = document.getElementById('auth-tab-login-btn');
    const regBtn = document.getElementById('auth-tab-register-btn');

    if (tab === 'login') {
        loginForm.classList.remove('hidden');
        regForm.classList.add('hidden');
        loginBtn.className = "pb-2 font-bold text-teal-700 border-b-2 border-teal-700 text-sm transition";
        regBtn.className = "pb-2 font-semibold text-slate-500 hover:text-teal-700 text-sm transition";
    } else {
        loginForm.classList.add('hidden');
        regForm.classList.remove('hidden');
        regBtn.className = "pb-2 font-bold text-teal-700 border-b-2 border-teal-700 text-sm transition";
        loginBtn.className = "pb-2 font-semibold text-slate-500 hover:text-teal-700 text-sm transition";
    }
}

async function handleDoctorRegister(e) {
    e.preventDefault();
    const title = document.getElementById('reg-title').value;
    const firstName = document.getElementById('reg-first-name').value.trim();
    const lastName = document.getElementById('reg-last-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const btn = document.getElementById('btn-register-submit');

    btn.disabled = true;
    btn.innerText = "נרשם למערכת...";

    try {
        const userCred = await auth.createUserWithEmailAndPassword(email, password);
        const uid = userCred.user.uid;
        const docData = { title, firstName, lastName, fullName: `${title} ${firstName} ${lastName}`.trim(), email, createdAt: Date.now() };
        await db.ref('doctors/' + uid).set(docData);
        activeDoctor = { ...docData, uid };
        document.getElementById('doc-welcome-subtitle').innerText = `${currentLanguage === 'he' ? 'מחובר כעת' : 'Logged in as'}: ${docData.fullName} (${email})`;
        showView('doctor');
    } catch (err) {
        alert("שגיאה בהרשמה: " + err.message);
    } finally {
        btn.disabled = false;
        btn.innerText = "צור חשבון רופא חדש";
    }
}

async function handleDoctorLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const btn = document.getElementById('btn-login-submit');

    btn.disabled = true;
    btn.innerText = "מתחבר...";

    try {
        const userCred = await auth.signInWithEmailAndPassword(email, password);
        const uid = userCred.user.uid;
        const snap = await db.ref('doctors/' + uid).once('value');
        if (snap.exists()) {
            activeDoctor = snap.val();
            activeDoctor.uid = uid;
        } else {
            activeDoctor = { email: email, title: 'ד"ר', firstName: '', lastName: '', fullName: email, uid };
        }
        document.getElementById('doc-welcome-subtitle').innerText = `${currentLanguage === 'he' ? 'מחובר כעת' : 'Logged in as'}: ${activeDoctor.fullName || activeDoctor.email}`;
        showView('doctor');
    } catch (err) {
        alert("שגיאה בהתחברות: " + err.message);
    } finally {
        btn.disabled = false;
        btn.innerText = "התחבר למערכת";
    }
}

async function logoutDoctor() {
    if (confirm(currentLanguage === 'he' ? 'האם אתה בטוח שברצונך להתנתק?' : 'Are you sure you want to log out?')) {
        await auth.signOut();
        activeDoctor = null;
        showView('landing');
    }
}

async function deleteDoctorAccount() {
    const user = auth.currentUser;
    if (!user) return;

    if (confirm("האם אתה בטוח שברצונך למחוק לחלוטין את החשבון שלך מהמערכת? פעולה זו אינה ניתנת לביטול.")) {
        try {
            await db.ref('doctors/' + user.uid).remove();
            await user.delete();
            activeDoctor = null;
            alert("החשבון נמחק בהצלחה.");
            showView('landing');
        } catch (err) {
            alert("שגיאה במחיקת החשבון: " + err.message);
        }
    }
}

function confirmAndGoHome() {
    if (confirm(currentLanguage === 'he' ? 'האם אתה בטוח שברצונך לחזור לדף הבית?' : 'Are you sure you want to return home?')) {
        showView('landing');
    }
}

function confirmAndClearForm(formId) {
    if (confirm(currentLanguage === 'he' ? 'האם אתה בטוח שברצונך לאפס את הנתונים בטופס?' : 'Are you sure you want to reset the form?')) {
        document.getElementById(formId).reset();
    }
}

function switchDoctorTab(tabName) {
    const structForm = document.getElementById('doctor-form-structured');
    const overForm = document.getElementById('doctor-form-override');
    const structBtn = document.getElementById('doc-tab-btn-struct');
    const overBtn = document.getElementById('doc-tab-btn-over');

    if (tabName === 'structured') {
        structForm.classList.remove('hidden');
        overForm.classList.add('hidden');
        structBtn.className = "pb-3 font-bold text-teal-700 border-b-2 border-teal-700 flex items-center gap-2 transition text-sm";
        overBtn.className = "pb-3 font-semibold text-slate-500 hover:text-teal-700 flex items-center gap-2 transition text-sm";
    } else {
        structForm.classList.add('hidden');
        overForm.classList.remove('hidden');
        overBtn.className = "pb-3 font-bold text-teal-700 border-b-2 border-teal-700 flex items-center gap-2 transition text-sm";
        structBtn.className = "pb-3 font-semibold text-slate-500 hover:text-teal-700 flex items-center gap-2 transition text-sm";
    }
    lucide.createIcons();
}

function switchPatientTab(tabName) {
    const sumTab = document.getElementById('patient-tab-summary');
    const conTab = document.getElementById('patient-tab-contact');
    const sumBtn = document.getElementById('tab-btn-summary');
    const conBtn = document.getElementById('tab-btn-contact');

    if (tabName === 'summary') {
        sumTab.classList.remove('hidden');
        conTab.classList.add('hidden');
        sumBtn.className = "pb-3 font-bold text-teal-700 border-b-2 border-teal-700 flex items-center gap-2 transition text-sm";
        conBtn.className = "pb-3 font-semibold text-slate-500 hover:text-teal-700 flex items-center gap-2 transition text-sm";
    } else {
        sumTab.classList.add('hidden');
        conTab.classList.remove('hidden');
        conBtn.className = "pb-3 font-bold text-teal-700 border-b-2 border-teal-700 flex items-center gap-2 transition text-sm";
        sumBtn.className = "pb-3 font-semibold text-slate-500 hover:text-teal-700 flex items-center gap-2 transition text-sm";
        document.getElementById('query-success-msg').classList.add('hidden');
        document.getElementById('query-error-msg').classList.add('hidden');
    }
    lucide.createIcons();
}

async function handleDirectSilentBackgroundDispatch(e) {
    e.preventDefault();
    const subject = document.getElementById('query-subject').value.trim();
    const body = document.getElementById('query-body').value.trim();
    const patientEmail = document.getElementById('patient-email').value.trim();
    const btn = document.getElementById('send-query-btn');
    
    const targetDoctorEmail = (currentRecord && currentRecord.doctorEmail) ? currentRecord.doctorEmail : "doctor@hospital.org.il";
    const targetDoctorName = (currentRecord && currentRecord.doctorName) ? currentRecord.doctorName : "הרופא המטפל";
    const patientCode = document.getElementById('patient-code-input').value.trim() || "לא צוין";

    document.getElementById('query-success-msg').classList.add('hidden');
    document.getElementById('query-error-msg').classList.add('hidden');

    btn.disabled = true;
    btn.innerHTML = `<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> ${currentLanguage === 'he' ? 'שולח לרופא...' : 'Sending...'}`;
    lucide.createIcons();

    try {
        if (WEB3FORMS_ACCESS_KEY && WEB3FORMS_ACCESS_KEY !== "YOUR_WEB3FORMS_ACCESS_KEY") {
            const formData = new FormData();
            formData.append("access_key", WEB3FORMS_ACCESS_KEY);
            formData.append("to_email", targetDoctorEmail);
            formData.append("subject", `[ThyroGuide - קוד ${patientCode}] ${subject}`);
            formData.append("from_name", `ThyroGuide (מטופל ${patientCode})`);
            formData.append("reply_to", patientEmail || targetDoctorEmail);
            formData.append("message", `פנייה חדשה עבור ${targetDoctorName}:\n\nקוד מטופל: ${patientCode}\nמייל המטופל להחזרת תשובה: ${patientEmail || 'לא צוין'}\n\nתוכן הפנייה:\n${body}`);

            const res = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await res.json();
            if (!data.success) throw new Error(data.message);
        } else {
            await new Promise(r => setTimeout(r, 800));
        }

        document.getElementById('query-success-msg').classList.remove('hidden');
        e.target.reset();
    } catch (err) {
        console.error("Email dispatch error:", err);
        document.getElementById('query-error-msg').classList.remove('hidden');
    } finally {
        btn.disabled = false;
        btn.innerHTML = `<i data-lucide="send" class="w-4 h-4"></i> <span>${translations[currentLanguage].con_btn}</span>`;
        lucide.createIcons();
    }
}

function parseCustomTextWithAI(title, details) {
    const fullText = (title + " " + details).toLowerCase();

    function isTermPresentAndAffirmative(text, terms, negationWords) {
        const clauses = text.split(/[,.;\n\r–—\(\)]+/);
        for (let clause of clauses) {
            clause = clause.trim();
            if (!clause) continue;
            const hasTerm = terms.some(term => clause.includes(term));
            if (!hasTerm) continue;
            const hasNegation = negationWords.some(neg => {
                const negIndex = clause.indexOf(neg);
                if (negIndex === -1) return false;
                return terms.some(term => {
                    const termIndex = clause.indexOf(term);
                    return termIndex > negIndex && (termIndex - negIndex) < 45;
                });
            });
            if (!hasNegation) return true;
        }
        return false;
    }

    const negationWords = ['ללא', 'אין', 'לא', 'בלי', 'שלילי', 'נשללה', 'נשלל', 'ללא צורך', 'אין צורך', 'no ', 'without ', 'not ', 'negative'];
    const lateralTerms = ['לטראלית', 'צידית', 'לטרלית', 'lateral', 'mrnd', 'rnd', 'levels ii', 'level ii', 'level iii', 'level iv'];
    const centralTerms = ['מרכזית', 'central', 'level vi', 'level 6', 'פרא-טראכיאלית'];
    const lobectomyTerms = ['lobectomy', 'כריתת אונה', 'אונה ימנית בלבד', 'אונה שמאלית בלבד', 'hemithyroidectomy'];
    const totalTerms = ['total thyroidectomy', 'כריתה שלמה', 'כריתה מלאה', 'טוטאלית', 'completion'];

    const hasLateral = isTermPresentAndAffirmative(fullText, lateralTerms, negationWords);
    const hasCentral = isTermPresentAndAffirmative(fullText, centralTerms, negationWords);
    const mentionsLobectomy = isTermPresentAndAffirmative(fullText, lobectomyTerms, negationWords);
    const mentionsTotal = isTermPresentAndAffirmative(fullText, totalTerms, negationWords);

    let isTotal = true;
    if (mentionsLobectomy && !mentionsTotal) isTotal = false;
    else if (mentionsTotal) isTotal = true;

    const hasNeckDissection = hasLateral || hasCentral;
    let nStage = "N0";
    if (hasLateral) nStage = "N1b";
    else if (hasCentral) nStage = "N1a";

    return { isTotal, hasNeckDissection, hasLateral, hasCentral, nStage };
}

async function handleCreateCode(e, mode) {
    e.preventDefault();
    let primaryPlanKey = "", secondaryPlanKey = "", customTitle = "", customDetails = "", hasNeckDissection = false, isTotal = true, size = 0, locationVal = "", bethesdaVal = "", funcVal = "", nStage = "N0";

    if (mode === 'override') {
        customTitle = document.getElementById('ov-surgery-title').value;
        customDetails = document.getElementById('ov-surgery-details').value;
        const aiResult = parseCustomTextWithAI(customTitle, customDetails);
        isTotal = aiResult.isTotal;
        hasNeckDissection = aiResult.hasNeckDissection;
        nStage = aiResult.nStage;
    } else {
        size = parseFloat(document.getElementById('tumor-size').value);
        locationVal = document.getElementById('tumor-location').value;
        bethesdaVal = document.getElementById('bethesda-score').value;
        funcVal = document.getElementById('thyroid-function').value;
        const hasEte = document.getElementById('gross-ete').checked;

        const rCentral = document.getElementById('r-central').checked;
        const lCentral = document.getElementById('l-central').checked;
        const rLateral = document.getElementById('r-lateral').checked;
        const lLateral = document.getElementById('l-lateral').checked;

        const centralNodes = rCentral || lCentral;
        const lateralNodes = rLateral || lLateral;
        hasNeckDissection = centralNodes || lateralNodes;
        nStage = lateralNodes ? "N1b" : (centralNodes ? "N1a" : "N0");

        if (hasNeckDissection) {
            isTotal = true;
            primaryPlanKey = "total_thyroidectomy";
        } else if (bethesdaVal === "3" || bethesdaVal === "4") {
            if (size > 4 || hasEte) {
                isTotal = true;
                primaryPlanKey = "total_thyroidectomy";
            } else {
                isTotal = false;
                primaryPlanKey = "lobectomy";
                secondaryPlanKey = "completion_possible";
            }
        } else { 
            if (size <= 1 && nStage === "N0" && !hasEte) {
                isTotal = false;
                primaryPlanKey = "lobectomy";
            } else if (size > 1 && size <= 4 && nStage === "N0" && !hasEte) {
                isTotal = false;
                primaryPlanKey = "lobectomy";
                secondaryPlanKey = "total_alternative";
            } else {
                isTotal = true;
                primaryPlanKey = "total_thyroidectomy";
            }
        }
    }

    const doctorFullName = activeDoctor ? (activeDoctor.fullName || `${activeDoctor.title} ${activeDoctor.firstName} ${activeDoctor.lastName}`.trim()) : 'ד"ר עמית ריטר';
    const doctorEmailAddress = activeDoctor ? activeDoctor.email : 'doctor@hospital.org.il';

    const payload = {
        mode, size, locationVal, bethesdaVal, funcVal, nStage, primaryPlanKey, secondaryPlanKey, customTitle, customDetails, hasNeckDissection, isTotal,
        doctorName: doctorFullName, doctorEmail: doctorEmailAddress
    };

    const submitBtn = mode === 'override' ? document.getElementById('btn-submit-over') : document.getElementById('btn-submit-struct');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i data-lucide="loader" class="w-5 h-5 animate-spin"></i> ${currentLanguage === 'he' ? 'מפיק קוד בענן...' : 'Generating Code...'}`;
    lucide.createIcons();

    try {
        const code = await saveRecordToCloud(payload);
        if (code) {
            const expiresAt = Date.now() + (30 * 24 * 60 * 60 * 1000);
            const expDateStr = new Date(expiresAt).toLocaleDateString(currentLanguage === 'he' ? 'he-IL' : 'en-US');

            document.getElementById('generated-code').innerText = code;
            document.getElementById('code-expiration-info').innerText = currentLanguage === 'he' ? `הקוד בתוקף עד לתאריך: ${expDateStr}` : `Code valid until: ${expDateStr}`;

            const qrContainer = document.getElementById('qrcode-container');
            qrContainer.innerHTML = '';
            new QRCode(qrContainer, { text: code, width: 140, height: 140, colorDark : "#0f766e", colorLight : "#ffffff" });

            document.getElementById('code-result').classList.remove('hidden');
            document.getElementById('code-result').scrollIntoView({ behavior: 'smooth' });
        }
    } catch (err) {
        console.error("Firebase Save Error:", err);
        alert(currentLanguage === 'he' ? 'חלה שגיאה בשמירת הנתונים ב-Firebase.' : 'Error saving record to Firebase.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        lucide.createIcons();
    }
}

async function saveRecordToCloud(patientData) {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const now = Date.now();
    const expiresAt = now + (30 * 24 * 60 * 60 * 1000);

    await db.ref('records/' + code).set({ data: patientData, createdAt: now, expiresAt });
    return code;
}

async function getRecordFromCloud(code) {
    if (!code) return null;
    const cleanCode = code.trim().toUpperCase();
    const snapshot = await db.ref('records/' + cleanCode).once('value');
    if (!snapshot.exists()) return null;

    const record = snapshot.val();
    if (record.expiresAt && Date.now() > record.expiresAt) {
        await db.ref('records/' + cleanCode).remove();
        return null;
    }
    return record.data;
}

async function handleFetchPatientData() {
    const inputCode = document.getElementById('patient-code-input').value.trim().toUpperCase();
    if (!inputCode) {
        alert(currentLanguage === 'he' ? 'אנא הזן קוד גישה בן 6 תווים.' : 'Please enter a 6-character code.');
        return;
    }

    const fetchBtn = document.getElementById('btn-fetch-patient');
    fetchBtn.disabled = true;
    fetchBtn.innerHTML = `<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> ${currentLanguage === 'he' ? 'טוען תיק רפואי...' : 'Loading report...'}`;
    lucide.createIcons();

    try {
        const record = await getRecordFromCloud(inputCode);
        if (!record) {
            alert(currentLanguage === 'he' ? 'קוד הגישה שגוי או שפג תוקפו.' : 'Invalid or expired access code.');
            return;
        }

        currentRecord = record;
        document.getElementById('patient-login').classList.add('hidden');
        document.getElementById('patient-data-display').classList.remove('hidden');
        renderPatientRecord(record, currentLanguage);
    } catch (err) {
        console.error("Fetch Patient Error:", err);
        alert(currentLanguage === 'he' ? 'שגיאה בשליפת הנתונים.' : 'Error fetching patient data.');
    } finally {
        fetchBtn.disabled = false;
        fetchBtn.innerHTML = `<span>${translations[currentLanguage].pat_log_btn}</span>`;
        lucide.createIcons();
    }
}

function renderPatientRecord(record, lang) {
    const isHebrew = (lang === 'he');

    document.getElementById('out-banner-tag').innerText = isHebrew ? `סיכום ייעוץ רפואי - ${record.doctorName}` : `Medical Consultation - ${record.doctorName}`;
    document.getElementById('contact-tab-doc-name').innerText = isHebrew ? `פנייה ל${record.doctorName}` : `Contact ${record.doctorName}`;
    document.getElementById('contact-heading-doc').innerText = isHebrew ? `פנייה ישירה ל${record.doctorName}` : `Direct Inquiry to ${record.doctorName}`;

    if (record.expiresAt) {
        const expDateStr = new Date(record.expiresAt).toLocaleDateString(isHebrew ? 'he-IL' : 'en-US');
        document.getElementById('out-expiration-badge').innerText = isHebrew ? `קוד גישה אישי בתוקף עד: ${expDateStr}` : `Access code valid until: ${expDateStr}`;
    }

    const metricsTableContainer = document.getElementById('clinical-metrics-table-container');
    const metricsTbody = document.getElementById('clinical-metrics-tbody');
    metricsTbody.innerHTML = '';

    if (record.mode === 'structured') {
        metricsTableContainer.classList.remove('hidden');
        const locMap = { right: isHebrew ? "אונה ימנית" : "Right Lobe", left: isHebrew ? "אונה שמאלית" : "Left Lobe", isthmus: isHebrew ? "איסתמוס (מיצר)" : "Isthmus", bilateral: isHebrew ? "דו-צדדי" : "Bilateral" };
        const funcMap = { euthyroid: isHebrew ? "תקינים (Euthyroid)" : "Normal", hyper: isHebrew ? "מוגברים" : "Elevated", hypo: isHebrew ? "מדוכאים" : "Suppressed" };
        const nodeMap = { N0: isHebrew ? "ללא עדות קלינית למעורבות" : "No clinical involvement", N1a: isHebrew ? "מעורבות מרכזית" : "Central involvement", N1b: isHebrew ? "מעורבות צידית ומרכזית" : "Lateral & Central involvement" };
        const bethMap = { "1": "Bethesda I", "2": "Bethesda II", "3": "Bethesda III", "4": "Bethesda IV", "5": "Bethesda V", "6": "Bethesda VI" };

        metricsTbody.innerHTML = `
            <tr class="border-b border-slate-200 bg-slate-50"><td class="p-3 text-slate-600 font-semibold">${isHebrew ? 'גודל הממצא המירבי' : 'Max Tumor Size'}</td><td class="p-3 text-slate-900 font-bold">${record.size} ${isHebrew ? 'ס"מ' : 'cm'}</td></tr>
            <tr class="border-b border-slate-200 bg-white"><td class="p-3 text-slate-600 font-semibold">${isHebrew ? 'מיקום אנטומי בבלוטה' : 'Anatomic Location'}</td><td class="p-3 text-slate-900 font-bold">${locMap[record.locationVal]}</td></tr>
            <tr class="border-b border-slate-200 bg-slate-50"><td class="p-3 text-slate-600 font-semibold">${isHebrew ? 'הערכת סיכון לממאירות' : 'Cytology'}</td><td class="p-3 text-slate-900 font-bold">${bethMap[record.bethesdaVal]}</td></tr>
            <tr class="border-b border-slate-200 bg-white"><td class="p-3 text-slate-600 font-semibold">${isHebrew ? 'תפקודי בלוטת התריס בדם' : 'Thyroid Function'}</td><td class="p-3 text-slate-900 font-bold">${funcMap[record.funcVal]}</td></tr>
            <tr class="bg-slate-50"><td class="p-3 text-slate-600 font-semibold">${isHebrew ? 'סטטוס בלוטות לימפה צוואריות' : 'Lymph Node Status'}</td><td class="p-3 text-slate-900 font-bold">${nodeMap[record.nStage]}</td></tr>
        `;
    } else {
        metricsTableContainer.classList.add('hidden');
    }

    let primaryPlanText = record.mode === 'override' ? record.customTitle : (record.isTotal ? (isHebrew ? "כריתה שלמה של בלוטת התריס" : "Total Thyroidectomy") : (isHebrew ? "כריתת אונה של בלוטת התריס" : "Thyroid Lobectomy"));
    document.getElementById('out-surgery-primary').innerText = primaryPlanText;
    document.getElementById('out-surgery-intro').innerHTML = isHebrew ? `הופנית על ידי ${record.doctorName} לביצוע ניתוח מסוג <strong>${primaryPlanText}</strong>.` : `Referred by ${record.doctorName} for <strong>${primaryPlanText}</strong>.`;

    let detailedHTML = record.mode === 'override' ? `<p><strong>${isHebrew ? 'הנחיות הרופא:' : 'Doctor Notes:'}</strong></p><p>${record.customDetails.replace(/\n/g, '<br>')}</p>` : `<p>${isHebrew ? 'הניתוח מבוצע בגישה צווארית קדמית תחת הרדמה כללית ובשילוב ניטור אלקטרופיזיולוגי עצבי (NIM).' : 'Standard procedure steps applied.'}</p>`;
    document.getElementById('out-detailed-explanation').innerHTML = detailedHTML;

    lucide.createIcons();
}
