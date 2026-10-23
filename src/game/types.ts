import { VocabItem, CEFRLevel } from '../data/vocabulary';
import { MathProblem } from '../services/mathGenerator';

export type GameMode = 'math' | 'vocab' | 'combined' | 'schulte';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GestureType = 'tap' | 'bomb';

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
  cefrLevel: CEFRLevel;
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
