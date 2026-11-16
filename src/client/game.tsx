import './index.css';

import { StrictMode, useState, type ChangeEvent } from 'react';
import { createRoot } from 'react-dom/client';
import { SUBREDDIT_DATABASE, ALL_SUBREDDIT_NAMES, getDailyPuzzle, SubredditPuzzle } from './data/subreddits';

export const App = () => {
  const [puzzle, setPuzzle] = useState<SubredditPuzzle>(() => getDailyPuzzle());
  const [isDaily, setIsDaily] = useState<boolean>(true);
  const [unlockedClues, setUnlockedClues] = useState<number>(1);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [inputVal, setInputVal] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isWinner, setIsWinner] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('subdle_streak') || '1', 10);
    } catch {
      return 1;
    }
  });
  const [showStatsModal, setShowStatsModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Maximum guesses allowed
  const MAX_GUESSES = 4;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Handle Autocomplete filtering
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputVal(val);
    if (val.trim().length > 0) {
      const filtered = ALL_SUBREDDIT_NAMES.filter(name => 
        name.toLowerCase().includes(val.toLowerCase().replace(/^r\//, ''))
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (name: string) => {
    setInputVal(name);
    setSuggestions([]);
  };

  // Make a Guess
  const handleMakeGuess = (selectedGuess?: string) => {
    const guess = (selectedGuess || inputVal).trim().replace(/^r\//, '');
    if (!guess || isGameOver) return;

    if (guesses.includes(guess.toLowerCase())) {
      showToast('You already guessed r/' + guess + '!');
      return;
    }

    const newGuesses = [...guesses, guess];
    setGuesses(newGuesses);
    setInputVal('');
    setSuggestions([]);

    const isCorrect = guess.toLowerCase() === puzzle.name.toLowerCase();

    if (isCorrect) {
      setIsWinner(true);
      setIsGameOver(true);
      setUnlockedClues(4);
      const newStreak = streak + 1;
      setStreak(newStreak);
      try {
        localStorage.setItem('subdle_streak', newStreak.toString());
      } catch {
        // ignore storage restrictions
      }
      showToast('🎉 Brilliant! r/' + puzzle.name + ' is correct!');
    } else {
      if (unlockedClues < 4) {
        setUnlockedClues(prev => prev + 1);
      }
      if (newGuesses.length >= MAX_GUESSES) {
        setIsGameOver(true);
        setUnlockedClues(4);
        showToast('Game over! It was r/' + puzzle.name);
      } else {
        showToast('Not r/' + guess + '! Clue ' + (unlockedClues + 1) + ' unlocked.');
      }
    }
  };

  // Manual Clue Unlock
  const handleRevealClue = () => {
    if (unlockedClues < 4 && !isGameOver) {
      setUnlockedClues(prev => prev + 1);
      showToast('Clue ' + (unlockedClues + 1) + ' revealed!');
    }
  };

  // Start Practice Random Mode
  const startRandomPractice = () => {
    const randomIndex = Math.floor(Math.random() * SUBREDDIT_DATABASE.length);
    const chosen = SUBREDDIT_DATABASE[randomIndex] ?? (SUBREDDIT_DATABASE[0] as SubredditPuzzle);
    setPuzzle(chosen);
    setIsDaily(false);
    setUnlockedClues(1);
    setGuesses([]);
    setIsGameOver(false);
    setIsWinner(false);
    setInputVal('');
    setSuggestions([]);
    showToast('Loaded new practice puzzle!');
  };

  // Generate Reddit Share Grid
  const handleShare = () => {
    let grid = '';
    guesses.forEach(g => {
      if (g.toLowerCase() === puzzle.name.toLowerCase()) {
        grid += '🟩🟩🟩🟩\n';
      } else {
        grid += '🟥🟥⬜⬜\n';
      }
    });

    const modeLabel = isDaily ? '#' + puzzle.id : '(Practice)';
    const scoreFraction = (isWinner ? guesses.length : 'X') + '/' + MAX_GUESSES;
    const shareText =
      'Subdle ' + modeLabel + ' ' + scoreFraction + '\n' +
      grid +
      '🔥 ' + streak + ' Day Streak\n' +
      'Play inside Reddit: r/subdle_daily_dev';

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        showToast('✓ Copied Reddit score to clipboard!');
      }).catch(() => {
        showToast('✓ Score ready to share!');
      });
    } else {
      showToast('✓ Score ready to share!');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] flex flex-col justify-between font-sans selection:bg-orange-500 selection:text-white">
      
      {/* Top Professional Header */}
      <header className="border-b border-slate-200/80 bg-white/95 px-4 py-3 sticky top-0 z-30 backdrop-blur-md shadow-xs">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#ff4500] flex items-center justify-center text-white font-extrabold text-sm shadow-sm">
              r/
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-tight text-slate-900">
                Subdle
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200">
                {isDaily ? 'Daily' : 'Practice'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <div className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200/80 flex items-center gap-1 shadow-2xs">
              <span>🔥</span>
              <span>{streak}</span>
            </div>
            <button 
              onClick={() => setShowHelpModal(true)}
              className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 flex items-center justify-center font-bold transition cursor-pointer"
              title="How to play"
            >
              ?
            </button>
            <button 
              onClick={() => setShowStatsModal(true)}
              className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 flex items-center justify-center font-bold transition cursor-pointer"
              title="Stats"
            >
              📊
            </button>
          </div>
        </div>
      </header>

      {/* Main Game Screen */}
      <main className="max-w-xl mx-auto px-4 py-5 flex-1 w-full space-y-4">
        
        {/* Daily Challenge Meta Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-2">
          <span className="font-medium text-slate-600">
            {isDaily ? `Daily Challenge #${puzzle.id}` : 'Practice Mode (Unlimited)'}
          </span>
          <span className="font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
            Attempts: {guesses.length} / {MAX_GUESSES}
          </span>
        </div>

        {/* 4 Clue Cards */}
        <div className="space-y-3">
          
          {/* Clue 1: Audience & Age */}
          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs space-y-2 transition-all">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5 text-slate-900">
                <span className="text-orange-500">👥</span>
                <span>Clue 1: Community Scale & Age</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                Unlocked
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-400 text-[11px] font-medium block mb-0.5">Subscribers</span>
                <div className="font-bold text-slate-900 text-base">{puzzle.subscribers}</div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-400 text-[11px] font-medium block mb-0.5">Created</span>
                <div className="font-bold text-slate-900 text-base">{puzzle.foundedYear}</div>
              </div>
            </div>
          </div>

          {/* Clue 2: Category & Focus */}
          <div className={`p-4 rounded-xl border transition-all ${unlockedClues >= 2 ? 'bg-white border-slate-200/90 shadow-xs' : 'bg-slate-100/50 border-slate-200/60 opacity-60'}`}>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5 text-slate-900">
                <span className="text-orange-500">🏷️</span>
                <span>Clue 2: Category & Topic Focus</span>
              </span>
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${unlockedClues >= 2 ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-slate-500 bg-slate-100 border-slate-200'}`}>
                {unlockedClues >= 2 ? 'Unlocked' : 'Locked'}
              </span>
            </div>
            {unlockedClues >= 2 ? (
              <div className="text-xs font-semibold text-slate-800 mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {puzzle.category}
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 mt-1 italic font-normal">Unlocks after Guess 1</p>
            )}
          </div>

          {/* Clue 3: Redacted Viral Post */}
          <div className={`p-4 rounded-xl border transition-all ${unlockedClues >= 3 ? 'bg-white border-slate-200/90 shadow-xs' : 'bg-slate-100/50 border-slate-200/60 opacity-60'}`}>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5 text-slate-900">
                <span className="text-orange-500">🤫</span>
                <span>Clue 3: Redacted All-Time Top Post</span>
              </span>
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${unlockedClues >= 3 ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-slate-500 bg-slate-100 border-slate-200'}`}>
                {unlockedClues >= 3 ? 'Unlocked' : 'Locked'}
              </span>
            </div>
            {unlockedClues >= 3 ? (
              <div className="text-xs text-slate-800 mt-2 bg-amber-50/50 p-3 rounded-lg border border-amber-100/80 font-serif leading-relaxed italic">
                "{puzzle.redactedPost}"
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 mt-1 italic font-normal">Unlocks after Guess 2</p>
            )}
          </div>

          {/* Clue 4: Signature Community Rule */}
          <div className={`p-4 rounded-xl border transition-all ${unlockedClues >= 4 ? 'bg-white border-slate-200/90 shadow-xs' : 'bg-slate-100/50 border-slate-200/60 opacity-60'}`}>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5 text-slate-900">
                <span className="text-orange-500">📜</span>
                <span>Clue 4: Signature Community Rule</span>
              </span>
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${unlockedClues >= 4 ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-slate-500 bg-slate-100 border-slate-200'}`}>
                {unlockedClues >= 4 ? 'Unlocked' : 'Locked'}
              </span>
            </div>
            {unlockedClues >= 4 ? (
              <div className="text-xs text-slate-800 mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed font-mono">
                {puzzle.signatureRule}
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 mt-1 italic font-normal">Unlocks after Guess 3</p>
            )}
          </div>

        </div>

        {/* Guesses Log */}
        {guesses.length > 0 && (
          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Your Guesses:</div>
            <div className="flex flex-wrap gap-2">
              {guesses.map((g, idx) => {
                const isMatch = g.toLowerCase() === puzzle.name.toLowerCase();
                return (
                  <div key={idx} className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 border ${isMatch ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'}`}>
                    <span>{isMatch ? '🟩' : '🟥'}</span>
                    <span>r/{g}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Input Bar or Game Over Panel */}
        {!isGameOver ? (
          <div className="space-y-2 relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-mono font-bold">r/</span>
                <input
                  type="text"
                  value={inputVal}
                  onChange={handleInputChange}
                  onKeyDown={(e) => e.key === 'Enter' && handleMakeGuess()}
                  placeholder="Type subreddit name (e.g. AskReddit, gaming)..."
                  className="w-full bg-white border border-slate-300 rounded-xl pl-8 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-mono placeholder:text-slate-400 shadow-2xs transition"
                />

                {/* Autocomplete Dropdown */}
                {suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-11 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-lg z-20 divide-y divide-slate-100">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectSuggestion(s)}
                        className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition flex items-center gap-1.5 font-mono cursor-pointer"
                      >
                        <span className="text-orange-500 font-bold">r/</span>
                        <span className="font-semibold">{s}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleMakeGuess()}
                className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl text-xs font-bold transition shadow-sm hover:shadow active:scale-95 flex-shrink-0 cursor-pointer"
              >
                Guess
              </button>
            </div>

            {unlockedClues < 4 && (
              <div className="text-center pt-1">
                <button
                  onClick={handleRevealClue}
                  className="text-[11px] text-slate-500 hover:text-orange-600 transition font-medium underline underline-offset-2 cursor-pointer"
                >
                  Stuck? Reveal next clue &rarr;
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Game Over Victory / Loss Card */
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 text-center space-y-4 shadow-sm">
            <div className="text-4xl">{isWinner ? '🎉' : '💔'}</div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                {isWinner ? 'Outstanding!' : 'Better luck tomorrow!'}
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {isWinner ? 'Solved in ' + guesses.length + ' / ' + MAX_GUESSES + ' attempts' : "Today's mystery subreddit was:"}
              </p>
              <div className="mt-2.5 inline-block px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 font-extrabold font-mono text-sm border border-orange-200">
                r/{puzzle.name}
              </div>
            </div>

            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              {puzzle.description}
            </p>

            {/* Share to Reddit Action Button */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={handleShare}
                className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl text-xs font-bold transition shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>📋 Copy Score for Reddit Comments</span>
              </button>
              <button
                onClick={startRandomPractice}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Play Practice Mode
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xl">
          {toastMessage}
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 max-w-md w-full rounded-2xl p-6 space-y-4 text-xs shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">How to Play Subdle</h3>
              <button onClick={() => setShowHelpModal(false)} className="text-slate-400 hover:text-slate-700 font-bold text-base cursor-pointer">✕</button>
            </div>
            <div className="space-y-3 text-slate-600 leading-relaxed">
              <p>🎯 <strong>Objective:</strong> Guess the secret Reddit community in 4 attempts or fewer.</p>
              <p>🔍 <strong>Clues:</strong> Each incorrect guess unlocks a new clue (Subscriber scale, Category, Redacted top viral post, and Rule).</p>
              <p>🔥 <strong>Daily Challenge:</strong> A brand new community is featured every day. Keep your daily streak alive!</p>
              <p>💬 <strong>Reddit Comments:</strong> Click "Copy Score" to post your spoiler-free emoji grid in the comments!</p>
            </div>
            <button onClick={() => setShowHelpModal(false)} className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold cursor-pointer transition">
              Got It, Let's Play!
            </button>
          </div>
        </div>
      )}

      {/* Stats Modal */}
      {showStatsModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 max-w-sm w-full rounded-2xl p-6 space-y-4 text-xs text-center shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Your Subdle Stats</h3>
              <button onClick={() => setShowStatsModal(false)} className="text-slate-400 hover:text-slate-700 font-bold text-base cursor-pointer">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-3 py-2">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div className="text-2xl font-extrabold text-orange-600 font-mono">{streak}</div>
                <div className="text-[11px] font-medium text-slate-500 mt-1">Current Streak</div>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div className="text-2xl font-extrabold text-emerald-600 font-mono">100%</div>
                <div className="text-[11px] font-medium text-slate-500 mt-1">Win Rate</div>
              </div>
            </div>
            <button onClick={() => setShowStatsModal(false)} className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer transition">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200/80 py-3.5 text-center text-[11px] text-slate-400 bg-white">
        Subdle Daily • Built for Reddit Game of the Day 2026 Hackathon
      </footer>

    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
