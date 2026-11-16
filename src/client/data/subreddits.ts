export interface SubredditPuzzle {
  id: number;
  name: string;
  subscribers: string;
  foundedYear: number;
  category: string;
  redactedPost: string;
  signatureRule: string;
  description: string;
  iconBg: string;
}

export const SUBREDDIT_DATABASE: SubredditPuzzle[] = [
  {
    id: 1,
    name: "AskReddit",
    subscribers: "45.8 Million",
    foundedYear: 2008,
    category: "General Discussion & Questions",
    redactedPost: "\"What is a fact that sounds completely [BLANK] but is actually 100% true?\"",
    signatureRule: "Rule 1: All post titles must be open-ended questions only.",
    description: "The place to ask and answer thought-provoking open-ended questions.",
    iconBg: "#FF4500"
  },
  {
    id: 2,
    name: "gaming",
    subscribers: "39.2 Million",
    foundedYear: 2007,
    category: "Video Games & Esports",
    redactedPost: "\"My 68-year-old dad finally completed his very first [BLANK] after 140 hours!\"",
    signatureRule: "Rule 1: Submissions must be directly related to gaming.",
    description: "A community dedicated to all things related to video games across all platforms.",
    iconBg: "#7193FF"
  },
  {
    id: 3,
    name: "aww",
    subscribers: "34.5 Million",
    foundedYear: 2008,
    category: "Cute Animals & Pets",
    redactedPost: "\"Adopted this tiny three-legged kitten from the shelter today. Reddit, meet [BLANK]!\"",
    signatureRule: "Rule 1: Content must be strictly cute, cuddly, or heart-warming. No sad content.",
    description: "Things that make you go AWW! Like puppies, bunnies, and cute babies.",
    iconBg: "#FFB000"
  },
  {
    id: 4,
    name: "todayilearned",
    subscribers: "33.1 Million",
    foundedYear: 2008,
    category: "Educational Trivia & History",
    redactedPost: "\"TIL that astronaut Neil Armstrong's Apollo 11 spacesuit was sewn by [BLANK] bra seamstresses.\"",
    signatureRule: "Rule 1: Post title must begin with 'TIL' and cite a reliable factual source.",
    description: "You learn something new every day; what did you learn today?",
    iconBg: "#46D160"
  },
  {
    id: 5,
    name: "science",
    subscribers: "32.0 Million",
    foundedYear: 2006,
    category: "Research, Physics & Biology",
    redactedPost: "\"New clinical study published in Nature reveals [BLANK] can reverse cellular aging biomarkers in human trials.\"",
    signatureRule: "Rule 1: Comments must be on-topic and substantive. Jokes and low-effort memes will be removed.",
    description: "This community is a place to share and discuss new scientific research.",
    iconBg: "#0079D3"
  },
  {
    id: 6,
    name: "showerthoughts",
    subscribers: "28.4 Million",
    foundedYear: 2011,
    category: "Philosophy & Epiphanies",
    redactedPost: "\"If you are over 25 years old, every single dog that was alive on Earth when you were born is now [BLANK].\"",
    signatureRule: "Rule 1: All thoughts must be original, casual philosophical epiphanies had during mundane moments.",
    description: "A subreddit for sharing those miniature epiphanies you have that highlight the oddities of life.",
    iconBg: "#94E044"
  },
  {
    id: 7,
    name: "movies",
    subscribers: "31.2 Million",
    foundedYear: 2008,
    category: "Cinema & Filmmaking",
    redactedPost: "\"What is a movie plot twist that you completely saw coming from the opening [BLANK]?\"",
    signatureRule: "Rule 1: Discussions must focus directly on released or upcoming feature films.",
    description: "News & discussion about major motion pictures and independent cinema.",
    iconBg: "#FF585B"
  },
  {
    id: 8,
    name: "explainlikeimfive",
    subscribers: "23.6 Million",
    foundedYear: 2011,
    category: "Simplified Explanations",
    redactedPost: "\"ELI5: Why do our eyes automatically close when we [BLANK]?\"",
    signatureRule: "Rule 1: Don't literally explain for a 5-year-old. Aim for a layperson with no domain knowledge.",
    description: "Explain like I'm five: simplified answers to complex questions for curious minds.",
    iconBg: "#FF66AC"
  },
  {
    id: 9,
    name: "mildlyinteresting",
    subscribers: "22.9 Million",
    foundedYear: 2012,
    category: "Everyday Curiosities",
    redactedPost: "\"The way the morning frost formed across my car windshield looks like a dense [BLANK] forest.\"",
    signatureRule: "Rule 1: Original Photographs Only (OC). Must be mildly, pleasantly interesting — not wild.",
    description: "For photos that are, you know, mildly interesting.",
    iconBg: "#24A0ED"
  },
  {
    id: 10,
    name: "space",
    subscribers: "23.4 Million",
    foundedYear: 2008,
    category: "Astronomy & Cosmology",
    redactedPost: "\"James Webb Space Telescope captures the deepest, sharpest infrared image of the distant [BLANK] ever recorded.\"",
    signatureRule: "Rule 1: Dedicated solely to astronomy and space exploration science.",
    description: "Dedicated to the vastness of space and exploration of our cosmos.",
    iconBg: "#001489"
  },
  {
    id: 11,
    name: "dataisbeautiful",
    subscribers: "20.1 Million",
    foundedYear: 2012,
    category: "Charts, Infographics & Stats",
    redactedPost: "\"[OC] Visualization tracking every country's average life expectancy versus [BLANK] consumption over 50 years.\"",
    signatureRule: "Rule 1: Visualizations must clearly communicate data. [OC] requires source & tool citations.",
    description: "A place on Reddit for aesthetic and compelling data visualizations.",
    iconBg: "#FF4500"
  },
  {
    id: 12,
    name: "diy",
    subscribers: "22.8 Million",
    foundedYear: 2008,
    category: "Home Improvement & Crafts",
    redactedPost: "\"Built a secret bookshelf door leading to my hidden home office for under [BLANK] dollars.\"",
    signatureRule: "Rule 1: Must document the actual build process step-by-step with photos.",
    description: "Do it yourself! Projects, step-by-step guides, and home workshop repairs.",
    iconBg: "#CC3600"
  }
];

export const ALL_SUBREDDIT_NAMES = [
  "AskReddit",
  "gaming",
  "aww",
  "todayilearned",
  "science",
  "showerthoughts",
  "movies",
  "explainlikeimfive",
  "mildlyinteresting",
  "space",
  "dataisbeautiful",
  "diy",
  "technology",
  "books",
  "memes",
  "sports",
  "food",
  "art",
  "history",
  "music",
  "news",
  "worldnews",
  "funny",
  "gifs",
  "pics",
  "gadgets",
  "television",
  "philosophy",
  "nottheonion",
  "gadgets"
];

// Returns the daily puzzle based on current day of year
export function getDailyPuzzle(dayOffset: number = 0): SubredditPuzzle {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime() + (dayOffset * 86400000);
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const puzzleIndex = Math.abs(dayOfYear % SUBREDDIT_DATABASE.length);
  const selected = SUBREDDIT_DATABASE[puzzleIndex];
  if (!selected) {
    return SUBREDDIT_DATABASE[0] as SubredditPuzzle;
  }
  return selected;
}
