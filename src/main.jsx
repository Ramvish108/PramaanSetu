import React, { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft, ArrowRight, BadgeCheck, Building2, Camera, Check, ChevronDown,
  CircleAlert, Clock, CreditCard, FileCheck2, FileImage, Globe2, HelpCircle, History as HistoryIcon, Info,
  KeyRound, Landmark, Lock, LoaderCircle, LogIn, MapPin, Phone, RefreshCw,
  ScanLine, ShieldCheck, Sparkles, Star, Upload, UserCircle2, UserPlus, X
} from 'lucide-react'
import { createRoot } from 'react-dom/client'
import './styles.css'

/* ------------------------------------------------------------------ */
/*  Copy — English + Hindi                                            */
/* ------------------------------------------------------------------ */
const copy = {
  en: {
    name: 'English',
    signIn: 'Sign in / Register',
    heading: 'Cross the paperwork.\nReach your certificate.',
    sub: 'PramaanSetu is a calmer front door to certificate applications — one clear question at a time, with your document checked before it is ever submitted.',
    start: 'Start application',
    help: 'How this works',
    assurance: 'Your details stay on this device. This is a safe prototype using sample data — nothing is sent to a real department.',
    statServices: 'services covered',
    statCheck: 'minute document check',
    statStore: 'personal data stored',
    heroBannerEyebrow: 'Live screening preview',
    heroBannerTitle: 'Every photo gets a second look — instantly',
    heroBannerBody: 'Before a document ever reaches a reviewer, it passes the same on-device check you\u2019ll see in step two: a plain-language verdict, not a wall of jargon.',
    heroBannerChip1: 'Screened before submission',
    heroBannerChip2: 'Nothing leaves this device unscanned',
    navHistory: 'History',
    aboutEyebrow: 'Why PramaanSetu',
    aboutTitle: 'A bridge, not a queue',
    aboutBody1: 'Government certificate forms reject people for small, avoidable reasons — a blurry photo, a missing field, an upload nobody explained. PramaanSetu turns that queue into a bridge: a short, guided walk from question to confirmation.',
    aboutBody2: 'Every document photo is screened for signs of AI generation or tampering before it reaches a reviewer, so genuine applicants are not slowed down by fraud checks happening later in the process.',
    featuresEyebrow: 'What changes for you',
    f1Title: 'One question at a time',
    f1Body: 'No dense forms. Each screen asks a single thing, in your language.',
    f2Title: 'Photo checked upfront',
    f2Body: 'A traffic-light signal tells you instantly if a document photo needs another try.',
    f3Title: 'A Citizen ID, not a login',
    f3Body: 'Register once for a lightweight ID. No passwords to remember, nothing sold or shared.',
    teamEyebrow: 'The people behind this',
    teamTitle: 'Meet the developers',
    teamSub: 'PramaanSetu was built by a small two-person team for this hackathon.',
    dev1Name: 'Ritish',
    dev1Role: 'Frontend & Product Design',
    dev1Bio: 'Placeholder bio — add a line or two about background, what they focused on in this project, and any links (portfolio, GitHub, LinkedIn).',
    dev2Name: 'Ram',
    dev2Role: 'Backend & AI Integration',
    dev2Bio: 'Placeholder bio — add a line or two about background, what they focused on in this project, and any links (portfolio, GitHub, LinkedIn).',
    choose: 'Choose a service',
    chooseSub: 'What would you like to do today?',
    birth: 'Birth certificate',
    birthSub: 'Request a new or corrected copy',
    income: 'Income certificate',
    incomeSub: 'Apply with your household details',
    domicile: 'Domicile certificate',
    domicileSub: 'Get proof of residence',
    continueBtn: 'Continue',
    back: 'Back',
    authEyebrow: 'One-time setup',
    authTitle: 'Create your Citizen ID',
    authSub: 'A lightweight ID so we can track this request. No password, no document upload here.',
    tabRegister: 'New here',
    tabLogin: 'Returning',
    fieldName: 'Full name',
    fieldNamePh: 'As it appears on your document',
    fieldMobile: 'Mobile number',
    fieldMobilePh: '10-digit mobile number',
    registerBtn: 'Create Citizen ID',
    loginBtn: 'Continue with existing ID',
    loginMobileBtn: 'Continue with mobile number',
    fieldIdPh: 'Citizen ID, e.g. PS-4K9QRT',
    loginWithId: 'Use Citizen ID',
    loginWithMobile: 'Use mobile number',
    fieldMobileLoginPh: '10-digit registered mobile number',
    idUnknownHint: "Don't know your Citizen ID? Use your registered mobile number instead.",
    authNote: 'Prototype note: this ID is generated locally for this session and is not stored anywhere.',
    errMobileTaken: 'This mobile number is already registered. Please sign in instead.',
    errIdNotFound: "We couldn't find that Citizen ID. Check it, or sign in with your mobile number.",
    errMobileNotFound: 'No Citizen ID is registered with that mobile number yet.',
    document: 'Add your document',
    docSub: 'A clear, well-lit photo helps avoid a rejection later.',
    uploadEmptyTitle: 'Take a photo or choose an image',
    uploadEmptySub: 'JPG or PNG · up to 10 MB',
    remove: 'Remove',
    runCheck: 'Run AI-generated image check',
    scanning: 'Screening your photo…',
    signalIdle: 'Waiting for a photo',
    signalScanning: 'Checking for AI generation',
    signalGreen: 'Looks authentic',
    signalAmber: 'Uncertain — try again',
    signalRed: 'Likely AI-generated',
    verdictGreenBody: 'No strong signs of AI generation or tampering were found. You can continue.',
    verdictAmberBody: 'The result was inconclusive. A sharper, better-lit photo usually resolves this.',
    verdictRedBody: 'This image shows strong signs of AI generation. Please upload the original document photo.',
    smallNote: 'The image is sent only to the configured Hugging Face inference model for this check. It is not stored by PramaanSetu.',
    reupload: 'Upload a different image',
    resultFrom: 'Result from',
    riskLabel: 'AI-generation risk signal',
    errNoFile: 'Please add a document photo first.',
    errNotImage: 'AI screening supports JPG, PNG, and camera images. Please upload an image instead of a PDF.',
    errUnavailable: 'AI screening is unavailable. Start the local Python API on port 8000, then try again.',
    errGeneric: 'The live AI check was unavailable. Please try again.',
    lockedTitle: 'Uploads paused for 24 hours',
    lockedBody: "This device flagged 3 AI-generated photos. To keep the check fair for everyone, uploading is paused and will reopen automatically.",
    lockedCountdownLabel: 'Uploads reopen in',
    lockedBackHome: 'Return to home',
    review: 'Review your request',
    reviewSub: 'Please check this summary before sending it.',
    service: 'Service',
    applicant: 'Applicant',
    citizenId: 'Citizen ID',
    document2: 'Document',
    photoReview: 'Photo review',
    verified: 'Ready to submit',
    prototypeTitle: 'Prototype notice',
    prototypeBody: 'This request will not be sent to a government department. It shows how a safer, clearer journey could work.',
    submit: 'Submit application',
    received: 'Your request has been received.',
    receivedSub: 'We will keep you updated. Keep this request number for reference.',
    requestNo: 'Request number',
    status: 'Status',
    submitted: 'Submitted',
    nextUpdate: 'Next update',
    within2: 'Within 2 working days',
    returnHome: 'Return to home',
    mockLabel: 'Mock application · No real data submitted',
    footerNote: 'PramaanSetu is an independent hackathon prototype, not an official government service.',
    accessibility: 'Accessibility',
    privacy: 'Privacy',
    hiThere: 'Hi',
    stepOf: (s) => `Step ${s} of 3`,
    application: 'Application',
    historyTitle: 'Recently analyzed',
    historySub: 'Every document photo you have screened on this device, most recent first.',
    historyEmptyTitle: 'Nothing checked yet',
    historyEmptyBody: 'Documents you screen during an application will show up here.',
    historyBack: 'Back to home',
    analysisResult: 'Analysis Result',
    analysisCompleted: 'Completed',
    aiGenProb: 'AI-generation probability',
    whatMeans: 'What does this mean?',
    whatMeansBody: 'Our AI model has detected patterns commonly found in AI-generated or manipulated images.',
    whatMeansCaveat: 'This is a screening signal, not proof of authenticity.',
    analysisDetails: 'Analysis Details',
    modelUsed: 'Model Used',
    modeLabel: 'Mode',
    modeValue: 'Local (On-Premise)',
    analyzedAt: 'Analyzed At',
    device: 'Device',
    privateTitle: 'Your image was processed locally.',
    privateBody: 'We do not store or share your data.',
  },
  hi: {
    name: 'हिन्दी',
    signIn: 'साइन इन / पंजीकरण',
    heading: 'कागज़ी कार्रवाई पार करें,\nअपने प्रमाणपत्र तक पहुँचें।',
    sub: 'प्रमाणसेतु प्रमाणपत्र आवेदन का एक शांत रास्ता है — एक बार में एक साफ़ सवाल, और जमा करने से पहले आपके दस्तावेज़ की जाँच।',
    start: 'आवेदन शुरू करें',
    help: 'यह कैसे काम करता है',
    assurance: 'आपकी जानकारी इसी डिवाइस पर रहती है। यह नमूना डेटा वाला एक सुरक्षित प्रोटोटाइप है — कुछ भी असली विभाग को नहीं भेजा जाता।',
    statServices: 'सेवाएँ शामिल',
    statCheck: 'मिनट में दस्तावेज़ जाँच',
    statStore: 'व्यक्तिगत डेटा संग्रहीत',
    heroBannerEyebrow: 'लाइव जाँच झलक',
    heroBannerTitle: 'हर फोटो की तुरंत दोबारा जाँच होती है',
    heroBannerBody: 'दस्तावेज़ समीक्षक तक पहुँचने से पहले वही जाँच से गुज़रता है जो आप चरण दो में देखेंगे — आसान भाषा में एक स्पष्ट परिणाम।',
    heroBannerChip1: 'जमा करने से पहले जाँचा गया',
    heroBannerChip2: 'बिना जाँचे कुछ भी डिवाइस से बाहर नहीं जाता',
    navHistory: 'इतिहास',
    aboutEyebrow: 'प्रमाणसेतु क्यों',
    aboutTitle: 'एक सेतु, कतार नहीं',
    aboutBody1: 'सरकारी प्रमाणपत्र फॉर्म अक्सर छोटी, टाली जा सकने वाली वजहों से अस्वीकार होते हैं — धुंधली फोटो, छूटा हुआ फ़ील्ड। प्रमाणसेतु इस कतार को एक सेतु में बदल देता है: सवाल से पुष्टि तक एक छोटी, निर्देशित यात्रा।',
    aboutBody2: 'हर दस्तावेज़ फोटो की जाँच समीक्षक तक पहुँचने से पहले AI-जनित या छेड़छाड़ के संकेतों के लिए की जाती है, ताकि सही आवेदक बाद की जाँच में न अटकें।',
    featuresEyebrow: 'आपके लिए क्या बदलता है',
    f1Title: 'एक बार में एक सवाल',
    f1Body: 'घने फॉर्म नहीं। हर स्क्रीन आपकी भाषा में एक ही बात पूछती है।',
    f2Title: 'फोटो पहले ही जाँची जाती है',
    f2Body: 'ट्रैफ़िक-लाइट संकेत तुरंत बताता है कि फोटो दोबारा लेनी है या नहीं।',
    f3Title: 'नागरिक ID, लॉगिन नहीं',
    f3Body: 'एक हल्की ID के लिए एक बार पंजीकरण करें। कोई पासवर्ड याद नहीं रखना।',
    teamEyebrow: 'इसके पीछे की टीम',
    teamTitle: 'डेवलपर्स से मिलें',
    teamSub: 'प्रमाणसेतु को इस हैकाथॉन के लिए दो-सदस्यीय टीम द्वारा बनाया गया है।',
    dev1Name: 'डेवलपर एक',
    dev1Role: 'फ्रंटएंड और प्रोडक्ट डिज़ाइन',
    dev1Bio: 'प्लेसहोल्डर बायो — पृष्ठभूमि, इस प्रोजेक्ट में योगदान और लिंक (पोर्टफोलियो, GitHub, LinkedIn) के बारे में एक-दो पंक्तियाँ जोड़ें।',
    dev2Name: 'डेवलपर दो',
    dev2Role: 'बैकएंड और AI इंटीग्रेशन',
    dev2Bio: 'प्लेसहोल्डर बायो — पृष्ठभूमि, इस प्रोजेक्ट में योगदान और लिंक (पोर्टफोलियो, GitHub, LinkedIn) के बारे में एक-दो पंक्तियाँ जोड़ें।',
    choose: 'सेवा चुनें',
    chooseSub: 'आप आज क्या करना चाहते हैं?',
    birth: 'जन्म प्रमाणपत्र',
    birthSub: 'नई या संशोधित प्रति का अनुरोध',
    income: 'आय प्रमाणपत्र',
    incomeSub: 'परिवार की जानकारी के साथ आवेदन',
    domicile: 'निवास प्रमाणपत्र',
    domicileSub: 'निवास का प्रमाण लें',
    continueBtn: 'आगे बढ़ें',
    back: 'वापस',
    authEyebrow: 'एक-बार सेटअप',
    authTitle: 'अपनी नागरिक ID बनाएँ',
    authSub: 'इस अनुरोध को ट्रैक करने के लिए एक हल्की ID। यहाँ कोई पासवर्ड या दस्तावेज़ अपलोड नहीं।',
    tabRegister: 'नए उपयोगकर्ता',
    tabLogin: 'पहले से पंजीकृत',
    fieldName: 'पूरा नाम',
    fieldNamePh: 'दस्तावेज़ पर जैसा दिखे',
    fieldMobile: 'मोबाइल नंबर',
    fieldMobilePh: '10 अंकों का मोबाइल नंबर',
    registerBtn: 'नागरिक ID बनाएँ',
    loginBtn: 'मौजूदा ID से आगे बढ़ें',
    loginMobileBtn: 'मोबाइल नंबर से आगे बढ़ें',
    fieldIdPh: 'नागरिक ID, जैसे PS-4K9QRT',
    loginWithId: 'नागरिक ID उपयोग करें',
    loginWithMobile: 'मोबाइल नंबर उपयोग करें',
    fieldMobileLoginPh: '10 अंकों का पंजीकृत मोबाइल नंबर',
    idUnknownHint: 'अपनी नागरिक ID नहीं पता? इसके बजाय अपना पंजीकृत मोबाइल नंबर इस्तेमाल करें।',
    authNote: 'प्रोटोटाइप नोट: यह ID केवल इस सत्र के लिए स्थानीय रूप से बनाई गई है, कहीं संग्रहीत नहीं है।',
    errMobileTaken: 'यह मोबाइल नंबर पहले से पंजीकृत है। कृपया साइन इन करें।',
    errIdNotFound: 'यह नागरिक ID नहीं मिली। जाँच लें, या अपने मोबाइल नंबर से साइन इन करें।',
    errMobileNotFound: 'इस मोबाइल नंबर से अभी तक कोई नागरिक ID पंजीकृत नहीं है।',
    document: 'अपना दस्तावेज़ जोड़ें',
    docSub: 'एक साफ़, अच्छी रोशनी वाली फोटो बाद में अस्वीकृति से बचाती है।',
    uploadEmptyTitle: 'फोटो लें या छवि चुनें',
    uploadEmptySub: 'JPG या PNG · 10 MB तक',
    remove: 'हटाएँ',
    runCheck: 'AI-जनित छवि जाँच चलाएँ',
    scanning: 'आपकी फोटो जाँची जा रही है…',
    signalIdle: 'फोटो का इंतज़ार',
    signalScanning: 'AI जनरेशन की जाँच हो रही है',
    signalGreen: 'असली लगती है',
    signalAmber: 'अनिश्चित — फिर कोशिश करें',
    signalRed: 'संभवतः AI-जनित',
    verdictGreenBody: 'AI जनरेशन या छेड़छाड़ के मजबूत संकेत नहीं मिले। आप आगे बढ़ सकते हैं।',
    verdictAmberBody: 'परिणाम अनिश्चित रहा। एक स्पष्ट, बेहतर रोशनी वाली फोटो आमतौर पर इसे ठीक कर देती है।',
    verdictRedBody: 'इस छवि में AI जनरेशन के मजबूत संकेत हैं। कृपया मूल दस्तावेज़ की फोटो अपलोड करें।',
    smallNote: 'यह छवि केवल इस जाँच के लिए कॉन्फ़िगर किए गए Hugging Face मॉडल को भेजी जाती है। इसे प्रमाणसेतु द्वारा संग्रहीत नहीं किया जाता।',
    reupload: 'दूसरी छवि अपलोड करें',
    resultFrom: 'परिणाम स्रोत',
    riskLabel: 'AI-जनरेशन जोखिम संकेत',
    errNoFile: 'कृपया पहले दस्तावेज़ की फोटो जोड़ें।',
    errNotImage: 'AI जाँच केवल JPG, PNG और कैमरा छवियों को सपोर्ट करती है। कृपया PDF की जगह एक छवि अपलोड करें।',
    errUnavailable: 'AI जाँच अभी उपलब्ध नहीं है। पोर्ट 8000 पर लोकल Python API शुरू करें और फिर से कोशिश करें।',
    errGeneric: 'लाइव AI जाँच उपलब्ध नहीं थी। कृपया फिर से कोशिश करें।',
    lockedTitle: '24 घंटे के लिए अपलोड रोका गया',
    lockedBody: 'इस डिवाइस से 3 AI-जनित फोटो चिह्नित की गईं। सबके लिए जाँच निष्पक्ष रखने हेतु अपलोड रोका गया है और अपने आप फिर से शुरू होगा।',
    lockedCountdownLabel: 'अपलोड फिर से शुरू होगा',
    lockedBackHome: 'होम पर वापस जाएँ',
    review: 'अपना अनुरोध जाँचें',
    reviewSub: 'भेजने से पहले कृपया यह सारांश जाँच लें।',
    service: 'सेवा',
    applicant: 'आवेदक',
    citizenId: 'नागरिक ID',
    document2: 'दस्तावेज़',
    photoReview: 'फोटो समीक्षा',
    verified: 'जमा करने के लिए तैयार',
    prototypeTitle: 'प्रोटोटाइप सूचना',
    prototypeBody: 'यह अनुरोध किसी सरकारी विभाग को नहीं भेजा जाएगा। यह दिखाता है कि एक सुरक्षित, स्पष्ट यात्रा कैसे काम कर सकती है।',
    submit: 'आवेदन जमा करें',
    received: 'आपका अनुरोध प्राप्त हो गया है।',
    receivedSub: 'हम आपको अपडेट रखेंगे। संदर्भ के लिए यह अनुरोध संख्या रखें।',
    requestNo: 'अनुरोध संख्या',
    status: 'स्थिति',
    submitted: 'जमा किया गया',
    nextUpdate: 'अगला अपडेट',
    within2: '2 कार्य दिवसों में',
    returnHome: 'होम पर वापस जाएँ',
    mockLabel: 'नमूना आवेदन · कोई वास्तविक डेटा जमा नहीं हुआ',
    footerNote: 'प्रमाणसेतु एक स्वतंत्र हैकाथॉन प्रोटोटाइप है, आधिकारिक सरकारी सेवा नहीं।',
    accessibility: 'सुगम्यता',
    privacy: 'गोपनीयता',
    hiThere: 'नमस्ते',
    stepOf: (s) => `चरण ${s} / 3`,
    application: 'आवेदन',
    historyTitle: 'हाल ही में जाँचे गए',
    historySub: 'इस डिवाइस पर जाँची गई हर दस्तावेज़ फोटो, नवीनतम सबसे ऊपर।',
    historyEmptyTitle: 'अभी तक कुछ नहीं जाँचा गया',
    historyEmptyBody: 'आवेदन के दौरान जाँची गई तस्वीरें यहाँ दिखेंगी।',
    historyBack: 'होम पर वापस',
    analysisResult: 'विश्लेषण परिणाम',
    analysisCompleted: 'पूर्ण',
    aiGenProb: 'AI-जनरेशन संभावना',
    whatMeans: 'इसका क्या मतलब है?',
    whatMeansBody: 'हमारे AI मॉडल ने AI-जनित या छेड़छाड़ की गई छवियों में आमतौर पर पाए जाने वाले पैटर्न का पता लगाया है।',
    whatMeansCaveat: 'यह एक जाँच संकेत है, प्रामाणिकता का प्रमाण नहीं।',
    analysisDetails: 'विश्लेषण विवरण',
    modelUsed: 'उपयोग किया गया मॉडल',
    modeLabel: 'मोड',
    modeValue: 'लोकल (ऑन-प्रिमाइस)',
    analyzedAt: 'विश्लेषण समय',
    device: 'डिवाइस',
    privateTitle: 'आपकी छवि स्थानीय रूप से संसाधित की गई।',
    privateBody: 'हम आपका डेटा संग्रहीत या साझा नहीं करते।',
  }
}

const SERVICES = [
  { key: 'birth', Icon: FileCheck2 },
  { key: 'income', Icon: Building2 },
  { key: 'domicile', Icon: MapPin },
]

/* Placeholder team roster for the "Meet the developers" section.
   Swap `initials` for a real photo by rendering an <img> in DevCard instead. */
const TEAM = [
  { nameKey: 'dev1Name', roleKey: 'dev1Role', bioKey: 'dev1Bio', initials: 'R' },
  { nameKey: 'dev2Name', roleKey: 'dev2Role', bioKey: 'dev2Bio', initials: 'R' },
]

/* ------------------------------------------------------------------ */
/*  Local "backend" — prototype persistence via localStorage           */
/* ------------------------------------------------------------------ */
const LS_USERS = 'ps-users'
const LS_HISTORY = 'ps-history'
const LS_RED_ATTEMPTS = 'ps-red-attempts'
const LS_LOCK_UNTIL = 'ps-lock-until'

const RED_ATTEMPT_LIMIT = 3
const LOCK_DURATION_MS = 24 * 60 * 60 * 1000
const HISTORY_LIMIT = 20

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* storage unavailable */ }
}

function findUserByMobile(mobile) {
  return readJSON(LS_USERS, []).find((u) => u.mobile === mobile) || null
}

function findUserById(id) {
  const norm = id.trim().toUpperCase()
  return readJSON(LS_USERS, []).find((u) => u.id.toUpperCase() === norm) || null
}

function saveUser(user) {
  const users = readJSON(LS_USERS, [])
  users.push(user)
  writeJSON(LS_USERS, users)
}

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function formatDuration(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000))
  const h = String(Math.floor(total / 3600)).padStart(2, '0')
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0')
  const s = String(total % 60).padStart(2, '0')
  return `${h}:${m}:${s}`
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function genId(prefix) {
  return prefix + '-' + Math.random().toString(36).slice(2, 8).toUpperCase()
}

function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect() } },
      { threshold: 0.18 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, visible]
}

function Reveal({ children, delay = 0, className = '' }) {
  const [ref, visible] = useReveal()
  return (
    <div ref={ref} className={`ps-reveal ${visible ? 'ps-in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Illustrations                                                      */
/* ------------------------------------------------------------------ */
function GateIllustration({ lifted }) {
  return (
    <svg className="ps-gate-illo" viewBox="0 0 340 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="170" cy="190" rx="150" ry="14" fill="rgba(20,30,55,0.1)" />
      <path d="M20 150 Q170 60 320 150" stroke="rgba(20,30,55,0.22)" strokeWidth="3" strokeDasharray="2 10" fill="none" />
      <rect x="40" y="150" width="10" height="46" rx="2" fill="#3A4256" />
      <rect x="290" y="150" width="10" height="46" rx="2" fill="#3A4256" />
      <circle cx="45" cy="140" r="7" fill="#E8871E" />
      <circle cx="295" cy="140" r="7" fill="#E8871E" />
      <g style={{ transformOrigin: '45px 140px', transform: lifted ? 'rotate(-58deg)' : 'rotate(0deg)', transition: 'transform 1.1s cubic-bezier(.2,.9,.25,1) .5s' }}>
        <rect x="45" y="136" width="250" height="8" rx="4" fill="#FFFFFF" stroke="#E3D9C2" />
        <rect x="45" y="136" width="26" height="8" fill="#C1442E" />
        <rect x="97" y="136" width="26" height="8" fill="#C1442E" />
        <rect x="149" y="136" width="26" height="8" fill="#C1442E" />
      </g>
      <rect x="20" y="188" width="300" height="4" rx="2" fill="rgba(20,30,55,0.14)" />
    </svg>
  )
}

function BridgeIllustration() {
  return (
    <svg className="ps-bridge-illo" viewBox="0 0 420 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 170 C 90 60, 330 60, 400 170" stroke="#E8871E" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M20 170 C 90 60, 330 60, 400 170" stroke="rgba(245,239,225,0.25)" strokeWidth="1" fill="none" />
      {[60, 110, 160, 210, 260, 310, 360].map((x, i) => (
        <line key={i} x1={x} y1={170} x2={x} y2={x > 210 ? 105 + (x - 210) * 0.25 : 105 + (210 - x) * 0.25} stroke="rgba(245,239,225,0.4)" strokeWidth="2" />
      ))}
      <rect x="10" y="170" width="400" height="10" rx="3" fill="#F5EFE1" />
      <circle cx="60" cy="170" r="5" fill="#3F7D5C" />
      <circle cx="360" cy="170" r="5" fill="#3F7D5C" />
    </svg>
  )
}

function IdCardPreview({ name, id, lang }) {
  return (
    <div className="ps-idcard">
      <div className="ps-idcard-top">
        <Landmark size={16} />
        <span>PramaanSetu · {lang === 'hi' ? 'नागरिक ID' : 'Citizen ID'}</span>
      </div>
      <div className="ps-idcard-body">
        <div className="ps-idcard-avatar"><UserCircle2 size={30} /></div>
        <div>
          <strong>{name || (lang === 'hi' ? 'आपका नाम' : 'Your name')}</strong>
          <span className="ps-idcard-id">{id || 'PS-XXXXXX'}</span>
        </div>
      </div>
      <div className="ps-idcard-strip" />
    </div>
  )
}

/* Developer card for the home-page "Meet the developers" section.
   Uses an initials avatar as a placeholder — swap for an <img> when real photos are ready. */
function DevCard({ initials, name, role, bio }) {
  return (
    <div className="ps-dev-card">
      <div className="ps-dev-avatar"><span>{initials}</span></div>
      <strong className="ps-dev-name">{name}</strong>
      <span className="ps-dev-role">{role}</span>
      <p className="ps-dev-bio">{bio}</p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Emoji reaction (replaces the traffic light)                        */
/* ------------------------------------------------------------------ */
const EMOJI_MAP = {
  idle: '😔',
  scanning: '🤔',
  green: '😄',
  amber: '😕',
  red: '😠',
}

function EmojiSignal({ stage, verdict }) {
  const key = stage === 'scanning' ? 'scanning' : stage === 'done' ? verdict : 'idle'
  return (
    <div className={`ps-emoji-signal ps-emoji-${key}`}>
      <span className="ps-emoji-face" role="img" aria-label={key}>{EMOJI_MAP[key]}</span>
    </div>
  )
}

/* A small round emoji badge that sits in the corner of a thumbnail —
   used on the history list, mirroring the reviewer-dashboard style. */
function EmojiCornerBadge({ verdict }) {
  const key = verdict || 'idle'
  return (
    <span className={`ps-corner-badge ps-corner-${key}`} role="img" aria-label={key}>
      {EMOJI_MAP[key]}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Skeletons                                                          */
/* ------------------------------------------------------------------ */
function Bar({ w, h = 14, r = 6, style }) {
  return <span className="ps-skel" style={{ width: w, height: h, borderRadius: r, ...style }} />
}

function AppSkeleton() {
  return (
    <div className="ps-skeleton">
      <div className="ps-skel-nav">
        <Bar w={150} h={22} />
        <div className="ps-skel-nav-right">
          <Bar w={90} h={16} />
          <Bar w={140} h={34} r={17} />
        </div>
      </div>
      <div className="ps-skel-hero">
        <Bar w={200} h={14} r={20} />
        <Bar w="70%" h={40} style={{ marginTop: 14 }} />
        <Bar w="55%" h={40} style={{ marginTop: 8 }} />
        <Bar w="80%" h={16} style={{ marginTop: 18 }} />
        <Bar w="60%" h={16} style={{ marginTop: 8 }} />
        <div className="ps-skel-hero-actions">
          <Bar w={180} h={48} r={26} />
          <Bar w={150} h={48} r={26} />
        </div>
      </div>
      <div className="ps-skel-cards">
        {[0, 1, 2].map((i) => (
          <div className="ps-skel-card" key={i}>
            <Bar w={40} h={40} r={12} />
            <Bar w="70%" h={16} style={{ marginTop: 14 }} />
            <Bar w="90%" h={12} style={{ marginTop: 8 }} />
            <Bar w="50%" h={12} style={{ marginTop: 6 }} />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main App                                                           */
/* ------------------------------------------------------------------ */
function App() {
  const [appLoading, setAppLoading] = useState(true)
  const [screen, setScreen] = useState(0)
  const [lang, setLang] = useState(localStorage.getItem('ps-lang') || 'en')
  const [menuOpen, setMenuOpen] = useState(false)
  const [gateLifted, setGateLifted] = useState(false)

  const [service, setService] = useState('birth')

  const [authTab, setAuthTab] = useState('register')
  const [loginMethod, setLoginMethod] = useState('id') // 'id' | 'mobile'
  const [regName, setRegName] = useState('')
  const [regMobile, setRegMobile] = useState('')
  const [loginId, setLoginId] = useState('')
  const [loginMobile, setLoginMobile] = useState('')
  const [authNotice, setAuthNotice] = useState('')
  const [user, setUser] = useState(null)

  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [checkStage, setCheckStage] = useState('idle') // idle | scanning | done
  const [verdict, setVerdict] = useState(null) // green | amber | red
  const [risk, setRisk] = useState(null)
  const [detectionMeta, setDetectionMeta] = useState(null) // { label, source }
  const [notice, setNotice] = useState('')

  const [history, setHistory] = useState(() => readJSON(LS_HISTORY, []))
  const [lockUntil, setLockUntil] = useState(() => {
    const stored = readJSON(LS_LOCK_UNTIL, null)
    return stored && stored > Date.now() ? stored : null
  })
  const [lockLabel, setLockLabel] = useState('')

  const [requestNo, setRequestNo] = useState('')
  const input = useRef(null)
  const t = copy[lang]

  const isLocked = !!lockUntil && lockUntil > Date.now()

  useEffect(() => {
    const timer = setTimeout(() => setAppLoading(false), 1400)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!appLoading) {
      const g = setTimeout(() => setGateLifted(true), 120)
      return () => clearTimeout(g)
    }
  }, [appLoading])

  useEffect(() => localStorage.setItem('ps-lang', lang), [lang])
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

  // Tick the upload-lock countdown once a second while a lock is active,
  // and clear it automatically the moment the 24 hours are up.
  useEffect(() => {
    if (!lockUntil) { setLockLabel(''); return }
    const tick = () => {
      const remaining = lockUntil - Date.now()
      if (remaining <= 0) {
        localStorage.removeItem(LS_LOCK_UNTIL)
        localStorage.removeItem(LS_RED_ATTEMPTS)
        setLockUntil(null)
        setLockLabel('')
      } else {
        setLockLabel(formatDuration(remaining))
      }
    }
    tick()
    const iv = setInterval(tick, 1000)
    return () => clearInterval(iv)
  }, [lockUntil])

  const goToStart = () => setScreen(user ? 2 : 1)

  const selectFile = (chosen) => {
    if (!chosen || isLocked) return
    setFile(chosen)
    setPreview(URL.createObjectURL(chosen))
    setCheckStage('idle')
    setVerdict(null)
    setRisk(null)
    setDetectionMeta(null)
    setNotice('')
  }

  // Records a completed screening in local history, and — if it was
  // flagged as AI-generated — counts it toward the 3-strike upload lock.
  const registerCompletedCheck = async (r, verdictKey, meta) => {
    try {
      const thumb = file ? await fileToDataURL(file) : null
      const entry = {
        id: genId('H'),
        name: file?.name || 'document.jpg',
        date: new Date().toISOString(),
        verdict: verdictKey,
        risk: r,
        thumb,
      }
      const nextHistory = [entry, ...history].slice(0, HISTORY_LIMIT)
      setHistory(nextHistory)
      writeJSON(LS_HISTORY, nextHistory)
    } catch { /* thumbnail generation failed — history entry is best-effort */ }

    if (verdictKey === 'red') {
      const now = Date.now()
      const attempts = readJSON(LS_RED_ATTEMPTS, []).filter((ts) => now - ts < LOCK_DURATION_MS)
      attempts.push(now)
      if (attempts.length >= RED_ATTEMPT_LIMIT) {
        const until = now + LOCK_DURATION_MS
        writeJSON(LS_LOCK_UNTIL, until)
        localStorage.removeItem(LS_RED_ATTEMPTS)
        setLockUntil(until)
      } else {
        writeJSON(LS_RED_ATTEMPTS, attempts)
      }
    }
  }

  /*
   * This is the "working" part carried over from the original build:
   * a real call to the local detection API instead of a client-side
   * simulated/random risk score.
   */
  const runCheck = async () => {
    if (isLocked) return
    if (!file) { setNotice(t.errNoFile); return }
    if (!file.type.startsWith('image/')) { setNotice(t.errNotImage); return }

    setNotice('')
    setCheckStage('scanning')
    setVerdict(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch('/api/detect', { method: 'POST', body: formData })
      const isJson = response.headers.get('content-type')?.includes('application/json')
      const payload = isJson ? await response.json() : null

      if (!response.ok) throw new Error(payload?.detail || t.errUnavailable)

      const r = payload.risk
      const nextVerdict = r >= 0.5 ? 'red' : r >= 0.3 ? 'amber' : 'green'
      setRisk(r)
      setDetectionMeta({ label: payload.label, source: payload.model })
      setVerdict(nextVerdict)
      setCheckStage('done')
      registerCompletedCheck(r, nextVerdict, { label: payload.label, source: payload.model })
    } catch (error) {
      setNotice(error.message || t.errGeneric)
      setCheckStage('idle')
    }
  }

  const handleRegister = (e) => {
    e.preventDefault()
    if (!regName.trim()) { setAuthNotice('Please enter your full name.'); return }
    if (!/^\d{10}$/.test(regMobile.trim())) { setAuthNotice('Please enter a valid 10-digit mobile number.'); return }
    if (findUserByMobile(regMobile.trim())) { setAuthNotice(t.errMobileTaken); return }
    const newUser = { name: regName.trim(), mobile: regMobile.trim(), id: genId('PS') }
    saveUser(newUser)
    setUser({ name: newUser.name, id: newUser.id })
    setAuthNotice('')
    setScreen(2)
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (loginMethod === 'id') {
      if (!/^PS-[A-Z0-9]{4,8}$/.test(loginId.trim().toUpperCase())) { setAuthNotice('Enter a Citizen ID in the format PS-XXXXXX.'); return }
      const found = findUserById(loginId.trim())
      if (!found) { setAuthNotice(t.errIdNotFound); return }
      setUser({ name: found.name, id: found.id })
    } else {
      if (!/^\d{10}$/.test(loginMobile.trim())) { setAuthNotice('Please enter a valid 10-digit mobile number.'); return }
      const found = findUserByMobile(loginMobile.trim())
      if (!found) { setAuthNotice(t.errMobileNotFound); return }
      setUser({ name: found.name, id: found.id })
    }
    setAuthNotice('')
    setScreen(2)
  }

  const submitApplication = () => {
    const d = new Date()
    const stamp = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
    setRequestNo(`PS-${stamp}-${Math.floor(100 + Math.random() * 900)}`)
    setScreen(5)
  }

  const resetAll = () => {
    setScreen(0); setFile(null); setPreview(null); setCheckStage('idle'); setVerdict(null); setNotice('')
  }

  const setLanguage = (next) => { setLang(next); setMenuOpen(false) }

  const step = Math.max(0, Math.min(3, screen === 1 ? 0 : screen - 1))
  const showProgress = screen > 0 && screen < 5

  return (
    <div className="ps-app">
      <header className="ps-topbar">
        <button className="ps-brand" onClick={() => !appLoading && setScreen(0)} aria-label="PramaanSetu home">
          <span className="ps-brand-mark"><Landmark size={18} /></span>
          <span>Pramaan<span>Setu</span></span>
        </button>
        <div className="ps-topbar-right">
          {user && (
            <button className="ps-history-nav" onClick={() => setScreen(6)}>
              <HistoryIcon size={16} />{t.navHistory}
            </button>
          )}
          <div className="ps-language">
            <button onClick={() => setMenuOpen(!menuOpen)}><Globe2 size={16} />{t.name}<ChevronDown size={14} /></button>
            {menuOpen && (
              <div className="ps-language-menu">
                <button onClick={() => setLanguage('en')}>English</button>
                <button onClick={() => setLanguage('hi')}>हिन्दी</button>
              </div>
            )}
          </div>
          {user ? (
            <div className="ps-user-chip">
              <UserCircle2 size={18} />
              <span>{t.hiThere}, {user.name.split(' ')[0]} · <b>{user.id}</b></span>
            </div>
          ) : (
            <button className="ps-signin-btn" onClick={() => setScreen(1)}>
              <UserPlus size={16} />{t.signIn}
            </button>
          )}
        </div>
      </header>

      {showProgress && (
        <div className="ps-progress-wrap">
          <div className="ps-progress-label"><span>{t.application}</span><span>{t.stepOf(step)}</span></div>
          <div className="ps-progress"><i style={{ width: `${(step / 3) * 100}%` }} /></div>
        </div>
      )}

      {appLoading ? <AppSkeleton /> : (
        <main key={screen} className="ps-screen-in">

          {screen === 0 && (
            <>
              <section className="ps-hero-wrap">
                <div className="ps-hero">
                  <div className="ps-eyebrow"><Sparkles size={14} /> {lang === 'hi' ? 'एक सरल सार्वजनिक-सेवा अनुभव' : 'A simpler public-service experience'}</div>
                  <h1>{t.heading.split('\n').map((line, i) => <React.Fragment key={i}>{line}{i === 0 && <br />}</React.Fragment>)}</h1>
                  <p>{t.sub}</p>
                  <div className="ps-hero-actions">
                    <button className="ps-primary" onClick={goToStart}>{t.start}<ArrowRight size={18} /></button>
                    <button className="ps-text-button"><HelpCircle size={18} />{t.help}</button>
                  </div>
                  <div className="ps-assurance"><ShieldCheck size={18} /><span>{t.assurance}</span></div>
                  <div className="ps-hero-stats">
                    <div><strong>3</strong><span>{t.statServices}</span></div>
                    <div><strong>~2</strong><span>{t.statCheck}</span></div>
                    <div><strong>0</strong><span>{t.statStore}</span></div>
                  </div>
                </div>

                <div className="ps-hero-banner">
                  <div className="ps-hero-banner-card">
                    <div className="ps-eyebrow ps-eyebrow-dark">{t.heroBannerEyebrow}</div>
                    <GateIllustration lifted={gateLifted} />
                    <h3>{t.heroBannerTitle}</h3>
                    <p>{t.heroBannerBody}</p>
                    <div className="ps-hero-banner-chips">
                      <span className="ps-hero-banner-chip"><ShieldCheck size={14} />{t.heroBannerChip1}</span>
                      <span className="ps-hero-banner-chip"><Lock size={14} />{t.heroBannerChip2}</span>
                    </div>
                  </div>
                </div>
              </section>

              <Reveal className="ps-about">
                <div className="ps-about-copy">
                  <div className="ps-eyebrow ps-eyebrow-dark"><Sparkles size={14} /> {t.aboutEyebrow}</div>
                  <h2>{t.aboutTitle}</h2>
                  <p>{t.aboutBody1}</p>
                  <p>{t.aboutBody2}</p>
                </div>
                <div className="ps-about-illo"><BridgeIllustration /></div>
              </Reveal>

              <section className="ps-features">
                <div className="ps-eyebrow ps-eyebrow-dark"><Star size={14} /> {t.featuresEyebrow}</div>
                <div className="ps-feature-grid">
                  <Reveal delay={0}><div className="ps-feature-card"><span className="ps-feature-icon"><FileCheck2 size={22} /></span><strong>{t.f1Title}</strong><p>{t.f1Body}</p></div></Reveal>
                  <Reveal delay={100}><div className="ps-feature-card"><span className="ps-feature-icon"><ScanLine size={22} /></span><strong>{t.f2Title}</strong><p>{t.f2Body}</p></div></Reveal>
                  <Reveal delay={200}><div className="ps-feature-card"><span className="ps-feature-icon"><CreditCard size={22} /></span><strong>{t.f3Title}</strong><p>{t.f3Body}</p></div></Reveal>
                </div>
              </section>

              <section className="ps-team">
                <div className="ps-eyebrow ps-eyebrow-dark"><UserCircle2 size={14} /> {t.teamEyebrow}</div>
                <h2>{t.teamTitle}</h2>
                <p className="ps-team-sub">{t.teamSub}</p>
                <div className="ps-team-grid">
                  {TEAM.map((dev, i) => (
                    <Reveal delay={i * 100} key={dev.nameKey}>
                      <DevCard initials={dev.initials} name={t[dev.nameKey]} role={t[dev.roleKey]} bio={t[dev.bioKey]} />
                    </Reveal>
                  ))}
                </div>
              </section>
            </>
          )}

          {screen === 1 && (
            <section className="ps-flow ps-flow-auth">
              <button className="ps-back" onClick={() => setScreen(0)}><ArrowLeft size={18} />{t.back}</button>
              <div className="ps-flow-grid">
                <div>
                  <div className="ps-flow-heading">
                    <div className="ps-step-icon"><KeyRound size={22} /></div>
                    <div className="ps-eyebrow ps-eyebrow-dark">{t.authEyebrow}</div>
                    <h2>{t.authTitle}</h2>
                    <p>{t.authSub}</p>
                  </div>

                  <div className="ps-tabs">
                    <button className={authTab === 'register' ? 'ps-tab-active' : ''} onClick={() => { setAuthTab('register'); setAuthNotice('') }}><UserPlus size={15} />{t.tabRegister}</button>
                    <button className={authTab === 'login' ? 'ps-tab-active' : ''} onClick={() => { setAuthTab('login'); setAuthNotice('') }}><LogIn size={15} />{t.tabLogin}</button>
                  </div>

                  {authTab === 'register' ? (
                    <form className="ps-form" onSubmit={handleRegister}>
                      <label>{t.fieldName}
                        <input value={regName} onChange={(e) => setRegName(e.target.value)} placeholder={t.fieldNamePh} />
                      </label>
                      <label>{t.fieldMobile}
                        <input value={regMobile} onChange={(e) => setRegMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder={t.fieldMobilePh} inputMode="numeric" />
                      </label>
                      {authNotice && <p className="ps-notice"><CircleAlert size={16} />{authNotice}</p>}
                      <button className="ps-primary ps-full" type="submit">{t.registerBtn}<ArrowRight size={18} /></button>
                    </form>
                  ) : (
                    <form className="ps-form" onSubmit={handleLogin}>
                      <div className="ps-login-method">
                        <button type="button" className={loginMethod === 'id' ? 'ps-method-active' : ''} onClick={() => { setLoginMethod('id'); setAuthNotice('') }}><KeyRound size={14} />{t.loginWithId}</button>
                        <button type="button" className={loginMethod === 'mobile' ? 'ps-method-active' : ''} onClick={() => { setLoginMethod('mobile'); setAuthNotice('') }}><Phone size={14} />{t.loginWithMobile}</button>
                      </div>

                      {loginMethod === 'id' ? (
                        <label>{t.citizenId}
                          <input value={loginId} onChange={(e) => setLoginId(e.target.value)} placeholder={t.fieldIdPh} />
                        </label>
                      ) : (
                        <label>{t.fieldMobile}
                          <input value={loginMobile} onChange={(e) => setLoginMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder={t.fieldMobileLoginPh} inputMode="numeric" />
                        </label>
                      )}

                      {loginMethod === 'id' && <p className="ps-hint"><Info size={13} />{t.idUnknownHint}</p>}

                      {authNotice && <p className="ps-notice"><CircleAlert size={16} />{authNotice}</p>}
                      <button className="ps-primary ps-full" type="submit">{loginMethod === 'id' ? t.loginBtn : t.loginMobileBtn}<ArrowRight size={18} /></button>
                    </form>
                  )}
                  <p className="ps-small-note"><Info size={14} />{t.authNote}</p>
                </div>

                <div className="ps-idcard-preview-wrap">
                  <IdCardPreview name={regName} id={user?.id} lang={lang} />
                </div>
              </div>
            </section>
          )}

          {screen === 2 && (
            <section className="ps-flow">
              <button className="ps-back" onClick={() => setScreen(0)}><ArrowLeft size={18} />{t.back}</button>
              <div className="ps-flow-heading">
                <div className="ps-step-icon"><FileCheck2 size={22} /></div>
                <h2>{t.choose}</h2>
                <p>{t.chooseSub}</p>
              </div>
              <div className="ps-service-list">
                {SERVICES.map(({ key, Icon }) => (
                  <button key={key} className={`ps-service ${service === key ? 'ps-selected' : ''}`} onClick={() => setService(key)}>
                    <span className="ps-service-icon"><Icon size={22} /></span>
                    <span><strong>{t[key]}</strong><small>{t[`${key}Sub`]}</small></span>
                    <span className="ps-radio">{service === key && <i />}</span>
                  </button>
                ))}
              </div>
              <button className="ps-primary ps-continue" onClick={() => setScreen(3)}>{t.continueBtn}<ArrowRight size={18} /></button>
            </section>
          )}

          {screen === 3 && (
            <section className="ps-flow ps-flow-check">
              <button className="ps-back" onClick={() => setScreen(2)}><ArrowLeft size={18} />{t.back}</button>
              <div className="ps-flow-heading">
                <div className="ps-step-icon"><Camera size={22} /></div>
                <h2>{t.document}</h2>
                <p>{t.docSub}</p>
              </div>

              {isLocked ? (
                <div className="ps-upload-locked">
                  <span className="ps-upload-locked-icon"><Lock size={22} /></span>
                  <strong>{t.lockedTitle}</strong>
                  <p>{t.lockedBody}</p>
                  <div className="ps-lock-timer"><Clock size={15} />{t.lockedCountdownLabel}: <b>{lockLabel}</b></div>
                  <button className="ps-text-button" onClick={() => setScreen(0)}>{t.lockedBackHome}</button>
                </div>
              ) : (
                <div className="ps-check-grid">
                  <div className="ps-check-left">
                    <div className="ps-upload-card ps-upload-card-wide">
                      {preview ? (
                        <>
                          <img src={preview} alt="Selected document preview" className={checkStage === 'scanning' ? 'ps-scanning-img' : ''} />
                          {checkStage === 'scanning' && <span className="ps-scan-line" />}
                          <span className="ps-file-badge"><FileImage size={13} />{file?.name}</span>
                          <button className="ps-remove" onClick={() => { setFile(null); setPreview(null); setCheckStage('idle'); setVerdict(null); setDetectionMeta(null) }}><X size={16} />{t.remove}</button>
                        </>
                      ) : (
                        <button className="ps-upload-empty" onClick={() => input.current?.click()}>
                          <span><Upload size={24} /></span>
                          <strong>{t.uploadEmptyTitle}</strong>
                          <small>{t.uploadEmptySub}</small>
                        </button>
                      )}
                      <input ref={input} className="ps-file-input" type="file" accept="image/*" capture="environment" onChange={(e) => selectFile(e.target.files?.[0])} />
                    </div>

                    {notice && <p className="ps-notice"><CircleAlert size={16} />{notice}</p>}

                    <button
                      className="ps-primary ps-continue"
                      disabled={checkStage === 'scanning'}
                      onClick={
                        checkStage === 'done'
                          ? (verdict === 'red' ? () => { setFile(null); setPreview(null); setCheckStage('idle'); setVerdict(null); setDetectionMeta(null); input.current?.click() } : () => setScreen(4))
                          : runCheck
                      }
                    >
                      {checkStage === 'scanning' ? <><LoaderCircle className="ps-spin" size={18} />{t.scanning}</>
                        : checkStage === 'done'
                          ? (verdict === 'red' ? <><RefreshCw size={18} />{t.reupload}</> : <>{t.continueBtn}<ArrowRight size={18} /></>)
                          : <><ScanLine size={18} />{t.runCheck}</>}
                    </button>

                    <p className="ps-small-note"><Info size={14} />{t.smallNote}</p>

                    {history.length > 0 && (
                      <div className="ps-recent-block">
                        <div className="ps-recent-head">
                          <strong>{t.historyTitle}</strong>
                          <button className="ps-recent-viewall" onClick={() => setScreen(6)}>{lang === 'hi' ? 'सभी इतिहास देखें' : 'View all history'}<ArrowRight size={13} /></button>
                        </div>
                        <div className="ps-recent-list">
                          {history.slice(0, 3).map((h) => (
                            <div className="ps-recent-item" key={h.id}>
                              <div className="ps-recent-thumb">
                                {h.thumb ? <img src={h.thumb} alt="" /> : <FileImage size={18} />}
                                <EmojiCornerBadge verdict={h.verdict} />
                              </div>
                              <div className="ps-recent-info">
                                <strong>{h.name}</strong>
                                <span>{new Date(h.date).toLocaleString(lang === 'hi' ? 'hi-IN' : 'en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                              </div>
                              <div className={`ps-history-pill ps-history-pill-${h.verdict}`}>
                                {h.verdict === 'green' && t.signalGreen}
                                {h.verdict === 'amber' && t.signalAmber}
                                {h.verdict === 'red' && t.signalRed}
                              </div>
                              <div className="ps-history-risk">{Math.round((h.risk || 0) * 100)}%</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <aside className="ps-check-right">
                    <div className="ps-result-card">
                      <div className="ps-result-head">
                        <span><ScanLine size={16} />{t.analysisResult}</span>
                        {checkStage === 'done' && <span className="ps-result-status">{t.analysisCompleted}</span>}
                      </div>

                      <div className={`ps-result-body ps-result-body-${checkStage === 'done' ? verdict : 'idle'}`}>
                        <div className="ps-result-face-wrap">
                          <span className="ps-result-face" role="img" aria-label={checkStage}>
                            {checkStage === 'scanning' ? EMOJI_MAP.scanning : checkStage === 'done' ? EMOJI_MAP[verdict] : EMOJI_MAP.idle}
                          </span>
                          {checkStage === 'done' && <EmojiCornerBadge verdict={verdict} />}
                        </div>
                        <div className="ps-result-copy">
                          <strong>
                            {checkStage === 'idle' && t.signalIdle}
                            {checkStage === 'scanning' && t.signalScanning}
                            {checkStage === 'done' && verdict === 'green' && t.signalGreen}
                            {checkStage === 'done' && verdict === 'amber' && t.signalAmber}
                            {checkStage === 'done' && verdict === 'red' && t.signalRed}
                          </strong>
                          {checkStage === 'done' && <span className="ps-result-pct">{Math.round((risk || 0) * 100)}%</span>}
                        </div>
                        {checkStage === 'done' && (
                          <div className="ps-result-bar">
                            <i style={{ width: `${Math.round((risk || 0) * 100)}%` }} />
                          </div>
                        )}
                        {checkStage === 'done' && (
                          <div className="ps-result-scale">
                            <span>0%</span><span>{t.aiGenProb}</span><span>100%</span>
                          </div>
                        )}
                      </div>

                      {checkStage === 'done' && (
                        <div className={`ps-result-explainer ps-result-explainer-${verdict}`}>
                          <strong>{t.whatMeans}</strong>
                          <p>
                            {verdict === 'green' && t.verdictGreenBody}
                            {verdict === 'amber' && t.verdictAmberBody}
                            {verdict === 'red' && t.verdictRedBody}
                          </p>
                          <p className="ps-result-caveat">{t.whatMeansCaveat}</p>
                        </div>
                      )}

                      {checkStage === 'done' && (
                        <div className="ps-result-details">
                          <strong>{t.analysisDetails}</strong>
                          <div className="ps-result-details-grid">
                            <span>{t.modelUsed}</span><span>{detectionMeta?.source || '—'}</span>
                            <span>{t.modeLabel}</span><span>{t.modeValue}</span>
                            <span>{t.analyzedAt}</span><span>{new Date().toLocaleString(lang === 'hi' ? 'hi-IN' : 'en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                            <span>{t.device}</span><span>CPU</span>
                          </div>
                        </div>
                      )}

                      <div className="ps-result-private">
                        <ShieldCheck size={16} />
                        <span><strong>{t.privateTitle}</strong>{t.privateBody}</span>
                      </div>
                    </div>
                  </aside>
                </div>
              )}
            </section>
          )}

          {screen === 4 && (
            <section className="ps-flow">
              <button className="ps-back" onClick={() => setScreen(3)}><ArrowLeft size={18} />{t.back}</button>
              <div className="ps-flow-heading">
                <div className="ps-step-icon"><BadgeCheck size={22} /></div>
                <h2>{t.review}</h2>
                <p>{t.reviewSub}</p>
              </div>
              <div className="ps-summary">
                <div><span>{t.service}</span><strong>{t[service]}</strong></div>
                <div><span>{t.applicant}</span><strong>{user?.name || (lang === 'hi' ? 'नागरिक' : 'Sample citizen')}</strong></div>
                <div><span>{t.citizenId}</span><strong>{user?.id || '—'}</strong></div>
                <div><span>{t.document2}</span><strong>{file?.name || 'Document photo'}</strong><FileImage size={18} /></div>
                <div><span>{t.photoReview}</span><strong className="ps-verified"><Check size={15} />{t.verified}</strong></div>
              </div>
              <div className="ps-prototype-callout"><Info size={18} /><span><strong>{t.prototypeTitle}</strong>{t.prototypeBody}</span></div>
              <button className="ps-primary ps-continue" onClick={submitApplication}>{t.submit}<ArrowRight size={18} /></button>
            </section>
          )}

          {screen === 5 && (
            <section className="ps-success">
              <div className="ps-ticket">
                <div className="ps-ticket-main">
                  <div className="ps-success-icon"><Check size={30} /></div>
                  <div className="ps-eyebrow ps-eyebrow-dark">{t.requestNo} · {requestNo}</div>
                  <h1>{t.received}</h1>
                  <p>{t.receivedSub}</p>
                </div>
                <div className="ps-ticket-perf" />
                <div className="ps-ticket-stub">
                  <div><span>{t.service}</span><strong>{t[service]}</strong></div>
                  <div><span>{t.status}</span><strong className="ps-verified"><Check size={14} />{t.submitted}</strong></div>
                  <div><span>{t.nextUpdate}</span><strong>{t.within2}</strong></div>
                </div>
              </div>
              <button className="ps-primary" onClick={resetAll}>{t.returnHome}</button>
              <p className="ps-mock-label">{t.mockLabel}</p>
            </section>
          )}

          {screen === 6 && (
            <section className="ps-flow ps-flow-history">
              <button className="ps-back" onClick={() => setScreen(0)}><ArrowLeft size={18} />{t.historyBack}</button>
              <div className="ps-flow-heading">
                <div className="ps-step-icon"><HistoryIcon size={22} /></div>
                <h2>{t.historyTitle}</h2>
                <p>{t.historySub}</p>
              </div>

              {history.length === 0 ? (
                <div className="ps-history-empty">
                  <span><ScanLine size={22} /></span>
                  <strong>{t.historyEmptyTitle}</strong>
                  <p>{t.historyEmptyBody}</p>
                </div>
              ) : (
                <div className="ps-history-list">
                  {history.map((h) => (
                    <div className="ps-history-item" key={h.id}>
                      <div className="ps-history-thumb">
                        {h.thumb ? <img src={h.thumb} alt="" /> : <FileImage size={20} />}
                        <EmojiCornerBadge verdict={h.verdict} />
                      </div>
                      <div className="ps-history-info">
                        <strong>{h.name}</strong>
                        <span>{new Date(h.date).toLocaleString(lang === 'hi' ? 'hi-IN' : 'en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                      </div>
                      <div className={`ps-history-pill ps-history-pill-${h.verdict}`}>
                        {h.verdict === 'green' && t.signalGreen}
                        {h.verdict === 'amber' && t.signalAmber}
                        {h.verdict === 'red' && t.signalRed}
                      </div>
                      <div className="ps-history-risk">{Math.round((h.risk || 0) * 100)}%</div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          <footer className="ps-footer">
            <span>{t.footerNote}</span>
            <button>{t.accessibility}</button>
            <button>{t.privacy}</button>
          </footer>
        </main>
      )}
    </div>
  )
}

export default App

createRoot(document.getElementById('root')).render(<App />)// import React, { useEffect, useRef, useState } from 'react'
// import { createRoot } from 'react-dom/client'
// import { ArrowLeft, ArrowRight, Camera, Check, ChevronDown, CircleAlert, FileCheck2, FileImage, Globe2, HelpCircle, Info, LoaderCircle, LockKeyhole, ScanLine, ShieldCheck, Sparkles, Upload, X } from 'lucide-react'
// import './styles.css'

// const copies = {
//   en: { name: 'English', heading: 'Apply for your certificate\nwithout the confusion.', sub: 'Answer a few simple questions. We will check your documents before you submit.', start: 'Start application', help: 'How this works', choose: 'Choose a service', chooseSub: 'What would you like to do today?', birth: 'Birth certificate', birthSub: 'Request a new or corrected copy', income: 'Income certificate', incomeSub: 'Apply with your household details', domicile: 'Domicile certificate', domicileSub: 'Get proof of residence', document: 'Add your document', docSub: 'A clear photo helps prevent a rejection later.', review: 'Check my photo', submit: 'Submit application', received: 'Your request has been received.', receivedSub: 'We will keep you updated. You can return anytime with this request number.' },
//   hi: { name: 'हिन्दी', heading: 'अपना प्रमाणपत्र आवेदन\nअब आसानी से करें।', sub: 'कुछ आसान सवालों के जवाब दें। जमा करने से पहले हम आपके दस्तावेज़ जाँचेंगे।', start: 'आवेदन शुरू करें', help: 'यह कैसे काम करता है', choose: 'सेवा चुनें', chooseSub: 'आप आज क्या करना चाहते हैं?', birth: 'जन्म प्रमाणपत्र', birthSub: 'नई या संशोधित प्रति का अनुरोध', income: 'आय प्रमाणपत्र', incomeSub: 'परिवार की जानकारी के साथ आवेदन', domicile: 'निवास प्रमाणपत्र', domicileSub: 'निवास का प्रमाण लें', document: 'अपना दस्तावेज़ जोड़ें', docSub: 'एक साफ़ फोटो से बाद में अस्वीकृति से बचाव होता है।', review: 'मेरी फोटो जाँचें', submit: 'आवेदन जमा करें', received: 'आपका अनुरोध प्राप्त हो गया है।', receivedSub: 'हम आपको अपडेट रखेंगे। इस अनुरोध संख्या से कभी भी वापस आएँ।' }
// }

// function App() {
//   const [screen, setScreen] = useState(0)
//   const [lang, setLang] = useState(localStorage.getItem('ps-lang') || 'en')
//   const [menuOpen, setMenuOpen] = useState(false)
//   const [service, setService] = useState('birth')
//   const [file, setFile] = useState(null)
//   const [preview, setPreview] = useState(null)
//   const [checking, setChecking] = useState(false)
//   const [checks, setChecks] = useState(null)
//   const [notice, setNotice] = useState('')
//   const input = useRef(null)
//   const t = copies[lang]

//   useEffect(() => localStorage.setItem('ps-lang', lang), [lang])
//   useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview])
//   const step = Math.max(0, screen - 1)
//   const selectFile = (chosen) => {
//     if (!chosen) return
//     setFile(chosen); setPreview(URL.createObjectURL(chosen)); setChecks(null); setNotice('')
//   }
//   const checkPhoto = async () => {
//     if (!file) return setNotice('Please add a document photo first.')
//     if (!file.type.startsWith('image/')) return setNotice('AI screening supports JPG, PNG, and camera images. Please upload an image instead of a PDF.')
//     setChecking(true); setNotice('')
//     try {
//       const formData = new FormData()
//       formData.append('file', file)
//       const response = await fetch('/api/detect', { method: 'POST', body: formData })
//       const isJson = response.headers.get('content-type')?.includes('application/json')
//       const payload = isJson ? await response.json() : null
//       if (!response.ok) throw new Error(payload?.detail || 'AI screening is unavailable. Start the local Python API on port 8000, then try again.')
//       setChecks({ risk: payload.risk, label: payload.label, source: payload.model })
//     } catch (error) {
//       setNotice(error.message || 'The live AI check was unavailable. Please try again.')
//     } finally { setChecking(false) }
//   }
//   const setLanguage = (next) => { setLang(next); setMenuOpen(false) }

//   return <main>
//     <header className="topbar"><button className="brand" onClick={() => setScreen(0)} aria-label="PramaanSetu home"><span className="brand-mark"><Check size={17}/></span><span>Pramaan<span>Setu</span></span></button><div className="language"><button onClick={() => setMenuOpen(!menuOpen)}><Globe2 size={16}/>{t.name}<ChevronDown size={15}/></button>{menuOpen && <div className="language-menu"><button onClick={() => setLanguage('en')}>English</button><button onClick={() => setLanguage('hi')}>हिन्दी</button></div>}</div></header>
//     {screen > 0 && screen < 4 && <div className="progress-wrap"><div className="progress-label"><span>Application</span><span>Step {step} of 3</span></div><div className="progress"><i style={{width: `${(step / 3) * 100}%`}}/></div></div>}

//     {screen === 0 && <section className="hero"><div className="eyebrow"><Sparkles size={15}/> A simpler public-service experience</div><h1>{t.heading.split('\n').map((x,i)=><React.Fragment key={i}>{x}{i===0 && <br/>}</React.Fragment>)}</h1><p>{t.sub}</p><div className="hero-actions"><button className="primary" onClick={() => setScreen(1)}>{t.start}<ArrowRight size={18}/></button><button className="text-button"><HelpCircle size={18}/>{t.help}</button></div><div className="assurance"><ShieldCheck size={18}/><span>Your details stay on this device. This is a safe prototype using sample data.</span></div><div className="hero-card"><div><FileCheck2 size={28}/><strong>Clear steps</strong><span>One question at a time</span></div><div><ScanLine size={28}/><strong>Photo check</strong><span>Catch common errors early</span></div><div><LockKeyhole size={28}/><strong>No sign-in</strong><span>Nothing personal is stored</span></div></div></section>}

//     {screen === 1 && <section className="flow"><button className="back" onClick={() => setScreen(0)}><ArrowLeft size={18}/>Back</button><div className="flow-heading"><div className="step-icon"><FileCheck2 size={24}/></div><h2>{t.choose}</h2><p>{t.chooseSub}</p></div><div className="service-list">{[['birth', FileCheck2], ['income', Info], ['domicile', Globe2]].map(([key, Icon]) => <button key={key} className={`service ${service===key?'selected':''}`} onClick={() => setService(key)}><span className="service-icon"><Icon size={22}/></span><span><strong>{t[key]}</strong><small>{t[`${key}Sub`]}</small></span><span className="radio">{service===key && <i/>}</span></button>)}</div><button className="primary continue" onClick={() => setScreen(2)}>Continue<ArrowRight size={18}/></button></section>}

//     {screen === 2 && <section className="flow"><button className="back" onClick={() => setScreen(1)}><ArrowLeft size={18}/>Back</button><div className="flow-heading"><div className="step-icon"><Camera size={24}/></div><h2>Screen your document image</h2><p>We check for signs that an image may have been generated or altered by AI.</p></div><div className="upload-card">{preview ? <><img src={preview} alt="Selected document preview"/><button className="remove" onClick={() => {setFile(null);setPreview(null);setChecks(null)}}><X size={16}/>Remove</button></> : <button className="upload-empty" onClick={() => input.current?.click()}><span><Upload size={24}/></span><strong>Take a photo or choose an image</strong><small>JPG or PNG · up to 10 MB</small></button>}<input ref={input} type="file" accept="image/*" capture="environment" onChange={e => selectFile(e.target.files?.[0])}/></div>{notice && <p className="notice"><CircleAlert size={16}/>{notice}</p>}{checks && <div className={`detection-result ${checks.risk >= .5 ? 'high-risk' : 'low-risk'}`}><span className="detection-icon">{checks.risk >= .5 ? <CircleAlert size={22}/> : <Check size={22}/>}</span><div><strong>{checks.label}</strong><p>AI-generation risk signal: <b>{Math.round(checks.risk * 100)}%</b></p><small>Result from {checks.source}. This is a screening signal, not proof of document authenticity.</small></div></div>}<button className="primary continue" disabled={checking} onClick={checks ? () => checks.risk >= .5 ? setNotice('Please upload an original document photo before continuing.') : setScreen(3) : checkPhoto}>{checking?<LoaderCircle className="spin" size={18}/> : checks ? checks.risk >= .5 ? <>Upload a different image<Upload size={18}/></> : <>Continue<ArrowRight size={18}/></> : <><ScanLine size={18}/>Run AI-generated image check</>}</button><p className="small-note"><Info size={14}/>The image is sent only to the configured Hugging Face inference model for this check. It is not stored by PramaanSetu.</p></section>}

//     {screen === 3 && <section className="flow"><button className="back" onClick={() => setScreen(2)}><ArrowLeft size={18}/>Back</button><div className="flow-heading"><div className="step-icon"><FileCheck2 size={24}/></div><h2>Review your request</h2><p>Please check this summary before sending it.</p></div><div className="summary"><div><span>Service</span><strong>{t[service]}</strong></div><div><span>Applicant</span><strong>Sample citizen</strong></div><div><span>Document</span><strong>{file?.name || 'Document photo'}</strong><FileImage size={18}/></div><div><span>Photo review</span><strong className="verified"><Check size={15}/>Ready to submit</strong></div></div><div className="prototype-callout"><Info size={18}/><span><strong>Prototype notice</strong>This request will not be sent to a government department. It shows how a safer, clearer journey could work.</span></div><button className="primary continue" onClick={() => setScreen(4)}>{t.submit}<ArrowRight size={18}/></button></section>}

//     {screen === 4 && <section className="success"><div className="success-icon"><Check size={34}/></div><div className="eyebrow">Request number · PS-260824-019</div><h1>{t.received}</h1><p>{t.receivedSub}</p><div className="receipt"><div><span>Service</span><strong>{t[service]}</strong></div><div><span>Status</span><strong className="verified"><Check size={15}/>Submitted</strong></div><div><span>Next update</span><strong>Within 2 working days</strong></div></div><button className="primary" onClick={() => setScreen(0)}>Return to home</button><p className="mock-label">Mock application · No real data submitted</p></section>}
//     <footer><span>PramaanSetu is an independent hackathon prototype, not an official government service.</span><button>Accessibility</button><button>Privacy</button></footer>
//   </main>
// }
// createRoot(document.getElementById('root')).render(<App />)
