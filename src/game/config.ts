import { GameConfig, GameMode, Difficulty, CustomGameParams } from './types';
import { MATH_LEVELS_META } from '../services/mathGenerator';

export function getGameConfig(mode: GameMode, difficulty: Difficulty): GameConfig {
  const modeLabels: Record<GameMode, string> = {
    math: 'Toán',
    vocab: 'Tiếng Anh',
    combined: 'Kết Hợp',
    schulte: 'Schulte',
    survival: 'Sinh Tồn'
  };

  const diffLabels: Record<Difficulty, string> = {
    easy: 'Dễ',
    medium: 'Trung Bình',
    hard: 'Khó'
  };

  const name = `${modeLabels[mode]} - ${diffLabels[difficulty]}`;

  if (mode === 'survival') {
    const ringCount = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
    const nodeCounts = { easy: 10, medium: 16, hard: 22 };
    return {
      id: 99,
      mode,
      difficulty,
      name,
      subtitle: 'Bắt đầu 25s · Đúng +2s · Sai -4s · Tốc độ tăng dần',
      rings: ringCount,
      nodeCount: nodeCounts[difficulty],
      targetCount: 999,
      timeLimitSec: 25,
      baseSpeed: difficulty === 'easy' ? 0.0035 : difficulty === 'medium' ? 0.0045 : 0.0055,
      cefrLevel: difficulty === 'easy' ? 'A1' : difficulty === 'medium' ? 'A2' : 'B2',
      mathLevel: difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3,
      allowBomb: difficulty !== 'easy',
      hasReversal: difficulty !== 'easy',
      hasSinusoidalSpeed: difficulty === 'hard',
      isChainedMath: difficulty === 'hard'
    };
  }

  if (difficulty === 'easy') {
    return {
      id: 1,
      mode,
      difficulty,
      name,
      subtitle: '1 Vòng quỹ đạo · 10 Mục tiêu · Tốc độ êm dịu',
      rings: 1,
      nodeCount: 10,
      targetCount: 10,
      timeLimitSec: 60,
      baseSpeed: 0.0032,
      cefrLevel: 'A1',
      mathLevel: 1,
      allowBomb: false,
      hasReversal: false
    };
  }

  if (difficulty === 'medium') {
    return {
      id: 2,
      mode,
      difficulty,
      name,
      subtitle: '2 Vòng ngược chiều · 15 Mục tiêu · Tốc độ tiêu chuẩn',
      rings: 2,
      nodeCount: 16,
      targetCount: 15,
      timeLimitSec: 65,
      baseSpeed: 0.0042,
      cefrLevel: 'A2',
      mathLevel: 2,
      allowBomb: false,
      hasReversal: true
    };
  }

  // Hard
  return {
    id: 3,
    mode,
    difficulty,
    name,
    subtitle: '3 Vòng đa tầng · 20 Mục tiêu · Bom & Đảo chiều liên tục',
    rings: 3,
    nodeCount: 22,
    targetCount: 20,
    timeLimitSec: 75,
    baseSpeed: 0.0055,
    cefrLevel: 'B2',
    mathLevel: 3,
    allowBomb: true,
    hasReversal: true,
    hasSinusoidalSpeed: true,
    isChainedMath: true
  };
}

export function createCustomGameConfig(p: CustomGameParams): GameConfig {
  const speeds: Record<string, number> = {
    slow: 0.0028,
    normal: 0.0042,
    fast: 0.0060,
    wave: 0.0044
  };
  const nodeCounts: Record<number, number> = { 1: 10, 2: 16, 3: 22 };
  const timeLimit = Math.max(50, Math.round(p.targetCount * 4.5));

  const modeLabels: Record<GameMode, string> = {
    math: 'Toán',
    vocab: `Tiếng Anh (${p.cefrLevel.toUpperCase()})`,
    combined: 'Kết Hợp',
    schulte: 'Schulte',
    survival: 'Sinh Tồn'
  };

  return {
    id: 88,
    mode: p.mode,
    difficulty: 'medium',
    name: `Tùy Chỉnh: ${modeLabels[p.mode]}`,
    subtitle: `${p.targetCount} Mục tiêu · ${p.rings} Vòng · ${p.speed}`,
    rings: p.rings,
    nodeCount: nodeCounts[p.rings] || 16,
    targetCount: p.targetCount,
    timeLimitSec: timeLimit,
    baseSpeed: speeds[p.speed] || 0.0042,
    cefrLevel: p.cefrLevel,
    mathLevel: p.mathLevel || 2,
    allowBomb: p.allowBomb,
    hasReversal: p.hasReversal,
    hasSinusoidalSpeed: p.speed === 'wave',
    isChainedMath: p.isChainedMath
  };
}

export function getMathLevelConfig(level: number, diff: Difficulty = 'medium'): GameConfig {
  const safeLevel = Math.max(1, Math.min(3, Math.round(level || 1)));
  const mappedDiff: Difficulty = safeLevel === 1 ? 'easy' : safeLevel === 2 ? 'medium' : 'hard';
  const cfg = getGameConfig('math', diff || mappedDiff);
  cfg.mathLevel = safeLevel;
  const meta = MATH_LEVELS_META[safeLevel - 1] || MATH_LEVELS_META[0];
  cfg.name = `Toán Cấp ${safeLevel}: ${meta.name}`;
  cfg.subtitle = `${meta.description} · ${meta.category}`;
  return cfg;
}

export function getSchulteConfig(): GameConfig {
  return {
    id: 99,
    mode: 'schulte',
    difficulty: 'medium',
    name: 'Schulte Classic 1→30',
    subtitle: 'Tìm số tuần tự 1 đến 30 từ thị giác ngoại vi',
    rings: 3,
    nodeCount: 30,
    targetCount: 30,
    timeLimitSec: 300,
    baseSpeed: 0.0035,
    cefrLevel: 'A1',
    allowBomb: false,
    hasReversal: false
  };
}
