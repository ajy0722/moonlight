export type AngleMode = "deg" | "rad" | "grad";

/** 긴 이름부터 매칭해야 함 (예: "asinh"가 "asin"보다 먼저 매칭돼야 함) */
const FUNC_NAMES = [
  "logbase",
  "asinh",
  "acosh",
  "atanh",
  "nroot",
  "sinh",
  "cosh",
  "tanh",
  "asin",
  "acos",
  "atan",
  "sin",
  "cos",
  "tan",
  "log",
  "rnd",
  "dms",
  "ln",
] as const;

type FuncName = (typeof FUNC_NAMES)[number] | "sqrt" | "cbrt";

type Token =
  | { type: "num"; value: number }
  | { type: "op"; value: "+" | "-" | "*" | "/" | "^" | "%" | "mod" }
  | { type: "lparen" }
  | { type: "rparen" }
  | { type: "comma" }
  | { type: "func"; name: FuncName };

function tokenize(input: string): Token[] {
  const src = input.replace(/\s+/g, "");
  const tokens: Token[] = [];
  let i = 0;

  while (i < src.length) {
    const ch = src[i];

    if (/[0-9.]/.test(ch)) {
      let j = i + 1;
      while (j < src.length && /[0-9.]/.test(src[j])) j++;
      const numStr = src.slice(i, j);
      const value = Number(numStr);
      if (Number.isNaN(value)) throw new Error("잘못된 숫자입니다");
      tokens.push({ type: "num", value });
      i = j;
      continue;
    }

    if (ch === "π") {
      tokens.push({ type: "num", value: Math.PI });
      i++;
      continue;
    }
    if (ch === "e") {
      tokens.push({ type: "num", value: Math.E });
      i++;
      continue;
    }
    if (ch === "(") {
      tokens.push({ type: "lparen" });
      i++;
      continue;
    }
    if (ch === ")") {
      tokens.push({ type: "rparen" });
      i++;
      continue;
    }
    if (ch === ",") {
      tokens.push({ type: "comma" });
      i++;
      continue;
    }
    if (ch === "+" || ch === "-") {
      tokens.push({ type: "op", value: ch });
      i++;
      continue;
    }
    if (ch === "×") {
      tokens.push({ type: "op", value: "*" });
      i++;
      continue;
    }
    if (ch === "÷") {
      tokens.push({ type: "op", value: "/" });
      i++;
      continue;
    }
    if (ch === "^" || ch === "%") {
      tokens.push({ type: "op", value: ch });
      i++;
      continue;
    }
    if (ch === "√") {
      tokens.push({ type: "func", name: "sqrt" });
      i++;
      continue;
    }
    if (ch === "∛") {
      tokens.push({ type: "func", name: "cbrt" });
      i++;
      continue;
    }

    const rest = src.slice(i);
    if (rest.startsWith("mod")) {
      tokens.push({ type: "op", value: "mod" });
      i += 3;
      continue;
    }

    const matchedFunc = FUNC_NAMES.find((name) => rest.startsWith(name));
    if (matchedFunc) {
      tokens.push({ type: "func", name: matchedFunc });
      i += matchedFunc.length;
      continue;
    }

    throw new Error(`알 수 없는 문자: ${ch}`);
  }

  return tokens;
}

function toRadians(value: number, mode: AngleMode): number {
  if (mode === "deg") return (value * Math.PI) / 180;
  if (mode === "grad") return (value * Math.PI) / 200;
  return value;
}

function fromRadians(value: number, mode: AngleMode): number {
  if (mode === "deg") return (value * 180) / Math.PI;
  if (mode === "grad") return (value * 200) / Math.PI;
  return value;
}

class Parser {
  private pos = 0;

  constructor(
    private readonly tokens: Token[],
    private readonly angleMode: AngleMode
  ) {}

  parse(): number {
    const value = this.parseExpression();
    if (this.pos !== this.tokens.length) throw new Error("잘못된 식입니다");
    return value;
  }

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  private parseExpression(): number {
    let value = this.parseTerm();
    for (;;) {
      const t = this.peek();
      if (t?.type === "op" && (t.value === "+" || t.value === "-")) {
        this.pos++;
        const rhs = this.parseTerm();
        value = t.value === "+" ? value + rhs : value - rhs;
      } else {
        return value;
      }
    }
  }

  private parseTerm(): number {
    let value = this.parsePercent();
    for (;;) {
      const t = this.peek();
      if (t?.type === "op" && (t.value === "*" || t.value === "/" || t.value === "mod")) {
        this.pos++;
        const rhs = this.parsePercent();
        if (t.value === "/" && rhs === 0) throw new Error("0으로 나눌 수 없습니다");
        if (t.value === "mod") value = value % rhs;
        else value = t.value === "*" ? value * rhs : value / rhs;
      } else {
        return value;
      }
    }
  }

  private parsePercent(): number {
    let value = this.parsePower();
    while (this.peek()?.type === "op" && (this.peek() as { type: "op"; value: string }).value === "%") {
      this.pos++;
      value = value / 100;
    }
    return value;
  }

  private parsePower(): number {
    const base = this.parseUnary();
    const t = this.peek();
    if (t?.type === "op" && t.value === "^") {
      this.pos++;
      const exponent = this.parsePower();
      return Math.pow(base, exponent);
    }
    return base;
  }

  private parseUnary(): number {
    const t = this.peek();
    if (t?.type === "op" && t.value === "-") {
      this.pos++;
      return -this.parseUnary();
    }
    if (t?.type === "op" && t.value === "+") {
      this.pos++;
      return this.parseUnary();
    }
    return this.parsePrimary();
  }

  private parsePrimary(): number {
    const t = this.peek();
    if (!t) throw new Error("식이 비어 있습니다");

    if (t.type === "num") {
      this.pos++;
      return t.value;
    }

    if (t.type === "lparen") {
      this.pos++;
      const value = this.parseExpression();
      if (this.peek()?.type !== "rparen") throw new Error("괄호가 맞지 않습니다");
      this.pos++;
      return value;
    }

    if (t.type === "func") {
      this.pos++;
      if (this.peek()?.type !== "lparen") throw new Error("함수 뒤에는 괄호가 필요합니다");
      this.pos++;

      const args = [this.parseExpression()];
      while (this.peek()?.type === "comma") {
        this.pos++;
        args.push(this.parseExpression());
      }

      if (this.peek()?.type !== "rparen") throw new Error("괄호가 맞지 않습니다");
      this.pos++;
      return this.applyFunc(t.name, args);
    }

    throw new Error("잘못된 식입니다");
  }

  private applyFunc(name: FuncName, args: number[]): number {
    const arg = args[0];
    const deg = this.angleMode;

    switch (name) {
      case "sin":
        return Math.sin(toRadians(arg, deg));
      case "cos":
        return Math.cos(toRadians(arg, deg));
      case "tan":
        return Math.tan(toRadians(arg, deg));
      case "asin":
        return fromRadians(Math.asin(arg), deg);
      case "acos":
        return fromRadians(Math.acos(arg), deg);
      case "atan":
        return fromRadians(Math.atan(arg), deg);
      case "sinh":
        return Math.sinh(arg);
      case "cosh":
        return Math.cosh(arg);
      case "tanh":
        return Math.tanh(arg);
      case "asinh":
        return Math.asinh(arg);
      case "acosh":
        return Math.acosh(arg);
      case "atanh":
        return Math.atanh(arg);
      case "ln":
        return Math.log(arg);
      case "log":
        return Math.log10(arg);
      case "logbase": {
        if (args.length !== 2) throw new Error("logbase(밑, 진수) 형태로 입력하세요");
        const [base, x] = args;
        if (base <= 0 || base === 1) throw new Error("밑이 올바르지 않습니다");
        return Math.log(x) / Math.log(base);
      }
      case "sqrt":
        if (arg < 0) throw new Error("음수의 제곱근은 계산할 수 없습니다");
        return Math.sqrt(arg);
      case "cbrt":
        return Math.cbrt(arg);
      case "nroot": {
        if (args.length !== 2) throw new Error("nroot(차수, 값) 형태로 입력하세요");
        const [n, x] = args;
        if (n === 0) throw new Error("0제곱근은 계산할 수 없습니다");
        return Math.sign(x) === -1 && n % 2 === 0 ? NaN : Math.sign(x) * Math.pow(Math.abs(x), 1 / n);
      }
      case "rnd":
        return Number(arg.toPrecision(10));
      case "dms": {
        if (args.length !== 3) throw new Error("dms(도, 분, 초) 형태로 입력하세요");
        const [d, m, s] = args;
        const sign = d < 0 ? -1 : 1;
        return sign * (Math.abs(d) + m / 60 + s / 3600);
      }
    }
  }
}

/** 열린 괄호 개수만큼 닫는 괄호를 뒤에 채워준다 (마지막에 괄호를 다 안 닫아도 계산되도록) */
function autoCloseParens(expression: string): string {
  let depth = 0;
  for (const ch of expression) {
    if (ch === "(") depth++;
    else if (ch === ")") depth = Math.max(0, depth - 1);
  }
  return expression + ")".repeat(depth);
}

export function evaluateExpression(expression: string, angleMode: AngleMode): number {
  const tokens = tokenize(autoCloseParens(expression));
  if (tokens.length === 0) throw new Error("식이 비어 있습니다");

  const result = new Parser(tokens, angleMode).parse();
  if (!Number.isFinite(result)) throw new Error("계산할 수 없는 값입니다");
  return result;
}

/** 부동소수점 오차를 정리해서 보여준다 */
export function formatResult(value: number): string {
  const rounded = Number(value.toPrecision(12));
  return rounded.toString();
}

interface FractionParts {
  sign: -1 | 1;
  whole: number;
  numerator: number;
  denominator: number;
}

/** 연분수 전개로 value에 가장 가까운 유리수(분자/분모)를 찾는다 */
function bestRational(x: number, maxDenominator: number): { numerator: number; denominator: number } {
  const tolerance = 1e-9;
  let h1 = 1;
  let h2 = 0;
  let k1 = 0;
  let k2 = 1;
  let b = x;

  for (let iter = 0; iter < 30; iter++) {
    const a = Math.floor(b);
    const auxH = h1;
    h1 = a * h1 + h2;
    h2 = auxH;
    const auxK = k1;
    k1 = a * k1 + k2;
    k2 = auxK;

    if (Math.abs(b - a) < tolerance || k1 > maxDenominator) break;
    b = 1 / (b - a);
  }

  return { numerator: h1, denominator: k1 };
}

function toFractionParts(value: number, maxDenominator = 100_000): FractionParts | null {
  if (!Number.isFinite(value) || Number.isInteger(value)) return null;

  const sign: -1 | 1 = value < 0 ? -1 : 1;
  const x = Math.abs(value);
  const { numerator, denominator } = bestRational(x, maxDenominator);

  if (denominator <= 1 || denominator > maxDenominator) return null;
  if (Math.abs(numerator / denominator - x) > 1e-6 * Math.max(1, x)) return null;

  const whole = Math.floor(numerator / denominator);
  const remainder = numerator - whole * denominator;
  return { sign, whole, numerator: remainder, denominator };
}

/** "1 3/4" 같은 대분수 형태. 분수로 표현하기 어려우면 기존 소수 표기로 돌아간다 */
export function formatMixedFraction(value: number): string {
  const parts = toFractionParts(value);
  if (!parts) return formatResult(value);
  const prefix = parts.sign < 0 ? "-" : "";
  if (parts.whole === 0) return `${prefix}${parts.numerator}/${parts.denominator}`;
  if (parts.numerator === 0) return `${prefix}${parts.whole}`;
  return `${prefix}${parts.whole} ${parts.numerator}/${parts.denominator}`;
}

/** "7/4" 같은 가분수 형태 */
export function formatImproperFraction(value: number): string {
  const parts = toFractionParts(value);
  if (!parts) return formatResult(value);
  const improperNumerator = parts.whole * parts.denominator + parts.numerator;
  return `${parts.sign < 0 ? "-" : ""}${improperNumerator}/${parts.denominator}`;
}
