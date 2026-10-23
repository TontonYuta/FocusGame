import { VocabItem, getRandomVocab, getVocabPoolByCategory } from '../data/vocabulary';
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
    subtitle: '1 Vòng quỹ đạo · Phép tính < 20 · Toán học thuần túy',
    targetMode: 'math_only',
    rings: 1,
    nodeCount: 10,
    targetCount: 10,
    timeLimitSec: 60,
    category: 'daily',
    baseSpeed: 0.004,
    allowDoubleTap: false,
    allowHold: false,
    allowBomb: false
  },
  {
    id: 2,
    name: 'Màn 2: Phản Xạ Từ Vựng',
    subtitle: '1 Vòng quỹ đạo · Từ vựng cơ bản · Tiếng Anh thuần túy',
    targetMode: 'vocab_only',
    rings: 1,
    nodeCount: 12,
    targetCount: 12,
    timeLimitSec: 65,
    category: 'daily',
    baseSpeed: 0.0045,
    allowDoubleTap: false,
    allowHold: false,
    allowBomb: false
  },
  {
    id: 3,
    name: 'Màn 3: Nhị Nguyên Hợp Nhất',
    subtitle: '2 Vòng ngược chiều · Kết hợp Toán & Anh · Chạm đúp',
    targetMode: 'combined',
    rings: 2,
    nodeCount: 18,
    targetCount: 15,
    timeLimitSec: 75,
    category: 'toeic',
    baseSpeed: 0.005,
    allowDoubleTap: true,
    allowHold: false,
    allowBomb: false
  },
  {
    id: 4,
    name: 'Màn 4: Phản Xạ Đa Chiều',
    subtitle: '2 Vòng biến tốc · Phép tính 2 bước · Nhấn giữ & Kéo',
    targetMode: 'combined',
    rings: 2,
    nodeCount: 22,
    targetCount: 18,
    timeLimitSec: 85,
    category: 'toeic',
    baseSpeed: 0.005,
    allowDoubleTap: true,
    allowHold: true,
    allowBomb: false,
    hasSinusoidalSpeed: true
  },
  {
    id: 5,
    name: 'Màn 5: Cơn Lốc Đảo Chiều',
    subtitle: '3 Vòng quay đảo chiều · IELTS · Cảnh giác bom tím',
    targetMode: 'combined',
    rings: 3,
    nodeCount: 28,
    targetCount: 20,
    timeLimitSec: 90,
    category: 'academic',
    baseSpeed: 0.006,
    allowDoubleTap: true,
    allowHold: true,
    allowBomb: true,
    hasReversal: true
  },
  {
    id: 6,
    name: 'Màn 6: Bóng Ma Nhấp Nháy',
    subtitle: '3 Vòng nhấp nháy chữ · Toán tới 100 · Công nghệ Tech',
    targetMode: 'combined',
    rings: 3,
    nodeCount: 30,
    targetCount: 22,
    timeLimitSec: 95,
    category: 'tech',
    baseSpeed: 0.006,
    allowDoubleTap: true,
    allowHold: true,
    allowBomb: true,
    hasMemoryBlink: true
  },
  {
    id: 7,
    name: 'Màn 7: Boss - Vòng Xoáy Vô Cực',
    subtitle: 'Toán chuỗi kế thừa · Đảo chiều biến tốc · Thử thách đỉnh cao',
    targetMode: 'combined',
    rings: 3,
    nodeCount: 30,
    targetCount: 30,
    timeLimitSec: 120,
    category: 'mixed',
    baseSpeed: 0.007,
    allowDoubleTap: true,
    allowHold: true,
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

    const vocabPool = getVocabPoolByCategory(config.category);

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
    const nodeSize = isMobile ? 48 : 58;

    el.className = 'absolute flex flex-col items-center justify-center rounded-2xl select-none cursor-pointer transition-transform duration-100 active:scale-95 z-20 touch-manipulation';
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

    el.className = 'absolute flex items-center justify-center rounded-2xl bg-slate-900/90 border-2 border-indigo-500/80 text-white font-mono font-black text-lg sm:text-xl shadow-lg hover:border-cyan-400 cursor-pointer select-none transition-all active:scale-90 z-20 touch-manipulation';
    el.style.width = `${nodeSize}px`;
    el.style.height = `${nodeSize}px`;
    el.style.left = '50%';
    el.style.top = '50%';
    el.style.transform = 'translate(-50%, -50%)';
    el.innerHTML = `<span>${node.number}</span>`;

    el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.handleSchulteNodeClick(node);
    });

    return el;
  }

  private renderNodeAppearance(node: OrbitNode, el: HTMLElement) {
    if (node.isBomb) {
      el.className = 'absolute flex flex-col items-center justify-center rounded-2xl bg-purple-950/90 border-2 border-purple-500 text-purple-200 shadow-lg glow-purple cursor-pointer select-none z-20 touch-manipulation';
      el.innerHTML = `
        <div class="text-sm">💣</div>
        <div class="text-[8px] sm:text-[9px] font-mono font-bold text-purple-300">TRÁNH</div>
      `;
      return;
    }

    let borderStyle = 'border-2 border-cyan-500/80 bg-slate-900/95 text-slate-100 shadow-md glow-cyan';
    let gestureBadge = '';

    if (node.gesture === 'double_tap') {
      borderStyle = 'border-2 border-dashed border-rose-500 bg-rose-950/80 text-rose-100 shadow-md glow-red';
      gestureBadge = '<span class="text-[7px] sm:text-[8px] text-rose-400 font-mono font-bold">ĐÚP</span>';
    } else if (node.gesture === 'hold') {
      borderStyle = 'border-2 border-amber-400 bg-amber-950/80 text-amber-100 shadow-md glow-gold';
      gestureBadge = '<span class="text-[7px] sm:text-[8px] text-amber-400 font-mono font-bold">GIỮ</span>';
    }

    el.className = `absolute flex flex-col items-center justify-center rounded-2xl ${borderStyle} cursor-pointer select-none z-20 p-1 touch-manipulation`;

    const mode = this.currentLevelConfig.targetMode || 'combined';
    let innerContent = '';

    if (mode === 'math_only') {
      innerContent = `
        <div class="w-full h-full flex flex-col items-center justify-center">
          <span class="font-mono text-base sm:text-lg font-black tracking-tight text-white leading-none">${node.number}</span>
          ${gestureBadge ? `<div class="mt-0.5">${gestureBadge}</div>` : ''}
        </div>
      `;
    } else if (mode === 'vocab_only') {
      innerContent = `
        <div class="w-full h-full flex flex-col items-center justify-center px-1">
          <span class="node-word-text text-[10px] sm:text-xs font-bold tracking-tight text-white max-w-[50px] sm:max-w-[62px] truncate text-center leading-tight">
            ${node.vocab ? node.vocab.en : ''}
          </span>
          ${gestureBadge ? `<div class="mt-0.5">${gestureBadge}</div>` : ''}
        </div>
      `;
    } else {
      innerContent = `
        <div class="w-full flex items-center justify-between px-1 -mt-0.5">
          <span class="font-mono text-xs font-black tracking-tight text-white">${node.number}</span>
          ${gestureBadge}
        </div>
        <div class="node-word-text text-[9px] font-semibold tracking-tight text-slate-200 max-w-[50px] sm:max-w-[56px] truncate text-center leading-none mt-0.5">
          ${node.vocab ? node.vocab.en : ''}
        </div>
      `;
    }

    el.innerHTML = `
      ${innerContent}
      <!-- Progress circular border for Hold gesture -->
      <svg class="node-hold-circle absolute inset-0 w-full h-full -rotate-90 pointer-events-none hidden">
        <circle cx="50%" cy="50%" r="46%" stroke="#f59e0b" stroke-width="3" fill="none" stroke-dasharray="190" stroke-dashoffset="190" stroke-linecap="round"/>
      </svg>
    `;
  }

  private bindNodeInteractions(node: OrbitNode, el: HTMLElement) {
    let pointerStartX = 0;
    let pointerStartY = 0;

    el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      if (!this.isRunning || this.isPaused) return;

      pointerStartX = e.clientX;
      pointerStartY = e.clientY;

      if (node.isBomb) {
        this.triggerBombHit();
        return;
      }

      if (node.gesture === 'tap') {
        this.handleNodeEvaluation(node);
      } else if (node.gesture === 'double_tap') {
        const now = performance.now();
        if (now - node.lastTapTime < 350) {
          // Successful double tap within 350ms!
          node.lastTapTime = 0;
          this.handleNodeEvaluation(node);
        } else {
          // First tap of double tap
          node.lastTapTime = now;
          audio.playDoubleTapFirst();
          // Visual pulse to prompt second tap
          el.classList.add('scale-110');
          setTimeout(() => el.classList.remove('scale-110'), 150);
        }
      } else if (node.gesture === 'hold') {
        // Start hold timer & drag detection
        const holdSvg = el.querySelector('.node-hold-circle') as HTMLElement;
        const circle = el.querySelector('.node-hold-circle circle') as SVGCircleElement;
        if (holdSvg && circle) {
          holdSvg.classList.remove('hidden');
          circle.style.strokeDashoffset = '190';
        }

        const startHold = performance.now();
        const duration = 400; // 400ms hold

        node.holdTimer = window.setInterval(() => {
          const elapsed = performance.now() - startHold;
          const ratio = Math.min(1, elapsed / duration);
          if (circle) {
            circle.style.strokeDashoffset = `${190 - 190 * ratio}`;
          }
          if (elapsed >= duration) {
            if (node.holdTimer !== null) {
              clearInterval(node.holdTimer);
              node.holdTimer = null;
            }
            if (holdSvg) holdSvg.classList.add('hidden');
            this.handleNodeEvaluation(node);
          }
        }, 30);

        // Track drag & drop towards center
        const onPointerMove = (moveEvt: PointerEvent) => {
          const dx = moveEvt.clientX - pointerStartX;
          const dy = moveEvt.clientY - pointerStartY;
          if (Math.hypot(dx, dy) > 15) {
            node.isDragging = true;
            node.dragX = dx;
            node.dragY = dy;
            // Show drop overlay in central hub
            const overlay = document.getElementById('hubDropOverlay');
            if (overlay) overlay.classList.remove('hidden');
            overlay?.classList.add('flex');
          }
        };

        const onPointerUp = (upEvt: PointerEvent) => {
          window.removeEventListener('pointermove', onPointerMove);
          window.removeEventListener('pointerup', onPointerUp);

          if (node.holdTimer !== null) {
            clearInterval(node.holdTimer);
            node.holdTimer = null;
          }
          if (holdSvg) holdSvg.classList.add('hidden');

          const overlay = document.getElementById('hubDropOverlay');
          if (overlay) {
            overlay.classList.add('hidden');
            overlay.classList.remove('flex');
          }

          if (node.isDragging) {
            node.isDragging = false;
            node.dragX = 0;
            node.dragY = 0;
            // Check if dropped inside central hub!
            const hubRect = this.hubElement.getBoundingClientRect();
            const hubCenterX = hubRect.left + hubRect.width / 2;
            const hubCenterY = hubRect.top + hubRect.height / 2;
            const distToCenter = Math.hypot(upEvt.clientX - hubCenterX, upEvt.clientY - hubCenterY);

            if (distToCenter <= hubRect.width / 2) {
              // Successfully dropped into central hub!
              this.handleNodeEvaluation(node);
            }
          }
        };

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
      }
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

    if (mathEl) mathEl.innerText = `SỐ TIẾP: ${this.schulteTargetNumber}`;
    if (vocabEl) vocabEl.innerText = 'Chạm từ 1 đến 30';
    if (hintEl) hintEl.innerHTML = `<span class="text-cyan-400">Đã tìm: ${this.schulteTargetNumber - 1}/30</span>`;
  }

  private handleNodeEvaluation(node: OrbitNode) {
    this.totalHits++;
    const isExactMatch = node.isTarget;

    if (isExactMatch) {
      // SUCCESS! Correct Number AND Correct Word
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
      if (node.vocab && node.vocab.en) {
        audio.speakWord(node.vocab.en);
        this.recordWordInteraction(node.vocab, false);
      }

      // Visual success animation
      if (node.domElement) {
        node.domElement.classList.add('scale-125', 'bg-emerald-500/80');
        setTimeout(() => {
          node.domElement?.classList.remove('scale-125', 'bg-emerald-500/80');
        }, 200);
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
      setTimeout(() => this.container.classList.remove('screen-shake'), 350);

      // Record mistake word in notebook
      if (node.vocab && node.vocab.en) {
        this.recordWordInteraction(node.vocab, true);
        storage.recordMistake(node.vocab.en);
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
        }, 300);
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
    const pool = getVocabPoolByCategory(config.category);

    // Common gesture setup
    let targetGesture: GestureType = 'tap';
    if (config.allowHold && Math.random() < 0.28) {
      targetGesture = 'hold';
    } else if (config.allowDoubleTap && Math.random() < 0.35) {
      targetGesture = 'double_tap';
    }
    this.currentTargetGesture = targetGesture;
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

    if (mode === 'math_only') {
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
      targetNode.gesture = targetGesture;

      // Assign distinct decoy numbers to all other nodes
      const usedNumbers = new Set<number>([mathProblem.result]);
      indices.slice(1).forEach((idx) => {
        const n = this.nodes[idx];
        if (idx === bombIdx) {
          n.isBomb = true;
          n.gesture = 'bomb';
          return;
        }
        let decoyNum = mathProblem.result;
        let attempts = 0;
        while ((decoyNum === mathProblem.result || usedNumbers.has(decoyNum)) && attempts < 30) {
          const delta = (Math.floor(Math.random() * 8) + 1) * (Math.random() > 0.5 ? 1 : -1);
          decoyNum = Math.max(1, mathProblem.result + delta);
          attempts++;
        }
        usedNumbers.add(decoyNum);
        n.number = decoyNum;
        n.isDecoyNumber = true;
        n.gesture = this.pickGestureForNode(config);
      });
    } else if (mode === 'vocab_only') {
      const targetVocab = getRandomVocab(pool);
      this.currentVocab = targetVocab;
      this.currentMath = null;

      // Target Node
      const targetNode = this.nodes[targetIdx];
      targetNode.isTarget = true;
      targetNode.vocab = targetVocab;
      targetNode.gesture = targetGesture;

      const usedWords = new Set<string>([targetVocab.en]);
      indices.slice(1).forEach((idx) => {
        const n = this.nodes[idx];
        if (idx === bombIdx) {
          n.isBomb = true;
          n.gesture = 'bomb';
          return;
        }
        let decoyVocab = getRandomVocab(pool, targetVocab.en);
        let attempts = 0;
        while (usedWords.has(decoyVocab.en) && attempts < 25) {
          decoyVocab = getRandomVocab(pool, targetVocab.en);
          attempts++;
        }
        usedWords.add(decoyVocab.en);
        n.vocab = decoyVocab;
        n.isDecoyWord = true;
        n.gesture = this.pickGestureForNode(config);
      });
    } else {
      // COMBINED MODE (4-in-1: Math + English)
      const mathProblem = generateMathProblem(
        config.id,
        config.isChainedMath ? this.previousMathAnswer : undefined
      );
      this.currentMath = mathProblem;
      this.previousMathAnswer = mathProblem.result;

      const targetVocab = getRandomVocab(pool);
      this.currentVocab = targetVocab;

      const targetNode = this.nodes[targetIdx];
      targetNode.isTarget = true;
      targetNode.number = mathProblem.result;
      targetNode.vocab = targetVocab;
      targetNode.gesture = targetGesture;

      const decoyNum1 = indices[1];
      const decoyNum2 = indices[2];
      const decoyWord1 = indices[3];
      const decoyWord2 = indices[4];
      const actualBombIdx = config.allowBomb ? indices[5] : -1;

      // Decoy Numbers (Same Number, Wrong Word)
      [decoyNum1, decoyNum2].forEach(idx => {
        if (idx !== undefined && this.nodes[idx]) {
          const n = this.nodes[idx];
          n.isDecoyNumber = true;
          n.number = mathProblem.result;
          n.vocab = getRandomVocab(pool, targetVocab.en);
          n.gesture = this.pickGestureForNode(config);
        }
      });

      // Decoy Words (Same Word, Wrong Number)
      [decoyWord1, decoyWord2].forEach(idx => {
        if (idx !== undefined && this.nodes[idx]) {
          const n = this.nodes[idx];
          n.isDecoyWord = true;
          let delta = Math.floor(Math.random() * 5) + 1;
          if (Math.random() > 0.5) delta = -delta;
          n.number = Math.max(1, mathProblem.result + delta);
          n.vocab = targetVocab;
          n.gesture = this.pickGestureForNode(config);
        }
      });

      // Bomb node
      if (actualBombIdx !== -1 && this.nodes[actualBombIdx]) {
        const bNode = this.nodes[actualBombIdx];
        bNode.isBomb = true;
        bNode.gesture = 'bomb';
      }

      // Remaining nodes get random numbers & words
      indices.slice(config.allowBomb ? 6 : 5).forEach(idx => {
        const n = this.nodes[idx];
        n.number = Math.floor(Math.random() * 50) + 5;
        n.vocab = getRandomVocab(pool, targetVocab.en);
        n.gesture = this.pickGestureForNode(config);
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

  private pickGestureForNode(config: LevelConfig): GestureType {
    if (config.allowHold && Math.random() < 0.2) return 'hold';
    if (config.allowDoubleTap && Math.random() < 0.25) return 'double_tap';
    return 'tap';
  }

  private updateHubPrompt() {
    const mathEl = document.getElementById('hubMathExpression');
    const vocabEl = document.getElementById('hubVocabCue');
    const hintEl = document.getElementById('hubGestureHint');
    const formulaEl = document.getElementById('hubTargetFormula');
    const mode = this.currentLevelConfig.targetMode || 'combined';

    if (mode === 'math_only') {
      if (mathEl && this.currentMath) {
        mathEl.innerText = this.currentMath.expression;
      }
      if (vocabEl) {
        vocabEl.innerHTML = '<span class="text-[10px] sm:text-xs text-cyan-300 font-mono font-bold tracking-wider uppercase">TOÁN HỌC THUẦN TÚY</span>';
      }
      if (formulaEl && this.currentMath) {
        formulaEl.innerText = `= ${this.currentMath.result}`;
      }
    } else if (mode === 'vocab_only') {
      if (mathEl && this.currentVocab) {
        mathEl.innerHTML = `<span class="text-sm sm:text-lg md:text-xl font-black text-amber-300 leading-tight">"${this.currentVocab.vi}"</span>`;
      }
      if (vocabEl) {
        vocabEl.innerHTML = '<span class="text-[10px] sm:text-xs text-emerald-300 font-mono font-bold tracking-wider uppercase">TỪ VỰNG TIẾNG ANH</span>';
      }
      if (formulaEl && this.currentVocab) {
        formulaEl.innerText = `${this.currentVocab.en}`;
      }
    } else {
      if (mathEl && this.currentMath) {
        mathEl.innerText = this.currentMath.expression;
      }
      if (vocabEl && this.currentVocab) {
        vocabEl.innerText = `"${this.currentVocab.vi}"`;
      }
      if (formulaEl && this.currentMath) {
        formulaEl.innerText = `${this.currentMath.result} · ?`;
      }
    }

    // Gesture indicator in Central Hub
    if (hintEl) {
      let gestureText = '1 Chạm';
      if (this.currentTargetGesture === 'double_tap') {
        gestureText = 'Chạm Đúp (Đỏ)';
      } else if (this.currentTargetGesture === 'hold') {
        gestureText = 'Giữ/Kéo (Vàng)';
      }
      hintEl.innerHTML = `Thao tác: <span class="text-cyan-300 font-bold">${gestureText}</span>`;
    }
  }

  private loop = () => {
    if (!this.isRunning) return;

    if (!this.isPaused) {
      this.frameCount++;
      const arenaRect = this.container.getBoundingClientRect();
      const centerX = arenaRect.width / 2;
      const centerY = arenaRect.height / 2;
      const maxRadius = Math.min(centerX, centerY) * 0.92;
      const isMobile = arenaRect.width < 480;
      const hubRadius = (this.hubElement.offsetWidth / 2) || (isMobile ? 56 : 72);
      const nodeRadius = isMobile ? 24 : 29;
      const innerMargin = isMobile ? 10 : 18;
      const minOrbit = hubRadius + nodeRadius + innerMargin;
      const maxOrbit = Math.max(minOrbit + 20, maxRadius - nodeRadius - 4);

      let ringRadii: number[] = [];
      const ringsCount = this.currentLevelConfig.rings;
      if (ringsCount === 1) {
        ringRadii = [(minOrbit + maxOrbit) / 2];
      } else if (ringsCount === 2) {
        ringRadii = [
          minOrbit + (maxOrbit - minOrbit) * 0.18,
          maxOrbit
        ];
      } else {
        ringRadii = [
          minOrbit,
          minOrbit + (maxOrbit - minOrbit) * 0.5,
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
