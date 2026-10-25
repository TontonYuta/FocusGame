import { describe, it, expect } from 'vitest';
import { buildMatchStats } from '../game/matchStats';
import { GameConfig } from '../game/types';

describe('matchStats calculation & cognitive radar scoring', () => {
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
    mathLevel: 1,
    allowBomb: false,
    hasReversal: false
  };

  const vocabConfig: GameConfig = {
    id: 2,
    mode: 'vocab',
    difficulty: 'medium',
    name: 'Tiếng Anh - Trung Bình',
    subtitle: '',
    rings: 2,
    nodeCount: 16,
    targetCount: 15,
    timeLimitSec: 65,
    baseSpeed: 0.0042,
    cefrLevel: 'B2',
    allowBomb: false,
    hasReversal: true
  };

  const schulteConfig: GameConfig = {
    id: 99,
    mode: 'schulte',
    difficulty: 'medium',
    name: 'Schulte Classic 1→30',
    subtitle: '',
    rings: 3,
    nodeCount: 30,
    targetCount: 30,
    timeLimitSec: 300,
    baseSpeed: 0.0035,
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
    mathLevel: 2,
    allowBomb: true,
    hasReversal: true
  };

  it('calculates 3 stars for win with high accuracy and good time', () => {
    const stats = buildMatchStats(
      normalConfig,
      true,
      30,
      5000,
      { total: 10, correct: 10 },
      [500, 600, 700],
      new Map()
    );

    expect(stats.isWin).toBe(true);
    expect(stats.accuracy).toBe(100);
    expect(stats.stars).toBe(3);
    expect(stats.visionScore).toBeGreaterThanOrEqual(40);
    expect(stats.visionScore).toBeLessThanOrEqual(100);
    expect(stats.reflexScore).toBeGreaterThanOrEqual(85);
  });

  it('calculates domain-specific math and vocab scores accurately', () => {
    // Pure Math win
    const mathStats = buildMatchStats(
      normalConfig,
      true,
      25,
      6000,
      { total: 10, correct: 10 },
      [750, 800, 700],
      new Map()
    );
    expect(mathStats.mathScore).toBeGreaterThanOrEqual(85);
    expect(mathStats.reflexScore).toBeGreaterThanOrEqual(85);

    // Pure Vocab win with B2
    const vocabStats = buildMatchStats(
      vocabConfig,
      true,
      20,
      8000,
      { total: 15, correct: 15 },
      [800, 850],
      new Map()
    );
    expect(vocabStats.vocabScore).toBeGreaterThanOrEqual(90);
    expect(vocabStats.visionScore).toBeGreaterThanOrEqual(75);
  });

  it('evaluates Schulte mode as a peripheral vision benchmark', () => {
    // 32 seconds to clear Schulte 1→30
    const schulteStats = buildMatchStats(
      schulteConfig,
      true,
      268, // 32s spent
      9000,
      { total: 30, correct: 30 },
      [800, 900],
      new Map()
    );
    expect(schulteStats.visionScore).toBeGreaterThanOrEqual(95);
  });

  it('calculates survival mode stars based on targets reached', () => {
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
