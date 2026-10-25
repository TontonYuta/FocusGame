import { GameConfig, CustomGameParams, GameMode, SpeedPreset } from '../game/types';
import { createCustomGameConfig } from '../game/config';
import { CEFRLevel } from '../data/vocabulary';
import { storage } from '../services/storage';

export interface CustomSelectCallbacks {
  onStartCustom: (config: GameConfig) => void;
}

export function initCustomSelect(callbacks: CustomSelectCallbacks) {
  const saved = storage.getCustomParams() as Partial<CustomGameParams>;

  const params: CustomGameParams = {
    mode: (saved.mode as GameMode) || 'combined',
    rings: saved.rings || 2,
    speed: (saved.speed as SpeedPreset) || 'normal',
    targetCount: saved.targetCount || 15,
    cefrLevel: (saved.cefrLevel as CEFRLevel | 'all') || 'all',
    allowBomb: saved.allowBomb ?? true,
    hasReversal: saved.hasReversal ?? true,
    isChainedMath: saved.isChainedMath ?? false
  };

  const btnStart = document.getElementById('btnStartCustomGame');
  const cefrRow = document.getElementById('customCefrRow');

  function updateActiveStates() {
    // Mode buttons
    document.querySelectorAll<HTMLButtonElement>('.btn-cust-mode').forEach(b => {
      const active = b.dataset.mode === params.mode;
      const activeClass = params.mode === 'survival'
        ? 'bg-rose-950/60 border-rose-500 text-white shadow-md glow-red'
        : 'bg-cyan-950/60 border-cyan-500 text-white shadow-md glow-cyan';
      b.className = `btn-cust-mode py-2 rounded-xl text-xs font-bold border-2 transition active:scale-95 cursor-pointer ${
        active ? activeClass : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
      }`;
    });

    // Show/hide CEFR row if vocab or combined
    if (cefrRow) {
      if (params.mode === 'math') cefrRow.classList.add('hidden');
      else cefrRow.classList.remove('hidden');
    }

    // CEFR buttons
    document.querySelectorAll<HTMLButtonElement>('.btn-cust-cefr').forEach(b => {
      const active = b.dataset.cefr === params.cefrLevel;
      b.className = `btn-cust-cefr px-2.5 py-1 text-[11px] font-bold rounded-lg border transition active:scale-95 shrink-0 cursor-pointer ${
        active ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
      }`;
    });

    // Rings buttons
    document.querySelectorAll<HTMLButtonElement>('.btn-cust-rings').forEach(b => {
      const r = Number(b.dataset.rings);
      const active = r === params.rings;
      b.className = `btn-cust-rings flex-1 py-2 text-xs font-bold rounded-xl border-2 transition active:scale-95 cursor-pointer ${
        active ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
      }`;
    });

    // Speed buttons
    document.querySelectorAll<HTMLButtonElement>('.btn-cust-speed').forEach(b => {
      const active = b.dataset.speed === params.speed;
      b.className = `btn-cust-speed flex-1 py-2 text-xs font-bold rounded-xl border-2 transition active:scale-95 cursor-pointer ${
        active ? 'bg-amber-950/60 border-amber-500 text-white shadow-md' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
      }`;
    });

    // Target buttons
    document.querySelectorAll<HTMLButtonElement>('.btn-cust-targets').forEach(b => {
      const t = Number(b.dataset.targets);
      const active = t === params.targetCount;
      b.className = `btn-cust-targets flex-1 py-1.5 text-xs font-bold rounded-xl border-2 transition active:scale-95 cursor-pointer ${
        active ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-md' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
      }`;
    });

    // Toggles
    const toggleBomb = document.getElementById('toggleCustBomb');
    if (toggleBomb) {
      toggleBomb.className = `flex-1 py-2 px-2 text-xs font-semibold rounded-xl border transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 ${
        params.allowBomb ? 'bg-purple-950/60 border-purple-500 text-purple-200' : 'bg-slate-900 border-slate-800 text-slate-500'
      }`;
    }

    const toggleRev = document.getElementById('toggleCustReversal');
    if (toggleRev) {
      toggleRev.className = `flex-1 py-2 px-2 text-xs font-semibold rounded-xl border transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 ${
        params.hasReversal ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-500'
      }`;
    }

    const toggleChain = document.getElementById('toggleCustChained');
    if (toggleChain) {
      toggleChain.className = `flex-1 py-2 px-2 text-xs font-semibold rounded-xl border transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 ${
        params.isChainedMath ? 'bg-amber-950/60 border-amber-500 text-amber-200' : 'bg-slate-900 border-slate-800 text-slate-500'
      }`;
    }
  }

  // Bind Listeners
  document.querySelectorAll<HTMLButtonElement>('.btn-cust-mode').forEach(b => {
    b.addEventListener('click', () => {
      params.mode = (b.dataset.mode as GameMode) || 'combined';
      updateActiveStates();
    });
  });

  document.querySelectorAll<HTMLButtonElement>('.btn-cust-cefr').forEach(b => {
    b.addEventListener('click', () => {
      params.cefrLevel = (b.dataset.cefr as CEFRLevel | 'all') || 'all';
      updateActiveStates();
    });
  });

  document.querySelectorAll<HTMLButtonElement>('.btn-cust-rings').forEach(b => {
    b.addEventListener('click', () => {
      params.rings = Number(b.dataset.rings) || 2;
      updateActiveStates();
    });
  });

  document.querySelectorAll<HTMLButtonElement>('.btn-cust-speed').forEach(b => {
    b.addEventListener('click', () => {
      params.speed = (b.dataset.speed as SpeedPreset) || 'normal';
      updateActiveStates();
    });
  });

  document.querySelectorAll<HTMLButtonElement>('.btn-cust-targets').forEach(b => {
    b.addEventListener('click', () => {
      params.targetCount = Number(b.dataset.targets) || 15;
      updateActiveStates();
    });
  });

  document.getElementById('toggleCustBomb')?.addEventListener('click', () => {
    params.allowBomb = !params.allowBomb;
    updateActiveStates();
  });

  document.getElementById('toggleCustReversal')?.addEventListener('click', () => {
    params.hasReversal = !params.hasReversal;
    updateActiveStates();
  });

  document.getElementById('toggleCustChained')?.addEventListener('click', () => {
    params.isChainedMath = !params.isChainedMath;
    updateActiveStates();
  });

  btnStart?.addEventListener('click', () => {
    storage.saveCustomParams(params);
    const config = createCustomGameConfig(params);
    callbacks.onStartCustom(config);
  });

  updateActiveStates();
}
