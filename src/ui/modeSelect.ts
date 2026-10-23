import { GameMode, Difficulty } from '../game/types';

export interface ModeSelectCallbacks {
  onStartMatch: (mode: GameMode, diff: Difficulty) => void;
  onStartSchulte: () => void;
}

export function initModeSelect(callbacks: ModeSelectCallbacks) {
  let selectedMode: GameMode = 'math';
  let selectedDiff: Difficulty = 'easy';

  const modeButtons = document.querySelectorAll<HTMLButtonElement>('.btn-mode-card');
  const diffButtons = document.querySelectorAll<HTMLButtonElement>('.btn-diff-card');
  const btnStartGame = document.getElementById('btnStartGame');
  const btnStartSchulte = document.getElementById('btnStartSchulte');

  function updateModeSelection(mode: GameMode) {
    selectedMode = mode;
    modeButtons.forEach(btn => {
      const m = btn.dataset.mode as GameMode;
      if (m === mode) {
        btn.className = 'btn-mode-card selected flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl border-2 transition active:scale-95 bg-cyan-950/50 border-cyan-500 shadow-md glow-cyan cursor-pointer';
      } else {
        btn.className = 'btn-mode-card flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl border-2 transition active:scale-95 bg-slate-900 border-slate-800 hover:border-slate-700 cursor-pointer';
      }
    });
  }

  function updateDiffSelection(diff: Difficulty) {
    selectedDiff = diff;
    diffButtons.forEach(btn => {
      const d = btn.dataset.diff as Difficulty;
      if (d === diff) {
        const borderCol = diff === 'easy' ? 'border-emerald-500 bg-emerald-950/50' : diff === 'medium' ? 'border-amber-500 bg-amber-950/50' : 'border-rose-500 bg-rose-950/50';
        btn.className = `btn-diff-card selected flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl border-2 transition active:scale-95 ${borderCol} shadow-md cursor-pointer`;
      } else {
        btn.className = 'btn-diff-card flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl border-2 transition active:scale-95 bg-slate-900 border-slate-800 hover:border-slate-700 cursor-pointer';
      }
    });
  }

  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode as GameMode;
      if (mode) updateModeSelection(mode);
    });
  });

  diffButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const diff = btn.dataset.diff as Difficulty;
      if (diff) updateDiffSelection(diff);
    });
  });

  btnStartGame?.addEventListener('click', () => {
    callbacks.onStartMatch(selectedMode, selectedDiff);
  });

  btnStartSchulte?.addEventListener('click', () => {
    callbacks.onStartSchulte();
  });
}
