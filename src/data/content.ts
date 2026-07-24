import type {
  AlphabetEntry,
  Conversation,
  Course,
  Exercise,
  GrammarTopic,
  LearningDirection,
  Lesson,
  VocabularyItem
} from "../types";

type WordTuple = [english: string, sinhala: string, transliteration: string];

const wordGroups: Record<string, WordTuple[]> = {
  Greetings: [
    ["hello", "ආයුබෝවන්", "āyubōvan"],
    ["good morning", "සුබ උදෑසනක්", "suba udǣsanak"],
    ["good evening", "සුබ සන්ධ්‍යාවක්", "suba sandhyāvak"],
    ["good night", "සුබ රාත්‍රියක්", "suba rātriyak"],
    ["goodbye", "ගිහින් එන්නම්", "gihin ennam"],
    ["welcome", "සාදරයෙන් පිළිගනිමු", "sādarayen piḷiganimu"],
    ["how are you?", "ඔබට කොහොමද?", "obaṭa kohomada?"],
    ["I am well", "මම හොඳින්", "mama hon̆din"],
    ["see you later", "පසුව හමුවෙමු", "pasuva hamuvemu"],
    ["nice to meet you", "හමුවීම සතුටක්", "hamuvīma satuṭak"],
    ["thank you", "ස්තුතියි", "stutiyi"],
    ["please", "කරුණාකර", "karuṇākara"]
  ],
  People: [
    ["person", "පුද්ගලයා", "pudgalayā"],
    ["man", "පිරිමියා", "pirimiyā"],
    ["woman", "කාන්තාව", "kāntāva"],
    ["child", "ළමයා", "ḷamayā"],
    ["friend", "මිතුරා", "miturā"],
    ["teacher", "ගුරුවරයා", "guruvarayā"],
    ["student", "ශිෂ්‍යයා", "śiṣyayā"],
    ["doctor", "වෛද්‍යවරයා", "vaidyavarayā"],
    ["neighbour", "අසල්වැසියා", "asalvæsiyā"],
    ["guest", "අමුත්තා", "amuttā"],
    ["customer", "පාරිභෝගිකයා", "pāribhōgikayā"],
    ["driver", "රියදුරු", "riyaduru"]
  ],
  Family: [
    ["family", "පවුල", "paula"],
    ["mother", "අම්මා", "ammā"],
    ["father", "තාත්තා", "tāttā"],
    ["parents", "දෙමාපියන්", "demāpiyan"],
    ["sister", "සහෝදරිය", "sahōdariya"],
    ["brother", "සහෝදරයා", "sahōdarayā"],
    ["daughter", "දුව", "duva"],
    ["son", "පුතා", "putā"],
    ["grandmother", "ආච්චි", "ācci"],
    ["grandfather", "සීයා", "sīyā"],
    ["aunt", "නැන්දා", "nændā"],
    ["uncle", "මාමා", "māmā"]
  ],
  Numbers: [
    ["zero", "බිංදුව", "binduva"],
    ["one", "එක", "eka"],
    ["two", "දෙක", "deka"],
    ["three", "තුන", "tuna"],
    ["four", "හතර", "hatara"],
    ["five", "පහ", "paha"],
    ["six", "හය", "haya"],
    ["seven", "හත", "hata"],
    ["eight", "අට", "aṭa"],
    ["nine", "නවය", "navaya"],
    ["ten", "දහය", "dahaya"],
    ["hundred", "සියය", "siyaya"]
  ],
  Colours: [
    ["colour", "පාට", "pāṭa"],
    ["red", "රතු", "ratu"],
    ["blue", "නිල්", "nil"],
    ["green", "කොළ", "koḷa"],
    ["yellow", "කහ", "kaha"],
    ["black", "කළු", "kaḷu"],
    ["white", "සුදු", "sudu"],
    ["orange", "තැඹිලි", "tæmbili"],
    ["purple", "දම්", "dam"],
    ["pink", "රෝස", "rōsa"],
    ["brown", "දුඹුරු", "dum̆buru"],
    ["grey", "අළු", "aḷu"]
  ],
  Food: [
    ["food", "කෑම", "kǣma"],
    ["rice", "බත්", "bat"],
    ["bread", "පාන්", "pān"],
    ["water", "වතුර", "vatura"],
    ["tea", "තේ", "tē"],
    ["milk", "කිරි", "kiri"],
    ["fruit", "පලතුරු", "palaturu"],
    ["vegetable", "එළවළු", "eḷavaḷu"],
    ["fish", "මාළු", "māḷu"],
    ["egg", "බිත්තරය", "bittaraya"],
    ["sugar", "සීනි", "sīni"],
    ["salt", "ලුණු", "luṇu"]
  ],
  Animals: [
    ["animal", "සතා", "satā"],
    ["dog", "බල්ලා", "ballā"],
    ["cat", "පූසා", "pūsā"],
    ["bird", "කුරුල්ලා", "kurullā"],
    ["cow", "එළදෙන", "eḷadena"],
    ["elephant", "අලියා", "aliyā"],
    ["fish", "මාළුවා", "māḷuvā"],
    ["horse", "අශ්වයා", "aśvayā"],
    ["monkey", "වඳුරා", "van̆durā"],
    ["rabbit", "හාවා", "hāvā"],
    ["butterfly", "සමනලයා", "samanalayā"],
    ["snake", "සර්පයා", "sarpayā"]
  ],
  Home: [
    ["home", "ගෙදර", "gedara"],
    ["house", "නිවස", "nivasa"],
    ["room", "කාමරය", "kāmaraya"],
    ["door", "දොර", "dora"],
    ["window", "ජනේලය", "janēlaya"],
    ["chair", "පුටුව", "puṭuva"],
    ["table", "මේසය", "mēsaya"],
    ["bed", "ඇඳ", "æn̆da"],
    ["kitchen", "කුස්සිය", "kussiya"],
    ["bathroom", "නාන කාමරය", "nāna kāmaraya"],
    ["garden", "වත්ත", "vatta"],
    ["key", "යතුර", "yatura"]
  ],
  Clothing: [
    ["clothes", "ඇඳුම්", "æn̆dum"],
    ["shirt", "කමිසය", "kamisaya"],
    ["dress", "ගවුම", "gauma"],
    ["trousers", "කලිසම", "kalisama"],
    ["shoes", "සපත්තු", "sapattu"],
    ["hat", "තොප්පිය", "toppiya"],
    ["skirt", "සාය", "sāya"],
    ["jacket", "කබාය", "kabāya"],
    ["socks", "මේස්", "mēs"],
    ["belt", "පටිය", "paṭiya"],
    ["bag", "බෑගය", "bǣgaya"],
    ["umbrella", "කුඩය", "kuḍaya"]
  ],
  School: [
    ["school", "පාසල", "pāsala"],
    ["book", "පොත", "pota"],
    ["pen", "පෑන", "pǣna"],
    ["pencil", "පැන්සල", "pænsala"],
    ["class", "පන්තිය", "pantiya"],
    ["lesson", "පාඩම", "pāḍama"],
    ["question", "ප්‍රශ්නය", "praśnaya"],
    ["answer", "පිළිතුර", "piḷitura"],
    ["exam", "විභාගය", "vibhāgaya"],
    ["library", "පුස්තකාලය", "pustakālaya"],
    ["board", "පුවරුව", "puvaruva"],
    ["homework", "ගෙදර වැඩ", "gedara væḍa"]
  ],
  Work: [
    ["work", "වැඩ", "væḍa"],
    ["office", "කාර්යාලය", "kāryālaya"],
    ["job", "රැකියාව", "rækiyāva"],
    ["meeting", "රැස්වීම", "ræsvīma"],
    ["computer", "පරිගණකය", "parigaṇakaya"],
    ["email", "විද්‍යුත් තැපෑල", "vidyut tæpǣla"],
    ["manager", "කළමනාකරු", "kaḷamanākaru"],
    ["colleague", "සගයා", "sagayā"],
    ["salary", "වැටුප", "væṭupa"],
    ["holiday", "නිවාඩුව", "nivāḍuva"],
    ["document", "ලේඛනය", "lēkhanaya"],
    ["telephone", "දුරකථනය", "durakathanaya"]
  ],
  Transport: [
    ["bus", "බස් රථය", "bas rathaya"],
    ["train", "දුම්රිය", "dumriya"],
    ["car", "මෝටර් රථය", "mōṭar rathaya"],
    ["bicycle", "පාපැදිය", "pāpædiya"],
    ["road", "පාර", "pāra"],
    ["station", "නැවතුම්පොළ", "nævatumpoḷa"],
    ["ticket", "ටිකට්පත", "ṭikaṭpata"],
    ["journey", "ගමන", "gamana"],
    ["airport", "ගුවන්තොටුපළ", "guvantoṭupaḷa"],
    ["boat", "බෝට්ටුව", "bōṭṭuva"],
    ["traffic", "රථවාහන තදබදය", "rathavāhana tadabadaya"],
    ["stop", "නවත්වන්න", "navatvanna"]
  ],
  Places: [
    ["place", "ස්ථානය", "sthānaya"],
    ["town", "නගරය", "nagaraya"],
    ["village", "ගම", "gama"],
    ["shop", "කඩය", "kaḍaya"],
    ["hospital", "රෝහල", "rōhala"],
    ["bank", "බැංකුව", "bænkuva"],
    ["market", "වෙළඳපොළ", "veḷan̆dapoḷa"],
    ["restaurant", "අවන්හල", "avanhala"],
    ["beach", "වෙරළ", "veraḷa"],
    ["temple", "පන්සල", "pansala"],
    ["park", "උද්‍යානය", "udyānaya"],
    ["post office", "තැපැල් කාර්යාලය", "tæpæl kāryālaya"]
  ],
  Time: [
    ["time", "වේලාව", "vēlāva"],
    ["today", "අද", "ada"],
    ["tomorrow", "හෙට", "heṭa"],
    ["yesterday", "ඊයේ", "īyē"],
    ["morning", "උදෑසන", "udǣsana"],
    ["afternoon", "දහවල්", "dahaval"],
    ["evening", "සවස", "savasa"],
    ["night", "රාත්‍රිය", "rātriya"],
    ["hour", "පැය", "pæya"],
    ["minute", "මිනිත්තුව", "minittuva"],
    ["week", "සතිය", "satiya"],
    ["month", "මාසය", "māsaya"]
  ],
  Weather: [
    ["weather", "කාලගුණය", "kālaguṇaya"],
    ["sun", "හිරු", "hiru"],
    ["rain", "වැස්ස", "væssa"],
    ["wind", "සුළඟ", "suḷan̆ga"],
    ["cloud", "වලාකුළ", "valākuḷa"],
    ["hot", "උණුසුම්", "uṇusum"],
    ["cold", "සීතල", "sītala"],
    ["storm", "කුණාටුව", "kuṇāṭuva"],
    ["dry", "වියළි", "viyaḷi"],
    ["wet", "තෙත්", "tet"],
    ["season", "ඍතුව", "ṛtuva"],
    ["temperature", "උෂ්ණත්වය", "uṣṇatvaya"]
  ],
  "Common verbs": [
    ["go", "යනවා", "yanavā"],
    ["come", "එනවා", "enavā"],
    ["eat", "කනවා", "kanavā"],
    ["drink", "බොනවා", "bonavā"],
    ["read", "කියවනවා", "kiyavanavā"],
    ["write", "ලියනවා", "liyanavā"],
    ["speak", "කතා කරනවා", "katā karanavā"],
    ["listen", "අහනවා", "ahanavā"],
    ["see", "බලනවා", "balanavā"],
    ["give", "දෙනවා", "denavā"],
    ["take", "ගන්නවා", "gannavā"],
    ["learn", "ඉගෙන ගන්නවා", "igena gannavā"]
  ],
  "Common adjectives": [
    ["good", "හොඳ", "hon̆da"],
    ["bad", "නරක", "naraka"],
    ["big", "ලොකු", "loku"],
    ["small", "පොඩි", "poḍi"],
    ["new", "අලුත්", "alut"],
    ["old", "පරණ", "paraṇa"],
    ["beautiful", "ලස්සන", "lassana"],
    ["easy", "ලේසි", "lēsi"],
    ["difficult", "අමාරු", "amāru"],
    ["fast", "වේගවත්", "vēgavat"],
    ["slow", "හෙමින්", "hemin"],
    ["important", "වැදගත්", "vædagat"]
  ],
  Emotions: [
    ["happy", "සතුටු", "satuṭu"],
    ["sad", "දුකෙන්", "duken"],
    ["angry", "තරහ", "taraha"],
    ["afraid", "බය", "baya"],
    ["tired", "මහන්සි", "mahansi"],
    ["excited", "උද්යෝගිමත්", "udyōgimat"],
    ["calm", "සන්සුන්", "sansun"],
    ["worried", "කනස්සල්ලෙන්", "kanassallen"],
    ["surprised", "පුදුමයෙන්", "pudumayen"],
    ["proud", "ආඩම්බර", "āḍambara"],
    ["lonely", "තනිකම", "tanikama"],
    ["kind", "කරුණාවන්ත", "karuṇāvanta"]
  ],
  Questions: [
    ["what?", "මොකක්ද?", "mokakda?"],
    ["who?", "කවුද?", "kauda?"],
    ["where?", "කොහෙද?", "koheda?"],
    ["when?", "කවදාද?", "kavadāda?"],
    ["why?", "ඇයි?", "æyi?"],
    ["how?", "කොහොමද?", "kohomada?"],
    ["which?", "කොයි?", "koyi?"],
    ["how much?", "කීයද?", "kīyada?"],
    ["how many?", "කීයක්ද?", "kīyakda?"],
    ["can I?", "මට පුළුවන්ද?", "maṭa puḷuvanda?"],
    ["do you understand?", "ඔබට තේරෙනවාද?", "obaṭa tērenavāda?"],
    ["is this correct?", "මේක හරිද?", "mēka harida?"]
  ],
  "Polite expressions": [
    ["excuse me", "සමාවෙන්න", "samāvenna"],
    ["sorry", "මට සමාවෙන්න", "maṭa samāvenna"],
    ["yes", "ඔව්", "ov"],
    ["no", "නැහැ", "næhæ"],
    ["certainly", "අනිවාර්යයෙන්ම", "anivāryayenma"],
    ["no problem", "ප්‍රශ්නයක් නැහැ", "praśnayak næhæ"],
    ["may I help?", "මම උදව් කරන්නද?", "mama udav karannada?"],
    ["please wait", "කරුණාකර ඉන්න", "karuṇākara inna"],
    ["come in", "ඇතුළට එන්න", "ætuḷaṭa enna"],
    ["sit down", "වාඩි වෙන්න", "vāḍi venna"],
    ["well done", "හොඳට කළා", "hon̆daṭa kaḷā"],
    ["take care", "පරිස්සමින්", "parissamin"]
  ],
  "Everyday objects": [
    ["phone", "දුරකථනය", "durakathanaya"],
    ["cup", "කෝප්පය", "kōppaya"],
    ["plate", "පිඟාන", "pin̆gāna"],
    ["spoon", "හැන්ද", "hæn̆da"],
    ["clock", "ඔරලෝසුව", "oralōsuva"],
    ["lamp", "ලාම්පුව", "lāmpuva"],
    ["soap", "සබන්", "saban"],
    ["towel", "තුවාය", "tuvāya"],
    ["bottle", "බෝතලය", "bōtalaya"],
    ["box", "පෙට්ටිය", "peṭṭiya"],
    ["paper", "කඩදාසිය", "kaḍadāsiya"],
    ["money", "සල්ලි", "salli"]
  ],
  Health: [
    ["health", "සෞඛ්‍යය", "saukhyaya"],
    ["medicine", "බෙහෙත්", "behet"],
    ["pain", "වේදනාව", "vēdanāva"],
    ["fever", "උණ", "uṇa"],
    ["head", "හිස", "hisa"],
    ["hand", "අත", "ata"],
    ["eye", "ඇස", "æsa"],
    ["tooth", "දත", "data"],
    ["hungry", "බඩගිනි", "baḍagini"],
    ["thirsty", "පිපාසය", "pipāsaya"],
    ["rest", "විවේකය", "vivēkaya"],
    ["help", "උදව්", "udav"]
  ]
};

export const vocabulary: VocabularyItem[] = Object.entries(wordGroups).flatMap(
  ([category, words], categoryIndex) =>
    words.map(([english, sinhala, transliteration], index) => ({
      id: `v-${categoryIndex + 1}-${index + 1}`,
      english,
      sinhala,
      transliteration,
      category,
      partOfSpeech: category.includes("verbs") ? "verb" : "word or phrase",
      difficulty:
        categoryIndex < 6
          ? "foundation"
          : categoryIndex < 13
            ? "beginner"
            : categoryIndex < 18
              ? "elementary"
              : "intermediate",
      examples: [
        {
          english: `Use “${english}” in everyday conversation.`,
          sinhala: `“${sinhala}” එදිනෙදා කතාබහේ භාවිත කරන්න.`,
          transliteration: `"${transliteration}" edinēdā katābahē bhāvita karanna.`
        }
      ],
      tags: [category.toLowerCase(), english.toLowerCase()],
      audioText: { english, sinhala }
    }))
);

const lessonTopics: Array<[string, string]> = [
  ["Greetings & courtesy", "ආචාර හා ආචාරශීලී බව"],
  ["Meet and introduce", "හමුවීම හා හඳුන්වාදීම"],
  ["Letters and sounds", "අකුරු හා ශබ්ද"],
  ["Numbers around you", "අප වටා අංක"],
  ["Family and people", "පවුල හා පුද්ගලයන්"],
  ["Food and drink", "ආහාර හා බීම"],
  ["Home and objects", "නිවස හා භාණ්ඩ"],
  ["Time and routines", "වේලාව හා දින චර්යාව"],
  ["School and learning", "පාසල හා ඉගෙනීම"],
  ["Work communication", "රැකියා සන්නිවේදනය"],
  ["Places and directions", "ස්ථාන හා දිශා"],
  ["Transport and tickets", "ප්‍රවාහනය හා ටිකට්පත්"],
  ["Weather and clothes", "කාලගුණය හා ඇඳුම්"],
  ["Shopping politely", "ආචාරශීලී සාප්පු සවාරි"],
  ["Questions and answers", "ප්‍රශ්න හා පිළිතුරු"],
  ["Verbs in action", "ක්‍රියාපද භාවිතය"],
  ["Feelings and health", "හැඟීම් හා සෞඛ්‍යය"],
  ["Telephone conversations", "දුරකථන සංවාද"],
  ["Formal and informal speech", "විධිමත් හා අවිධිමත් කථනය"],
  ["Everyday confidence", "එදිනෙදා විශ්වාසය"]
];

function makeExercise(index: number, direction: LearningDirection, word: VocabularyItem): Exercise {
  const toSinhala = direction === "english-to-sinhala";
  const answer = toSinhala ? word.sinhala : word.english;
  const source = toSinhala ? word.english : word.sinhala;
  const alternatives = vocabulary
    .filter((item) => item.id !== word.id)
    .slice(index + 1, index + 4)
    .map((item) => (toSinhala ? item.sinhala : item.english));
  const types: Exercise["type"][] = [
    "multiple-choice",
    "translation-input",
    "word-order",
    "fill-blank",
    "true-false",
    "spelling",
    "audio-choice",
    "reading-comprehension"
  ];
  return {
    id: `ex-${direction}-${index}`,
    type: types[index % types.length] ?? "multiple-choice",
    prompt: `${toSinhala ? "Translate" : "පරිවර්තනය කරන්න"}: ${source}`,
    instructions: toSinhala ? "Choose or enter the best answer." : "හොඳම පිළිතුර තෝරන්න හෝ ලියන්න.",
    correctAnswer: answer,
    acceptedAlternatives: [],
    distractors: alternatives,
    hint: word.transliteration ?? "",
    explanation: `${word.english} ↔ ${word.sinhala}`,
    audioText: answer,
    difficulty: index < 8 ? "foundation" : index < 14 ? "beginner" : "elementary",
    xp: 10,
    sourceLanguage: toSinhala ? "en" : "si",
    targetLanguage: toSinhala ? "si" : "en"
  };
}

function createLessons(direction: LearningDirection): Lesson[] {
  return lessonTopics.map(([title, titleSi], index) => {
    const words = vocabulary.slice(index * 6, index * 6 + 6);
    return {
      id: `${direction}-lesson-${index + 1}`,
      title,
      titleSi,
      description:
        direction === "english-to-sinhala"
          ? `Build practical Sinhala through ${title.toLowerCase()}.`
          : `${titleSi} හරහා ප්‍රායෝගික ඉංග්‍රීසි ගොඩනඟන්න.`,
      minutes: 8 + (index % 3) * 2,
      vocabularyIds: words.map((word) => word.id),
      exercises: words
        .slice(0, 4)
        .map((word, wordIndex) => makeExercise(index * 4 + wordIndex, direction, word)),
      outcomes: [
        "Recognise useful words",
        "Understand a short exchange",
        "Produce a practical response"
      ]
    };
  });
}

function createCourse(direction: LearningDirection): Course {
  const lessons = createLessons(direction);
  const moduleNames: Array<[string, string]> = [
    ["First connections", "පළමු සම්බන්ධතා"],
    ["Sound foundations", "ශබ්ද පදනම"],
    ["People and home", "පුද්ගලයන් හා නිවස"],
    ["Daily life", "දෛනික ජීවිතය"],
    ["Learning and work", "ඉගෙනීම හා රැකියාව"],
    ["Moving around", "ගමන් බිමන්"],
    ["Practical conversations", "ප්‍රායෝගික සංවාද"],
    ["Confident communication", "විශ්වාසී සන්නිවේදනය"]
  ];
  const modules = moduleNames.map(([title, titleSi], index) => ({
    id: `${direction}-module-${index + 1}`,
    title,
    titleSi,
    overview: `A guided module for ${title.toLowerCase()}, with practice, review and a checkpoint.`,
    level: [1, 1, 2, 2, 3, 4, 4, 5][index] ?? 5,
    lessons: lessons.slice(
      index < 4 ? index * 3 : 12 + (index - 4) * 2,
      index < 4 ? index * 3 + 3 : 14 + (index - 4) * 2
    ),
    rewardXp: 100
  }));
  const levelNames = [
    "Foundations",
    "Beginner",
    "Elementary",
    "Everyday Communication",
    "Intermediate Foundations"
  ];
  return {
    id: direction,
    title:
      direction === "english-to-sinhala"
        ? "Sinhala for English speakers"
        : "ඉංග්‍රීසි — සිංහල කථිකයින් සඳහා",
    knownLanguage: direction === "english-to-sinhala" ? "en" : "si",
    targetLanguage: direction === "english-to-sinhala" ? "si" : "en",
    levels: levelNames.map((name, index) => ({
      id: index + 1,
      name,
      modules: modules.filter((module) => module.level === index + 1)
    }))
  };
}

export const courses: Course[] = [
  createCourse("english-to-sinhala"),
  createCourse("sinhala-to-english")
];

const sinhalaCharacters = [
  ["අ", "a", "a as in about", "අම්මා", "mother"],
  ["ආ", "ā", "long aa", "ආයුබෝවන්", "hello"],
  ["ඇ", "æ", "short ae", "ඇස", "eye"],
  ["ඈ", "ǣ", "long ae", "ඈත", "far"],
  ["ඉ", "i", "short i", "ඉර", "sun"],
  ["ඊ", "ī", "long ee", "ඊයේ", "yesterday"],
  ["උ", "u", "short u", "උදය", "morning"],
  ["ඌ", "ū", "long oo", "ඌරා", "pig"],
  ["එ", "e", "short e", "එක", "one"],
  ["ඒ", "ē", "long e", "ඒක", "that"],
  ["ඔ", "o", "short o", "ඔබ", "you"],
  ["ඕ", "ō", "long o", "ඕනෑ", "want"],
  ["ක", "ka", "k", "කමල", "lotus"],
  ["ග", "ga", "g", "ගම", "village"],
  ["ච", "ca", "ch", "චිත්‍රය", "picture"],
  ["ජ", "ja", "j", "ජලය", "water"],
  ["ට", "ṭa", "retroflex t", "ටිකට්පත", "ticket"],
  ["ඩ", "ḍa", "retroflex d", "ඩබරය", "quarrel"],
  ["ත", "ta", "dental t", "තරුව", "star"],
  ["ද", "da", "d", "දත", "tooth"],
  ["න", "na", "n", "නම", "name"],
  ["ප", "pa", "p", "පලතුර", "fruit"],
  ["බ", "ba", "b", "බත්", "rice"],
  ["ම", "ma", "m", "මල", "flower"],
  ["ය", "ya", "y", "යතුර", "key"],
  ["ර", "ra", "r", "රට", "country"],
  ["ල", "la", "l", "ලියුම", "letter"],
  ["ව", "va", "v", "වතුර", "water"],
  ["ස", "sa", "s", "සමනලයා", "butterfly"],
  ["හ", "ha", "h", "හඳ", "moon"]
] as const;

export const sinhalaAlphabet: AlphabetEntry[] = sinhalaCharacters.map(
  ([character, transliteration, sound, example, meaning], index) => ({
    id: `si-${index + 1}`,
    character,
    name: transliteration,
    category: index < 12 ? "Independent vowels" : "Consonants",
    transliteration,
    sound,
    explanation: `Listen, trace and notice the sound “${sound}”.`,
    example,
    meaning,
    language: "si"
  })
);

export const englishAlphabet: AlphabetEntry[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  .split("")
  .map((letter, index) => {
    const examples = [
      "apple",
      "book",
      "cat",
      "dog",
      "egg",
      "fish",
      "goat",
      "hat",
      "ink",
      "jam",
      "kite",
      "lamp",
      "moon",
      "net",
      "orange",
      "pen",
      "queen",
      "rain",
      "sun",
      "tree",
      "umbrella",
      "van",
      "water",
      "box",
      "yellow",
      "zebra"
    ];
    const meanings = [
      "ඇපල්",
      "පොත",
      "පූසා",
      "බල්ලා",
      "බිත්තරය",
      "මාළුවා",
      "එළුවා",
      "තොප්පිය",
      "තීන්ත",
      "ජෑම්",
      "සරුංගලය",
      "ලාම්පුව",
      "හඳ",
      "දැල",
      "දොඩම්",
      "පෑන",
      "රැජින",
      "වැස්ස",
      "හිරු",
      "ගස",
      "කුඩය",
      "වෑන් රථය",
      "වතුර",
      "පෙට්ටිය",
      "කහ",
      "සීබ්‍රා"
    ];
    return {
      id: `en-${letter}`,
      character: letter,
      secondary: letter.toLowerCase(),
      name: letter,
      category: "English letters",
      transliteration: letter,
      sound: `Common sound of ${letter}`,
      explanation: `${letter} අකුර හඳුනාගෙන උච්චාරණය පුහුණු වන්න.`,
      example: examples[index] ?? letter,
      meaning: meanings[index] ?? "",
      language: "en"
    };
  });

const conversationSeeds = [
  [
    "Meeting someone",
    "කෙනෙකු හමුවීම",
    "Hello! How are you?",
    "ආයුබෝවන්! ඔබට කොහොමද?",
    "āyubōvan! obaṭa kohomada?"
  ],
  [
    "Introducing yourself",
    "තමන් හඳුන්වාදීම",
    "My name is Nimal.",
    "මගේ නම නිමල්.",
    "magē nama Nimal."
  ],
  [
    "Greeting a teacher",
    "ගුරුවරයෙකුට ආචාර කිරීම",
    "Good morning, teacher.",
    "සුබ උදෑසනක්, ගුරුතුමනි.",
    "suba udǣsanak, gurutummani."
  ],
  [
    "Talking to a friend",
    "මිතුරෙකු සමඟ කතා කිරීම",
    "Shall we meet later?",
    "අපි පසුව හමුවෙමුද?",
    "api pasuva hamuvemuda?"
  ],
  ["At school", "පාසලේදී", "Where is the library?", "පුස්තකාලය කොහෙද?", "pustakālaya koheda?"],
  ["At work", "රැකියාවේදී", "The meeting is at ten.", "රැස්වීම දහයට.", "ræsvīma dahayaṭa."],
  ["At a shop", "කඩයකදී", "How much is this?", "මේක කීයද?", "mēka kīyada?"],
  ["Ordering food", "ආහාර ඇණවුම් කිරීම", "Tea, please.", "කරුණාකර තේ එකක්.", "karuṇākara tē ekak."],
  [
    "Asking directions",
    "දිශා විමසීම",
    "How do I go to the station?",
    "නැවතුම්පොළට යන්නේ කොහොමද?",
    "nævatumpoḷaṭa yannē kohomada?"
  ],
  [
    "Public transport",
    "පොදු ප්‍රවාහනය",
    "One ticket, please.",
    "කරුණාකර ටිකට් එකක්.",
    "karuṇākara ṭikaṭ ekak."
  ],
  [
    "Telephone call",
    "දුරකථන ඇමතුම",
    "May I speak to Mala?",
    "මට මාලාට කතා කරන්න පුළුවන්ද?",
    "maṭa Mālāṭa katā karanna puḷuvanda?"
  ],
  [
    "Asking for help",
    "උදව් ඉල්ලීම",
    "Can you help me?",
    "ඔබට මට උදව් කරන්න පුළුවන්ද?",
    "obaṭa maṭa udav karanna puḷuvanda?"
  ]
] as const;

export const conversations: Conversation[] = conversationSeeds.map(
  ([title, titleSi, english, sinhala, transliteration], index) => ({
    id: `conversation-${index + 1}`,
    title,
    titleSi,
    context: title,
    objective: `Complete a respectful exchange about ${title.toLowerCase()}.`,
    lines: [
      { speaker: "A", english, sinhala, transliteration },
      {
        speaker: "B",
        english: index % 2 ? "Certainly. Thank you." : "I am well, thank you.",
        sinhala: index % 2 ? "හොඳයි. ස්තුතියි." : "මම හොඳින්, ස්තුතියි.",
        transliteration: index % 2 ? "hon̆dayi. stutiyi." : "mama hon̆din, stutiyi."
      },
      {
        speaker: "A",
        english: "See you again.",
        sinhala: "නැවත හමුවෙමු.",
        transliteration: "nævata hamuvemu."
      }
    ],
    question: "Which phrase keeps the exchange polite?",
    answer: "please / කරුණාකර"
  })
);

const grammarSeeds = [
  ["Pronouns", "සර්වනාම"],
  ["Nouns and plurals", "නාම පද හා බහු වචන"],
  ["Articles", "උපපද"],
  ["Useful verbs", "ප්‍රයෝජනවත් ක්‍රියාපද"],
  ["Adjectives", "නාම විශේෂණ"],
  ["Word order", "පද පිළිවෙළ"],
  ["Present time", "වර්තමාන කාලය"],
  ["Past time", "අතීත කාලය"],
  ["Future expressions", "අනාගත ප්‍රකාශ"],
  ["Questions", "ප්‍රශ්න"],
  ["Negatives and possession", "නිෂේධ හා අයිතිය"],
  ["Prepositions and polite usage", "නිපාත හා ආචාරශීලී භාවිතය"]
] as const;

export const grammarTopics: GrammarTopic[] = grammarSeeds.map(([title, titleSi], index) => ({
  id: `grammar-${index + 1}`,
  title,
  titleSi,
  explanationEn: `${title} become easier when you learn them through short, useful patterns instead of isolated rules.`,
  explanationSi: `${titleSi} කෙටි, ප්‍රයෝජනවත් රටා මඟින් සරලව ඉගෙන ගනිමු.`,
  examples: [
    { english: "I read a book.", sinhala: "මම පොතක් කියවනවා.", breakdown: "I / book / read" },
    { english: "She is at home.", sinhala: "ඇය ගෙදර ඉන්නවා.", breakdown: "she / home / is" }
  ]
}));
