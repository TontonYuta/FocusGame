import { VocabItem, getRandomVocab, getVocabPoolByCategory, getVocabPoolByLevel, CEFRLevel } from '../data/vocabulary';
import { generateMathProblem, MathProblem } from '../services/mathGenerator';
import { audio } from '../services/audio';
import { storage } from '../services/storage';

export type GestureType = 'tap' | 'double_tap' | 'hold' | 'bomb';

export interface OrbitNode {
  id: string;
  ringIndex: number; // 0, 1, 2
  angle: number;     // in radians
  number: number;
  vocab: VocabItem;
  gesture: GestureType;
  isTarget: boolean;
  isDecoyNumber: boolean; // same number, wrong word
  isDecoyWord: boolean;   // same word, wrong number
  isBomb: boolean;
  domElement: HTMLElement | null;
  // Gesture tracking states
  lastTapTime: number;
  holdTimer: number | null;
  holdProgress: number; // 0..100
  isDragging: boolean;
  dragX: number;
  dragY: number;
}

export type TargetMode = 'math_only' | 'vocab_only' | 'combined';

export interface LevelConfig {
  id: number;
  name: string;
  subtitle: string;
  targetMode?: TargetMode;
  rings: number;
  nodeCount: number;
  targetCount: number;
  timeLimitSec: number;
  category: string;
  cefrLevel?: CEFRLevel;
  baseSpeed: number; // rad/frame
  allowDoubleTap: boolean;
  allowHold: boolean;
  allowBomb: boolean;
  hasSinusoidalSpeed?: boolean;
  hasReversal?: boolean;
  hasMemoryBlink?: boolean;
  isChainedMath?: boolean;
}

export const CAMPAIGN_LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: 'Màn 1: Khởi Động Tính Nhẩm',
    subtitle: '1 Vòng quỹ đạo · Phép tính < 20 · Phản xạ nhanh',
    targetMode: 'math_only',
    rings: 1,
    nodeCount: 10,
    targetCount: 10,
    timeLimitSec: 60,
    category: 'a1',
    cefrLevel: 'A1',
    baseSpeed: 0.0035,
    allowDoubleTap: false,
    allowHold: false,
    allowBomb: false
  },
  {
    id: 2,
    name: 'Màn 2: Từ Vựng Căn Bản A1',
    subtitle: '1 Vòng quỹ đạo · 40 từ vựng quen thuộc · Phản xạ từ vựng',
    targetMode: 'vocab_only',
    rings: 1,
    nodeCount: 12,
    targetCount: 12,
    timeLimitSec: 65,
    category: 'a1',
    cefrLevel: 'A1',
    baseSpeed: 0.0038,
    allowDoubleTap: false,
    allowHold: false,
    allowBomb: false
  },
  {
    id: 3,
    name: 'Màn 3: Nhị Nguyên Hợp Nhất',
    subtitle: '2 Vòng ngược chiều · Kết hợp Toán & Từ vựng A1 xen kẽ',
    targetMode: 'combined',
    rings: 2,
    nodeCount: 16,
    targetCount: 14,
    timeLimitSec: 75,
    category: 'a1',
    cefrLevel: 'A1',
    baseSpeed: 0.0042,
    allowDoubleTap: false,
    allowHold: false,
    allowBomb: false
  },
  {
    id: 4,
    name: 'Màn 4: Phản Xạ Đa Chiều A2',
    subtitle: '2 Vòng biến tốc · Kết hợp Toán 2 bước & Từ vựng A2',
    targetMode: 'combined',
    rings: 2,
    nodeCount: 20,
    targetCount: 16,
    timeLimitSec: 85,
    category: 'a2',
    cefrLevel: 'A2',
    baseSpeed: 0.0045,
    allowDoubleTap: false,
    allowHold: false,
    allowBomb: false,
    hasSinusoidalSpeed: true
  },
  {
    id: 5,
    name: 'Màn 5: Cơn Lốc Đảo Chiều B1',
    subtitle: '3 Vòng quay đảo chiều · Kết hợp Toán & Từ vựng B1 · Bom tím',
    targetMode: 'combined',
    rings: 3,
    nodeCount: 24,
    targetCount: 18,
    timeLimitSec: 90,
    category: 'b1',
    cefrLevel: 'B1',
    baseSpeed: 0.0048,
    allowDoubleTap: false,
    allowHold: false,
    allowBomb: true,
    hasReversal: true
  },
  {
    id: 6,
    name: 'Màn 6: Bóng Ma Nhấp Nháy B2',
    subtitle: '3 Vòng nhấp nháy chữ · Kết hợp Toán tới 100 & Từ vựng B2 · Bom tím',
    targetMode: 'combined',
    rings: 3,
    nodeCount: 26,
    targetCount: 20,
    timeLimitSec: 95,
    category: 'b2',
    cefrLevel: 'B2',
    baseSpeed: 0.005,
    allowDoubleTap: false,
    allowHold: false,
    allowBomb: true,
    hasMemoryBlink: true
  },
  {
    id: 7,
    name: 'Màn 7: Boss - Vòng Xoáy Vô Cực C1',
    subtitle: 'Thử thách đỉnh cao · Toán chuỗi & Từ vựng học thuật C1',
    targetMode: 'combined',
    rings: 3,
    nodeCount: 28,
    targetCount: 24,
    timeLimitSec: 110,
    category: 'c1',
    cefrLevel: 'C1',
    baseSpeed: 0.0055,
    allowDoubleTap: false,
    allowHold: false,
    allowBomb: true,
    hasReversal: true,
    hasSinusoidalSpeed: true,
    hasMemoryBlink: true,
    isChainedMath: true
  }
];

export interface MatchStats {
  levelId: number;
  levelName: string;
  isWin: boolean;
  stars: number;
  score: number;
  timeSpentSec: number;
  accuracy: number;
  avgReflexMs: number;
  visionScore: number;
  mathScore: number;
  vocabScore: number;
  reflexScore: number;
  reviewedWords: { vocab: VocabItem; wasWrong: boolean }[];
}

export class GameEngine {
  private container: HTMLElement;
  private nodesContainer: HTMLElement;
  private hubElement: HTMLElement;
  private onStatsCallback: (stats: MatchStats) => void;
  private onHudUpdateCallback: (data: {
    score: number;
    combo: number;
    targetsDone: number;
    targetTotal: number;
    timeLeft: number;
    totalTime: number;
    accuracy: number;
  }) => void;

  public isRunning: boolean = false;
  public isPaused: boolean = false;
  public isSchulteMode: boolean = false;
  public currentLevelConfig: LevelConfig = CAMPAIGN_LEVELS[0];

  // Game loop & physics state
  private animationFrameId: number | null = null;
  private nodes: OrbitNode[] = [];
  private ringDirections: number[] = [1, -1, 1]; // Direction per ring
  private ringSpeeds: number[] = [0.004, 0.004, 0.004];
  private timeTickTimer: number | null = null;
  private reversalTimer: number | null = null;
  private memoryBlinkTimer: number | null = null;
  private frameCount: number = 0;

  // Active target & prompts
  public currentTargetType: 'math' | 'vocab' | 'schulte' = 'math';
  public currentMath: MathProblem | null = null;
  public currentVocab: VocabItem | null = null;
  public currentTargetGesture: GestureType = 'tap';
  private previousMathAnswer: number = 0;
  private targetSpawnTime: number = 0;
  private targetReactionTimes: number[] = [];

  // Match progression
  public score: number = 0;
  public combo: number = 1;
  public targetsCleared: number = 0;
  public totalHits: number = 0;
  public correctHits: number = 0;
  public wrongHits: number = 0;
  public timeLeftSec: number = 60;
  public totalTimeSec: number = 60;
  private wordsEncountered: Map<string, { vocab: VocabItem; wasWrong: boolean }> = new Map();

  // Schulte mode state
  public schulteTargetNumber: number = 1;
  public schulteStartTime: number = 0;

  constructor(
    arenaElement: HTMLElement,
    nodesOrbitLayer: HTMLElement,
    centralHub: HTMLElement,
    onHudUpdate: (data: {
      score: number;
      combo: number;
      targetsDone: number;
      targetTotal: number;
      timeLeft: number;
      totalTime: number;
      accuracy: number;
    }) => void,
    onMatchEnd: (stats: MatchStats) => void
  ) {
    this.container = arenaElement;
    this.nodesContainer = nodesOrbitLayer;
    this.hubElement = centralHub;
    this.onHudUpdateCallback = onHudUpdate;
    this.onStatsCallback = onMatchEnd;
  }

  public startLevel(config: LevelConfig) {
    this.stop();
    this.isSchulteMode = false;
    this.currentLevelConfig = config;
    this.targetsCleared = 0;
    this.score = 0;
    this.combo = 1;
    this.totalHits = 0;
    this.correctHits = 0;
    this.wrongHits = 0;
    this.timeLeftSec = config.timeLimitSec;
    this.totalTimeSec = config.timeLimitSec;
    this.wordsEncountered.clear();
    this.targetReactionTimes = [];
    this.previousMathAnswer = 0;
    this.frameCount = 0;
    this.ringDirections = [1, -1, 1];

    this.initRingGuides(config.rings);
    this.spawnNodes();
    this.nextTargetPrompt();

    this.isRunning = true;
    this.isPaused = false;
    this.startTimers();
    this.loop();
    this.updateHud();
  }

  public startSchulteMode() {
    this.stop();
    this.isSchulteMode = true;
    this.currentLevelConfig = {
      id: 99,
      name: 'Schulte Classic 1→30',
      subtitle: 'Tìm số tuần tự 1 đến 30 từ thị giác ngoại vi',
      rings: 3,
      nodeCount: 30,
      targetCount: 30,
      timeLimitSec: 300,
      category: 'mixed',
      baseSpeed: 0.0035,
      allowDoubleTap: false,
      allowHold: false,
      allowBomb: false
    };

    this.targetsCleared = 0;
    this.schulteTargetNumber = 1;
    this.score = 0;
    this.combo = 1;
    this.totalHits = 0;
    this.correctHits = 0;
    this.wrongHits = 0;
    this.timeLeftSec = 300;
    this.totalTimeSec = 300;
    this.wordsEncountered.clear();
    this.targetReactionTimes = [];
    this.schulteStartTime = performance.now();

    this.initRingGuides(3);
    this.spawnSchulteNodes();
    this.updateSchulteHubPrompt();

    this.isRunning = true;
    this.isPaused = false;
    this.startTimers();
    this.loop();
    this.updateHud();
  }

  public pause() {
    this.isPaused = true;
  }

  public resume() {
    this.isPaused = false;
  }

  public stop() {
    this.isRunning = false;
    this.isPaused = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.timeTickTimer !== null) {
      clearInterval(this.timeTickTimer);
      this.timeTickTimer = null;
    }
    if (this.reversalTimer !== null) {
      clearInterval(this.reversalTimer);
      this.reversalTimer = null;
    }
    if (this.memoryBlinkTimer !== null) {
      clearInterval(this.memoryBlinkTimer);
      this.memoryBlinkTimer = null;
    }
    this.nodesContainer.innerHTML = '';
    this.nodes = [];
  }

  private initRingGuides(activeRings: number) {
    const r1 = document.getElementById('ringGuide1');
    const r2 = document.getElementById('ringGuide2');
    const r3 = document.getElementById('ringGuide3');

    if (r1) r1.style.display = activeRings >= 1 ? 'block' : 'none';
    if (r2) r2.style.display = activeRings >= 2 ? 'block' : 'none';
    if (r3) r3.style.display = activeRings >= 3 ? 'block' : 'none';
  }

  private startTimers() {
    // 1-second countdown clock
    this.timeTickTimer = window.setInterval(() => {
      if (!this.isRunning || this.isPaused) return;

      if (!this.isSchulteMode) {
        this.timeLeftSec -= 1;
        if (this.timeLeftSec <= 5 && this.timeLeftSec > 0) {
          audio.playTick();
        }
        if (this.timeLeftSec <= 0) {
          this.endMatch(false);
          return;
        }
      } else {
        // Schulte timer counts up in time
        this.timeLeftSec = Math.max(0, 300 - Math.floor((performance.now() - this.schulteStartTime) / 1000));
      }

      this.updateHud();
    }, 1000);

    // Direction reversal timer (Level 4, 6)
    if (this.currentLevelConfig.hasReversal) {
      this.reversalTimer = window.setInterval(() => {
        if (!this.isRunning || this.isPaused) return;
        this.triggerDirectionReversal();
      }, 8000);
    }

    // Memory Blink timer (Level 5, 6)
    if (this.currentLevelConfig.hasMemoryBlink) {
      this.memoryBlinkTimer = window.setInterval(() => {
        if (!this.isRunning || this.isPaused) return;
        this.triggerMemoryBlink();
      }, 4000);
    }
  }

  public triggerDirectionReversal() {
    // Invert ring directions with a visual cyan flash
    this.ringDirections = this.ringDirections.map(d => -d);
    const flash = document.getElementById('reversalFlashOverlay');
    if (flash) {
      flash.style.backgroundColor = 'rgba(6, 182, 212, 0.25)';
      setTimeout(() => {
        if (flash) flash.style.backgroundColor = 'transparent';
      }, 300);
    }
  }

  public triggerMemoryBlink() {
    // Briefly fade words to 0.15 opacity
    this.nodes.forEach(n => {
      if (n.domElement) {
        const wordEl = n.domElement.querySelector('.node-word-text') as HTMLElement;
        if (wordEl) {
          wordEl.style.opacity = '0.15';
          wordEl.style.transition = 'opacity 0.2s ease';
        }
      }
    });

    setTimeout(() => {
      this.nodes.forEach(n => {
        if (n.domElement) {
          const wordEl = n.domElement.querySelector('.node-word-text') as HTMLElement;
          if (wordEl) {
            wordEl.style.opacity = '1';
          }
        }
      });
    }, 1500);
  }

  private spawnNodes() {
    this.nodesContainer.innerHTML = '';
    this.nodes = [];

    const config = this.currentLevelConfig;
    const totalRings = config.rings;
    const totalCount = config.nodeCount;

    // Distribute nodes across rings
    let ringDistribution: number[] = [];
    if (totalRings === 1) {
      ringDistribution = [totalCount];
    } else if (totalRings === 2) {
      ringDistribution = [Math.floor(totalCount * 0.44), Math.ceil(totalCount * 0.56)];
    } else {
      ringDistribution = [
        Math.floor(totalCount * 0.26),
        Math.floor(totalCount * 0.34),
        totalCount - Math.floor(totalCount * 0.26) - Math.floor(totalCount * 0.34)
      ];
    }

    const vocabPool = config.cefrLevel
      ? getVocabPoolByLevel(config.cefrLevel)
      : getVocabPoolByCategory(config.category);

    let globalNodeIdx = 0;
    ringDistribution.forEach((countInRing, rIndex) => {
      const angleStep = (2 * Math.PI) / countInRing;
      for (let i = 0; i < countInRing; i++) {
        const angle = i * angleStep;
        const initialVocab = getRandomVocab(vocabPool);
        const initialNumber = Math.floor(Math.random() * 25) + 5;

        // Determine gesture
        let gesture: GestureType = 'tap';
        if (config.allowBomb && Math.random() < 0.1) {
          gesture = 'bomb';
        } else if (config.allowHold && Math.random() < 0.25) {
          gesture = 'hold';
        } else if (config.allowDoubleTap && Math.random() < 0.3) {
          gesture = 'double_tap';
        }

        const node: OrbitNode = {
          id: `node-${globalNodeIdx}`,
          ringIndex: rIndex,
          angle: angle,
          number: initialNumber,
          vocab: initialVocab,
          gesture: gesture,
          isTarget: false,
          isDecoyNumber: false,
          isDecoyWord: false,
          isBomb: gesture === 'bomb',
          domElement: null,
          lastTapTime: 0,
          holdTimer: null,
          holdProgress: 0,
          isDragging: false,
          dragX: 0,
          dragY: 0
        };

        const el = this.createNodeDom(node);
        node.domElement = el;
        this.nodesContainer.appendChild(el);
        this.nodes.push(node);
        globalNodeIdx++;
      }
    });
  }

  private spawnSchulteNodes() {
    this.nodesContainer.innerHTML = '';
    this.nodes = [];

    // Distribute 30 numbers across 3 rings: 8, 10, 12
    const distribution = [8, 10, 12];
    const dummyVocab = getVocabPoolByCategory('daily')[0];

    // Shuffle numbers 1 to 30
    const numbers = Array.from({ length: 30 }, (_, i) => i + 1);
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    let numIdx = 0;
    distribution.forEach((countInRing, rIndex) => {
      const angleStep = (2 * Math.PI) / countInRing;
      for (let i = 0; i < countInRing; i++) {
        const angle = i * angleStep;
        const num = numbers[numIdx++];

        const node: OrbitNode = {
          id: `schulte-node-${num}`,
          ringIndex: rIndex,
          angle: angle,
          number: num,
          vocab: dummyVocab,
          gesture: 'tap',
          isTarget: num === 1,
          isDecoyNumber: false,
          isDecoyWord: false,
          isBomb: false,
          domElement: null,
          lastTapTime: 0,
          holdTimer: null,
          holdProgress: 0,
          isDragging: false,
          dragX: 0,
          dragY: 0
        };

        const el = this.createSchulteNodeDom(node);
        node.domElement = el;
        this.nodesContainer.appendChild(el);
        this.nodes.push(node);
      }
    });
  }

  private createNodeDom(node: OrbitNode): HTMLElement {
    const el = document.createElement('div');
    el.id = node.id;
    const isMobile = (this.container.clientWidth || 360) < 480;
    const nodeSize = isMobile ? 46 : 54;

    el.className = 'orbit-node absolute flex flex-col items-center justify-center rounded-2xl select-none cursor-pointer transition-transform duration-100 active:scale-95 z-20 touch-manipulation';
    el.style.width = `${nodeSize}px`;
    el.style.height = `${nodeSize}px`;
    el.style.left = '50%';
    el.style.top = '50%';
    el.style.transform = 'translate(-50%, -50%)';

    this.renderNodeAppearance(node, el);
    this.bindNodeInteractions(node, el);

    return el;
  }

  private createSchulteNodeDom(node: OrbitNode): HTMLElement {
    const el = document.createElement('div');
    el.id = node.id;
    const isMobile = (this.container.clientWidth || 360) < 480;
    const nodeSize = isMobile ? 44 : 52;

    el.className = 'orbit-node absolute flex items-center justify-center rounded-2xl bg-slate-900/90 border-2 border-indigo-500/80 text-white font-mono font-black text-lg sm:text-xl shadow-lg hover:border-cyan-400 cursor-pointer select-none transition-all active:scale-90 z-20 touch-manipulation';
    el.style.width = `${nodeSize}px`;
    el.style.height = `${nodeSize}px`;
    el.style.left = '50%';
    el.style.top = '50%';
    el.style.transform = 'translate(-50%, -50%)';
    el.innerHTML = `<span class="node-main-text">${node.number}</span>`;

    el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.handleSchulteNodeClick(node);
    });

    return el;
  }

  private renderNodeAppearance(node: OrbitNode, el: HTMLElement) {
    if (node.isBomb) {
      el.className = 'orbit-node absolute flex items-center justify-center rounded-2xl bg-purple-950/90 border-2 border-purple-500 text-purple-200 shadow-lg glow-purple cursor-pointer select-none z-20 touch-manipulation transition-transform active:scale-90';
      el.innerHTML = '<span class="text-base sm:text-xl">💣</span>';
      return;
    }

    el.className = 'orbit-node absolute flex items-center justify-center rounded-2xl border-2 border-cyan-500/80 bg-slate-900/95 text-slate-100 shadow-md glow-cyan hover:border-cyan-400 cursor-pointer select-none z-20 p-1 touch-manipulation transition-transform active:scale-90';

    if (this.currentTargetType === 'math') {
      el.innerHTML = `<span class="node-main-text font-mono text-base sm:text-lg font-black tracking-tight text-white leading-none">${node.number}</span>`;
    } else {
      const word = node.vocab ? node.vocab.en : '';
      const wordSizeClass = word.length > 7 ? 'text-[9.5px] sm:text-[10.5px]' : 'text-xs sm:text-sm';
      el.innerHTML = `<span class="node-main-text node-word-text ${wordSizeClass} font-bold tracking-tight text-white max-w-[54px] truncate text-center leading-none">${word}</span>`;
    }
  }

  private bindNodeInteractions(node: OrbitNode, el: HTMLElement) {
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      if (!this.isRunning || this.isPaused) return;

      if (node.isBomb) {
        this.triggerBombHit();
        return;
      }

      this.handleNodeEvaluation(node);
    });
  }

  private handleSchulteNodeClick(node: OrbitNode) {
    if (node.number === this.schulteTargetNumber) {
      audio.playCorrect();
      if (node.domElement) {
        node.domElement.classList.add('bg-emerald-500', 'border-emerald-300', 'scale-90', 'opacity-40');
      }
      this.schulteTargetNumber++;
      this.targetsCleared++;
      this.totalHits++;
      this.correctHits++;

      if (this.schulteTargetNumber > 30) {
        // Finished Schulte 1->30!
        const totalMs = performance.now() - this.schulteStartTime;
        storage.saveSchulteBestTime(totalMs);
        this.endMatch(true);
      } else {
        this.updateSchulteHubPrompt();
      }
    } else {
      audio.playWrong();
      this.totalHits++;
      this.wrongHits++;
      if (node.domElement) {
        node.domElement.classList.add('bg-rose-500/80');
        setTimeout(() => node.domElement?.classList.remove('bg-rose-500/80'), 200);
      }
    }
    this.updateHud();
  }

  private updateSchulteHubPrompt() {
    const mathEl = document.getElementById('hubMathExpression');
    const vocabEl = document.getElementById('hubVocabCue');
    const hintEl = document.getElementById('hubGestureHint');

    if (mathEl) {
      mathEl.innerText = String(this.schulteTargetNumber);
      mathEl.className = 'font-mono text-3xl sm:text-5xl md:text-6xl font-black text-white leading-none text-center';
      mathEl.classList.remove('hidden');
    }
    if (vocabEl) vocabEl.classList.add('hidden');
    if (hintEl) hintEl.classList.add('hidden');
  }

  private handleNodeEvaluation(node: OrbitNode) {
    this.totalHits++;

    let isExactMatch = false;
    if (this.currentTargetType === 'math') {
      isExactMatch = (this.currentMath !== null && node.number === this.currentMath.result);
    } else if (this.currentTargetType === 'vocab') {
      isExactMatch = (this.currentVocab !== null && !!node.vocab && node.vocab.en.toLowerCase() === this.currentVocab.en.toLowerCase());
    } else {
      isExactMatch = node.isTarget;
    }

    if (isExactMatch) {
      // SUCCESS!
      this.correctHits++;
      this.targetsCleared++;
      this.combo = Math.min(10, this.combo + 1);

      const reactionTime = performance.now() - this.targetSpawnTime;
      this.targetReactionTimes.push(reactionTime);

      // Score formula
      const speedBonus = Math.max(0, Math.floor((4000 - reactionTime) / 30));
      const points = (100 + speedBonus) * this.combo;
      this.score += points;

      audio.playCorrect();
      if (this.combo >= 2) {
        audio.playComboUp(this.combo);
      }

      // Pronounce target English word immediately
      if (this.currentTargetType === 'vocab' && node.vocab && node.vocab.en) {
        audio.speakWord(node.vocab.en);
        this.recordWordInteraction(node.vocab, false);
      }

      // Visual success animation
      if (node.domElement) {
        node.domElement.classList.add('bg-emerald-500', 'border-emerald-300', 'scale-110');
        setTimeout(() => {
          node.domElement?.classList.remove('bg-emerald-500', 'border-emerald-300', 'scale-110');
        }, 180);
      }

      // Check level completion
      if (this.targetsCleared >= this.currentLevelConfig.targetCount) {
        this.endMatch(true);
      } else {
        // Reversal check on Level 4 after 3 correct hits
        if (this.currentLevelConfig.hasReversal && this.targetsCleared % 3 === 0) {
          this.triggerDirectionReversal();
        }
        this.nextTargetPrompt();
      }
    } else {
      // MISTAKE!
      this.wrongHits++;
      this.combo = 1; // Break combo streak
      audio.playWrong();

      // Screen shake feedback
      this.container.classList.add('screen-shake');
      setTimeout(() => this.container.classList.remove('screen-shake'), 300);

      // Record mistake word in notebook
      if (this.currentTargetType === 'vocab' && this.currentVocab) {
        this.recordWordInteraction(this.currentVocab, true);
        storage.recordMistake(this.currentVocab.en);
      }

      // If Boss Level (id === 7), shuffle node positions on mistake!
      if (this.currentLevelConfig.id === 7 || this.currentLevelConfig.name.includes('Boss')) {
        this.shuffleNodePositions();
      }

      // Visual flash on node
      if (node.domElement) {
        node.domElement.classList.add('bg-rose-600', 'border-rose-300');
        setTimeout(() => {
          if (node.domElement) {
            this.renderNodeAppearance(node, node.domElement);
          }
        }, 250);
      }
    }

    this.updateHud();
  }

  private triggerBombHit() {
    audio.playBomb();
    this.totalHits++;
    this.wrongHits++;
    this.combo = 1;
    this.timeLeftSec = Math.max(0, this.timeLeftSec - 5);

    this.container.classList.add('screen-shake');
    setTimeout(() => this.container.classList.remove('screen-shake'), 400);

    const flash = document.getElementById('reversalFlashOverlay');
    if (flash) {
      flash.style.backgroundColor = 'rgba(168, 85, 247, 0.4)';
      setTimeout(() => {
        if (flash) flash.style.backgroundColor = 'transparent';
      }, 350);
    }

    if (this.timeLeftSec <= 0) {
      this.endMatch(false);
    } else {
      this.updateHud();
    }
  }

  private recordWordInteraction(vocab: VocabItem, wasWrong: boolean) {
    const existing = this.wordsEncountered.get(vocab.en);
    if (!existing) {
      this.wordsEncountered.set(vocab.en, { vocab, wasWrong });
    } else if (wasWrong) {
      existing.wasWrong = true;
    }
  }

  private shuffleNodePositions() {
    this.nodes.forEach(n => {
      n.angle = (n.angle + (Math.random() - 0.5) * Math.PI) % (2 * Math.PI);
    });
  }

  private nextTargetPrompt() {
    const config = this.currentLevelConfig;
    const mode = config.targetMode || 'combined';
    const pool = config.cefrLevel
      ? getVocabPoolByLevel(config.cefrLevel)
      : getVocabPoolByCategory(config.category);

    // Determine turn type
    if (mode === 'math_only') {
      this.currentTargetType = 'math';
    } else if (mode === 'vocab_only') {
      this.currentTargetType = 'vocab';
    } else {
      // Combined mode: alternate Math and Vocab per target
      this.currentTargetType = (this.targetsCleared % 2 === 0) ? 'math' : 'vocab';
    }

    this.currentTargetGesture = 'tap';
    this.targetSpawnTime = performance.now();

    // Reset all nodes
    this.nodes.forEach(n => {
      n.isTarget = false;
      n.isDecoyNumber = false;
      n.isDecoyWord = false;
      n.isBomb = false;
      n.gesture = 'tap';
    });

    const indices = Array.from({ length: this.nodes.length }, (_, i) => i);
    // Shuffle indices
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    const targetIdx = indices[0];
    const bombIdx = config.allowBomb ? indices[1] : -1;

    if (this.currentTargetType === 'math') {
      const mathProblem = generateMathProblem(
        config.id,
        config.isChainedMath ? this.previousMathAnswer : undefined
      );
      this.currentMath = mathProblem;
      this.previousMathAnswer = mathProblem.result;
      this.currentVocab = null;

      // Target Node
      const targetNode = this.nodes[targetIdx];
      targetNode.isTarget = true;
      targetNode.number = mathProblem.result;

      // Assign distinct decoy numbers to all other nodes
      const usedNumbers = new Set<number>([mathProblem.result]);
      indices.slice(1).forEach((idx) => {
        const n = this.nodes[idx];
        if (idx === bombIdx) {
          n.isBomb = true;
          return;
        }
        let decoyNum = mathProblem.result;
        let attempts = 0;
        while ((decoyNum === mathProblem.result || usedNumbers.has(decoyNum)) && attempts < 40) {
          const delta = (Math.floor(Math.random() * 8) + 1) * (Math.random() > 0.5 ? 1 : -1);
          decoyNum = Math.max(1, mathProblem.result + delta);
          attempts++;
        }
        if (usedNumbers.has(decoyNum)) {
          decoyNum = mathProblem.result + attempts + 2;
        }
        usedNumbers.add(decoyNum);
        n.number = decoyNum;
        n.isDecoyNumber = true;
      });
    } else {
      // Vocab Turn
      const targetVocab = getRandomVocab(pool);
      this.currentVocab = targetVocab;
      this.currentMath = null;

      // Target Node
      const targetNode = this.nodes[targetIdx];
      targetNode.isTarget = true;
      targetNode.vocab = targetVocab;

      // Assign distinct decoy words to all other nodes
      const usedWords = new Set<string>([targetVocab.en]);
      indices.slice(1).forEach((idx) => {
        const n = this.nodes[idx];
        if (idx === bombIdx) {
          n.isBomb = true;
          return;
        }
        let decoyVocab = getRandomVocab(pool, targetVocab.en);
        let attempts = 0;
        while (usedWords.has(decoyVocab.en) && attempts < 35) {
          decoyVocab = getRandomVocab(pool, targetVocab.en);
          attempts++;
        }
        usedWords.add(decoyVocab.en);
        n.vocab = decoyVocab;
        n.isDecoyWord = true;
      });
    }

    // Re-render all nodes
    this.nodes.forEach(n => {
      if (n.domElement) {
        this.renderNodeAppearance(n, n.domElement);
      }
    });

    // Update Central Hub display
    this.updateHubPrompt();
  }

  private updateHubPrompt() {
    const mathEl = document.getElementById('hubMathExpression');
    const vocabEl = document.getElementById('hubVocabCue');
    const hintEl = document.getElementById('hubGestureHint');
    const formulaEl = document.getElementById('hubTargetFormula');

    if (formulaEl) {
      formulaEl.innerText = '';
      formulaEl.classList.add('hidden');
    }
    if (hintEl) {
      hintEl.innerText = '';
      hintEl.classList.add('hidden');
    }

    if (this.currentTargetType === 'math') {
      if (mathEl && this.currentMath) {
        mathEl.innerText = this.currentMath.expression;
        mathEl.className = 'font-mono text-xl sm:text-2xl md:text-3xl font-black text-amber-300 tracking-tight leading-none text-center';
        mathEl.classList.remove('hidden');
      }
      if (vocabEl) {
        vocabEl.classList.add('hidden');
      }
    } else if (this.currentTargetType === 'vocab') {
      if (vocabEl && this.currentVocab) {
        vocabEl.innerText = this.currentVocab.vi;
        vocabEl.className = 'font-patrick text-base sm:text-xl md:text-2xl font-bold text-cyan-300 leading-tight text-center px-1';
        vocabEl.classList.remove('hidden');
      }
      if (mathEl) {
        mathEl.classList.add('hidden');
      }
    }
  }

  private loop = () => {
    if (!this.isRunning) return;

    if (!this.isPaused) {
      this.frameCount++;
      const arenaRect = this.container.getBoundingClientRect();
      const centerX = arenaRect.width / 2;
      const centerY = arenaRect.height / 2;
      const arenaSize = Math.min(centerX, centerY) * 2;
      const isMobile = arenaRect.width < 480;
      const hubElRect = this.hubElement.getBoundingClientRect();
      const hubRadius = (hubElRect.width / 2) || (isMobile ? 48 : 64);
      const nodeRadius = isMobile ? 23 : 27;
      const innerMargin = isMobile ? 14 : 20;
      const minOrbit = hubRadius + nodeRadius + innerMargin;
      const maxRadius = Math.min(centerX, centerY) * 0.94;
      const maxOrbit = Math.max(minOrbit + 26, maxRadius - nodeRadius - (isMobile ? 4 : 8));

      let ringRadii: number[] = [];
      const ringsCount = this.currentLevelConfig.rings;
      if (ringsCount === 1) {
        ringRadii = [(minOrbit + maxOrbit) / 2];
      } else if (ringsCount === 2) {
        ringRadii = [
          minOrbit + (maxOrbit - minOrbit) * 0.2,
          maxOrbit
        ];
      } else {
        ringRadii = [
          minOrbit,
          minOrbit + (maxOrbit - minOrbit) * 0.52,
          maxOrbit
        ];
      }

      // Sync visual orbit guides with real dynamic radii every 30 frames
      if (this.frameCount % 30 === 0) {
        const guides = [
          document.getElementById('ringGuide1'),
          document.getElementById('ringGuide2'),
          document.getElementById('ringGuide3'),
        ];
        guides.forEach((g, idx) => {
          if (!g) return;
          if (idx < ringRadii.length) {
            g.style.display = 'block';
            const diameter = Math.round(ringRadii[idx] * 2);
            g.style.width = `${diameter}px`;
            g.style.height = `${diameter}px`;
          } else {
            g.style.display = 'none';
          }
        });
      }

      // Update ring speeds (sinusoidal modulation for Level 4, 7)
      const config = this.currentLevelConfig;
      let speedFactor = 1.0;
      if (config.hasSinusoidalSpeed) {
        speedFactor = 1.0 + 0.5 * Math.sin(this.frameCount * 0.02);
      }

      // Update polar coordinates and render
      this.nodes.forEach(node => {
        const ringDir = this.ringDirections[node.ringIndex] || 1;
        const baseSpd = config.baseSpeed;
        const deltaAngle = ringDir * baseSpd * speedFactor;

        node.angle = (node.angle + deltaAngle) % (2 * Math.PI);

        // Convert Polar to Cartesian
        const r = ringRadii[node.ringIndex] || maxRadius * 0.5;
        let x = centerX + r * Math.cos(node.angle);
        let y = centerY + r * Math.sin(node.angle);

        // If currently being dragged
        if (node.isDragging) {
          x += node.dragX;
          y += node.dragY;
        }

        if (node.domElement) {
          // Keep node text upright without rotating parent element
          node.domElement.style.left = `${x}px`;
          node.domElement.style.top = `${y}px`;
        }
      });
    }

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  private updateHud() {
    const accuracy = this.totalHits > 0 ? Math.round((this.correctHits / this.totalHits) * 100) : 100;
    this.onHudUpdateCallback({
      score: this.score,
      combo: this.combo,
      targetsDone: this.targetsCleared,
      targetTotal: this.currentLevelConfig.targetCount,
      timeLeft: this.timeLeftSec,
      totalTime: this.totalTimeSec,
      accuracy: accuracy
    });
  }

  private endMatch(isWin: boolean) {
    this.stop();
    if (isWin) {
      audio.playWin();
    } else {
      audio.playWrong();
    }

    const timeSpent = this.totalTimeSec - this.timeLeftSec;
    const accuracy = this.totalHits > 0 ? Math.round((this.correctHits / this.totalHits) * 100) : 0;
    const avgReflex = this.targetReactionTimes.length > 0
      ? Math.round(this.targetReactionTimes.reduce((a, b) => a + b, 0) / this.targetReactionTimes.length)
      : 1200;

    // Calculate Stars
    let stars = 0;
    if (isWin) {
      if (accuracy >= 90 && this.timeLeftSec >= this.totalTimeSec * 0.25) {
        stars = 3;
      } else if (accuracy >= 75) {
        stars = 2;
      } else {
        stars = 1;
      }
      // Save unlock & records
      storage.unlockLevel(this.currentLevelConfig.id + 1);
      storage.saveLevelRecord(this.currentLevelConfig.id, stars, this.score, timeSpent);
    }

    // 4 Cognitive Scores (0-100)
    const visionScore = Math.min(100, Math.max(30, Math.round(100 - (avgReflex / 25))));
    const mathScore = Math.min(100, Math.max(20, Math.round(accuracy * 0.95)));
    const vocabScore = Math.min(100, Math.max(25, Math.round(accuracy * 0.9 + (isWin ? 10 : 0))));
    const reflexScore = Math.min(100, Math.max(30, Math.round(100 - (avgReflex / 30))));

    const reviewedList = Array.from(this.wordsEncountered.values());

    const stats: MatchStats = {
      levelId: this.currentLevelConfig.id,
      levelName: this.currentLevelConfig.name,
      isWin,
      stars,
      score: this.score,
      timeSpentSec: timeSpent,
      accuracy,
      avgReflexMs: avgReflex,
      visionScore,
      mathScore,
      vocabScore,
      reflexScore,
      reviewedWords: reviewedList
    };

    this.onStatsCallback(stats);
  }
}
