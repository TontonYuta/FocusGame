import { VocabItem, CEFRLevel } from '../data/vocabulary';

export type GameMode = 'math' | 'vocab' | 'combined' | 'schulte' | 'survival';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GestureType = 'tap' | 'bomb';
export type SpeedPreset = 'slow' | 'normal' | 'fast' | 'wave';

export interface CustomGameParams {
  mode: GameMode;
  rings: number;
  speed: SpeedPreset;
  targetCount: number;
  cefrLevel: CEFRLevel | 'all' | 'custom';
  mathLevel?: number;
  allowBomb: boolean;
  hasReversal: boolean;
  isChainedMath: boolean;
}

export interface OrbitNode {
  id: string;
  ringIndex: number;
  angle: number;
  number: number;
  vocab: VocabItem;
  gesture: GestureType;
  isTarget: boolean;
  isDecoyNumber: boolean;
  isDecoyWord: boolean;
  isBomb: boolean;
  domElement: HTMLElement | null;
}

export interface GameConfig {
  id: number;
  mode: GameMode;
  difficulty: Difficulty;
  name: string;
  subtitle: string;
  rings: number;
  nodeCount: number;
  targetCount: number;
  timeLimitSec: number;
  baseSpeed: number;
  cefrLevel: CEFRLevel | 'all' | 'custom';
  mathLevel?: number;
  allowBomb: boolean;
  hasReversal: boolean;
  hasSinusoidalSpeed?: boolean;
  isChainedMath?: boolean;
}

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

export interface HudData {
  score: number;
  combo: number;
  targetsDone: number;
  targetTotal: number;
  timeLeft: number;
  totalTime: number;
  accuracy: number;
}
