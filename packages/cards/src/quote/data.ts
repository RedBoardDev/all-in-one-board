
import type { QuoteData } from "./types";

const QUOTES = [
  {
    content: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    tag: "Work",
  },
  {
    content: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
    tag: "Leadership",
  },
  { content: "Stay hungry, stay foolish.", author: "Steve Jobs", tag: "Life" },
  {
    content: "It always seems impossible until it's done.",
    author: "Nelson Mandela",
    tag: "Motivation",
  },
  {
    content:
      "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    tag: "Future",
  },
  {
    content: "Code is like humor. When you have to explain it, it's bad.",
    author: "Cory House",
    tag: "Programming",
  },
  {
    content: "Simplicity is the soul of efficiency.",
    author: "Austin Freeman",
    tag: "Efficiency",
  },
  {
    content: "Talk is cheap. Show me the code.",
    author: "Linus Torvalds",
    tag: "Programming",
  },
];

export async function getQuoteData(): Promise<QuoteData> {
  // Simulate network delay to show skeletons
  await new Promise((resolve) => setTimeout(resolve, 800));

  const randomIndex = Math.floor(Math.random() * QUOTES.length);
  return QUOTES[randomIndex];
}

