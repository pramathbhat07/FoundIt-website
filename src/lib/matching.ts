import { Item } from "../types";

export interface MatchResult {
  item: Item;
  score: number;
  matchReasons: string[];
}

// General vocabulary and stop words
const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "with",
  "my",
  "i",
  "lost",
  "found",
  "is",
  "was",
  "it",
  "of",
  "this",
  "that",
  "around",
  "near",
  "by",
]);

function extractKeywords(text: string): string[] {
  if (!text) return [];
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/);
  return words.filter((w) => w.length > 3 && !STOP_WORDS.has(w));
}

function extractColors(text: string): string[] {
  if (!text) return [];
  const colors = [
    "black",
    "white",
    "blue",
    "red",
    "green",
    "yellow",
    "silver",
    "gold",
    "gray",
    "grey",
    "purple",
    "orange",
    "brown",
    "pink",
    "clear",
    "transparent",
  ];
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/);
  return colors.filter((c) => words.includes(c));
}

export function calculateMatch(
  target: Partial<Item>,
  candidate: Item,
): MatchResult {
  let score = 0;
  const matchReasons: string[] = [];

  // 1. Category Match - 30 points max
  if (target.category && candidate.category) {
    if (target.category === candidate.category) {
      score += 30;
      matchReasons.push("Same category");
    }
  }

  // 2. Keyword matching in title and description - 40 points max
  const targetText = `${target.title || ""} ${target.description || ""}`;
  const candidateText = `${candidate.title} ${candidate.description}`;

  const targetKeywords = new Set(extractKeywords(targetText));
  const candidateKeywords = new Set(extractKeywords(candidateText));

  let keywordMatches = 0;
  for (const kw of targetKeywords) {
    if (candidateKeywords.has(kw)) {
      keywordMatches++;
    }
  }

  if (targetKeywords.size > 0) {
    // If we have some matches, scale score appropriately
    const keywordScore = Math.min(
      40,
      (keywordMatches / Math.max(1, Math.min(targetKeywords.size, 3))) * 40,
    );
    score += keywordScore;
    if (keywordMatches > 0) {
      matchReasons.push(`Shared keywords`);
    }
  }

  // 3. Color extraction and match - 15 points
  const targetColors = new Set(extractColors(targetText));
  const candidateColors = new Set(extractColors(candidateText));

  let colorMatches = 0;
  for (const c of targetColors) {
    if (candidateColors.has(c)) {
      colorMatches++;
    }
  }
  if (colorMatches > 0) {
    score += 15;
    matchReasons.push("Matching colors");
  }

  // 4. Location matching (very basic string presence) - 15 points
  if (target.location && candidate.location) {
    const tl = target.location.toLowerCase();
    const cl = candidate.location.toLowerCase();

    // Basic heuristic: check if significant words in locations match
    const tlWords = extractKeywords(tl);
    const clWords = extractKeywords(cl);

    const sharedLocWords = tlWords.filter((w) => clWords.includes(w));
    if (sharedLocWords.length > 0) {
      score += 15;
      matchReasons.push("Similar location");
    }
  }

  // Normalize score to 100 max just to be safe
  score = Math.min(100, Math.round(score));

  return {
    item: candidate,
    score,
    matchReasons,
  };
}

export function findTopMatches(
  target: Partial<Item>,
  candidates: Item[],
  threshold: number = 40,
): MatchResult[] {
  const matches = candidates
    .map((c) => calculateMatch(target, c))
    .filter((m) => m.score >= threshold)
    .sort((a, b) => b.score - a.score);

  return matches;
}
