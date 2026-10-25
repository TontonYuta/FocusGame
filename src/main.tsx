import { GameEngine, getGameConfig, getMathLevelConfig, getSchulteConfig, GameMode, Difficulty, GameConfig } from './game/engine';
import { audio } from './services/audio';
import { storage } from './services/storage';
import { getVocabPoolByLevel } from './data/vocabulary';
import { initModeSelect } from './ui/modeSelect';
import { initCustomSelect } from './ui/customSelect';
import { updateArenaHud } from './ui/arenaHud';
import { initModalResults, showMatchResults } from './ui/modalResults';
import { initModalNotebook } from './ui/modalNotebook';
import { initModalUpdate } from './ui/modalUpdate';
import { initModalPreview, showVocabPreviewDeck } from './ui/modalPreview';

let engine: GameEngine;
let activeConfig: GameConfig;

const screenSelect = document.getElementById('screenLevelSelect')!;
const screenArena = document.getElementById('screenGameArena')!;
const modalPause = document.getElementById('modalPause')!;

function showScreen(screen: 'select' | 'arena') {
  if (screen === 'select') {
    screenSelect.classList.remove('hidden');
    screenArena.classList.add('hidden');
  } else {
    screenSelect.classList.add('hidden');
    screenArena.classList.remove('hidden');
  }
}

function launchMatch(config: GameConfig) {
  activeConfig = config;
  const isVocabMode = config.mode === 'vocab' || config.mode === 'combined' || config.mode === 'survival';
  const shouldPreview = isVocabMode && storage.getPreviewVocabSetting();

  if (shouldPreview) {
    const pool = getVocabPoolByLevel(config.cefrLevel || 'A1');
    if (pool.length > 0) {
      showVocabPreviewDeck(pool.slice(0, 16), config.name, () => {
        showScreen('arena');
        engine.startMatch(config);
      });
      return;
    }
  }

  showScreen('arena');
  engine.startMatch(config);
}

function updateSoundUI() {
  const on = document.getElementById('iconSoundOn');
  const off = document.getElementById('iconSoundOff');
  if (audio.isSoundEnabled) {
    on?.classList.remove('hidden');
    off?.classList.add('hidden');
  } else {
    on?.classList.add('hidden');
    off?.classList.remove('hidden');
  }
}

function init() {
  audio.isSoundEnabled = storage.getSoundSetting();
  updateSoundUI();

  document.getElementById('btnToggleSound')?.addEventListener('click', () => {
    audio.isSoundEnabled = !audio.isSoundEnabled;
    storage.setSoundSetting(audio.isSoundEnabled);
    updateSoundUI();
  });

  const arenaEl = document.getElementById('arenaContainer')!;
  const nodesEl = document.getElementById('nodesOrbitLayer')!;
  const hubEl = document.getElementById('centralHub')!;

  engine = new GameEngine(
    arenaEl,
    nodesEl,
    hubEl,
    data => {
      updateArenaHud(data, engine.config, engine.targetType, engine.mathProblem, engine.vocabItem, engine.schulteTarget);
    },
    stats => {
      showMatchResults(stats);
    }
  );

  initModeSelect({
    onStartMatch: (mode: GameMode, diff: Difficulty) => {
      const cfg = getGameConfig(mode, diff);
      launchMatch(cfg);
    },
    onStartSchulte: () => {
      activeConfig = getSchulteConfig();
      showScreen('arena');
      engine.startSchulte(activeConfig);
    },
    onStartSurvival: () => {
      const cfg = getGameConfig('survival', 'medium');
      launchMatch(cfg);
    }
  });

  initCustomSelect({
    onStartCustom: (customConfig: GameConfig) => {
      launchMatch(customConfig);
    }
  });

  initModalResults({
    onMenu: () => {
      engine.stop();
      showScreen('select');
    },
    onRetry: () => {
      if (activeConfig.mode === 'schulte') engine.startSchulte(activeConfig);
      else engine.startMatch(activeConfig);
    },
    onNext: () => {
      const nextDiff: Difficulty = activeConfig.difficulty === 'easy' ? 'medium' : 'hard';
      activeConfig = getGameConfig(activeConfig.mode, nextDiff);
      engine.startMatch(activeConfig);
    }
  });

  initModalNotebook();
  initModalUpdate();
  initModalPreview();

  const chkQuickPreview = document.getElementById('chkQuickPreviewVocab') as HTMLInputElement | null;
  if (chkQuickPreview) {
    chkQuickPreview.checked = storage.getPreviewVocabSetting();
    chkQuickPreview.addEventListener('change', () => {
      storage.setPreviewVocabSetting(chkQuickPreview.checked);
    });
  }

  // Navigation & Pause
  document.getElementById('btnHome')?.addEventListener('click', () => {
    if (engine.isRunning) {
      modalPause.classList.remove('hidden');
      engine.pause();
    } else {
      showScreen('select');
    }
  });

  document.getElementById('btnPauseGame')?.addEventListener('click', () => {
    modalPause.classList.remove('hidden');
    engine.pause();
  });

  document.getElementById('btnResumeGame')?.addEventListener('click', () => {
    modalPause.classList.add('hidden');
    engine.resume();
  });

  document.getElementById('btnRestartCurrentLevel')?.addEventListener('click', () => {
    modalPause.classList.add('hidden');
    if (activeConfig.mode === 'schulte') engine.startSchulte(activeConfig);
    else engine.startMatch(activeConfig);
  });

  document.getElementById('btnQuitToMenu')?.addEventListener('click', () => {
    modalPause.classList.add('hidden');
    engine.stop();
    showScreen('select');
  });

  // Desktop Keyboard Ergonomics (Cmd+K / Shortcut Standards)
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      if (e.key === 'Escape') {
        (e.target as HTMLElement).blur();
        document.getElementById('modalNotebook')?.classList.add('hidden');
      }
      return;
    }

    const modalResults = document.getElementById('modalAnalytics');
    const modalNotebook = document.getElementById('modalNotebook');
    const modalPreview = document.getElementById('modalVocabPreview');
    const modalUpdate = document.getElementById('modalUpdate');
    const isArenaActive = !screenArena.classList.contains('hidden');
    const isSelectActive = !screenSelect.classList.contains('hidden');

    if (e.code === 'Space') {
      if (isArenaActive) {
        e.preventDefault();
        if (engine.isPaused) {
          modalPause.classList.add('hidden');
          engine.resume();
        } else {
          modalPause.classList.remove('hidden');
          engine.pause();
        }
      }
    } else if (e.code === 'KeyR') {
      if (isArenaActive || !modalPause.classList.contains('hidden') || (modalResults && !modalResults.classList.contains('hidden'))) {
        e.preventDefault();
        modalPause.classList.add('hidden');
        modalResults?.classList.add('hidden');
        if (activeConfig.mode === 'schulte') engine.startSchulte(activeConfig);
        else engine.startMatch(activeConfig);
      }
    } else if (e.code === 'Escape') {
      e.preventDefault();
      if (modalPreview && !modalPreview.classList.contains('hidden')) {
        modalPreview.classList.add('hidden');
      } else if (modalUpdate && !modalUpdate.classList.contains('hidden')) {
        modalUpdate.classList.add('hidden');
      } else if (modalNotebook && !modalNotebook.classList.contains('hidden')) {
        modalNotebook.classList.add('hidden');
      } else if (modalResults && !modalResults.classList.contains('hidden')) {
        modalResults.classList.add('hidden');
        engine.stop();
        showScreen('select');
      } else if (!modalPause.classList.contains('hidden')) {
        modalPause.classList.add('hidden');
        engine.resume();
      } else if (isArenaActive) {
        modalPause.classList.remove('hidden');
        engine.pause();
      }
    } else if (e.code === 'Enter') {
      if (modalResults && !modalResults.classList.contains('hidden')) {
        e.preventDefault();
        document.getElementById('btnAnalyticsNext')?.click();
      } else if (isSelectActive) {
        e.preventDefault();
        document.getElementById('btnStartGame')?.click();
      }
    } else if (isSelectActive) {
      const modeMap: Record<string, string> = {
        Digit1: 'math',
        Digit2: 'vocab',
        Digit3: 'combined',
        Digit4: 'survival'
      };
      if (modeMap[e.code]) {
        e.preventDefault();
        const btn = document.querySelector<HTMLButtonElement>(`.btn-mode-card[data-mode="${modeMap[e.code]}"]`);
        btn?.click();
      }
    }
  });

  showScreen('select');
}

window.addEventListener('DOMContentLoaded', init);
