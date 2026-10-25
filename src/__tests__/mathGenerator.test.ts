import { describe, it, expect } from 'vitest';
import { generateMathProblem, MATH_LEVELS_META } from '../services/mathGenerator';

describe('3-Tier FocusGame Math Engine', () => {
  it('defines 3 clear difficulty levels', () => {
    expect(MATH_LEVELS_META).toHaveLength(3);
    expect(MATH_LEVELS_META[0].badge).toBe('Dễ');
    expect(MATH_LEVELS_META[1].badge).toBe('Vừa');
    expect(MATH_LEVELS_META[2].badge).toBe('Khó');
  });

  it('generates valid problems for all 3 difficulty tiers', () => {
    for (let level = 1; level <= 3; level++) {
      for (let i = 0; i < 30; i++) {
        const p = generateMathProblem(level);
        expect(p.expression).toBeDefined();
        expect(p.expression.length).toBeGreaterThanOrEqual(3);
        expect(Number.isInteger(p.result)).toBe(true);
        expect(p.result).toBeGreaterThan(0);
      }
    }
  });

  it('does NOT generate derivative or integral notations', () => {
    for (let level = 1; level <= 3; level++) {
      for (let i = 0; i < 50; i++) {
        const p = generateMathProblem(level);
        // Must never contain calculus symbols
        expect(p.expression).not.toContain('∫');
        expect(p.expression).not.toContain("dx");
        expect(p.expression).not.toContain("d/dx");
        expect(p.expression).not.toContain("' |");
      }
    }
  });

  it('generates clear addition and subtraction in Level 1 (Easy)', () => {
    for (let i = 0; i < 30; i++) {
      const p = generateMathProblem(1);
      expect(p.result).toBeGreaterThan(0);
      expect(p.result).toBeLessThanOrEqual(60);
    }
  });

  it('generates multiplication and parenthesis in Level 2 (Medium)', () => {
    let hasMultiplication = false;
    for (let i = 0; i < 30; i++) {
      const p = generateMathProblem(2);
      if (p.expression.includes('×') || p.expression.includes('÷')) {
        hasMultiplication = true;
      }
      expect(p.result).toBeGreaterThan(0);
    }
    expect(hasMultiplication).toBe(true);
  });

  it('generates missing variable or multi-step logic in Level 3 (Hard)', () => {
    let hasAlgebraOrStep = false;
    for (let i = 0; i < 30; i++) {
      const p = generateMathProblem(3);
      if (p.expression.includes('?') || p.expression.includes('x') || p.expression.includes('%') || p.expression.includes('(')) {
        hasAlgebraOrStep = true;
      }
      expect(p.result).toBeGreaterThan(0);
    }
    expect(hasAlgebraOrStep).toBe(true);
  });

  it('generates chained math problems correctly using previous answer', () => {
    const prev = 18;
    for (let i = 0; i < 20; i++) {
      const p = generateMathProblem(2, prev);
      expect(p.expression).toContain(String(prev));
      expect(p.result).toBeGreaterThan(0);
    }
  });
});
