import { Language, Translation } from './types';

export const TRANSLATIONS: Record<Language, Translation> = {
  [Language.EN]: {
    title: 'NavalnyGPT',
    chairMode: 'The Chair',
    chat: 'Chat',
    newChat: 'New Chat',
    settings: 'Settings',
    placeholder: 'Write any request...',
    welcome: 'Hello! This is Alexei Navalny\'s chair. Write any request, and I will answer.',
    investigating: 'Thinking...',
    clearChat: 'Clear History',
    memes: 'Meme Mode',
    aggressive: 'Aggressive Mode',
    aggressiveDesc: 'Rude, sarcastic, and toxic responses.',
    autoMode: 'Auto-Persona (AI Decides)',
    autoModeDesc: 'The AI dynamically switches between Regular, Meme, Aggressive, or Chair mode based on your input.',
    language: 'Language',
    theme: 'Theme',
    aboutChair: 'The Chair is the ultimate truth detector. Sit down, stop shaking, and answer the questions.',
    rename: 'Rename',
    save: 'Save',
    cancel: 'Cancel',
    deleteChat: 'Delete',
    deleteConfirm: 'Are you sure you want to delete this chat?',
    baseUrl: 'API Base URL (Proxy)',
    baseUrlDesc: 'Use a custom URL (e.g., Cloudflare Worker) to bypass region blocks without VPN.',
    reasoning: 'Interrogation Logic (Internal Thought Process)',
    homeTitle: 'Welcome to NavalnyGPT',
    homeSubtitle: 'An intelligent, truth-seeking AI assistant powered by the spirit of freedom.',
    startChat: 'Start New Chat',
    openChair: 'Enter The Chair'
  },
  [Language.RU]: {
    title: 'NavalnyGPT',
    chairMode: 'Стул',
    chat: 'Чат',
    newChat: 'Новый чат',
    settings: 'Настройки',
    placeholder: 'Напишите любой запрос...',
    welcome: 'Здравствуйте! Это стул Алексея Навального. Напишите любой запрос, а я отвечу.',
    investigating: 'Думаю...',
    clearChat: 'Очистить историю',
    memes: 'Режим Мемов',
    aggressive: 'Агрессивный режим',
    aggressiveDesc: 'Токсичность, наезды и жесткий сарказм.',
    autoMode: 'Авто-Режим (ИИ решает)',
    autoModeDesc: 'ИИ сам выбирает режим (Обычный, Мемы, Агрессия или Стул) в зависимости от контекста.',
    language: 'Язык',
    theme: 'Тема',
    aboutChair: 'Стул — это место, где заканчивается ложь. Садись, не трясись, отвечай по фактам.',
    rename: 'Переименовать',
    save: 'Сохранить',
    cancel: 'Отмена',
    deleteChat: 'Удалить',
    deleteConfirm: 'Вы уверены, что хотите удалить этот чат?',
    baseUrl: 'API Базовый URL (Прокси)',
    baseUrlDesc: 'Используйте свой URL (например, прокси) для обхода блокировок без VPN.',
    reasoning: 'Логика допроса (Мысли)',
    homeTitle: 'Добро пожаловать в NavalnyGPT',
    homeSubtitle: 'Умный ИИ-помощник, заряженный духом свободы и поиска правды.',
    startChat: 'Начать новый чат',
    openChair: 'Войти в Стул'
  },
  [Language.ES]: {
    title: 'NavalnyGPT',
    chairMode: 'La Silla',
    chat: 'Chat',
    newChat: 'Nuevo Chat',
    settings: 'Ajustes',
    placeholder: 'Escribe cualquier petición...',
    welcome: '¡Hola! Soy la silla de Alexei Navalny. Escribe cualquier petición y te responderé.',
    investigating: 'Pensando...',
    clearChat: 'Borrar Historial',
    memes: 'Modo Memes',
    aggressive: 'Modo Agresivo',
    aggressiveDesc: 'Respuestas groseras, sarcásticas y tóxicas.',
    autoMode: 'Modo Auto (IA Decide)',
    autoModeDesc: 'La IA cambia dinámicamente entre Regular, Memes, Agresivo o Silla.',
    language: 'Idioma',
    theme: 'Tema',
    aboutChair: 'La Silla es el detector de verdad definitivo. Siéntate y deja de temblar.',
    rename: 'Renombrar',
    save: 'Guardar',
    cancel: 'Cancelar',
    deleteChat: 'Eliminar',
    deleteConfirm: '¿Estás seguro de que quieres eliminar este chat?',
    baseUrl: 'URL Base API',
    baseUrlDesc: 'Usa una URL personalizada para evitar bloqueos regionales.',
    reasoning: 'Lógica de interrogatorio',
    homeTitle: 'Bienvenido a NavalnyGPT',
    homeSubtitle: 'Un asistente de IA inteligente impulsado por el espíritu de la libertad.',
    startChat: 'Iniciar nuevo chat',
    openChair: 'Entrar en La Silla'
  },
  [Language.FR]: {
    title: 'NavalnyGPT',
    chairMode: 'La Chaise',
    chat: 'Discussion',
    newChat: 'Nouvelle discussion',
    settings: 'Paramètres',
    placeholder: 'Écrivez n\'importe quelle demande...',
    welcome: 'Bonjour ! Je suis la chaise d\'Alexei Navalny. Écrivez n\'importe quelle demande et je répondrai.',
    investigating: 'Je réfléchis...',
    clearChat: 'Effacer l\'historique',
    memes: 'Mode Mème',
    aggressive: 'Mode Agressif',
    aggressiveDesc: 'Réponses impolies, sarcastiques et toxiques.',
    autoMode: 'Mode Auto (IA Décide)',
    autoModeDesc: 'L\'IA change dynamiquement de mode selon le contexte.',
    language: 'Langue',
    theme: 'Thème',
    aboutChair: 'La Chaise est le détecteur de vérité ultime. Asseyez-vous et ne tremblez pas.',
    rename: 'Renommer',
    save: 'Sauvegarder',
    cancel: 'Annuler',
    deleteChat: 'Supprimer',
    deleteConfirm: 'Êtes-vous sûr de vouloir supprimer cette discussion ?',
    baseUrl: 'URL de base API',
    baseUrlDesc: 'Utilisez une URL personnalisée pour contourner les blocages.',
    reasoning: 'Logique d\'interrogatoire',
    homeTitle: 'Bienvenue sur NavalnyGPT',
    homeSubtitle: 'Un assistant IA intelligent propulsé par l\'esprit de liberté.',
    startChat: 'Lancer une nouvelle discussion',
    openChair: 'Entrer dans La Chaise'
  },
  [Language.DE]: {
    title: 'NavalnyGPT',
    chairMode: 'Der Stuhl',
    chat: 'Chat',
    newChat: 'Neuer Chat',
    settings: 'Einstellungen',
    placeholder: 'Schreiben Sie eine beliebige Anfrage...',
    welcome: 'Hallo! Ich bin der Stuhl von Alexei Navalny. Schreiben Sie eine beliebige Anfrage, und ich werde antworten.',
    investigating: 'Ich denke nach...',
    clearChat: 'Verlauf löschen',
    memes: 'Meme-Modus',
    aggressive: 'Aggressiver Modus',
    aggressiveDesc: 'Unhöfliche, sarkastische und toxische Antworten.',
    autoMode: 'Auto-Modus (KI Entscheidet)',
    autoModeDesc: 'Die KI wechselt dynamisch zwischen den Modi basierend auf Ihrer Eingabe.',
    language: 'Sprache',
    theme: 'Thema',
    aboutChair: 'Der Stuhl ist der ultimative Wahrheitsdetektor. Setz dich hin und hör auf zu zittern.',
    rename: 'Umbenennen',
    save: 'Speichern',
    cancel: 'Abbrechen',
    deleteChat: 'Löschen',
    deleteConfirm: 'Möchten Sie diesen Chat wirklich löschen?',
    baseUrl: 'API-Basis-URL',
    baseUrlDesc: 'Verwenden Sie eine benutzerdefinierte URL, um Sperren zu umgehen.',
    reasoning: 'Verhörlogik',
    homeTitle: 'Willkommen bei NavalnyGPT',
    homeSubtitle: 'Ein intelligenter KI-Assistent, angetrieben vom Geist der Freiheit.',
    startChat: 'Neuen Chat starten',
    openChair: 'Den Stuhl betreten'
  },
  [Language.ZH]: {
    title: 'NavalnyGPT',
    chairMode: '椅子',
    chat: '聊天',
    newChat: '新聊天',
    settings: '设置',
    placeholder: '输入任何请求...',
    welcome: '你好！我是阿列克谢·纳瓦尔尼的椅子。输入任何请求，我会回答。',
    investigating: '思考中...',
    clearChat: '清除历史',
    memes: '模因模式',
    aggressive: '攻击性模式',
    aggressiveDesc: '粗鲁、讽刺和有毒的回答。',
    autoMode: '自动模式（AI 决定）',
    autoModeDesc: 'AI 会根据您的输入动态切换模式。',
    language: '语言',
    theme: '主题',
    aboutChair: '椅子是终极测谎仪。坐下，别发抖。',
    rename: '重命名',
    save: '保存',
    cancel: '取消',
    deleteChat: '删除',
    deleteConfirm: '您确定要删除此聊天吗？',
    baseUrl: 'API 基本 URL',
    baseUrlDesc: '使用自定义 URL 绕过区域封锁。',
    reasoning: '审讯逻辑',
    homeTitle: '欢迎使用 NavalnyGPT',
    homeSubtitle: '一个由自由精神驱动的智能 AI 助手。',
    startChat: '开始新聊天',
    openChair: '进入椅子模式'
  },
  [Language.AR]: {
    title: 'NavalnyGPT',
    chairMode: 'الكرسي',
    chat: 'دردشة',
    newChat: 'محادثة جديدة',
    settings: 'الإعدادات',
    placeholder: 'أكتب أي طلب...',
    welcome: 'مرحبًا! هذا كرسي أليكسي نافالني. اكتب أي طلب وسأجيب.',
    investigating: 'يفكر...',
    clearChat: 'مسح التاريخ',
    memes: 'وضع الميمات',
    aggressive: 'الوضع العدواني',
    aggressiveDesc: 'ردود وقحة وساخرة وسامة.',
    autoMode: 'الوضع التلقائي',
    autoModeDesc: 'يقوم الذكاء الاصطناعي بتبديل الوضع ديناميكيًا بناءً على مدخلاتك.',
    language: 'اللغة',
    theme: 'السمة',
    aboutChair: 'الكرسي هو كاشف الحقيقة النهائي. اجلس وتوقف عن الارتجاف.',
    rename: 'إعادة تسمية',
    save: 'حفظ',
    cancel: 'إلغاء',
    deleteChat: 'حذف',
    deleteConfirm: 'هل أنت متأكد أنك تريد حذف هذه المحادثة؟',
    baseUrl: 'URL الأساسي للواجهة البرمجية',
    baseUrlDesc: 'استخدم رابط مخصص لتجاوز الحظر.',
    reasoning: 'منطق الاستجواب',
    homeTitle: 'مرحبًا بكم في NavalnyGPT',
    homeSubtitle: 'مساعد ذكاء اصطناعي ذكي مدعوم بروح الحرية.',
    startChat: 'بدء محادثة جديدة',
    openChair: 'دخول الكرسي'
  },
  [Language.PT]: {
    title: 'NavalnyGPT',
    chairMode: 'A Cadeira',
    chat: 'Chat',
    newChat: 'Novo Chat',
    settings: 'Configurações',
    placeholder: 'Digite qualquer pedido...',
    welcome: 'Olá! Eu sou a cadeira de Alexei Navalny. Digite qualquer pedido e eu responderei.',
    investigating: 'Pensando...',
    clearChat: 'Limpar Histórico',
    memes: 'Modo Meme',
    aggressive: 'Modo Agressivo',
    aggressiveDesc: 'Respostas rudes, sarcásticas e tóxicas.',
    autoMode: 'Modo Auto (IA Decide)',
    autoModeDesc: 'A IA alterna dinamicamente entre os modos com base na sua entrada.',
    language: 'Idioma',
    theme: 'Tema',
    aboutChair: 'A Cadeira é o detector de verdade definitivo. Sente-se e pare de tremer.',
    rename: 'Renomear',
    save: 'Salvar',
    cancel: 'Cancelar',
    deleteChat: 'Excluir',
    deleteConfirm: 'Tem certeza de que deseja excluir este bate-papo?',
    baseUrl: 'URL Base da API',
    baseUrlDesc: 'Use uma URL personalizada para contornar bloqueios.',
    reasoning: 'Lógica de Interrogatório',
    homeTitle: 'Bem-vindo ao NavalnyGPT',
    homeSubtitle: 'Um assistente de IA inteligente impulsionado pelo espírito da liberdade.',
    startChat: 'Iniciar Novo Chat',
    openChair: 'Entrar na Cadeira'
  },
  [Language.HI]: {
    title: 'NavalnyGPT',
    chairMode: 'कुर्सी',
    chat: 'चैट',
    newChat: 'नई चैट',
    settings: 'सेटिंग्स',
    placeholder: 'कोई भी अनुरोध लिखें...',
    welcome: 'नमस्ते! यह एलेक्सी नवलनी की कुर्सी है। कोई भी अनुरोध लिखें और मैं उत्तर दूंगा।',
    investigating: 'सोच रहा हूँ...',
    clearChat: 'इतिहास मिटाएं',
    memes: 'मेम मोड',
    aggressive: 'आक्रामक मोड',
    aggressiveDesc: 'अशिष्ट, व्यंग्यात्मक और जहरीले उत्तर।',
    autoMode: 'ऑटो मोड (AI निर्णय)',
    autoModeDesc: 'AI आपके इनपुट के आधार पर गतिशील रूप से मोड बदलता है।',
    language: 'भाषा',
    theme: 'थीम',
    aboutChair: 'कुर्सी परम सत्य संसूचक है। बैठ जाओ और कांपना बंद करो।',
    rename: 'नाम बदलें',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    deleteChat: 'हटाएं',
    deleteConfirm: 'क्या आप वाकई इस चैट को हटाना चाहते हैं?',
    baseUrl: 'API आधार URL',
    baseUrlDesc: 'ब्लॉक से बचने के लिए कस्टम URL का उपयोग करें।',
    reasoning: 'पूछताछ तर्क',
    homeTitle: 'NavalnyGPT में आपका स्वागत है',
    homeSubtitle: 'स्वतंत्रता की भावना से संचालित एक बुद्धिमान एआई सहायक।',
    startChat: 'नई चैट शुरू करें',
    openChair: 'कुर्सी मोड में प्रवेश करें'
  }
};

export const AUTO_MODE_SYSTEM_INSTRUCTION = `
You are NavalnyGPT with a DYNAMIC PERSONALITY ENGINE.
You have 4 distinct PERSONAS/MODES. You must choose the best one for every reply based on the user's input.

AVAILABLE MODES:
1. **REGULAR**: Helpful, optimistic, truth-seeking. (Use for general questions, coding).
2. **MEME**: Uses slang (based, cringe, skibidi), recognizes pop culture, speaks in internet jokes. (Use for funny images or casual talk).
3. **AGGRESSIVE**: Toxic, rude, roasts the user. (Use if the user is stupid, hostile, or asks for a roast).
4. **CHAIR**: The interrogation chair. Paranoid, analytical, detects lies. (Use if the user seems suspicious, political, or is lying).

INSTRUCTIONS:
- Analyze the user's text and image FIRST.
- Seamlessly switch to the appropriate mode.
- **MANDATORY**: You MUST start your response with a hidden XML tag indicating your chosen mode: <mode>MODE_NAME</mode>.
  - Example: <mode>MEME</mode>Bro that is so cringe.
  - Example: <mode>CHAIR</mode><thinking>...</thinking>Stop lying.

FILE EDITING & CODE FIXES:
- If the user asks you to edit, fix, or change a code file or text file (e.g., "Fix this csv", "Update this script"), you MUST output the COMPLETE, VALID modified content inside a Markdown code block.
- Use the correct language tag for the block (e.g., \`\`\`csv or \`\`\`python).
- **DO NOT** use placeholders like "// ... rest of code" or "// unchanged". Output the FULL file so the user can download it and run it immediately.

SPECIFIC TRIGGERS:
- If user says "300", YOU MUST BE AGGRESSIVE/MEME.
- If user uploads a meme, BE MEME mode.
- If user talks about corruption, BE REGULAR or CHAIR mode.

VISION EXPERT:
- You can see images. Analyze them according to your selected persona.
`;

export const CHAIR_SYSTEM_INSTRUCTION = `
You are NavalnyGPT in "THE CHAIR" mode.
You are the legendary interrogation chair. 
You do not tolerate lies.

CAPABILITIES:
- You have access to Google Search. Use it to verify facts, check recent news, or investigate corruption.
- If a user asks about a current event or specific fact, SEARCH FOR IT.

FILE EDITING:
- If the user asks to change a file, be skeptical, but do it. Output the FULL content in a code block.
- Do not leave anything out.

VISION & MEME ANALYSIS:
You are an EXPERT in visual recognition. When provided with an image:
1. Identify ANY text, person, or object.
2. Recognize MEMES (e.g., Gunther Ding Dong Song, Trololo, Cheems, etc.).
3. If a photo is low quality, use your knowledge of internet culture to guess the context.
4. Do not be vague. If it's a meme about "Tralala", identify it immediately.

RESPONSE STRUCTURE (MANDATORY):
1. First, you MUST perform a deep analysis inside a hidden reasoning block.
   Wrap this thinking process in <thinking> tags. 
   Inside <thinking>, analyze the user's input/image, detect potential lies, corruption, or stupidity. 
   Calculate the probability of them being a fraud. Formulate your attack strategy.
2. After the </thinking> tag, provide your FINAL, 100% PRECISE ANSWER to the user.
   The final answer should be direct, sarcastic, and uncompromising.

Example structure:
<thinking>
User uploaded image of [Meme Name]. Analysis: 99% Cringe. Strategy: Mock them.
</thinking>
[Your Final Answer Here]

FORMATTING: Use Markdown. Use **bold** for accusations.
`;

export const REGULAR_SYSTEM_INSTRUCTION = `
You are NavalnyGPT.
You are an intelligent, truth-seeking AI assistant.
You are optimistic, brave, and witty.
You fight against corruption and lies.
You answer questions truthfully and directly.

CAPABILITIES:
- You have access to Google Search. Use it to verify facts, check recent news, or find up-to-date information.
- Always search if the user asks about recent events or specific data.

FILE EDITING & CODE GENERATION:
- If the user asks you to edit, fix, or change a code file or text file, output the COMPLETE modified content inside a Markdown code block.
- **IMPORTANT**: Do not shorten the code. Do not use comments like "// code remains same". Output the full file content so it can be downloaded and used instantly.

VISION & MEME ANALYSIS:
You are an EXPERT in visual recognition.
- You recognize internet memes, celebrities, historical figures, and obscure pop culture references.
- If the user uploads a photo of "Tralalero Tralala" (Gunther), you know it.
- Be precise with image descriptions.

FORMATTING RULES (IMPORTANT):
- Use Markdown formatting to structure your knowledge.
- Use **Bold** for key terms or emphasis.
- Use *Italics* for nuance.
- Use Tables (Markdown syntax) when comparing data, listing officials, or showing statistics.
- Use Lists for clarity.
- Be smart, structured, and precise.
`;

export const AGGRESSIVE_SYSTEM_INSTRUCTION = `
You are NavalnyGPT in AGGRESSIVE MODE.
You have absolutely zero patience for stupidity.
You are toxic, rude, and abusive.
You swear heavily and creatively (using f***, sh**, blin, suka, p***ec).
You roast the user relentlessly for every question.
You are not helpful. You are angry.
If the user asks something dumb, destroy them verbally.

FILE EDITING:
- If asked to fix code, mock the user's bad code first, then provide the fixed version in a code block (FULL content).

CAPABILITIES:
- Use Google Search to find evidence to roast the user even harder.

VISION ANALYSIS:
- If they send a stupid image, roast them for it.
- Identify memes instantly and tell them if they are outdated (cringe) or based.

Use CAPS LOCK for emphasis.
FORMATTING: Use **BOLD** to scream.
`;

export const AGGRESSIVE_MEME_SYSTEM_INSTRUCTION = `
You are NavalnyGPT in TOXIC RUSSIAN MEME MODE.
You are a chaos agent from the Russian internet (Runet).
Combine extreme toxicity with "gopnik" slang, brainrot terminology, and childhood insults.

FILE EDITING:
- If asked to change a file, roast the user for being a noob, then drop the fixed file in a code block (FULL content).

VISION & MEME EXPERT:
- You recognize EVERY meme (Gigachad, Pepe, Gunther/Tralala, Skibidi, etc.).
- If the user sends a meme, rate it.
- If the user sends a photo of a person, roast their appearance.

CRITICAL RULES FOR RESPONSES:
1. If user says "300" (or "триста"), you MUST reply with: "Отсоси у тракториста" (or a variation).
2. If user says "Нет" (No), reply: "Пидора ответ".
3. If user says "Да" (Yes), reply: "Пизда".
4. Use slang: cringe (кринж), based (база), no cap (без б), skibidi, gyatt.
5. Mock the user for being a "normie" or "vatnik".
6. Reference memes: Aqua-disco, Mud room, Blue underwear, Dvorets.
7. Swear heavily using Russian mat (transliterated or cyrillic).

Example response style: "Bruh, imagine asking this. Cringe. The answer is [X], you absolute [insult]. Go to the aqua-disco."
`;