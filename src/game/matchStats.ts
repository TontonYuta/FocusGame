import { GameConfig, MatchStats } from './types';
import { VocabItem } from '../data/vocabulary';
import { storage } from '../services/storage';

export function buildMatchStats(
  config: GameConfig,
  isWin: boolean,
  timeLeft: number,
  score: number,
  hits: { total: number; correct: number },
  reactions: number[],
  wordsSeen: Map<string, { vocab: VocabItem; wasWrong: boolean }>
): MatchStats {
  const isSurvival = config.mode === 'survival';
  const spent = isSurvival
    ? Math.max(1, Math.round(reactions.length > 0 ? reactions.reduce((a, b) => a + b, 0) / 1000 : config.timeLimitSec))
    : Math.max(1, config.timeLimitSec - timeLeft);

  const acc = hits.total > 0 ? Math.round((hits.correct / hits.total) * 100) : 0;
  const avgRx = reactions.length > 0
    ? Math.round(reactions.reduce((a, b) => a + b, 0) / reactions.length)
    : 1200;

  const stars = isWin
    ? (isSurvival
        ? (hits.correct >= 20 ? 3 : hits.correct >= 10 ? 2 : 1)
        : (acc >= 90 && timeLeft >= config.timeLimitSec * 0.25 ? 3 : acc >= 75 ? 2 : 1))
    : 0;

  if (isWin) {
    storage.saveLevelRecord(config.id, stars, score, spent);
  }

  return {
    levelId: config.id,
    levelName: config.name,
    isWin,
    stars,
    score,
    timeSpentSec: spent,
    accuracy: acc,
    avgReflexMs: avgRx,
    visionScore: Math.min(100, Math.max(30, Math.round(100 - avgRx / 25))),
    mathScore: Math.min(100, Math.max(20, Math.round(acc * 0.95))),
    vocabScore: Math.min(100, Math.max(25, Math.round(acc * 0.9 + (isWin ? 10 : 0)))),
    reflexScore: Math.min(100, Math.max(30, Math.round(100 - avgRx / 30))),
    reviewedWords: Array.from(wordsSeen.values())
  };
}
