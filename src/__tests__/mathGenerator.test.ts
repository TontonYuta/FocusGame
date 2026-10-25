import { describe, it, expect } from 'vitest';
import { generateMathProblem } from '../services/mathGenerator';

describe('mathGenerator service', () => {
  it('generates valid level 1 math problems', () => {
    for (let i = 0; i < 20; i++) {
      const p = generateMathProblem(1);
      expect(p.expression).toBeDefined();
      expect(typeof p.result).toBe('number');
      expect(p.result).toBeGreaterThan(0);
    }
  });

  it('generates valid level 2 multiplication problems', () => {
    for (let i = 0; i < 20; i++) {
      const p = generateMathProblem(2);
      expect(p.expression).toBeDefined();
      expect(p.result).toBeGreaterThan(0);
    }
  });

  it('generates valid level 3 multi-step problems', () => {
    for (let i = 0; i < 20; i++) {
      const p = generateMathProblem(3);
      expect(p.expression).toContain('×');
      expect(p.result).toBeGreaterThan(0);
    }
  });

  it('generates valid chained math problems using previous answer', () => {
    const prev = 12;
    for (let i = 0; i < 10; i++) {
      const p = generateMathProblem(3, prev);
      expect(p.expression).toContain(String(prev));
      expect(p.result).toBeGreaterThan(0);
    }
  });
});
