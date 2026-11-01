import { conversations, grammarTopics } from "../data/content";

/**
 * Real sentences for a word, taken from the app's own conversations and
 * grammar guides. Replaces the old generated line ("Use X in everyday
 * conversation") that every word used to get: a word with no real sentence
 * now shows none, rather than a hollow one.
 *
 * Matching is by whole word. Sinhala adds case endings to the word itself
 * (ඔබ → ඔබට), so a substring match would claim a sentence uses a word it
 * only contains part of; exact tokens only, at the cost of missing inflected
 * uses.
 */

export interface RealExample {
  english: string;
  sinhala: string;
  /** Where in the app the sentence comes from, for the learner to go and hear it. */
  source: string;
}

const tokens = (text: string) =>
  text
    .replace(/[.,!?;:“”"'()]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

const sentences: RealExample[] = (() => {
  const seen = new Map<string, RealExample>();
  for (const conversation of conversations)
    for (const line of conversation.lines)
      if (!seen.has(line.sinhala))
        seen.set(line.sinhala, {
          english: line.english,
          sinhala: line.sinhala,
          source: `${conversation.title} conversation`
        });
  for (const topic of grammarTopics)
    for (const example of topic.examples)
      if (!seen.has(example.sinhala))
        seen.set(example.sinhala, {
          english: example.english,
          sinhala: example.sinhala,
          source: "Grammar guide"
        });
  return [...seen.values()];
})();

export function realExampleFor(sinhala: string): RealExample | undefined {
  const word = tokens(sinhala);
  if (!word.length) return undefined;
  return sentences.find((sentence) => {
    const words = tokens(sentence.sinhala);
    return words.some((_, start) => word.every((part, offset) => words[start + offset] === part));
  });
}
