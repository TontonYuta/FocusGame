export interface MathProblem {
  expression: string;
  result: number;
}

export interface MathDifficultyMeta {
  level: number;
  name: string;
  category: string;
  description: string;
  badge: string;
}

export const MATH_LEVELS_META: MathDifficultyMeta[] = [
  { level: 1, name: 'Cộng Trừ Cơ Bản', category: 'Số học', description: 'Phép cộng trừ 2 chữ số nhẩm nhanh', badge: 'Dễ' },
  { level: 2, name: 'Nhân Chia & Ngoặc', category: 'Số học', description: 'Bảng cửu chương và phối hợp dấu ngoặc', badge: 'Vừa' },
  { level: 3, name: 'Đại Số & Tìm Ẩn Số', category: 'Đại số', description: 'Tìm ẩn số x, modulo và tính chuỗi', badge: 'Khó' }
];

/**
 * Generates fast, clear, mental-math arithmetic problems calibrated for FocusGame.
 * Strictly outputs positive integers that render clearly on mobile screens.
 */
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

  // Constrain level between 1 and 3 (1: Dễ, 2: Vừa/Trung bình, 3: Khó)
  const lvl = Math.max(1, Math.min(3, Math.round(levelNum || 1)));

  let expr = '';
  let ans = 0;

  switch (lvl) {
    // -------------------------------------------------------------------------
    // CẤP ĐỘ 1: DỄ - Cộng trừ trực quan, nhanh trong phạm vi 1-50
    // -------------------------------------------------------------------------
    case 1: {
      const type = Math.floor(Math.random() * 4);
      if (type === 0) {
        // Phép cộng 2 số
        const a = Math.floor(Math.random() * 20) + 6; // 6..25
        const b = Math.floor(Math.random() * 18) + 5; // 5..22
        expr = `${a} + ${b}`;
        ans = a + b;
      } else if (type === 1) {
        // Phép trừ 2 số (kết quả luôn dương đẹp)
        const b = Math.floor(Math.random() * 16) + 4; // 4..19
        const diff = Math.floor(Math.random() * 18) + 5; // 5..22
        const a = b + diff;
        expr = `${a} - ${b}`;
        ans = diff;
      } else if (type === 2) {
        // 3 số kết hợp nhỏ
        const a = Math.floor(Math.random() * 10) + 8; // 8..17
        const b = Math.floor(Math.random() * 8) + 4;  // 4..11
        const c = Math.floor(Math.random() * 6) + 2;  // 2..7
        expr = `${a} + ${b} - ${c}`;
        ans = a + b - c;
      } else {
        // Phép nhân cơ bản bảng nhân 2, 3, 5
        const base = [2, 3, 5][Math.floor(Math.random() * 3)];
        const b = Math.floor(Math.random() * 7) + 2; // 2..8 -> max 40
        expr = `${b} × ${base}`;
        ans = b * base;
      }
      break;
    }

    // -------------------------------------------------------------------------
    // CẤP ĐỘ 2: TRUNG BÌNH - Nhân chia cửu chương & phối hợp ngoặc trong 1-80
    // -------------------------------------------------------------------------
    case 2: {
      const type = Math.floor(Math.random() * 4);
      if (type === 0) {
        // Bảng cửu chương 4..9
        const a = Math.floor(Math.random() * 6) + 4; // 4..9
        const b = Math.floor(Math.random() * 7) + 3; // 3..9
        expr = `${a} × ${b}`;
        ans = a * b;
      } else if (type === 1) {
        // (a × b) + c
        const a = Math.floor(Math.random() * 5) + 3; // 3..7
        const b = Math.floor(Math.random() * 6) + 3; // 3..8
        const c = Math.floor(Math.random() * 12) + 3; // 3..14
        expr = `(${a} × ${b}) + ${c}`;
        ans = a * b + c;
      } else if (type === 2) {
        // (a × b) - c
        const a = Math.floor(Math.random() * 5) + 4; // 4..8
        const b = Math.floor(Math.random() * 5) + 4; // 4..8
        const prod = a * b;
        const c = Math.floor(Math.random() * (prod - 8)) + 3;
        expr = `(${a} × ${b}) - ${c}`;
        ans = prod - c;
      } else {
        // Phép chia hết + offset
        const divisor = Math.floor(Math.random() * 6) + 3; // 3..8
        const quotient = Math.floor(Math.random() * 6) + 3; // 3..8
        const dividend = divisor * quotient;
        const offset = Math.floor(Math.random() * 9) + 2; // 2..10
        expr = `(${dividend} ÷ ${divisor}) + ${offset}`;
        ans = quotient + offset;
      }
      break;
    }

    // -------------------------------------------------------------------------
    // CẤP ĐỘ 3: KHÓ - Tìm ẩn số x/?, 2 bước tính toán, chia dư/modulo
    // -------------------------------------------------------------------------
    case 3:
    default: {
      const type = Math.floor(Math.random() * 4);
      if (type === 0) {
        // Tìm ẩn số dạng: ? + b = c  (ẩn số là ans)
        const b = Math.floor(Math.random() * 20) + 12; // 12..31
        ans = Math.floor(Math.random() * 22) + 10;     // 10..31
        const c = ans + b;
        expr = `? + ${b} = ${c}`;
      } else if (type === 1) {
        // Tìm ẩn số dạng: x - b = c  (ẩn số x là ans)
        const b = Math.floor(Math.random() * 18) + 8; // 8..25
        const c = Math.floor(Math.random() * 25) + 10; // 10..34
        ans = b + c;
        expr = `x - ${b} = ${c}`;
      } else if (type === 2) {
        // Biểu thức hỗn hợp: (a × b) - (c × d)
        const a = Math.floor(Math.random() * 6) + 5; // 5..10
        const b = Math.floor(Math.random() * 6) + 5; // 5..10
        const c = Math.floor(Math.random() * 4) + 2; // 2..5
        const d = Math.floor(Math.random() * 4) + 2; // 2..5
        expr = `(${a} × ${b}) - (${c} × ${d})`;
        ans = (a * b) - (c * d);
      } else {
        // Phép chia lấy dư modulo + offset: (num % div) + c
        const div = Math.floor(Math.random() * 4) + 5; // 5..8
        const rem = Math.floor(Math.random() * (div - 2)) + 2; // 2..div-1
        const mul = Math.floor(Math.random() * 5) + 3;
        const num = mul * div + rem;
        const offset = Math.floor(Math.random() * 15) + 10;
        expr = `(${num} % ${div}) + ${offset}`;
        ans = rem + offset;
      }
      break;
    }
  }

  // Fallback an toàn nếu tính toán ra số âm hoặc không hợp lệ
  if (ans <= 0 || isNaN(ans)) {
    expr = '18 + 14';
    ans = 32;
  }

  return { expression: expr, result: ans };
}
