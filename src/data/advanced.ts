/**
 * Intermediate and Expert levels: grammar, taught through real sentences.
 *
 * The ledger rule, as in Nenarivu: every Sinhala sentence here is quoted from
 * a source that allows it (the FSI course is a U.S. government work and in the
 * public domain), with its printed page. Explanations are LingoLanka's own
 * words, and each one names the page or section its fact comes from. Topics no
 * source covers are left out rather than written from memory, which is why
 * there is no lesson on literary verb endings or monastic honorifics.
 *
 * Spellings follow today's standard where the 1979 typewriter print differs
 * (පුලුවනි → පුළුවනි, එලවන්න → එළවන්න, නැ → නෑ, බැ → බෑ, ලඟ → ළඟ); everything
 * else is as printed. src/test/advanced.test.ts enforces the ledger.
 */
import type { Exercise, Lesson, Module } from "../types";
import { transliterate } from "../lib/transliterate";
import { citationLabel, type Citation } from "./sources";

export interface SourcedExample {
  si: string;
  en: string;
  cite: Citation;
}

export interface Point {
  text: string;
  cite?: Citation;
}

/** A comprehension question for lessons whose content is explanation, not sentences. */
export interface Check {
  question: string;
  answer: string;
  wrong: string[];
  cite: Citation;
}

export interface AdvancedLesson {
  id: string;
  level: 6 | 7;
  title: string;
  /** A sourced form the lesson is about, shown as the lesson's Sinhala heading. */
  titleSi: string;
  summary: string;
  points: Point[];
  examples: SourcedExample[];
  checks?: Check[];
  minutes: number;
}

const fsi = (at: string): Citation => ({ source: "fsi-structures", at });
const wiki = (at: string): Citation => ({ source: "wikipedia-sinhala", at });
const ex = (si: string, en: string, at: string): SourcedExample => ({ si, en, cite: fsi(at) });

export const advancedLessons: AdvancedLesson[] = [
  {
    id: "si-int-word-order",
    level: 6,
    title: "Verbs go last",
    titleSi: "යනවා",
    summary:
      "Sinhala sentences end with the verb. Learn that one habit and most simple sentences fall into place.",
    points: [
      {
        text: "The usual order is subject, then object or place, then the verb at the very end. English “I am going home” becomes “I home am-going”.",
        cite: wiki("§Syntax")
      },
      {
        text: "Words English puts before a noun (on, under, near) come after it in Sinhala, so “under the book” is පොත යට, literally “book under”.",
        cite: wiki("§Syntax")
      },
      {
        text: "Others that work the same way: උඩ on top of, ළඟ near, ගැන about, වගේ like, පස්සේ after.",
        cite: fsi("p. 85")
      }
    ],
    examples: [
      ex("මම ගෙදර යනවා.", "I am going home.", "p. 29, §2.21"),
      ex("අම්මා බත් උයනවා.", "Mother cooks rice.", "p. 29, §2.21"),
      ex("ඉස්කෝලේ මහත්තයා සිංහල උගන්නනවා.", "The schoolmaster teaches Sinhala.", "p. 29, §2.21"),
      ex("මල්ලි මෙහාට එනවා.", "Younger brother is coming in this direction.", "p. 29, §2.21")
    ],
    minutes: 8
  },
  {
    id: "si-int-be",
    level: 6,
    title: "Two verbs for “be”",
    titleSi: "ඉන්නවා · තියෙනවා",
    summary:
      "Sinhala asks whether a thing is alive before it says the thing is there. People and animals take one verb, objects another.",
    points: [
      {
        text: "ඉන්නවා is for living beings: people and animals. තියෙනවා is for things. The course is explicit that neither crosses over.",
        cite: fsi("p. 27, §1.51")
      },
      {
        text: "In the course's examples, people are counted with දෙනෙක් (තුන් දෙනෙක්, three people) and things with -ක් (තුනක්, three of them).",
        cite: fsi("p. 27")
      },
      {
        text: "“A” or “one” is an ending, not a separate word: -ek for living beings (බල්ලෙක්, a dog) and -ak for things (තුනක්).",
        cite: wiki("§Indefinite article")
      },
      {
        text: "Neither verb is used for “is rich” or “is big”. Sinhala simply puts the two words side by side: මම පොහොසත්, “I (am) rich”.",
        cite: wiki("§Syntax")
      }
    ],
    examples: [
      ex("මල්ලිලා ඉන්නවා.", "There are younger brothers.", "p. 27, §1.51"),
      ex("කාර් තියෙනවා.", "There are cars.", "p. 27, §1.51"),
      ex("මහත්තුරු තුන් දෙනෙක් ඉන්නවා.", "There are three gentlemen.", "p. 27, §1.51"),
      ex("කාර් තුනක් තියෙනවා.", "There are three cars.", "p. 27, §1.51"),
      ex("ගල් හතරක් තියෙනවා.", "There are four stones.", "p. 29, §2.21")
    ],
    minutes: 9
  },
  {
    id: "si-int-have",
    level: 6,
    title: "Having, and having to",
    titleSi: "මට ... තියෙනවා",
    summary:
      "There is no verb “to have”. Sinhala says “to me there is”, and the same pattern gives you “I have to”.",
    points: [
      {
        text: "Put the owner in the “to” form (මට to me, මහත්තයාට to the gentleman) and use “there is”: තියෙනවා for things, ඉන්නවා for people and animals.",
        cite: fsi("p. 17, §1.321")
      },
      {
        text: "Add a verb ending in -න්න before තියෙනවා and the sentence means “have to”: මට යන්න තියෙනවා, I have to go.",
        cite: fsi("p. 17, §1.321")
      }
    ],
    examples: [
      ex("මට සල්ලි තියෙනවා.", "I have money.", "p. 17, §1.321"),
      ex("මහත්තයාට බල්ලෙක් ඉන්නවා.", "The gentleman has a dog.", "p. 17, §1.321"),
      ex("මට ගෙදර යන්න තියෙනවා.", "I have to go home.", "p. 17, §1.321"),
      ex("මට කාර් එකෙන් යන්න තියෙනවා.", "I have to go by car.", "p. 17, §1.321"),
      ex("මට හාල් ගන්න තියෙනවා.", "I have to buy rice.", "p. 17, §1.321"),
      ex("මහත්තයාට වැඩ කරන්න තියෙනවා.", "The gentleman has to work.", "p. 17, §1.321")
    ],
    minutes: 9
  },
  {
    id: "si-int-want-can",
    level: 6,
    title: "Want, can, cannot",
    titleSi: "ඕනෑ · පුළුවන් · බෑ",
    summary:
      "Wanting and being able work like having: the person goes in the “to” form, and the verb takes -න්න.",
    points: [
      {
        text: "ඕනෑ means want, පුළුවනි can, and බෑ cannot. Each takes the person in the “to” form and a verb ending in -න්න.",
        cite: fsi("pp. 17, 69")
      },
      {
        text: "පුළුවන් is an equally correct form of පුළුවනි, and it is the one used before the question marker ද.",
        cite: fsi("p. 69")
      },
      {
        text: "To say you do not want something, use එපා after the thing: මට කිරි එපා.",
        cite: fsi("p. 70")
      },
      {
        text: "For the past, add උනා: ඕනෑ උනා, wanted.",
        cite: fsi("p. 70")
      }
    ],
    examples: [
      ex("මට ටිකට් එකක් ගන්න ඕනෑ.", "I want to get a ticket.", "p. 17, §1.321"),
      ex("මහත්තයාට තේ බොන්න ඕනෑ.", "The gentleman wants to drink tea.", "p. 17, §1.321"),
      ex("මට කිරි බත් කන්න ඕනෑ.", "I want to eat milk rice.", "p. 70"),
      ex("මට සිංහල කතා කරන්න පුළුවනි.", "I can speak Sinhala.", "p. 69"),
      ex("මට ඉංග්‍රීසි කියවන්න පුළුවනි.", "I can read English.", "p. 69"),
      ex("මට ගෙදර යන්න බෑ.", "I can't go home.", "p. 69"),
      ex("මට කිරි එපා.", "I don't want any milk.", "p. 70"),
      ex("මට කෝච්චියෙන් එන්න ඕනෑ උනා.", "I wanted to come by train.", "p. 70")
    ],
    minutes: 10
  },
  {
    id: "si-int-questions",
    level: 6,
    title: "Yes-or-no questions",
    titleSi: "ද?",
    summary: "Turn a statement into a question by adding ද at the end. Nothing else moves.",
    points: [
      {
        text: "Put ද after the verb. The word order of the statement stays exactly as it was.",
        cite: fsi("p. 31, §2.23")
      },
      {
        text: "It works the same after ඕනෑ and පුළුවන්: ඕනෑ ද? පුළුවන් ද?",
        cite: fsi("pp. 69–70")
      },
      {
        text: "The “(you)” in brackets is not missing from the Sinhala by accident: Sinhala leaves out anyone, or anything, that is clear from context.",
        cite: wiki("§Discourse")
      },
      {
        text: "Notice මහත්තයා, “the gentleman”, where English would say “you, sir”. Speaking about the listener with a title is ordinary politeness; the Terms of address lesson explains why.",
        cite: fsi("p. 83, §3.28")
      }
    ],
    examples: [
      ex("මහත්තයා ගෙදර යනවා ද?", "Is the gentleman going home?", "p. 31, §2.23"),
      ex("වතුර බොනවා ද?", "Are (you) drinking water?", "p. 31, §2.23"),
      ex("සල්ලි තියෙනවා ද?", "Is there money?", "p. 31, §2.23"),
      ex("මහත්තයාට වීසා එකක් ඕනෑ ද?", "Does the gentleman want a visa?", "p. 70"),
      ex("මහත්තයාට පත්තර කියවන්න පුළුවන් ද?", "Can you read the papers, sir?", "p. 69")
    ],
    minutes: 8
  },
  {
    id: "si-int-negation",
    level: 6,
    title: "Saying no",
    titleSi: "නෑ",
    summary:
      "The negative is not a word you add in front. The verb changes shape first, then නෑ follows.",
    points: [
      {
        text: "Change the verb to its -න්නේ form and add නෑ: බොනවා (drinks) becomes බොන්නේ නෑ (doesn't drink).",
        cite: fsi("p. 33, §2.241")
      },
      {
        text: "The two “be” verbs are the exception: තියෙනවා and ඉන්නවා are simply replaced by නෑ.",
        cite: fsi("p. 33, §2.241")
      }
    ],
    examples: [
      ex("මම බොනවා.", "I drink.", "p. 33, §2.241"),
      ex("මම බොන්නේ නෑ.", "I don't drink.", "p. 33, §2.241"),
      ex("මහත්තයා යන්නේ නෑ.", "The gentleman doesn't go.", "p. 33, §2.241"),
      ex("මම බිත්තර කන්නේ නෑ.", "I don't eat eggs.", "p. 33, §2.241"),
      ex("මම වැඩ කරන්නේ නෑ.", "I don't work.", "p. 33, §2.241")
    ],
    minutes: 8
  },
  {
    id: "si-int-past",
    level: 6,
    title: "The past",
    titleSi: "ගියා",
    summary:
      "The past tense sits where the present did, at the end, and says the action is finished.",
    points: [
      {
        text: "The simple past expresses a completed action. Like the present, it goes at the end of the sentence and can take ද.",
        cite: fsi("p. 40, §2.41")
      },
      {
        text: "The most common verbs have irregular pasts (යනවා → ගියා), so they are worth learning one at a time.",
        cite: fsi("p. 29, §2.1")
      }
    ],
    examples: [
      ex("මම වැඩ කෙරුවා.", "I worked.", "p. 39, §2.41"),
      ex("මම සිංහල ඉගෙනගන්නවා.", "I am learning Sinhala.", "p. 40, §2.41"),
      ex("මම සිංහල ඉගෙනගත්තා.", "I learned Sinhala.", "p. 40, §2.41"),
      ex("මම අර ගමට ගියා.", "I went to that village.", "p. 16"),
      ex("මම මල්ලිට සල්ලි දුන්නා.", "I gave money to younger brother.", "p. 16"),
      ex("මට ලියුමක් ලැබුණා.", "I got a letter.", "p. 86, §5.1")
    ],
    minutes: 9
  },
  {
    id: "si-int-cases",
    level: 6,
    title: "To, from, in",
    titleSi: "-ට · -න්",
    summary: "Where English uses little words before a noun, Sinhala changes the end of the noun.",
    points: [
      {
        text: "-ට means “to”: ඉන්දියාවට, to India. It is the same ending as මට, “to me”, in having and wanting.",
        cite: fsi("p. 16")
      },
      {
        text: "-න් (or -එන්) means “from”: අමෙරිකාවෙන්, from America; හෝටලෙන්, from the hotel.",
        cite: fsi("pp. 14, 16")
      },
      {
        text: "“Of” is -ගේ for people (මහත්තයාගේ, the gentleman's) and -ඒ for things (පොතේ, the book's).",
        cite: fsi("p. 22")
      }
    ],
    examples: [
      ex("තාත්තා ඉන්දියාවට යනවා.", "Father is going to India.", "p. 16"),
      ex("මහත්තයා ආවේ අමෙරිකාවෙන්.", "The gentleman came from America.", "p. 16"),
      ex("අපි ආවේ හෝටලෙන්.", "We came from the hotel.", "p. 14"),
      ex("මම ඉන්නේ නුවර.", "I live in Kandy.", "p. 16")
    ],
    minutes: 8
  },
  {
    id: "si-exp-emphatic",
    level: 7,
    title: "The spotlight form",
    titleSi: "යන්නේ",
    summary:
      "Sinhala can shine a light on one part of a sentence by changing the verb and moving that part to the end.",
    points: [
      {
        text: "The -න්නේ form of the verb means some item other than the verb is being emphasised. That item usually comes last.",
        cite: fsi("p. 31, §2.22")
      },
      {
        text: "The past has its own spotlight form, ending in -ē: කෑවේ (ate), ගියේ (went).",
        cite: fsi("p. 40, §2.42")
      },
      {
        text: "Questions with a question word use this form too: යන්නේ කොහේ ද? “Where are you going?”",
        cite: fsi("pp. 29, 40")
      },
      {
        text: "The course translates එයා as “he”, but එයා means “that person” and is used for anyone, women included.",
        cite: fsi("p. 83, §3.28")
      }
    ],
    examples: [
      ex("මම යන්නේ ගෙදර.", "It is home that I am going.", "p. 29, §2.22"),
      ex("කන්තෝරුව අටට අරිනවා.", "The office opens at 8:00.", "p. 31, §2.22"),
      ex("කන්තෝරුව අරින්නේ අටට.", "It is at 8:00 that the office opens.", "p. 31, §2.22"),
      ex("එයා හවස ආපහු එනවා.", "He is coming back in the evening.", "p. 31, §2.22"),
      ex("එයා ආපහු එන්නේ හවස.", "It is in the evening that he is coming back.", "p. 31, §2.22"),
      ex("මම කෑවේ මස්.", "It was meat that I ate.", "p. 40, §2.42"),
      ex("ගියේ කොහේ ද?", "Where did you go?", "p. 40, §2.42")
    ],
    minutes: 10
  },
  {
    id: "si-exp-focus",
    level: 7,
    title: "Not that, but…",
    titleSi: "නෙමෙයි",
    summary:
      "Once a sentence has a spotlight, questions and denials aim at the spotlit part, not at the verb.",
    points: [
      {
        text: "ද never follows the -න්නේ form. It goes after another item, usually the emphasised one.",
        cite: fsi("p. 31, §2.23")
      },
      {
        text: "To deny the spotlit part, add නෙමෙයි (“is not”) after it, instead of නෑ.",
        cite: fsi("p. 33, §2.242")
      }
    ],
    examples: [
      ex("එයා ගෙදර එන්නේ හවස ද?", "Is it in the evening that he is coming home?", "p. 31, §2.23"),
      ex("කන්තෝරුව වහන්නේ අටට ද?", "Is it at 8:00 that the office closes?", "p. 31, §2.23"),
      ex("එයා බොන්නේ වතුර ද?", "Is it water that he is drinking?", "p. 31, §2.23"),
      ex("මම යන්නේ කඩේට නෙමෙයි.", "It is not to the store that I am going.", "p. 33, §2.242"),
      ex("මම ඉන්නේ අමෙරිකාවේ නෙමෙයි.", "It is not in America that I live.", "p. 33, §2.242"),
      ex("මම බොන්නේ වතුර නෙමෙයි.", "It is not water that I drink.", "p. 33, §2.242")
    ],
    minutes: 10
  },
  {
    id: "si-exp-clauses",
    level: 7,
    title: "Because, when, if",
    titleSi: "නිසා · කොට · ඔත්",
    summary:
      "Sinhala joins ideas by changing the first verb's ending, not with a separate word in front.",
    points: [
      {
        text: "නිසා after the -න form of a verb means “because”: මම යන නිසා. In the negative it becomes -න්නේ නැති නිසා.",
        cite: fsi("p. 39")
      },
      {
        text: "-කොට means “when, while” (both at once). -ම means “when, after” (the first finishes before the second).",
        cite: fsi("p. 60, §2.81")
      },
      {
        text: "For “if”, take the simple past, drop its final -ā, and add -ot: ගියා → ගියොත්, ආවා → ආවොත්.",
        cite: fsi("p. 62, §2.91")
      },
      {
        text: "In these joined clauses, “not” is the prefix නො-: නොවැස්සොත්, if it doesn't rain.",
        cite: fsi("p. 71, §2.15")
      }
    ],
    examples: [
      ex("මම යන නිසා.", "Because I am going.", "p. 39"),
      ex("මම යන්නේ නැති නිසා.", "Because I am not going.", "p. 39"),
      ex(
        "මම රෙදි හෝදනකොට, සබන් පාවිච්චි කරනවා.",
        "When I wash clothes, I use soap.",
        "p. 60, §2.81"
      ),
      ex(
        "මම රෙදි හේදුවාම, අත් රතු වෙනවා.",
        "When I wash clothes (that is, after I have done so), my hands get red.",
        "p. 60, §2.81"
      ),
      ex(
        "හෙට වැස්සොත්, අපට පොළොන්නරුවට යන්න බෑ.",
        "If it rains tomorrow, we can't go to Polonnaruwa.",
        "p. 61, §2.91"
      ),
      ex(
        "ඔයා මේ කෑම කෑවොත්, අසනීප වෙනවා.",
        "If you were to eat this food, you would become sick.",
        "p. 62, §2.91"
      ),
      ex(
        "හෙට නොවැස්සොත්, මම පිටකොටුවට යනවා.",
        "If it doesn't rain tomorrow, I'm going to the Pettah.",
        "p. 71, §2.15"
      ),
      ex("මම එයාට නොකිව්වත්, එයා එනවා.", "Even if I don't tell him, he'll come.", "p. 71, §2.15")
    ],
    minutes: 12
  },
  {
    id: "si-exp-hearsay",
    level: 7,
    title: "They say: ලු",
    titleSi: "ලු",
    summary:
      "One small particle marks what you know only by hearing it. Leaving it out claims you saw it yourself.",
    points: [
      {
        text: "ලු means “it seems” or “they say”. It is added after the basic form of the verb.",
        cite: fsi("p. 72, §2.16")
      },
      {
        text: "Before ලු, නෑ becomes නැති.",
        cite: fsi("p. 72, §2.16")
      },
      {
        text: "ලු can follow words other than verbs: එයා තැපැල් මහත්තයා ලු, “they say he's the postmaster”.",
        cite: fsi("p. 72, §2.16")
      }
    ],
    examples: [
      ex("එයා ළඟ සල්ලි තියෙනවා ලු.", "He evidently has money on him.", "p. 72, §2.16"),
      ex("එයා ළඟ සල්ලි නැති ලු.", "He evidently has no money on him.", "p. 72, §2.16"),
      ex(
        "එයා තැපැල් කන්තෝරුවේ වැඩ කරන්නේ නැති ලු.",
        "It seems that he doesn't work in the post office.",
        "p. 72, §2.16"
      ),
      ex("එයා තැපැල් මහත්තයා ලු.", "They say he's the postmaster.", "p. 72, §2.16"),
      ex("මහත්තයා පොහොසත් ලු.", "It seems that the gentleman is rich.", "p. 72, §2.16")
    ],
    minutes: 9
  },
  {
    id: "si-exp-address",
    level: 7,
    title: "Terms of address",
    titleSi: "මහත්තයා · එයා",
    summary:
      "Choosing how to say “you” and “she” is where well-meaning learners most often give offence. Here is what the course says.",
    points: [
      {
        text: "Sinhala has no neutral word for “you” that suits everyone at all times. Speakers use a title such as මහත්තයා (sir), the person's name, or their role instead.",
        cite: fsi("p. 83, §3.28")
      },
      {
        text: "ගෑනි, used of one woman, is considered insulting. Refer to a woman as මෙයා (this person) or එයා (that person).",
        cite: fsi("p. 83, §3.28")
      },
      {
        text: "මිනිහා for a man is not rude, but it is not respectful either; it is closer to “guy”.",
        cite: fsi("p. 83, §3.28")
      },
      {
        text: "When unsure, a title is the safe choice. The sentences below show it in use."
      }
    ],
    examples: [
      ex("මහත්තයාට පත්තර කියවන්න පුළුවන් ද?", "Can you read the papers, sir?", "p. 69"),
      ex("මහත්තයා ගෙදර යනවා ද?", "Is the gentleman going home?", "p. 31, §2.23"),
      ex("එයා ගෙදර එන්නේ හවස ද?", "Is it in the evening that he is coming home?", "p. 31, §2.23"),
      ex(
        "ඔයා මේ කෑම කෑවොත්, අසනීප වෙනවා.",
        "If you were to eat this food, you would become sick.",
        "p. 62, §2.91"
      )
    ],
    checks: [
      {
        question: "Is there one word for “you” that is polite to everyone?",
        answer: "No: use a title, a name or a role",
        wrong: ["Yes: ඔයා works for anyone"],
        cite: fsi("p. 83, §3.28")
      },
      {
        question: "How do you politely refer to a woman who is not present?",
        answer: "එයා (that person)",
        wrong: ["ගෑනි"],
        cite: fsi("p. 83, §3.28")
      },
      {
        question: "What is මිනිහා closest to in English?",
        answer: "“guy”: neither rude nor respectful",
        wrong: ["“sir”", "an insult"],
        cite: fsi("p. 83, §3.28")
      }
    ],
    minutes: 10
  },
  {
    id: "si-exp-diglossia",
    level: 7,
    title: "Two Sinhalas",
    titleSi: "සිංහල",
    summary:
      "The Sinhala in newspapers is not the Sinhala people speak. Knowing which is which explains a lot of what you will read.",
    points: [
      {
        text: "Sinhala has two main varieties, written (literary) and spoken. A language split this way is said to be diglossic.",
        cite: wiki("§Diglossia")
      },
      {
        text: "Literary Sinhala is used for prose, poetry, official documents and television and radio news.",
        cite: wiki("§Diglossia")
      },
      {
        text: "Sermons, university lectures, political speeches and personal letters sit in between, mixing features of both.",
        cite: wiki("§Diglossia")
      },
      {
        text: "The clearest difference: spoken Sinhala does not change the verb for person, number or gender. Literary Sinhala does.",
        cite: wiki("§Diglossia")
      },
      {
        text: "Written Sinhala has its own grammar and a largely different, larger vocabulary. The FSI course points readers to Gair and Karunatilaka's Literary Sinhala (1974) for it.",
        cite: fsi("p. 101, §9")
      },
      {
        text: "Every lesson in LingoLanka teaches spoken Sinhala."
      }
    ],
    examples: [],
    checks: [
      {
        question: "Which variety do television and radio news use?",
        answer: "Literary (written) Sinhala",
        wrong: ["Spoken Sinhala"],
        cite: wiki("§Diglossia")
      },
      {
        question: "In spoken Sinhala, does the verb change for “I”, “you” and “they”?",
        answer: "No",
        wrong: ["Yes"],
        cite: wiki("§Diglossia")
      },
      {
        question: "Compared with spoken Sinhala, the vocabulary of written Sinhala is…",
        answer: "largely different, and larger",
        wrong: ["the same"],
        cite: fsi("p. 101, §9")
      },
      {
        question: "Which variety does LingoLanka teach?",
        answer: "Spoken Sinhala",
        wrong: ["Literary Sinhala"],
        cite: wiki("§Diglossia")
      }
    ],
    minutes: 7
  },
  {
    id: "si-exp-particles",
    level: 7,
    title: "More than, also, or",
    titleSi: "වැඩියෙ · -ත් · ද…ද",
    summary:
      "Three small pieces that make comparisons and lists: what goes where, and what each one attaches to.",
    points: [
      {
        text: "To compare, put the thing you compare against in the “to” form, then වැඩියෙ: අර ගෙදරට වැඩියෙ, “than that house”.",
        cite: fsi("p. 85")
      },
      {
        text: "-ත් means “also”. After a vowel it is -ත් (එයාත්); after a consonant it is -උත් (බතුත්).",
        cite: fsi("p. 86, §5.1")
      },
      {
        text: "Two items each followed by ද means “or”: හරි ද වැරදි ද?",
        cite: fsi("p. 86, §5.2")
      }
    ],
    examples: [
      ex("එළවළුවලට වැඩියෙ පලතුරු ගණන්.", "Fruit is more expensive than vegetables.", "p. 85"),
      ex("අර ගෙදරට වැඩියෙ මේ ගෙදර ලොකුයි.", "This house is bigger than that house.", "p. 85"),
      ex("එයාත් කන්තෝරුවට ගියා.", "He also went to the office.", "p. 86, §5.1"),
      ex("බතුත් දෙන්න.", "Give rice too.", "p. 86, §5.1"),
      ex("ඒක හරි ද වැරදි ද?", "Is it right or wrong?", "p. 86, §5.2")
    ],
    minutes: 9
  }
];

export const advancedLessonById = (id: string | undefined) =>
  advancedLessons.find((lesson) => lesson.id === id);

const MAX_SENTENCE_QUESTIONS = 6;

/**
 * Questions come only from the lesson's own sourced sentences: one way asks
 * what a Sinhala sentence means, the other asks which sentence says something.
 * Wrong options are other sentences from the same lesson, so nothing is made up.
 */
function sentenceExercises(lesson: AdvancedLesson): Exercise[] {
  const { examples } = lesson;
  return examples.slice(0, MAX_SENTENCE_QUESTIONS).map((example, index) => {
    const others = [1, 2, 3]
      .map((offset) => examples[(index + offset) % examples.length]!)
      .filter((other) => other !== example);
    const source = citationLabel(example.cite);
    const base = {
      id: `${lesson.id}-q${index + 1}`,
      acceptedAlternatives: [],
      difficulty: "intermediate" as const,
      xp: 10,
      explanation: `${example.si} — ${example.en} (${source})`
    };
    if (index % 2 === 0) {
      return {
        ...base,
        type: "multiple-choice",
        prompt: `What does “${example.si}” mean?`,
        instructions: "Listen, say it aloud once, then choose the meaning.",
        correctAnswer: example.en,
        distractors: others.map((other) => other.en),
        hint: transliterate(example.si),
        sourceLanguage: "si",
        targetLanguage: "en",
        learningSupport: {
          english: example.en,
          sinhala: example.si,
          transliteration: transliterate(example.si)
        }
      };
    }
    return {
      ...base,
      type: "multiple-choice",
      prompt: `Which sentence means “${example.en}”?`,
      instructions: "Read each option aloud before you choose.",
      correctAnswer: example.si,
      distractors: others.map((other) => other.si),
      hint: "",
      sourceLanguage: "en",
      targetLanguage: "si",
      optionPronunciations: Object.fromEntries(
        [example, ...others].map((item) => [item.si, transliterate(item.si)])
      )
    };
  });
}

function checkExercises(lesson: AdvancedLesson): Exercise[] {
  return (lesson.checks ?? []).map((check, index) => ({
    id: `${lesson.id}-c${index + 1}`,
    type: "true-false",
    prompt: check.question,
    instructions: "Choose the answer the lesson gives.",
    correctAnswer: check.answer,
    acceptedAlternatives: [],
    distractors: check.wrong,
    hint: "",
    explanation: `Source: ${citationLabel(check.cite)}`,
    difficulty: "intermediate",
    xp: 10,
    sourceLanguage: "en",
    targetLanguage: "en"
  }));
}

function toLesson(lesson: AdvancedLesson): Lesson {
  return {
    id: lesson.id,
    title: lesson.title,
    titleSi: lesson.titleSi,
    description: lesson.summary,
    minutes: lesson.minutes,
    vocabularyIds: [],
    exercises: [...sentenceExercises(lesson), ...checkExercises(lesson)],
    outcomes: lesson.points.map((point) => point.text)
  };
}

export const advancedLevels: Array<{ id: number; name: string; modules: Module[] }> = [
  {
    id: 6,
    name: "Intermediate",
    modules: [
      {
        id: "si-module-intermediate",
        title: "How Sinhala sentences work",
        titleSi: "මම ගෙදර යනවා.",
        overview:
          "Word order, the two verbs for “be”, having, wanting, asking, saying no, the past and noun endings. Every sentence is quoted from the FSI course.",
        level: 6,
        lessons: advancedLessons.filter((lesson) => lesson.level === 6).map(toLesson),
        rewardXp: 150
      }
    ]
  },
  {
    id: 7,
    name: "Expert",
    modules: [
      {
        id: "si-module-expert",
        title: "Emphasis, clauses and courtesy",
        titleSi: "මම යන්නේ ගෙදර.",
        overview:
          "The spotlight form, joined clauses, hearsay, how to address people respectfully, and the gap between written and spoken Sinhala.",
        level: 7,
        lessons: advancedLessons.filter((lesson) => lesson.level === 7).map(toLesson),
        rewardXp: 200
      }
    ]
  }
];
