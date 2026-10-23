import { CAMPAIGN_LEVELS, GameEngine, LevelConfig, MatchStats } from './game/engine';
import { audio } from './services/audio';
import { storage } from './services/storage';
import { VOCABULARY_LIST, VocabItem, getVocabPoolByCategory } from './data/vocabulary';
import { drawRadarChart } from './components/radarChart';

// Global Engine Instance
let engine: GameEngine;
let currentNotebookFilter = 'all';

// DOM Element references
const screenLevelSelect = document.getElementById('screenLevelSelect')!;
const screenGameArena = document.getElementById('screenGameArena')!;
const viewCampaign = document.getElementById('viewCampaign')!;
const viewSchulte = document.getElementById('viewSchulte')!;
const viewCustom = document.getElementById('viewCustom')!;

const tabCampaign = document.getElementById('tabCampaign')!;
const tabSchulte = document.getElementById('tabSchulte')!;
const tabCustom = document.getElementById('tabCustom')!;

// Header controls
const btnHome = document.getElementById('btnHome')!;
const headerCategorySelect = document.getElementById('headerCategorySelect') as HTMLSelectElement;
const btnOpenNotebook = document.getElementById('btnOpenNotebook')!;
const mistakeBadgeCount = document.getElementById('mistakeBadgeCount')!;
const btnToggleSound = document.getElementById('btnToggleSound')!;
const iconSoundOn = document.getElementById('iconSoundOn')!;
const iconSoundOff = document.getElementById('iconSoundOff')!;
const btnToggleSpeech = document.getElementById('btnToggleSpeech')!;
const btnOpenGuide = document.getElementById('btnOpenGuide')!;
const btnUnlockAll = document.getElementById('btnUnlockAll')!;

// Arena HUD
const hudLevelTitle = document.getElementById('hudLevelTitle')!;
const hudTargetCount = document.getElementById('hudTargetCount')!;
const hudAccuracy = document.getElementById('hudAccuracy')!;
const hudComboFire = document.getElementById('hudComboFire')!;
const hudComboValue = document.getElementById('hudComboValue')!;
const hudScore = document.getElementById('hudScore')!;
const hudTimerCircle = document.getElementById('hudTimerCircle') as unknown as SVGCircleElement;
const hudTimerSec = document.getElementById('hudTimerSec')!;
const hubProgressCircle = document.getElementById('hubProgressCircle') as unknown as SVGCircleElement;
const btnPauseGame = document.getElementById('btnPauseGame')!;
const legendBomb = document.getElementById('legendBomb')!;

// Modals
const modalAnalytics = document.getElementById('modalAnalytics')!;
const modalNotebook = document.getElementById('modalNotebook')!;
const modalGuide = document.getElementById('modalGuide')!;
const modalPause = document.getElementById('modalPause')!;

// Analytics modal fields
const analyticsTitle = document.getElementById('analyticsTitle')!;
const analyticsSubtitle = document.getElementById('analyticsSubtitle')!;
const analyticsStars = document.getElementById('analyticsStars')!;
const statTotalScore = document.getElementById('statTotalScore')!;
const statClearTime = document.getElementById('statClearTime')!;
const statAccuracy = document.getElementById('statAccuracy')!;
const statAvgReflex = document.getElementById('statAvgReflex')!;
const radarChartCanvas = document.getElementById('radarChartCanvas') as HTMLCanvasElement;
const radarScoreVision = document.getElementById('radarScoreVision')!;
const radarScoreMath = document.getElementById('radarScoreMath')!;
const radarScoreVocab = document.getElementById('radarScoreVocab')!;
const radarScoreReflex = document.getElementById('radarScoreReflex')!;
const analyticsWordsList = document.getElementById('analyticsWordsList')!;
const btnAnalyticsMenu = document.getElementById('btnAnalyticsMenu')!;
const btnAnalyticsRetry = document.getElementById('btnAnalyticsRetry')!;
const btnAnalyticsNext = document.getElementById('btnAnalyticsNext')!;

// Notebook modal fields
const btnCloseNotebook = document.getElementById('btnCloseNotebook')!;
const notebookListContainer = document.getElementById('notebookListContainer')!;
const searchVocabInput = document.getElementById('searchVocabInput') as HTMLInputElement;
const btnClearMistakes = document.getElementById('btnClearMistakes')!;
const notebookMistakeCountTag = document.getElementById('notebookMistakeCountTag')!;

// Pause modal fields
const btnResumeGame = document.getElementById('btnResumeGame')!;
const btnRestartCurrentLevel = document.getElementById('btnRestartCurrentLevel')!;
const btnQuitToMenu = document.getElementById('btnQuitToMenu')!;

// Schulte & Custom buttons
const btnStartSchulte = document.getElementById('btnStartSchulte')!;
const schulteBestRecord = document.getElementById('schulteBestRecord')!;
const btnStartCustom = document.getElementById('btnStartCustom')!;

/**
 * Initialize Application & DOM Listeners
 */
function init() {
  // Sync Audio & Speech settings
  audio.isSoundEnabled = storage.getSoundSetting();
  audio.isSpeechEnabled = storage.getSpeechSetting();
  updateSoundIcon();

  // Sync Category
  const savedCat = storage.getGlobalCategory();
  if (headerCategorySelect) headerCategorySelect.value = savedCat;

  // Initialize Game Engine
  const arenaContainer = document.getElementById('arenaContainer')!;
  const nodesOrbitLayer = document.getElementById('nodesOrbitLayer')!;
  const centralHub = document.getElementById('centralHub')!;

  engine = new GameEngine(
    arenaContainer,
    nodesOrbitLayer,
    centralHub,
    onHudUpdate,
    onMatchEnd
  );

  // Render Campaign cards
  renderCampaignLevels();
  updateMistakeBadge();
  updateSchulteRecordDisplay();

  // Set up event listeners
  setupNavigationEvents();
  setupModalEvents();
  setupGameControlEvents();
}

/**
 * Render Level Selection Grid (Levels 1 to 6)
 */
function renderCampaignLevels() {
  viewCampaign.innerHTML = '';
  const unlocked = storage.getUnlockedLevels();
  const records = storage.getLevelRecords();
  const isDevAll = storage.getDevUnlockAll();

  btnUnlockAll.innerText = isDevAll ? 'Đã Mở Khóa All' : 'Mở Khóa All';
  btnUnlockAll.className = isDevAll
    ? 'px-2 py-1 text-[11px] font-mono rounded-lg bg-emerald-950 border border-emerald-600 text-emerald-300 font-bold'
    : 'px-2 py-1 text-[11px] font-mono rounded-lg bg-indigo-950/80 border border-indigo-700/80 text-indigo-300 hover:text-white transition';

  CAMPAIGN_LEVELS.forEach(lvl => {
    const isUnlocked = isDevAll || unlocked.includes(lvl.id);
    const rec = records[lvl.id] || { stars: 0, highScore: 0, bestTimeSec: 0 };

    const card = document.createElement('div');
    card.className = `p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
      isUnlocked
        ? 'bg-slate-900/90 border-slate-700/80 hover:border-cyan-500/70 hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer'
        : 'bg-slate-950/60 border-slate-800/60 opacity-60 cursor-not-allowed'
    }`;

    // Star Icons
    let starsHtml = '';
    for (let s = 1; s <= 3; s++) {
      if (s <= rec.stars) {
        starsHtml += `<svg class="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
      } else {
        starsHtml += `<svg class="w-4 h-4 text-slate-700 fill-slate-800" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
      }
    }

    // Badges
    const ringsBadge = `${lvl.rings} Vòng (${lvl.nodeCount} bóng)`;
    let gestureBadge = '1 Chạm';
    if (lvl.allowHold) gestureBadge = 'Chạm · Đúp · Giữ';
    else if (lvl.allowDoubleTap) gestureBadge = 'Chạm & Đúp';

    let modeBadge = '<span class="px-2 py-0.5 rounded-md bg-indigo-950/80 border border-indigo-700/80 text-indigo-300 font-bold">Toán & Anh</span>';
    if (lvl.targetMode === 'math_only') {
      modeBadge = '<span class="px-2 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-600/80 text-cyan-300 font-bold">Toán Thuần Túy</span>';
    } else if (lvl.targetMode === 'vocab_only') {
      modeBadge = '<span class="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-600/80 text-emerald-300 font-bold">Tiếng Anh Thuần Túy</span>';
    }

    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-[11px] font-mono tracking-wider text-cyan-400 font-bold uppercase">MÀN 0${lvl.id}</span>
          <div class="flex items-center gap-1">${starsHtml}</div>
        </div>
        <h4 class="font-patrick text-xl font-bold text-white mb-1 group-hover:text-cyan-300 transition">${lvl.name}</h4>
        <p class="text-xs text-slate-400 line-clamp-2 mb-3">${lvl.subtitle}</p>

        <!-- Mechanics tags -->
        <div class="flex items-center gap-1.5 flex-wrap text-[10px] font-mono text-slate-300 mb-4">
          ${modeBadge}
          <span class="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700/80">${ringsBadge}</span>
          <span class="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700/80">${gestureBadge}</span>
          ${lvl.allowBomb ? '<span class="px-2 py-0.5 rounded-md bg-purple-950/80 border border-purple-800 text-purple-300">Bom Tím</span>' : ''}
          ${lvl.hasReversal ? '<span class="px-2 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-800 text-cyan-300">Đảo Chiều</span>' : ''}
          ${lvl.hasMemoryBlink ? '<span class="px-2 py-0.5 rounded-md bg-amber-950/80 border border-amber-800 text-amber-300">Bóng Ma Chữ</span>' : ''}
        </div>
      </div>

      <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <div class="text-[11px] font-mono text-slate-400">
          ${rec.highScore > 0 ? `Điểm cao: <span class="text-amber-400 font-bold">${rec.highScore}</span>` : 'Chưa vượt qua'}
        </div>
        ${
          isUnlocked
            ? `<button class="px-3.5 py-1 text-xs font-bold rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-sm transition">Chơi Ngay</button>`
            : `<div class="flex items-center gap-1 text-xs text-slate-500"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Khóa</div>`
        }
      </div>
    `;

    if (isUnlocked) {
      card.addEventListener('click', () => {
        startCampaignLevel(lvl);
      });
    }

    viewCampaign.appendChild(card);
  });
}

function startCampaignLevel(config: LevelConfig) {
  // Use global category override if chosen
  const cat = headerCategorySelect.value;
  const runConfig = { ...config };
  if (cat !== 'mixed') {
    runConfig.category = cat;
  }

  showScreen('arena');
  hudLevelTitle.innerText = runConfig.name;
  if (runConfig.allowBomb) {
    legendBomb.classList.remove('hidden');
  } else {
    legendBomb.classList.add('hidden');
  }

  engine.startLevel(runConfig);
}

function showScreen(screen: 'levels' | 'arena') {
  if (screen === 'levels') {
    screenLevelSelect.classList.remove('hidden');
    screenGameArena.classList.add('hidden');
    renderCampaignLevels();
    updateSchulteRecordDisplay();
    updateMistakeBadge();
  } else {
    screenLevelSelect.classList.add('hidden');
    screenGameArena.classList.remove('hidden');
  }
}

/**
 * HUD Updates Callback from Engine
 */
function onHudUpdate(data: {
  score: number;
  combo: number;
  targetsDone: number;
  targetTotal: number;
  timeLeft: number;
  totalTime: number;
  accuracy: number;
}) {
  hudScore.innerText = String(data.score).padStart(4, '0');
  hudTargetCount.innerText = `Mục tiêu: ${data.targetsDone}/${data.targetTotal}`;
  hudAccuracy.innerText = `Chính xác: ${data.accuracy}%`;

  // Combo Badge & Fire
  hudComboValue.innerText = `x${data.combo}`;
  if (data.combo >= 5) {
    hudComboFire.classList.remove('hidden');
    hudComboValue.className = 'text-sm font-black font-mono text-amber-400 animate-pulse';
  } else {
    hudComboFire.classList.add('hidden');
    hudComboValue.className = 'text-sm font-extrabold font-mono text-cyan-400';
  }

  // Timer gauges
  hudTimerSec.innerText = String(data.timeLeft);
  const timeRatio = Math.max(0, data.timeLeft / data.totalTime);

  // SVG perimeter calculations
  // HUD mini circle: circumference = 2 * PI * 16 ≈ 100.5
  if (hudTimerCircle) {
    hudTimerCircle.style.strokeDashoffset = `${100.5 * (1 - timeRatio)}`;
    if (data.timeLeft <= 10) {
      hudTimerCircle.setAttribute('stroke', '#ef4444');
    } else {
      hudTimerCircle.setAttribute('stroke', '#06b6d4');
    }
  }

  // Central Hub circle: circumference = 400
  if (hubProgressCircle) {
    hubProgressCircle.style.strokeDashoffset = `${400 * (1 - timeRatio)}`;
    if (data.timeLeft <= 10) {
      hubProgressCircle.setAttribute('stroke', '#ef4444');
    } else {
      hubProgressCircle.setAttribute('stroke', '#06b6d4');
    }
  }
}

/**
 * Match End Callback: Display Brain Analytics Modal & Radar
 */
function onMatchEnd(stats: MatchStats) {
  modalAnalytics.classList.remove('hidden');

  if (stats.isWin) {
    analyticsTitle.innerText = 'CHIẾN THẮNG HUẤN LUYỆN!';
    analyticsTitle.className = 'text-2xl font-black text-cyan-400 font-patrick text-3xl';
    analyticsSubtitle.innerText = `Chúc mừng bạn đã hoàn thành xuất sắc ${stats.levelName}.`;
  } else {
    analyticsTitle.innerText = 'CHƯA ĐẠT MỤC TIÊU';
    analyticsTitle.className = 'text-2xl font-black text-rose-400 font-patrick text-3xl';
    analyticsSubtitle.innerText = 'Thời gian đã hết hoặc độ chính xác chưa đủ để mở khóa tầng tiếp theo.';
  }

  // Render Stars
  analyticsStars.innerHTML = '';
  for (let s = 1; s <= 3; s++) {
    const starSvg = document.createElement('div');
    if (s <= stats.stars) {
      starSvg.innerHTML = `<svg class="w-8 h-8 text-amber-400 fill-amber-400 animate-bounce" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    } else {
      starSvg.innerHTML = `<svg class="w-8 h-8 text-slate-700 fill-slate-800" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    }
    analyticsStars.appendChild(starSvg.firstElementChild!);
  }

  // Numbers
  statTotalScore.innerText = String(stats.score);
  statClearTime.innerText = `${stats.timeSpentSec}s`;
  statAccuracy.innerText = `${stats.accuracy}%`;
  statAvgReflex.innerText = `${stats.avgReflexMs}ms`;

  // Scores
  radarScoreVision.innerText = String(stats.visionScore);
  radarScoreMath.innerText = String(stats.mathScore);
  radarScoreVocab.innerText = String(stats.vocabScore);
  radarScoreReflex.innerText = String(stats.reflexScore);

  // Draw Radar Chart on Canvas
  drawRadarChart(radarChartCanvas, {
    vision: stats.visionScore,
    math: stats.mathScore,
    vocab: stats.vocabScore,
    reflex: stats.reflexScore
  });

  // Render Reviewed Words list
  analyticsWordsList.innerHTML = '';
  if (stats.reviewedWords.length === 0) {
    analyticsWordsList.innerHTML = `<div class="text-xs text-slate-500 italic">Không có từ vựng phát sinh.</div>`;
  } else {
    stats.reviewedWords.forEach(item => {
      const row = document.createElement('div');
      row.className = `p-2 rounded-lg border flex items-center justify-between text-xs ${
        item.wasWrong
          ? 'bg-rose-950/40 border-rose-800 text-rose-200'
          : 'bg-slate-900 border-slate-800 text-slate-200'
      }`;

      row.innerHTML = `
        <div class="flex items-center gap-2">
          <button class="btnAudioWord w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-cyan-400 transition" title="Nghe phát âm">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
          </button>
          <div>
            <span class="font-bold font-mono ${item.wasWrong ? 'text-rose-400' : 'text-cyan-400'}">${item.vocab.en}</span>
            <span class="text-[10px] text-slate-400 font-mono">${item.vocab.ipa}</span>
            <span class="text-slate-300 ml-1.5">${item.vocab.vi}</span>
          </div>
        </div>
        ${item.wasWrong ? '<span class="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-mono">Bấm nhầm</span>' : '<span class="text-[10px] text-emerald-400 font-mono">Chuẩn xác</span>'}
      `;

      row.querySelector('.btnAudioWord')?.addEventListener('click', () => {
        audio.speakWord(item.vocab.en);
      });

      analyticsWordsList.appendChild(row);
    });
  }

  // Next level button display
  if (stats.isWin && stats.levelId < 6) {
    btnAnalyticsNext.classList.remove('hidden');
  } else {
    btnAnalyticsNext.classList.add('hidden');
  }
}

/**
 * Setup Navigation, Tab & Modal Events
 */
function setupNavigationEvents() {
  btnHome.addEventListener('click', () => {
    if (engine.isRunning) {
      modalPause.classList.remove('hidden');
      engine.pause();
    } else {
      showScreen('levels');
    }
  });

  // Tab switching in Level Select
  tabCampaign.addEventListener('click', () => {
    tabCampaign.className = 'px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500 text-slate-950 shadow-sm transition';
    tabSchulte.className = 'px-3.5 py-1.5 text-xs font-semibold rounded-lg text-slate-400 hover:text-white transition';
    tabCustom.className = 'px-3.5 py-1.5 text-xs font-semibold rounded-lg text-slate-400 hover:text-white transition';

    viewCampaign.classList.remove('hidden');
    viewCampaign.classList.add('grid');
    viewSchulte.classList.add('hidden');
    viewSchulte.classList.remove('flex');
    viewCustom.classList.add('hidden');
    viewCustom.classList.remove('flex');
  });

  tabSchulte.addEventListener('click', () => {
    tabSchulte.className = 'px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-500 text-slate-950 shadow-sm transition';
    tabCampaign.className = 'px-3.5 py-1.5 text-xs font-semibold rounded-lg text-slate-400 hover:text-white transition';
    tabCustom.className = 'px-3.5 py-1.5 text-xs font-semibold rounded-lg text-slate-400 hover:text-white transition';

    viewCampaign.classList.add('hidden');
    viewCampaign.classList.remove('grid');
    viewSchulte.classList.remove('hidden');
    viewSchulte.classList.add('flex');
    viewCustom.classList.add('hidden');
    viewCustom.classList.remove('flex');
  });

  tabCustom.addEventListener('click', () => {
    tabCustom.className = 'px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-400 text-slate-950 shadow-sm transition';
    tabCampaign.className = 'px-3.5 py-1.5 text-xs font-semibold rounded-lg text-slate-400 hover:text-white transition';
    tabSchulte.className = 'px-3.5 py-1.5 text-xs font-semibold rounded-lg text-slate-400 hover:text-white transition';

    viewCampaign.classList.add('hidden');
    viewCampaign.classList.remove('grid');
    viewSchulte.classList.add('hidden');
    viewSchulte.classList.remove('flex');
    viewCustom.classList.remove('hidden');
    viewCustom.classList.add('flex');
  });

  // Global Category filter
  headerCategorySelect.addEventListener('change', () => {
    storage.setGlobalCategory(headerCategorySelect.value);
  });

  // Dev Unlock All Toggle
  btnUnlockAll.addEventListener('click', () => {
    const isUnlocked = storage.getDevUnlockAll();
    storage.setDevUnlockAll(!isUnlocked);
    renderCampaignLevels();
    audio.playCorrect();
  });

  // Sound FX toggle
  btnToggleSound.addEventListener('click', () => {
    audio.isSoundEnabled = !audio.isSoundEnabled;
    storage.setSoundSetting(audio.isSoundEnabled);
    updateSoundIcon();
    if (audio.isSoundEnabled) audio.playCorrect();
  });

  // Speech voice toggle
  btnToggleSpeech.addEventListener('click', () => {
    audio.isSpeechEnabled = !audio.isSpeechEnabled;
    storage.setSpeechSetting(audio.isSpeechEnabled);
    btnToggleSpeech.classList.toggle('text-emerald-400', audio.isSpeechEnabled);
    btnToggleSpeech.classList.toggle('text-slate-600', !audio.isSpeechEnabled);
    if (audio.isSpeechEnabled) {
      audio.speakWord('Speech enabled');
    }
  });

  // Guide Modal
  btnOpenGuide.addEventListener('click', () => {
    modalGuide.classList.remove('hidden');
  });
  document.getElementById('btnCloseGuide')?.addEventListener('click', () => {
    modalGuide.classList.add('hidden');
  });

  // Schulte mode button
  btnStartSchulte.addEventListener('click', () => {
    showScreen('arena');
    hudLevelTitle.innerText = 'Schulte Classic 1→30';
    legendBomb.classList.add('hidden');
    engine.startSchulteMode();
  });

  // Custom Sandbox start button
  btnStartCustom.addEventListener('click', () => {
    const rings = parseInt((document.getElementById('customRings') as HTMLSelectElement).value, 10);
    const speed = (document.getElementById('customSpeed') as HTMLSelectElement).value;
    const actions = (document.getElementById('customActions') as HTMLSelectElement).value;
    const targetCount = parseInt((document.getElementById('customTargetCount') as HTMLSelectElement).value, 10);
    const content = (document.getElementById('customContent') as HTMLSelectElement)?.value || 'combined';

    let baseSpeed = 0.005;
    let hasSinusoidal = false;
    if (speed === 'slow') baseSpeed = 0.003;
    if (speed === 'fast') baseSpeed = 0.008;
    if (speed === 'chaos') {
      baseSpeed = 0.006;
      hasSinusoidal = true;
    }

    const customConfig: LevelConfig = {
      id: 98,
      name: 'Đấu Trường Tùy Chỉnh',
      subtitle: `${rings} Vòng · ${targetCount} Mục tiêu`,
      targetMode: content as any,
      rings: rings,
      nodeCount: rings === 1 ? 10 : rings === 2 ? 18 : 28,
      targetCount: targetCount,
      timeLimitSec: targetCount * 5,
      category: headerCategorySelect.value,
      baseSpeed: baseSpeed,
      allowDoubleTap: actions === 'tap_double' || actions === 'all' || actions === 'all_bomb',
      allowHold: actions === 'all' || actions === 'all_bomb',
      allowBomb: actions === 'all_bomb',
      hasSinusoidalSpeed: hasSinusoidal,
      hasReversal: actions === 'all_bomb'
    };

    showScreen('arena');
    hudLevelTitle.innerText = customConfig.name;
    if (customConfig.allowBomb) legendBomb.classList.remove('hidden');
    else legendBomb.classList.add('hidden');

    engine.startLevel(customConfig);
  });
}

function updateSoundIcon() {
  if (audio.isSoundEnabled) {
    iconSoundOn.classList.remove('hidden');
    iconSoundOff.classList.add('hidden');
  } else {
    iconSoundOn.classList.add('hidden');
    iconSoundOff.classList.remove('hidden');
  }
}

function updateSchulteRecordDisplay() {
  const best = storage.getSchulteBestTime();
  if (best) {
    const sec = (best / 1000).toFixed(2);
    schulteBestRecord.innerText = `${sec} giây`;
  } else {
    schulteBestRecord.innerText = 'Chưa có';
  }
}

function updateMistakeBadge() {
  const mistakes = storage.getMistakenWords();
  const count = Object.keys(mistakes).length;
  if (count > 0) {
    mistakeBadgeCount.classList.remove('hidden');
    mistakeBadgeCount.innerText = String(count);
  } else {
    mistakeBadgeCount.classList.add('hidden');
  }
  if (notebookMistakeCountTag) {
    notebookMistakeCountTag.innerText = String(count);
  }
}

/**
 * Setup Modal Events (Analytics, Sổ Tay, Pause)
 */
function setupModalEvents() {
  // Analytics actions
  btnAnalyticsMenu.addEventListener('click', () => {
    modalAnalytics.classList.add('hidden');
    showScreen('levels');
  });

  btnAnalyticsRetry.addEventListener('click', () => {
    modalAnalytics.classList.add('hidden');
    if (engine.isSchulteMode) {
      engine.startSchulteMode();
    } else {
      engine.startLevel(engine.currentLevelConfig);
    }
  });

  btnAnalyticsNext.addEventListener('click', () => {
    modalAnalytics.classList.add('hidden');
    const nextLvl = CAMPAIGN_LEVELS.find(l => l.id === engine.currentLevelConfig.id + 1);
    if (nextLvl) {
      startCampaignLevel(nextLvl);
    } else {
      showScreen('levels');
    }
  });

  // Notebook (Sổ Tay Từ Vựng)
  btnOpenNotebook.addEventListener('click', () => {
    modalNotebook.classList.remove('hidden');
    renderNotebookList();
  });

  btnCloseNotebook.addEventListener('click', () => {
    modalNotebook.classList.add('hidden');
  });

  document.querySelectorAll('.btnNotebookTab').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.btnNotebookTab').forEach(b => {
        b.className = 'btnNotebookTab px-3 py-1 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 hover:text-white transition';
      });
      const target = e.currentTarget as HTMLElement;
      target.className = 'btnNotebookTab px-3 py-1 text-xs font-medium rounded-lg bg-cyan-500 text-slate-950 font-bold transition';
      currentNotebookFilter = target.getAttribute('data-filter') || 'all';
      renderNotebookList();
    });
  });

  searchVocabInput.addEventListener('input', () => {
    renderNotebookList();
  });

  btnClearMistakes.addEventListener('click', () => {
    storage.clearMistakes();
    updateMistakeBadge();
    renderNotebookList();
  });
}

function renderNotebookList() {
  notebookListContainer.innerHTML = '';
  const mistakes = storage.getMistakenWords();
  const query = searchVocabInput.value.toLowerCase().trim();

  let pool: VocabItem[] = [];

  if (currentNotebookFilter === 'mistakes') {
    pool = VOCABULARY_LIST.filter(v => mistakes[v.en]);
  } else if (currentNotebookFilter === 'all') {
    pool = VOCABULARY_LIST;
  } else {
    pool = getVocabPoolByCategory(currentNotebookFilter);
  }

  if (query) {
    pool = pool.filter(v =>
      v.en.toLowerCase().includes(query) ||
      v.vi.toLowerCase().includes(query) ||
      v.hint.toLowerCase().includes(query)
    );
  }

  if (pool.length === 0) {
    notebookListContainer.innerHTML = `
      <div class="py-8 text-center text-xs text-slate-500">
        Không tìm thấy từ vựng phù hợp với bộ lọc hiện tại.
      </div>
    `;
    return;
  }

  pool.forEach(item => {
    const isMistake = !!mistakes[item.en];
    const row = document.createElement('div');
    row.className = `p-3 rounded-xl border flex items-center justify-between text-xs transition ${
      isMistake ? 'bg-rose-950/20 border-rose-900/50 hover:border-rose-700' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
    }`;

    row.innerHTML = `
      <div class="flex items-center gap-3">
        <button class="btnAudioNotebook w-8 h-8 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 flex items-center justify-center text-slate-300 transition" title="Nghe phát âm">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
        </button>
        <div>
          <div class="flex items-center gap-2">
            <span class="font-bold text-sm font-mono ${isMistake ? 'text-rose-400' : 'text-cyan-400'}">${item.en}</span>
            <span class="text-[11px] text-slate-400 font-mono">${item.ipa}</span>
            <span class="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] uppercase font-mono text-slate-400">${item.cat}</span>
          </div>
          <div class="text-slate-200 mt-0.5">${item.vi} · <span class="text-slate-400 italic text-[11px]">${item.hint}</span></div>
        </div>
      </div>
      <div>
        ${isMistake ? `<span class="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-mono font-bold">Đã sai ${mistakes[item.en].count} lần</span>` : ''}
      </div>
    `;

    row.querySelector('.btnAudioNotebook')?.addEventListener('click', () => {
      audio.speakWord(item.en);
    });

    notebookListContainer.appendChild(row);
  });
}

/**
 * Setup In-Game Pause & Quit controls
 */
function setupGameControlEvents() {
  btnPauseGame.addEventListener('click', () => {
    engine.pause();
    modalPause.classList.remove('hidden');
  });

  btnResumeGame.addEventListener('click', () => {
    modalPause.classList.add('hidden');
    engine.resume();
  });

  btnRestartCurrentLevel.addEventListener('click', () => {
    modalPause.classList.add('hidden');
    if (engine.isSchulteMode) {
      engine.startSchulteMode();
    } else {
      engine.startLevel(engine.currentLevelConfig);
    }
  });

  btnQuitToMenu.addEventListener('click', () => {
    modalPause.classList.add('hidden');
    engine.stop();
    showScreen('levels');
  });
}

// Start app once DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
