import './index.css';

import { navigateTo, context, requestExpandedMode } from '@devvit/web/client';
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';

export const Splash = () => {
  const [streak] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('subdle_streak');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [puzzleNum] = useState<number>(() => {
    const epoch = new Date(2026, 0, 1).getTime();
    const today = new Date().getTime();
    return Math.max(1, Math.floor((today - epoch) / (1000 * 60 * 60 * 24)));
  });

  return (
    <div className="flex relative flex-col justify-center items-center min-h-[460px] p-6 bg-gradient-to-b from-[#0e1113] via-[#14171a] to-[#0c0d0e] text-white select-none">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 bg-orange-500/10 blur-3xl pointer-events-none rounded-full" />

      {/* Header Pill */}
      <div className="flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold tracking-wider uppercase">
        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
        Subdle Daily #{puzzleNum}
      </div>

      {/* Title & Snoo Mascot */}
      <div className="flex items-center justify-center gap-3 mb-2">
        <img
          className="w-12 h-12 object-contain drop-shadow-[0_4px_12px_rgba(255,69,0,0.35)]"
          src="/snoo.png"
          alt="Snoo"
        />
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-100 to-orange-400 bg-clip-text text-transparent">
          Subdle
        </h1>
      </div>

      <p className="text-sm sm:text-base text-gray-400 text-center max-w-sm mb-5 leading-snug">
        Can you guess today's mystery subreddit in <span className="text-orange-400 font-semibold">4 clues</span> or fewer?
      </p>

      {/* Clues Preview Grid */}
      <div className="grid grid-cols-2 gap-2 w-full max-w-xs mb-6 text-xs">
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300">
          <span className="text-base">👥</span>
          <div>
            <div className="text-[10px] text-gray-400 uppercase font-semibold">Clue 1</div>
            <div>Audience & Age</div>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300">
          <span className="text-base">🏷️</span>
          <div>
            <div className="text-[10px] text-gray-400 uppercase font-semibold">Clue 2</div>
            <div>Category Tag</div>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300">
          <span className="text-base">🤫</span>
          <div>
            <div className="text-[10px] text-gray-400 uppercase font-semibold">Clue 3</div>
            <div>Top Post (Redacted)</div>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300">
          <span className="text-base">📜</span>
          <div>
            <div className="text-[10px] text-gray-400 uppercase font-semibold">Clue 4</div>
            <div>Signature Rule</div>
          </div>
        </div>
      </div>

      {/* Play Action Button */}
      <button
        className="group relative flex items-center justify-center gap-2 w-full max-w-xs py-3 px-6 rounded-full bg-gradient-to-r from-[#ff4500] to-[#ff5722] hover:from-[#e03d00] hover:to-[#eb4d1b] text-white font-bold text-base shadow-[0_4px_20px_rgba(255,69,0,0.4)] hover:shadow-[0_6px_25px_rgba(255,69,0,0.6)] cursor-pointer transition-all transform active:scale-95"
        onClick={(e) => requestExpandedMode(e.nativeEvent, 'game')}
      >
        <span>Play Today's Subdle</span>
        <svg
          className="w-4 h-4 transition-transform group-hover:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>

      {/* User & Streak Banner */}
      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-400">
        <span>👤 {context.username ? `u/${context.username}` : 'Redditor'}</span>
        {streak > 0 && (
          <>
            <span className="text-gray-600">•</span>
            <span className="text-orange-400 font-semibold">🔥 {streak} Streak</span>
          </>
        )}
      </div>

      {/* Footer Links */}
      <footer className="mt-5 flex gap-3 text-[11px] text-gray-500">
        <button
          className="cursor-pointer hover:text-gray-300 transition-colors"
          onClick={() => navigateTo('https://redditgameofday2026.devpost.com/')}
        >
          Reddit Hackathon 2026
        </button>
        <span className="text-gray-700">•</span>
        <button
          className="cursor-pointer hover:text-gray-300 transition-colors"
          onClick={() => navigateTo('https://developers.reddit.com')}
        >
          Devvit Web
        </button>
      </footer>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Splash />
  </StrictMode>
);
