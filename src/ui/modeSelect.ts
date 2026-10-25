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

  // Top Tabs
  const tabQuick = document.getElementById('tabQuickPlay');
  const tabCustom = document.getElementById('tabCustomSandbox');
  const panelQuick = document.getElementById('panelQuickPlay');
  const panelCustom = document.getElementById('panelCustomSandbox');

  tabQuick?.addEventListener('click', () => {
    tabQuick.className = 'py-2 px-3 text-xs font-bold rounded-xl bg-cyan-500 text-slate-950 shadow-md transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer';
    if (tabCustom) tabCustom.className = 'py-2 px-3 text-xs font-semibold rounded-xl text-slate-400 hover:text-white transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer';
    panelQuick?.classList.remove('hidden');
    panelCustom?.classList.add('hidden');
  });

  tabCustom?.addEventListener('click', () => {
    if (tabCustom) tabCustom.className = 'py-2 px-3 text-xs font-bold rounded-xl bg-cyan-500 text-slate-950 shadow-md transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer';
    if (tabQuick) tabQuick.className = 'py-2 px-3 text-xs font-semibold rounded-xl text-slate-400 hover:text-white transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer';
    panelQuick?.classList.add('hidden');
    panelCustom?.classList.remove('hidden');
  });

  function updateModeSelection(mode: GameMode) {
    selectedMode = mode;
    modeButtons.forEach(btn => {
      const m = btn.dataset.mode as GameMode;
      if (m === mode) {
        const activeClass = mode === 'survival'
          ? 'bg-rose-950/50 border-rose-500 shadow-md glow-red'
          : 'bg-cyan-950/50 border-cyan-500 shadow-md glow-cyan';
        btn.className = `btn-mode-card selected flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-2xl border-2 transition active:scale-95 ${activeClass} cursor-pointer`;
      } else {
        btn.className = 'btn-mode-card flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-2xl border-2 transition active:scale-95 bg-slate-900 border-slate-800 hover:border-slate-700 cursor-pointer';
      }
    });
  }

  function updateDiffSelection(diff: Difficulty) {
    selectedDiff = diff;
    diffButtons.forEach(btn => {
      const d = btn.dataset.diff as Difficulty;
      if (d === diff) {
        const borderCol = diff === 'easy' ? 'border-emerald-500 bg-emerald-950/50' : diff === 'medium' ? 'border-amber-500 bg-amber-950/50' : 'border-rose-500 bg-rose-950/50';
        btn.className = `btn-diff-card selected flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-2xl border-2 transition active:scale-95 ${borderCol} shadow-md cursor-pointer`;
      } else {
        btn.className = 'btn-diff-card flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-2xl border-2 transition active:scale-95 bg-slate-900 border-slate-800 hover:border-slate-700 cursor-pointer';
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
