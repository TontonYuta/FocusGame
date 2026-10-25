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

  // -------------------------------------------------------------
  // 1. REFLEX SCORE (Phản Xạ: Tốc độ phản xạ thần kinh & đôi tay)
  // -------------------------------------------------------------
  let reflex = 60;
  if (avgRx <= 450) reflex = 99;
  else if (avgRx <= 650) reflex = 92 + Math.round((650 - avgRx) / 28);
  else if (avgRx <= 950) reflex = 83 + Math.round((950 - avgRx) / 33);
  else if (avgRx <= 1300) reflex = 73 + Math.round((1300 - avgRx) / 35);
  else if (avgRx <= 1700) reflex = 63 + Math.round((1700 - avgRx) / 40);
  else reflex = Math.max(40, Math.round(63 - (avgRx - 1700) / 60));

  if (isWin) reflex += 3;
  if (acc >= 90) reflex += 2;
  const reflexScore = Math.min(100, Math.max(40, reflex));

  // -------------------------------------------------------------
  // 2. VISION SCORE (Tinh Mắt: Thị giác ngoại vi & bám đuổi đa vòng)
  // -------------------------------------------------------------
  let vision = 65;
  if (config.mode === 'schulte') {
    // Schulte is pure peripheral vision benchmark (30 numbers)
    if (spent <= 35) vision = 98;
    else if (spent <= 55) vision = 88 + Math.round((55 - spent) / 2);
    else if (spent <= 80) vision = 76 + Math.round((80 - spent) / 2.1);
    else vision = Math.max(45, Math.round(76 - (spent - 80) * 0.8));
    if (acc === 100) vision += 3;
  } else {
    // Orbital tracking: accuracy + ring complexity + speed bonus
    const baseAccScore = acc * 0.72; // max 72
    const ringBonus = (config.rings || 1) === 3 ? 14 : (config.rings || 1) === 2 ? 8 : 4; // max 14
    const speedBonus = avgRx < 900 ? 8 : avgRx < 1300 ? 4 : 0; // max 8
    const bombBonus = config.allowBomb && isWin ? 6 : 0; // max 6
    vision = Math.round(baseAccScore + ringBonus + speedBonus + bombBonus);
  }
  const visionScore = Math.min(100, Math.max(40, vision));

  // -------------------------------------------------------------
  // 3. MATH SCORE (Tính Nhẩm: Khả năng số học & tư duy logic)
  // -------------------------------------------------------------
  let mathScore = 70;
  if (config.mode === 'math' || config.mode === 'combined' || config.mode === 'survival') {
    const diffBase = (config.mathLevel || 1) === 3 ? 84 : (config.mathLevel || 1) === 2 ? 78 : 72;
    const accPoints = Math.round((acc / 100) * 16);
    const fastMathBonus = avgRx < 900 ? 5 : avgRx < 1200 ? 3 : 0;
    const winBonus = isWin ? 3 : 0;
    mathScore = diffBase + accPoints + fastMathBonus + winBonus;
  } else {
    // In pure Vocab or Schulte, calibrate honest cognitive logic baseline
    mathScore = Math.round(62 + (acc * 0.22) + (avgRx < 1000 ? 8 : 4) + (isWin ? 4 : 0));
  }
  mathScore = Math.min(100, Math.max(40, mathScore));

  // -------------------------------------------------------------
  // 4. VOCAB SCORE (Từ Vựng: Ngôn ngữ & nhận diện mặt chữ)
  // -------------------------------------------------------------
  let vocabScore = 70;
  if (config.mode === 'vocab' || config.mode === 'combined' || config.mode === 'survival') {
    const levelMap: Record<string, number> = { A1: 72, A2: 78, B1: 83, B2: 87, C1: 91, all: 88, custom: 85 };
    const cefrBase = levelMap[config.cefrLevel || 'A1'] || 75;
    const accPoints = Math.round((acc / 100) * 15);
    const mistakesCount = Array.from(wordsSeen.values()).filter(w => w.wasWrong).length;
    const mistakePenalty = mistakesCount * 3;
    const speedBonus = avgRx < 1000 ? 5 : 0;
    const winBonus = isWin ? 3 : 0;
    vocabScore = cefrBase + accPoints - mistakePenalty + speedBonus + winBonus;
  } else {
    // In pure Math or Schulte, calibrate honest linguistic/semantic baseline
    vocabScore = Math.round(62 + (acc * 0.22) + (avgRx < 1000 ? 8 : 4) + (isWin ? 4 : 0));
  }
  vocabScore = Math.min(100, Math.max(40, vocabScore));

  return {
    levelId: config.id,
    levelName: config.name,
    isWin,
    stars,
    score,
    timeSpentSec: spent,
    accuracy: acc,
    avgReflexMs: avgRx,
    visionScore,
    mathScore,
    vocabScore,
    reflexScore,
    reviewedWords: Array.from(wordsSeen.values())
  };
}
