import { describe, it, expect } from 'vitest';
import { buildMatchStats } from '../game/matchStats';
import { GameConfig } from '../game/types';

describe('matchStats calculation', () => {
  const normalConfig: GameConfig = {
    id: 1,
    mode: 'math',
    difficulty: 'easy',
    name: 'Toán - Dễ',
    subtitle: '',
    rings: 1,
    nodeCount: 10,
    targetCount: 10,
    timeLimitSec: 60,
    baseSpeed: 0.0032,
    cefrLevel: 'A1',
    allowBomb: false,
    hasReversal: false
  };

  const survivalConfig: GameConfig = {
    id: 99,
    mode: 'survival',
    difficulty: 'medium',
    name: 'Sinh Tồn - Trung Bình',
    subtitle: '',
    rings: 2,
    nodeCount: 16,
    targetCount: 999,
    timeLimitSec: 25,
    baseSpeed: 0.0045,
    cefrLevel: 'A2',
    allowBomb: true,
    hasReversal: true
  };

  it('calculates 3 stars for win with high accuracy and good time', () => {
    const stats = buildMatchStats(
      normalConfig,
      true,
      30, // 30s left out of 60s
      5000,
      { total: 10, correct: 10 },
      [500, 600, 700],
      new Map()
    );

    expect(stats.isWin).toBe(true);
    expect(stats.accuracy).toBe(100);
    expect(stats.stars).toBe(3);
    expect(stats.visionScore).toBeGreaterThanOrEqual(0);
    expect(stats.visionScore).toBeLessThanOrEqual(100);
  });

  it('calculates survival mode stars based on targets reached', () => {
    // 25 correct hits in survival mode -> 3 stars
    const stats3 = buildMatchStats(
      survivalConfig,
      true,
      15,
      12000,
      { total: 26, correct: 25 },
      [400, 500],
      new Map()
    );
    expect(stats3.stars).toBe(3);

    // 12 correct hits -> 2 stars
    const stats2 = buildMatchStats(
      survivalConfig,
      true,
      8,
      5000,
      { total: 14, correct: 12 },
      [600, 700],
      new Map()
    );
    expect(stats2.stars).toBe(2);

    // 6 correct hits -> 1 star
    const stats1 = buildMatchStats(
      survivalConfig,
      true,
      2,
      2000,
      { total: 8, correct: 6 },
      [900, 1000],
      new Map()
    );
    expect(stats1.stars).toBe(1);
  });
});
