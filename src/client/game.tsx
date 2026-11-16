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
    return parseInt(localStorage.getItem('subdle_streak') || '1', 10);
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
      localStorage.setItem('subdle_streak', newStreak.toString());
      showToast('🎉 Brilliant! r/' + puzzle.name + ' was correct!');
    } else {
      // Unlock next clue if available
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
      'Play inside Reddit: r/subdle-daily';

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
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between font-sans selection:bg-orange-500 selection:text-white">
      
      {/* Top Navigation */}
      <header className="border-b border-slate-800 bg-slate-950/80 px-4 py-3 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-orange-600/30">
              r/
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
                Subdle <span className="text-xs uppercase font-mono px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">Daily</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <div className="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-400 font-bold border border-slate-700 flex items-center gap-1">
              <span>🔥</span>
              <span>{streak}</span>
            </div>
            <button 
              onClick={() => setShowHelpModal(true)}
              className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center justify-center font-bold"
              title="How to play"
            >
              ?
            </button>
            <button 
              onClick={() => setShowStatsModal(true)}
              className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center justify-center font-bold"
              title="Stats"
            >
              📊
            </button>
          </div>
        </div>
      </header>

      {/* Main Game Screen */}
      <main className="max-w-xl mx-auto px-4 py-5 flex-1 w-full space-y-4">
        
        {/* Daily / Practice Indicator */}
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/60 pb-2">
          <span>{isDaily ? `Today's Daily Challenge #${puzzle.id}` : 'Practice Mode (Unlimited)'}</span>
          <span className="font-mono text-orange-400">Attempts: {guesses.length} / {MAX_GUESSES}</span>
        </div>

        {/* 4 Clue Cards */}
        <div className="space-y-3">
          
          {/* Clue 1: Audience & Age */}
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5 transition-all shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5 text-orange-400">
                <span>🔍 Clue 1:</span>
                <span>Community Scale & Age</span>
              </span>
              <span className="text-[10px] uppercase font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Unlocked</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[11px]">Subscribers:</span>
                <div className="font-bold text-slate-100 font-mono text-sm">{puzzle.subscribers}</div>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[11px]">Created:</span>
                <div className="font-bold text-slate-100 font-mono text-sm">{puzzle.foundedYear}</div>
              </div>
            </div>
          </div>

          {/* Clue 2: Category */}
          <div className={`p-3.5 rounded-xl border transition-all ${unlockedClues >= 2 ? 'bg-slate-800/80 border-slate-700 shadow-sm' : 'bg-slate-900/40 border-slate-800/60 opacity-60'}`}>
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5 text-orange-400">
                <span>🏷️ Clue 2:</span>
                <span>Category & Focus</span>
              </span>
              <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded ${unlockedClues >= 2 ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 bg-slate-800'}`}>
                {unlockedClues >= 2 ? 'Unlocked' : 'Locked'}
              </span>
            </div>
            {unlockedClues >= 2 ? (
              <div className="text-xs text-slate-200 mt-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                {puzzle.category}
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 mt-1 italic">Unlocks after Guess 1</p>
            )}
          </div>

          {/* Clue 3: Redacted Viral Post */}
          <div className={`p-3.5 rounded-xl border transition-all ${unlockedClues >= 3 ? 'bg-slate-800/80 border-slate-700 shadow-sm' : 'bg-slate-900/40 border-slate-800/60 opacity-60'}`}>
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5 text-orange-400">
                <span>💬 Clue 3:</span>
                <span>Redacted Top Post</span>
              </span>
              <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded ${unlockedClues >= 3 ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 bg-slate-800'}`}>
                {unlockedClues >= 3 ? 'Unlocked' : 'Locked'}
              </span>
            </div>
            {unlockedClues >= 3 ? (
              <div className="text-xs text-slate-200 mt-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 font-serif leading-relaxed italic">
                {puzzle.redactedPost}
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 mt-1 italic">Unlocks after Guess 2</p>
            )}
          </div>

          {/* Clue 4: Signature Subreddit Rule */}
          <div className={`p-3.5 rounded-xl border transition-all ${unlockedClues >= 4 ? 'bg-slate-800/80 border-slate-700 shadow-sm' : 'bg-slate-900/40 border-slate-800/60 opacity-60'}`}>
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5 text-orange-400">
                <span>📜 Clue 4:</span>
                <span>Iconic Community Rule</span>
              </span>
              <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded ${unlockedClues >= 4 ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 bg-slate-800'}`}>
                {unlockedClues >= 4 ? 'Unlocked' : 'Locked'}
              </span>
            </div>
            {unlockedClues >= 4 ? (
              <div className="text-xs text-slate-200 mt-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 leading-relaxed">
                {puzzle.signatureRule}
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 mt-1 italic">Unlocks after Guess 3</p>
            )}
          </div>

        </div>

        {/* Guesses Log */}
        {guesses.length > 0 && (
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
            <div className="text-[11px] font-mono text-slate-400">Your Guesses:</div>
            <div className="flex flex-wrap gap-2">
              {guesses.map((g, idx) => {
                const isMatch = g.toLowerCase() === puzzle.name.toLowerCase();
                return (
                  <div key={idx} className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 border ${isMatch ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/30'}`}>
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
                <span className="absolute left-3 top-2.5 text-slate-500 text-xs font-mono">r/</span>
                <input
                  type="text"
                  value={inputVal}
                  onChange={handleInputChange}
                  onKeyDown={(e) => e.key === 'Enter' && handleMakeGuess()}
                  placeholder="Guess subreddit name (e.g. AskReddit, gaming)..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-orange-500 font-mono placeholder:text-slate-600 shadow-inner"
                />

                {/* Autocomplete Dropdown */}
                {suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-11 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl z-20">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectSuggestion(s)}
                        className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-orange-600 hover:text-white transition flex items-center gap-1.5 font-mono"
                      >
                        <span className="text-slate-500">r/</span>
                        <span>{s}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleMakeGuess()}
                className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-orange-600/20 flex-shrink-0"
              >
                Guess
              </button>
            </div>

            {unlockedClues < 4 && (
              <div className="text-center pt-1">
                <button
                  onClick={handleRevealClue}
                  className="text-[11px] text-slate-400 hover:text-orange-400 transition underline underline-offset-2"
                >
                  Stuck? Reveal next clue &rarr;
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Game Over Victory / Loss Card */
          <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-950 border border-orange-500/40 text-center space-y-4 shadow-xl">
            <div className="text-3xl">{isWinner ? '🎉' : '💔'}</div>
            <div>
              <h2 className="text-lg font-extrabold text-white">
                {isWinner ? 'Outstanding!' : 'Better luck tomorrow!'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {isWinner ? 'Solved in ' + guesses.length + ' / ' + MAX_GUESSES + ' attempts' : "Today's mystery subreddit was:"}
              </p>
              <div className="mt-2 inline-block px-4 py-1.5 rounded-full bg-orange-500/20 text-orange-400 font-bold font-mono text-sm border border-orange-500/40">
                r/{puzzle.name}
              </div>
            </div>

            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              {puzzle.description}
            </p>

            {/* Share to Reddit Action Button */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={handleShare}
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2"
              >
                <span>📋 Copy Score for Reddit Comments</span>
              </button>
              <button
                onClick={startRandomPractice}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium transition"
              >
                Play Practice Mode
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold shadow-2xl animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 max-w-md w-full rounded-2xl p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-sm">How to Play Subdle</h3>
              <button onClick={() => setShowHelpModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>
            <div className="space-y-2.5 text-slate-300 leading-relaxed">
              <p>🎯 <strong>Objective:</strong> Guess the secret popular subreddit in 4 attempts or fewer.</p>
              <p>🔍 <strong>Clues:</strong> Each incorrect guess unlocks a new clue (Subscriber count, Category, Redacted Top Post, and Rule).</p>
              <p>🔥 <strong>Daily Challenge:</strong> A brand new community is featured every day. Keep your daily streak alive!</p>
              <p>💬 <strong>Reddit Comments:</strong> Click "Share" to post your spoiler-free emoji grid in the comments!</p>
            </div>
            <button onClick={() => setShowHelpModal(false)} className="w-full py-2 bg-orange-600 text-white rounded-xl font-bold">
              Got It, Let's Play!
            </button>
          </div>
        </div>
      )}

      {/* Stats Modal */}
      {showStatsModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 max-w-sm w-full rounded-2xl p-5 space-y-4 text-xs text-center">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-sm">Your Subdle Stats</h3>
              <button onClick={() => setShowStatsModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-3 py-2">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-2xl font-bold text-orange-400 font-mono">{streak}</div>
                <div className="text-[10px] text-slate-400 mt-1">Current Streak</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-2xl font-bold text-emerald-400 font-mono">100%</div>
                <div className="text-[10px] text-slate-400 mt-1">Win Rate</div>
              </div>
            </div>
            <button onClick={() => setShowStatsModal(false)} className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-3 text-center text-[11px] text-slate-500">
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
