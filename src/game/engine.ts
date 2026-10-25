import { GameConfig, OrbitNode, MatchStats, HudData } from './types';
import { audio } from '../services/audio';
import { MathProblem } from '../services/mathGenerator';
import { VocabItem } from '../data/vocabulary';
import { calculateRingRadii, syncOrbitGuides, updateNodePositions } from './orbitMath';
import { spawnOrbitNodes, spawnSchulteOrbitNodes } from './nodeSpawner';
import { generateNextTarget } from './targetGenerator';
import { buildMatchStats } from './matchStats';
import { evaluateHit, evaluateSchulteHit } from './hitEvaluator';

export * from './types';
export * from './config';

export class GameEngine {
  public arena: HTMLElement;
  private nodesContainer: HTMLElement;
  private hub: HTMLElement;
  private onHud: (d: HudData) => void;
  private onEnd: (s: MatchStats) => void;

  public isRunning = false;
  public isPaused = false;
  public isSchulte = false;
  public config!: GameConfig;

  private frameId: number | null = null;
  private tickTimer: number | null = null;
  private reversalTimer: number | null = null;
  private nodes: OrbitNode[] = [];
  private ringDirs = [1, -1, 1];
  private frameCount = 0;
  private lastFrameMs = 0;
  private cachedRadii: number[] = [];
  private cachedCenterX = 0;
  private cachedCenterY = 0;

  public targetType: 'math' | 'vocab' | 'schulte' = 'math';
  public mathProblem: MathProblem | null = null;
  public vocabItem: VocabItem | null = null;
  public prevMathAnswer = 0;
  public targetSpawnMs = 0;
  public reactionTimes: number[] = [];

  public score = 0;
  public combo = 1;
  public targetsDone = 0;
  public totalHits = 0;
  public correctHits = 0;
  public timeLeft = 60;
  public schulteTarget = 1;
  public wordsSeen = new Map<string, { vocab: VocabItem; wasWrong: boolean }>();

  constructor(arena: HTMLElement, nodesEl: HTMLElement, hub: HTMLElement, onHud: (d: HudData) => void, onEnd: (s: MatchStats) => void) {
    this.arena = arena;
    this.nodesContainer = nodesEl;
    this.hub = hub;
    this.onHud = onHud;
    this.onEnd = onEnd;
    window.addEventListener('resize', () => { if (this.isRunning) this.updateDimensions(); });
  }

  public updateDimensions() {
    const rect = this.arena.getBoundingClientRect();
    const { ringRadii, centerX, centerY } = calculateRingRadii(this.config.rings, rect, this.hub);
    this.cachedRadii = ringRadii;
    this.cachedCenterX = centerX;
    this.cachedCenterY = centerY;
    syncOrbitGuides(ringRadii);
  }

  public startMatch(config: GameConfig) {
    this.stop();
    this.isSchulte = false;
    this.config = config;
    this.initMatchState(config.timeLimitSec);
    this.nodes = spawnOrbitNodes(config, this.nodesContainer, this.arena.clientWidth || 360, n => {
      evaluateHit(this, n, this.arena);
      this.updateHud();
    });
    this.updateDimensions();
    this.nextPrompt();
    this.startEngineLoop();
  }

  public startSchulte(schulteConfig: GameConfig) {
    this.stop();
    this.isSchulte = true;
    this.config = schulteConfig;
    this.initMatchState(schulteConfig.timeLimitSec);
    this.schulteTarget = 1;
    this.nodes = spawnSchulteOrbitNodes(this.nodesContainer, this.arena.clientWidth || 360, n => {
      evaluateSchulteHit(this, n);
      this.updateHud();
    });
    this.updateDimensions();
    this.targetType = 'schulte';
    this.startEngineLoop();
  }

  private initMatchState(timeSec: number) {
    this.targetsDone = 0; this.score = 0; this.combo = 1;
    this.totalHits = 0; this.correctHits = 0; this.timeLeft = timeSec;
    this.wordsSeen.clear(); this.reactionTimes = [];
    this.prevMathAnswer = 0; this.frameCount = 0; this.ringDirs = [1, -1, 1];
  }

  private startEngineLoop() {
    this.isRunning = true;
    this.lastFrameMs = performance.now();
    this.startTimers();
    this.loop(this.lastFrameMs);
    this.updateHud();
  }

  public pause() { this.isPaused = true; }
  public resume() { this.isPaused = false; this.lastFrameMs = performance.now(); }

  public stop() {
    this.isRunning = false;
    this.isPaused = false;
    if (this.frameId) cancelAnimationFrame(this.frameId);
    if (this.tickTimer) clearInterval(this.tickTimer);
    if (this.reversalTimer) clearInterval(this.reversalTimer);
    this.frameId = null; this.tickTimer = null; this.reversalTimer = null;
    this.nodesContainer.innerHTML = '';
    this.nodes = [];
  }

  private startTimers() {
    this.tickTimer = window.setInterval(() => {
      if (!this.isRunning || this.isPaused) return;
      this.timeLeft -= 1;
      if (this.timeLeft <= 5 && this.timeLeft > 0) audio.playTick();
      if (this.timeLeft <= 0) this.stopAndEnd(this.config.mode === 'survival' ? this.targetsDone >= 5 : false);
      this.updateHud();
    }, 1000);

    if (this.config.hasReversal) {
      this.reversalTimer = window.setInterval(() => {
        if (!this.isRunning || this.isPaused) return;
        this.ringDirs = this.ringDirs.map(d => -d);
      }, 8000);
    }
  }

  public nextPrompt() {
    if (this.config.mode === 'math') this.targetType = 'math';
    else if (this.config.mode === 'vocab') this.targetType = 'vocab';
    else this.targetType = this.targetsDone % 2 === 0 ? 'math' : 'vocab';

    this.targetSpawnMs = performance.now();
    const res = generateNextTarget(this.nodes, this.targetType, this.config, this.prevMathAnswer);
    this.mathProblem = res.currentMath;
    this.vocabItem = res.currentVocab;
    this.prevMathAnswer = res.previousMathAnswer;
    this.updateHud();
  }

  private loop = (timestamp: number) => {
    if (!this.isRunning) return;
    if (!this.isPaused) {
      this.frameCount++;
      const dt = this.lastFrameMs ? Math.min(50, timestamp - this.lastFrameMs) : 16.666;
      this.lastFrameMs = timestamp;
      const dtScale = dt / 16.6667;
      const factor = this.config.hasSinusoidalSpeed ? 1.0 + 0.5 * Math.sin(this.frameCount * 0.02) : 1.0;
      const survivalSpeedMult = this.config.mode === 'survival' ? Math.min(2.0, 1.0 + (this.targetsDone * 0.035)) : 1.0;
      updateNodePositions(this.nodes, this.cachedRadii, this.cachedCenterX, this.cachedCenterY, this.ringDirs, this.config.baseSpeed, factor * survivalSpeedMult, dtScale);
    }
    this.frameId = requestAnimationFrame(this.loop);
  };

  public updateHud() {
    const acc = this.totalHits > 0 ? Math.round((this.correctHits / this.totalHits) * 100) : 100;
    this.onHud({
      score: this.score, combo: this.combo, targetsDone: this.targetsDone,
      targetTotal: this.config.targetCount, timeLeft: this.timeLeft,
      totalTime: this.config.timeLimitSec, accuracy: acc
    });
  }

  public stopAndEnd(isWin: boolean) {
    this.stop();
    if (isWin) audio.playWin(); else audio.playWrong();
    const stats = buildMatchStats(
      this.config, isWin, this.timeLeft, this.score,
      { total: this.totalHits, correct: this.correctHits },
      this.reactionTimes, this.wordsSeen
    );
    this.onEnd(stats);
  }
}
