import { describe, it, expect } from 'vitest';
import { generateMathProblem, MATH_LEVELS_META } from '../services/mathGenerator';

describe('10-Tier Math Engine Generator', () => {
  it('defines exactly 10 levels with rich metadata', () => {
    expect(MATH_LEVELS_META).toHaveLength(10);
    expect(MATH_LEVELS_META[7].name).toContain('Đạo Hàm');
    expect(MATH_LEVELS_META[8].name).toContain('Tích Phân');
    expect(MATH_LEVELS_META[9].name).toContain('Giải Tích');
  });

  it('generates valid problems for all 10 levels', () => {
    for (let level = 1; level <= 10; level++) {
      for (let i = 0; i < 15; i++) {
        const p = generateMathProblem(level);
        expect(p.expression).toBeDefined();
        expect(p.expression.length).toBeGreaterThan(2);
        expect(Number.isInteger(p.result)).toBe(true);
        expect(p.result).toBeGreaterThan(0);
      }
    }
  });

  it('generates valid Level 8 Derivative problems with prime notation', () => {
    for (let i = 0; i < 20; i++) {
      const p = generateMathProblem(8);
      expect(p.expression).toContain("'");
      expect(p.expression).toContain('x=');
      expect(p.result).toBeGreaterThan(0);
    }
  });

  it('generates valid Level 9 Definite Integral problems with integral symbol', () => {
    for (let i = 0; i < 20; i++) {
      const p = generateMathProblem(9);
      expect(p.expression).toContain('∫');
      expect(p.expression).toContain('dx');
      expect(p.result).toBeGreaterThan(0);
    }
  });

  it('generates valid Level 10 Master Calculus problems', () => {
    for (let i = 0; i < 20; i++) {
      const p = generateMathProblem(10);
      const isCalculus = p.expression.includes('∫') || p.expression.includes("'");
      expect(isCalculus).toBe(true);
      expect(p.result).toBeGreaterThan(0);
    }
  });

  it('generates chained math problems correctly using previous answer', () => {
    const prev = 15;
    for (let i = 0; i < 10; i++) {
      const p = generateMathProblem(4, prev);
      expect(p.expression).toContain(String(prev));
      expect(p.result).toBeGreaterThan(0);
    }
  });
});
