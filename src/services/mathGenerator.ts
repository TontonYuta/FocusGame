export interface MathProblem {
  expression: string;
  result: number;
}

export interface MathLevelMeta {
  level: number;
  name: string;
  category: string;
  description: string;
  badge: string;
}

export const MATH_LEVELS_META: MathLevelMeta[] = [
  { level: 1, name: 'Cộng Trừ Cơ Bản', category: 'Số học', description: 'Phép cộng trừ 2 chữ số có nhớ', badge: 'L1' },
  { level: 2, name: 'Nhân Chia & Ngoặc', category: 'Số học', description: 'Ưu tiên phép tính nhân chia phối hợp', badge: 'L2' },
  { level: 3, name: 'Tìm Ẩn Số x', category: 'Đại số', description: 'Phương trình bậc nhất tìm nghiệm nguyên x', badge: 'L3' },
  { level: 4, name: 'Lũy Thừa & Căn Số', category: 'Đại số', description: 'Căn bậc hai chính phương và số mũ', badge: 'L4' },
  { level: 5, name: 'Giai Thừa & Modulo', category: 'Số học', description: 'Giai thừa n! và phép chia lấy dư mod', badge: 'L5' },
  { level: 6, name: 'Logarit Tự Nhiên', category: 'Đại số', description: 'Logarit cơ số 2, 3, 5, 10 nguyên đẹp', badge: 'L6' },
  { level: 7, name: 'Lượng Giác Góc Vàng', category: 'Lượng giác', description: 'Hàm sin, cos, tan tại các góc đặc biệt', badge: 'L7' },
  { level: 8, name: 'Đạo Hàm Tại Điểm', category: 'Giải tích', description: 'Tính đạo hàm f\'(x₀) của đa thức', badge: 'L8' },
  { level: 9, name: 'Tích Phân Xác Định', category: 'Giải tích', description: 'Tích phân xác định cận nguyên [a, b]', badge: 'L9' },
  { level: 10, name: 'Giải Tích Tối Thượng', category: 'Giải tích', description: 'Đạo hàm hàm hợp, tích phân & đạo hàm cấp 2', badge: 'L10' }
];

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

  // Constrain level between 1 and 10
  const lvl = Math.max(1, Math.min(10, Math.round(levelNum || 1)));

  let expr = '';
  let ans = 0;

  switch (lvl) {
    // -------------------------------------------------------------------------
    // LEVEL 1: Cộng trừ 2 số có nhớ & 3 số
    // -------------------------------------------------------------------------
    case 1: {
      const type = Math.floor(Math.random() * 3);
      if (type === 0) {
        const a = Math.floor(Math.random() * 25) + 14; // 14..38
        const b = Math.floor(Math.random() * 20) + 12; // 12..31
        expr = `${a} + ${b}`;
        ans = a + b;
      } else if (type === 1) {
        const a = Math.floor(Math.random() * 35) + 35; // 35..69
        const b = Math.floor(Math.random() * 20) + 11; // 11..30
        expr = `${a} - ${b}`;
        ans = a - b;
      } else {
        const a = Math.floor(Math.random() * 15) + 15;
        const b = Math.floor(Math.random() * 12) + 10;
        const c = Math.floor(Math.random() * 10) + 5;
        expr = `${a} + ${b} - ${c}`;
        ans = a + b - c;
      }
      break;
    }

    // -------------------------------------------------------------------------
    // LEVEL 2: Nhân chia & thứ tự ưu tiên
    // -------------------------------------------------------------------------
    case 2: {
      const type = Math.floor(Math.random() * 3);
      if (type === 0) {
        const a = Math.floor(Math.random() * 6) + 4; // 4..9
        const b = Math.floor(Math.random() * 6) + 4; // 4..9
        const c = Math.floor(Math.random() * 15) + 6;
        expr = `(${a} × ${b}) - ${c}`;
        ans = a * b - c;
      } else if (type === 1) {
        const a = Math.floor(Math.random() * 6) + 3;
        const b = Math.floor(Math.random() * 6) + 3;
        const c = Math.floor(Math.random() * 18) + 8;
        expr = `(${a} × ${b}) + ${c}`;
        ans = a * b + c;
      } else {
        const divisor = Math.floor(Math.random() * 5) + 4; // 4..8
        const quotient = Math.floor(Math.random() * 6) + 3; // 3..8
        const dividend = divisor * quotient;
        const offset = Math.floor(Math.random() * 12) + 5;
        expr = `(${dividend} ÷ ${divisor}) + ${offset}`;
        ans = quotient + offset;
      }
      break;
    }

    // -------------------------------------------------------------------------
    // LEVEL 3: Đại số tìm ẩn số x
    // -------------------------------------------------------------------------
    case 3: {
      const type = Math.floor(Math.random() * 3);
      if (type === 0) {
        // a*x + b = c -> find x
        const x = Math.floor(Math.random() * 8) + 3; // 3..10
        const a = Math.floor(Math.random() * 4) + 2; // 2..5
        const b = Math.floor(Math.random() * 12) + 5;
        const c = a * x + b;
        expr = `${a}x + ${b} = ${c}  →  x`;
        ans = x;
      } else if (type === 1) {
        // a*x - b = c -> find x
        const x = Math.floor(Math.random() * 7) + 4; // 4..10
        const a = Math.floor(Math.random() * 4) + 2;
        const b = Math.floor(Math.random() * 12) + 3;
        const c = a * x - b;
        expr = `${a}x - ${b} = ${c}  →  x`;
        ans = x;
      } else {
        // a*(x + b) = c -> find x
        const x = Math.floor(Math.random() * 7) + 3;
        const a = Math.floor(Math.random() * 3) + 2; // 2..4
        const b = Math.floor(Math.random() * 5) + 2;
        const c = a * (x + b);
        expr = `${a}(x + ${b}) = ${c}  →  x`;
        ans = x;
      }
      break;
    }

    // -------------------------------------------------------------------------
    // LEVEL 4: Căn bậc hai chính phương & Lũy thừa
    // -------------------------------------------------------------------------
    case 4: {
      const type = Math.floor(Math.random() * 3);
      const squares = [
        { sq: 64, r: 8 }, { sq: 81, r: 9 }, { sq: 100, r: 10 },
        { sq: 121, r: 11 }, { sq: 144, r: 12 }, { sq: 169, r: 13 },
        { sq: 196, r: 14 }, { sq: 225, r: 15 }, { sq: 256, r: 16 }
      ];
      const item = squares[Math.floor(Math.random() * squares.length)];

      if (type === 0) {
        // √N + a²
        const a = Math.floor(Math.random() * 4) + 3; // 3..6
        expr = `√${item.sq} + ${a}²`;
        ans = item.r + a * a;
      } else if (type === 1) {
        // 2^p - √N
        const p = Math.floor(Math.random() * 2) + 5; // 5..6 (32 or 64)
        const powVal = Math.pow(2, p);
        const validItem = squares.filter(s => powVal - s.r > 0)[0] || item;
        expr = `2${p === 5 ? '⁵' : '⁶'} - √${validItem.sq}`;
        ans = powVal - validItem.r;
      } else {
        // 3³ - √N or a³ - √N
        expr = `3³ - √${item.sq}`;
        ans = 27 - item.r;
        if (ans <= 0) {
          expr = `√${item.sq} × 2 + 5`;
          ans = item.r * 2 + 5;
        }
      }
      break;
    }

    // -------------------------------------------------------------------------
    // LEVEL 5: Giai thừa & Phép chia lấy dư Modulo
    // -------------------------------------------------------------------------
    case 5: {
      const type = Math.floor(Math.random() * 3);
      if (type === 0) {
        // 4! + delta = 24 + delta
        const delta = Math.floor(Math.random() * 15) + 6;
        expr = `4! + ${delta}`;
        ans = 24 + delta;
      } else if (type === 1) {
        // 5! ÷ k + delta = 120 ÷ k + delta
        const divisors = [4, 5, 6, 8, 10];
        const k = divisors[Math.floor(Math.random() * divisors.length)];
        const delta = Math.floor(Math.random() * 10) + 3;
        expr = `(5! ÷ ${k}) + ${delta}`;
        ans = (120 / k) + delta;
      } else {
        // N mod m + delta
        const mod = Math.floor(Math.random() * 5) + 6; // 6..10
        const rem = Math.floor(Math.random() * (mod - 2)) + 2; // 2..(mod-1)
        const mul = Math.floor(Math.random() * 6) + 5;
        const n = mul * mod + rem;
        const delta = Math.floor(Math.random() * 12) + 8;
        expr = `(${n} mod ${mod}) + ${delta}`;
        ans = rem + delta;
      }
      break;
    }

    // -------------------------------------------------------------------------
    // LEVEL 6: Logarit (Log2, Log3, Log5, Log10)
    // -------------------------------------------------------------------------
    case 6: {
      const type = Math.floor(Math.random() * 3);
      if (type === 0) {
        // log2(N) + log3(M)
        const log2Pairs = [{ n: 16, v: 4 }, { n: 32, v: 5 }, { n: 64, v: 6 }, { n: 128, v: 7 }];
        const log3Pairs = [{ n: 9, v: 2 }, { n: 27, v: 3 }, { n: 81, v: 4 }];
        const p1 = log2Pairs[Math.floor(Math.random() * log2Pairs.length)];
        const p2 = log3Pairs[Math.floor(Math.random() * log3Pairs.length)];
        expr = `log₂(${p1.n}) + log₃(${p2.n})`;
        ans = p1.v + p2.v;
      } else if (type === 1) {
        // 2*log3(27) + log5(125)
        const mult = Math.floor(Math.random() * 3) + 2;
        const log2v = Math.floor(Math.random() * 3) + 4; // 16, 32, 64 -> 4, 5, 6
        const n = Math.pow(2, log2v);
        expr = `${mult}·log₃(27) + log₂(${n})`;
        ans = mult * 3 + log2v;
      } else {
        // log5(125)*k - log10(100)
        const k = Math.floor(Math.random() * 4) + 3; // 3..6
        expr = `log₅(125) × ${k} - log₁₀(100)`;
        ans = 3 * k - 2;
      }
      break;
    }

    // -------------------------------------------------------------------------
    // LEVEL 7: Lượng giác góc đặc biệt (30°, 45°, 60°, 90°)
    // -------------------------------------------------------------------------
    case 7: {
      const type = Math.floor(Math.random() * 4);
      if (type === 0) {
        // 2k * sin(30°) + 2m * cos(60°) = k + m
        const k = Math.floor(Math.random() * 4) + 2; // 2..5 -> 2k = 4..10
        const m = Math.floor(Math.random() * 4) + 2;
        expr = `${k * 2}·sin(30°) + ${m * 2}·cos(60°)`;
        ans = k + m;
      } else if (type === 1) {
        // 2k * sin²(45°) + m * tan(45°) = k + m
        const k = Math.floor(Math.random() * 5) + 3; // 3..7 -> 2k = 6..14
        const m = Math.floor(Math.random() * 6) + 3;
        expr = `${k * 2}·sin²(45°) + ${m}·tan(45°)`;
        ans = k + m;
      } else if (type === 2) {
        // a*cos(0°) + b*sin(90°) = a + b
        const a = Math.floor(Math.random() * 8) + 4;
        const b = Math.floor(Math.random() * 8) + 4;
        expr = `${a}·cos(0°) + ${b}·sin(90°)`;
        ans = a + b;
      } else {
        // 4k * cos²(30°) - offset = 3k - offset
        const k = Math.floor(Math.random() * 3) + 3; // 3..5 -> 4k = 12..20
        const offset = Math.floor(Math.random() * 4) + 2;
        expr = `${k * 4}·cos²(30°) - ${offset}`;
        ans = 3 * k - offset;
      }
      break;
    }

    // -------------------------------------------------------------------------
    // LEVEL 8: ĐẠO HÀM TẠI ĐIỂM (Calculus I: Derivatives at x₀)
    // -------------------------------------------------------------------------
    case 8: {
      const type = Math.floor(Math.random() * 4);
      if (type === 0) {
        // (a*x² + b*x)' | x=x₀  ->  2a*x₀ + b
        const a = Math.floor(Math.random() * 3) + 2; // 2..4
        const b = Math.floor(Math.random() * 6) + 2; // 2..7
        const x0 = Math.floor(Math.random() * 3) + 2; // 2..4
        expr = `(${a}x² + ${b}x)' | x=${x0}`;
        ans = 2 * a * x0 + b;
      } else if (type === 1) {
        // (x³ - b*x)' | x=x₀  ->  3*x₀² - b
        const x0 = Math.floor(Math.random() * 2) + 2; // 2 or 3
        const prod = 3 * x0 * x0; // 12 or 27
        const b = Math.floor(Math.random() * (prod - 6)) + 3;
        expr = `(x³ - ${b}x)' | x=${x0}`;
        ans = prod - b;
      } else if (type === 2) {
        // (x⁴ - a*x²)' | x=2  ->  4(8) - 2a(2) = 32 - 4a
        const a = Math.floor(Math.random() * 4) + 2; // 2..5 -> 32 - 4a in [12..24]
        expr = `(x⁴ - ${a}x²)' | x=2`;
        ans = 32 - 4 * a;
      } else {
        // (a·sin x + b·x)' | x=0  ->  a*cos(0) + b = a + b
        const a = Math.floor(Math.random() * 6) + 3;
        const b = Math.floor(Math.random() * 8) + 4;
        expr = `(${a}·sin x + ${b}x)' | x=0`;
        ans = a + b;
      }
      break;
    }

    // -------------------------------------------------------------------------
    // LEVEL 9: TÍCH PHÂN XÁC ĐỊNH (Calculus II: Definite Integrals)
    // -------------------------------------------------------------------------
    case 9: {
      const type = Math.floor(Math.random() * 4);
      if (type === 0) {
        // ∫₀ᵇ 2a*x dx = [a*x²]₀ᵇ = a*b²
        const a = Math.floor(Math.random() * 2) + 1; // 1..2
        const b = Math.floor(Math.random() * 3) + 2; // 2..4
        const coeff = 2 * a;
        expr = `∫₀${b === 2 ? '²' : b === 3 ? '³' : '⁴'} ${coeff === 1 ? '' : coeff}x dx`;
        ans = a * b * b;
      } else if (type === 1) {
        // ∫₀² (3x² + c) dx = [x³ + cx]₀² = 8 + 2c
        const c = Math.floor(Math.random() * 6) + 2; // 2..7
        expr = `∫₀² (3x² + ${c}) dx`;
        ans = 8 + 2 * c;
      } else if (type === 2) {
        // ∫₁² (3x² - 2x) dx = [x³ - x²]₁² = (8 - 4) - (1 - 1) = 4
        const k = Math.floor(Math.random() * 2) + 1; // 1 or 2
        if (k === 1) {
          expr = `∫₁² (3x² - 2x) dx`;
          ans = 4;
        } else {
          // ∫₁³ (3x² - 2x) dx = (27 - 9) - 0 = 18
          expr = `∫₁³ (3x² - 2x) dx`;
          ans = 18;
        }
      } else {
        // ∫₀^π a·sin x dx = [-a·cos x]₀^π = a - (-a) = 2a
        const a = Math.floor(Math.random() * 6) + 3; // 3..8 -> ans = 6..16
        expr = `∫₀^π ${a}·sin x dx`;
        ans = 2 * a;
      }
      break;
    }

    // -------------------------------------------------------------------------
    // LEVEL 10: GIẢI TÍCH TỐI THƯỢNG (Master Calculus Challenge)
    // -------------------------------------------------------------------------
    case 10:
    default: {
      const type = Math.floor(Math.random() * 4);
      if (type === 0) {
        // ((ax - b)²)' | x=x₀  ->  2(ax - b)*a
        const b = Math.floor(Math.random() * 3) + 1; // 1..3
        expr = `((2x - ${b})²)' | x=3`;
        ans = 4 * (6 - b);
      } else if (type === 1) {
        // (e^(kx) + c*x)' | x=0  ->  k*e^0 + c = k + c
        const k = Math.floor(Math.random() * 4) + 2; // 2..5
        const c = Math.floor(Math.random() * 8) + 4; // 4..11
        expr = `(e${k === 2 ? '²' : k === 3 ? '³' : k === 4 ? '⁴' : '⁵'}ˣ + ${c}x)' | x=0`;
        ans = k + c;
      } else if (type === 2) {
        // Tích phân đa thức kết hợp
        const variants = [
          { e: '∫₁² (4x³ - 6x² + 5) dx', a: 6 },
          { e: '∫₀² (4x³ - 3x² + 2) dx', a: 12 },
          { e: '∫₁² (4x³ + 3x² - 2) dx', a: 20 },
          { e: '∫₀² (3x² + 4x + 1) dx', a: 18 }
        ];
        const v = variants[Math.floor(Math.random() * variants.length)];
        expr = v.e;
        ans = v.a;
      } else {
        // Đạo hàm cấp hai
        const variants = [
          { e: `(x⁴ - 2x³)'' | x=2`, a: 24 },
          { e: `(x⁴ - 3x³)'' | x=2`, a: 12 },
          { e: `(2x³ - 5x²)'' | x=3`, a: 26 },
          { e: `(x³ + 4x²)'' | x=3`, a: 26 }
        ];
        const v = variants[Math.floor(Math.random() * variants.length)];
        expr = v.e;
        ans = v.a;
      }
      break;
    }
  }

  // Safety fallback: ensure answer is a realistic positive integer
  if (ans <= 0 || isNaN(ans)) {
    expr = '15 + 8';
    ans = 23;
  }

  return { expression: expr, result: ans };
}
