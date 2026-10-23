import { GameConfig, GameMode, Difficulty } from './types';
import { CEFRLevel } from '../data/vocabulary';

export function getGameConfig(mode: GameMode, difficulty: Difficulty): GameConfig {
  const modeLabels: Record<GameMode, string> = {
    math: 'Toán',
    vocab: 'Tiếng Anh',
    combined: 'Kết Hợp',
    schulte: 'Schulte'
  };

  const diffLabels: Record<Difficulty, string> = {
    easy: 'Dễ',
    medium: 'Trung Bình',
    hard: 'Khó'
  };

  const name = `${modeLabels[mode]} - ${diffLabels[difficulty]}`;

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
    allowBomb: true,
    hasReversal: true,
    hasSinusoidalSpeed: true,
    isChainedMath: true
  };
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
