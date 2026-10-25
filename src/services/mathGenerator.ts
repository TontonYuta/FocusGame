export interface MathProblem {
  expression: string;
  result: number;
}

export function generateMathProblem(levelNum: number, previousAnswer?: number): MathProblem {
  // If chained math is requested with an existing answer
  if (previousAnswer && previousAnswer > 0) {
    const op = Math.random() > 0.4 ? '+' : '-';
    if (op === '+') {
      const delta = Math.floor(Math.random() * 12) + 3;
      return { expression: `${previousAnswer} + ${delta}`, result: previousAnswer + delta };
    } else {
      const delta = Math.min(Math.max(1, previousAnswer - 2), Math.floor(Math.random() * 10) + 2);
      const res = previousAnswer - delta;
      if (res > 0) {
        return { expression: `${previousAnswer} - ${delta}`, result: res };
      }
      return { expression: `${previousAnswer} + 5`, result: previousAnswer + 5 };
    }
  }

  let expr = '';
  let ans = 0;

  switch (levelNum) {
    case 1: {
      // Simple addition / subtraction under 20
      const type = Math.floor(Math.random() * 3);
      if (type === 0) {
        const a = Math.floor(Math.random() * 9) + 3;
        const b = Math.floor(Math.random() * 8) + 2;
        expr = `${a} + ${b}`;
        ans = a + b;
      } else if (type === 1) {
        const a = Math.floor(Math.random() * 10) + 10; // 10..19
        const b = Math.floor(Math.random() * 8) + 2;
        expr = `${a} - ${b}`;
        ans = a - b;
      } else {
        const a = Math.floor(Math.random() * 6) + 4;
        const b = Math.floor(Math.random() * 6) + 3;
        const c = Math.floor(Math.random() * 4) + 1;
        expr = `${a} + ${b} - ${c}`;
        ans = a + b - c;
      }
      break;
    }

    case 2: {
      // Add, sub, multiplication
      const type = Math.floor(Math.random() * 3);
      if (type === 0) {
        const a = Math.floor(Math.random() * 7) + 3;
        const b = Math.floor(Math.random() * 6) + 2;
        expr = `${a} × ${b}`;
        ans = a * b;
      } else if (type === 1) {
        const a = Math.floor(Math.random() * 6) + 3;
        const b = Math.floor(Math.random() * 5) + 2;
        const c = Math.floor(Math.random() * 9) + 2;
        expr = `(${a} × ${b}) + ${c}`;
        ans = a * b + c;
      } else {
        const a = Math.floor(Math.random() * 20) + 15;
        const b = Math.floor(Math.random() * 15) + 10;
        expr = `${a} + ${b}`;
        ans = a + b;
      }
      break;
    }

    case 3: {
      // Two-step operations (e.g., (6 * 4) - 5)
      const a = Math.floor(Math.random() * 6) + 3; // 3..8
      const b = Math.floor(Math.random() * 5) + 3; // 3..7 (min prod = 9)
      const prod = a * b;
      const isSub = Math.random() > 0.4;
      if (isSub) {
        const maxC = Math.max(2, Math.min(10, prod - 3));
        const c = Math.floor(Math.random() * (maxC - 1)) + 2;
        expr = `(${a} × ${b}) - ${c}`;
        ans = prod - c;
      } else {
        const c = Math.floor(Math.random() * 9) + 3;
        expr = `(${a} × ${b}) + ${c}`;
        ans = prod + c;
      }
      break;
    }

    case 4: {
      // Division, modulo, missing operands
      const type = Math.floor(Math.random() * 3);
      if (type === 0) {
        // Division + offset
        const divisor = Math.floor(Math.random() * 6) + 3; // 3..8
        const quotient = Math.floor(Math.random() * 6) + 3; // 3..8
        const dividend = divisor * quotient;
        const offset = Math.floor(Math.random() * 8) + 2;
        expr = `(${dividend} ÷ ${divisor}) + ${offset}`;
        ans = quotient + offset;
      } else if (type === 1) {
        // Modulo + offset
        const div = Math.floor(Math.random() * 4) + 4; // 4..7
        const mod = Math.floor(Math.random() * (div - 1)) + 1;
        const mul = Math.floor(Math.random() * 5) + 3;
        const num = mul * div + mod;
        const offset = Math.floor(Math.random() * 10) + 5;
        expr = `(${num} % ${div}) + ${offset}`;
        ans = mod + offset;
      } else {
        // Missing operand: [ ? + B = Target ]
        const b = Math.floor(Math.random() * 12) + 5;
        ans = Math.floor(Math.random() * 15) + 10;
        const target = ans + b;
        expr = `? + ${b} = ${target}`;
      }
      break;
    }

    case 5:
    case 6: {
      // Arithmetic up to 100 / Tech challenge
      const type = Math.floor(Math.random() * 3);
      if (type === 0) {
        const a = Math.floor(Math.random() * 40) + 25;
        const b = Math.floor(Math.random() * 40) + 20;
        expr = `${a} + ${b}`;
        ans = a + b;
      } else if (type === 1) {
        const a = Math.floor(Math.random() * 45) + 50;
        const b = Math.floor(Math.random() * 35) + 12;
        expr = `${a} - ${b}`;
        ans = a - b;
      } else {
        const a = Math.floor(Math.random() * 8) + 4;
        const b = Math.floor(Math.random() * 8) + 4;
        const c = Math.floor(Math.random() * 15) + 5;
        expr = `(${a} × ${b}) + ${c}`;
        ans = a * b + c;
      }
      break;
    }

    case 7: {
      // Boss: Chained calculation with previous answer or rapid arithmetic
      if (previousAnswer && previousAnswer > 0) {
        const op = Math.random() > 0.5 ? '+' : '-';
        if (op === '+') {
          const delta = Math.floor(Math.random() * 12) + 3;
          expr = `${previousAnswer} + ${delta}`;
          ans = previousAnswer + delta;
        } else {
          const delta = Math.min(previousAnswer - 2, Math.floor(Math.random() * 10) + 2);
          expr = `${previousAnswer} - ${delta}`;
          ans = previousAnswer - delta;
        }
      } else {
        // First chained problem
        const a = Math.floor(Math.random() * 8) + 6;
        const b = Math.floor(Math.random() * 5) + 3;
        expr = `${a} × ${b}`;
        ans = a * b;
      }
      break;
    }

    default: {
      // Sandbox fallback
      const a = Math.floor(Math.random() * 15) + 5;
      const b = Math.floor(Math.random() * 15) + 5;
      expr = `${a} + ${b}`;
      ans = a + b;
      break;
    }
  }

  // Ensure answer is positive and realistic
  if (ans <= 0) {
    expr = '12 + 7';
    ans = 19;
  }

  return { expression: expr, result: ans };
}
