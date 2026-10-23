import { GameEngine, getGameConfig, getSchulteConfig, GameMode, Difficulty, GameConfig } from './game/engine';
import { audio } from './services/audio';
import { storage } from './services/storage';
import { initModeSelect } from './ui/modeSelect';
import { updateArenaHud } from './ui/arenaHud';
import { initModalResults, showMatchResults } from './ui/modalResults';
import { initModalNotebook } from './ui/modalNotebook';

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
      activeConfig = getGameConfig(mode, diff);
      showScreen('arena');
      engine.startMatch(activeConfig);
    },
    onStartSchulte: () => {
      activeConfig = getSchulteConfig();
      showScreen('arena');
      engine.startSchulte(activeConfig);
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

  showScreen('select');
}

window.addEventListener('DOMContentLoaded', init);
