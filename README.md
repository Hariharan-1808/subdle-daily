# 🧩 Subdle Daily — The Daily Mystery Subreddit Game for Reddit

> **Reddit Game of the Day Hackathon 2026 Submission**  
> Built with **Devvit Web**, **React 19**, **Tailwind CSS v4**, and **Hono**.

[![Devvit Web](https://img.shields.io/badge/Devvit-Web%200.15.3-FF4500?logo=reddit&logoColor=white)](https://developers.reddit.com)
[![React](https://img.shields.io/badge/React-19.3-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

---

## 🎮 What is Subdle Daily?

**Subdle Daily** is a viral, bite-sized daily puzzle game designed natively for Reddit feeds via **Devvit Web (Interactive Posts)**. 

Inspired by Wordle, Heardle, and Redactle, Subdle challenges Redditors each day to guess a mystery subreddit in **4 clues or fewer**:

1. **Clue 1: Audience & Age** — Total subscriber count and the year the subreddit was founded.
2. **Clue 2: Community Category** — The primary topic / niche tag (e.g. Science, Gaming, Casual Discussion).
3. **Clue 3: Redacted Viral Post** — An iconic, all-time top post title with the community name redacted.
4. **Clue 4: Signature Rule** — A unique sidebar moderation rule that distinguishes the community.

Each incorrect guess or manual clue unlock reveals the next clue card. Players share their results in Reddit comments with spoiler-formatted emoji grids (`Subdle #42 2/4 🟩🟩⬜⬜`).

---

## ✨ Features

- **Daily Puzzle Engine:** Deterministic day-of-year algorithm delivers the exact same daily puzzle to all Reddit users globally each day.
- **Progressive Clue Reveal:** 4 mystery cards progressively unlock, rewarding sharp subreddit connoisseurs while keeping the game accessible to casual scrollers.
- **Smart Autocomplete:** Live predictive search matching over 100+ popular subreddit communities to eliminate typos.
- **Streak & Stat Tracking:** Tracks winning streaks and game history in persistent local storage.
- **Reddit Comment Share Format:** Instant one-click copy button generating spoiler-safe emoji result grids tailored for Reddit thread comments.
- **Unlimited Practice Mode:** Jump into unlimited randomized practice rounds anytime to test subreddit trivia knowledge.
- **Native Devvit Web Integration:** Seamless transition from inline feed teaser (`splash.tsx`) to full immersive fullscreen app (`game.tsx`).

---

## 🏗️ Architecture

```
subdle-daily/
├── devvit.json             # Devvit app manifest & interactive post entrypoints
├── src/
│   ├── client/
│   │   ├── data/
│   │   │   └── subreddits.ts   # Curated database of iconic subreddits & clues
│   │   ├── splash.tsx          # Feed inline interactive card (teaser + play CTA)
│   │   ├── splash.html         # Inline WebView entry point
│   │   ├── game.tsx            # Full expanded interactive game app
│   │   ├── game.html           # Fullscreen WebView entry point
│   │   └── index.css           # Tailwind CSS v4 styling
│   ├── server/
│   │   ├── core/
│   │   │   └── post.ts         # Post creation handler via Reddit API
│   │   ├── routes/             # Hono backend API and menu triggers
│   │   └── index.ts            # Devvit backend server entry
│   └── shared/
│       └── api.ts              # Shared type contracts
```

---

## 🚀 Development & Playtesting

### Prerequisites
- Node.js 22+ or 24+
- Devvit CLI (`@devvit/start`, `devvit`)

### Local Development
```bash
# Install dependencies
npm install

# Start local Devvit playtest server
npm run dev
```

### Build & Verification
```bash
# Type check with TypeScript compiler
npm run test:types

# Lint source files with ESLint
npm run lint

# Compile client & server bundles with Vite
npm run build
```

---

## 📜 License
BSD-3-Clause
