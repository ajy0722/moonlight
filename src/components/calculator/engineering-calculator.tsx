"use client";

import { Calculator as CalculatorIcon, Delete } from "lucide-react";
import { useState } from "react";
import {
  evaluateExpression,
  formatImproperFraction,
  formatMixedFraction,
  formatResult,
  type AngleMode,
} from "@/lib/calculator-engine";
import { cardClass, cardIconClass } from "@/lib/ui";

const OPERATOR_TOKENS = ["+", "-", "×", "÷", "^", "%", "mod", "10^(", "e^("];

type DisplayMode = "decimal" | "mixed" | "improper";

type Action =
  | "clear"
  | "backspace"
  | "equals"
  | "cycleAngle"
  | "toggleSecond"
  | "toggleHyp"
  | "negate"
  | "cycleFraction";

interface CalcButton {
  label: string;
  token?: string;
  action?: Action;
  span?: 2;
  variant?: "op" | "func" | "equals" | "danger";
}

const ANGLE_LABEL: Record<AngleMode, string> = { deg: "DEG", rad: "RAD", grad: "GRAD" };

function trigButton(name: "sin" | "cos" | "tan", isSecond: boolean, isHyp: boolean): CalcButton {
  const base = isHyp ? `${name}h` : name;
  const token = isSecond ? `a${base}(` : `${base}(`;
  const label = isSecond ? `${base}⁻¹` : base;
  return { label, token, variant: "func" };
}

function buildRows(angleMode: AngleMode, isSecond: boolean, isHyp: boolean): CalcButton[][] {
  return [
    [
      { label: ANGLE_LABEL[angleMode], action: "cycleAngle", variant: "func" },
      { label: "2nd", action: "toggleSecond", variant: isSecond ? "equals" : "func" },
      { label: "Hyp", action: "toggleHyp", variant: isHyp ? "equals" : "func" },
      { label: "AC", action: "clear", variant: "danger" },
      { label: "⌫", action: "backspace", variant: "danger" },
      { label: "Mod", token: "mod", variant: "op" },
    ],
    [
      trigButton("sin", isSecond, isHyp),
      trigButton("cos", isSecond, isHyp),
      trigButton("tan", isSecond, isHyp),
      { label: "(", token: "(" },
      { label: ")", token: ")" },
      { label: ",", token: "," },
    ],
    [
      { label: "ln", token: "ln(", variant: "func" },
      { label: "log", token: "log(", variant: "func" },
      { label: "logₐ", token: "logbase(", variant: "func" },
      { label: "√", token: "√(", variant: "func" },
      { label: "∛", token: "∛(", variant: "func" },
      { label: "ˣ√", token: "nroot(", variant: "func" },
    ],
    [
      { label: "xʸ", token: "^", variant: "op" },
      { label: "x²", token: "^2", variant: "op" },
      { label: "x³", token: "^3", variant: "op" },
      { label: "10ˣ", token: "10^(", variant: "func" },
      { label: "eˣ", token: "e^(", variant: "func" },
      { label: "Rnd", token: "rnd(", variant: "func" },
    ],
    [
      { label: "7", token: "7" },
      { label: "8", token: "8" },
      { label: "9", token: "9" },
      { label: "÷", token: "÷", variant: "op" },
      { label: "π", token: "π" },
      { label: "e", token: "e" },
    ],
    [
      { label: "4", token: "4" },
      { label: "5", token: "5" },
      { label: "6", token: "6" },
      { label: "×", token: "×", variant: "op" },
      { label: "%", token: "%", variant: "op" },
      { label: "+/-", action: "negate", variant: "func" },
    ],
    [
      { label: "1", token: "1" },
      { label: "2", token: "2" },
      { label: "3", token: "3" },
      { label: "−", token: "-", variant: "op" },
      { label: "S⇔D", action: "cycleFraction", variant: "func" },
      { label: "DMS", token: "dms(", variant: "func" },
    ],
    [
      { label: "0", token: "0", span: 2 },
      { label: ".", token: "." },
      { label: "+", token: "+", variant: "op" },
      { label: "=", action: "equals", span: 2, variant: "equals" },
    ],
  ];
}

const BUTTON_BASE =
  "flex items-center justify-center rounded-lg py-3.5 text-base font-medium transition select-none";

function buttonClass(variant: CalcButton["variant"]): string {
  switch (variant) {
    case "op":
      return `${BUTTON_BASE} bg-[#1f1f1f] text-cyan-300 hover:bg-[#282828]`;
    case "func":
      return `${BUTTON_BASE} bg-[#1f1f1f] text-neutral-300 text-sm hover:bg-[#282828]`;
    case "danger":
      return `${BUTTON_BASE} bg-[#1f1f1f] text-rose-300 hover:bg-rose-500/10`;
    case "equals":
      return `${BUTTON_BASE} bg-cyan-500 text-black font-semibold hover:bg-cyan-400`;
    default:
      return `${BUTTON_BASE} bg-[#181818] text-neutral-100 hover:bg-[#242424]`;
  }
}

export function EngineeringCalculator() {
  const [expression, setExpression] = useState("");
  const [historyLine, setHistoryLine] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [angleMode, setAngleMode] = useState<AngleMode>("deg");
  const [isSecond, setIsSecond] = useState(false);
  const [isHyp, setIsHyp] = useState(false);
  const [lastResultValue, setLastResultValue] = useState<number | null>(null);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("decimal");

  const appendToken = (token: string) => {
    setErrorMsg(null);
    setDisplayMode("decimal");
    if (justEvaluated) {
      const isOperator = OPERATOR_TOKENS.includes(token);
      setExpression(isOperator ? expression + token : token);
      setJustEvaluated(false);
      return;
    }
    setExpression((prev) => prev + token);
  };

  const handleClear = () => {
    setExpression("");
    setHistoryLine(null);
    setErrorMsg(null);
    setJustEvaluated(false);
    setLastResultValue(null);
    setDisplayMode("decimal");
  };

  const handleBackspace = () => {
    if (justEvaluated) {
      handleClear();
      return;
    }
    setErrorMsg(null);
    setExpression((prev) => prev.slice(0, -1));
  };

  const handleEquals = () => {
    if (!expression.trim()) return;
    try {
      const value = evaluateExpression(expression, angleMode);
      const formatted = formatResult(value);
      setHistoryLine(`${expression} =`);
      setExpression(formatted);
      setLastResultValue(value);
      setDisplayMode("decimal");
      setErrorMsg(null);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "계산할 수 없는 식입니다");
      setLastResultValue(null);
    } finally {
      setJustEvaluated(true);
    }
  };

  const handleNegate = () => {
    setErrorMsg(null);
    setJustEvaluated(false);
    setDisplayMode("decimal");
    setExpression((prev) => {
      if (!prev) return prev;
      if (prev.startsWith("-(") && prev.endsWith(")")) return prev.slice(2, -1);
      return `-(${prev})`;
    });
  };

  const handleCycleFraction = () => {
    if (!justEvaluated || lastResultValue === null) return;
    setDisplayMode((prev) => (prev === "decimal" ? "mixed" : prev === "mixed" ? "improper" : "decimal"));
  };

  const handlePress = (button: CalcButton) => {
    switch (button.action) {
      case "clear":
        handleClear();
        return;
      case "backspace":
        handleBackspace();
        return;
      case "equals":
        handleEquals();
        return;
      case "cycleAngle":
        setAngleMode((prev) => (prev === "deg" ? "rad" : prev === "rad" ? "grad" : "deg"));
        return;
      case "toggleSecond":
        setIsSecond((prev) => !prev);
        return;
      case "toggleHyp":
        setIsHyp((prev) => !prev);
        return;
      case "negate":
        handleNegate();
        return;
      case "cycleFraction":
        handleCycleFraction();
        return;
      default:
        if (button.token) appendToken(button.token);
    }
  };

  const displayText = errorMsg
    ? "오류"
    : justEvaluated && lastResultValue !== null && displayMode !== "decimal"
      ? displayMode === "mixed"
        ? formatMixedFraction(lastResultValue)
        : formatImproperFraction(lastResultValue)
      : expression || "0";

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 px-6 py-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-50">계산기</h1>
        <p className="text-sm text-neutral-400">
          삼각/쌍곡선함수, 거듭제곱·로그, 분수 변환을 지원하는 공학용 계산기예요.
        </p>
      </header>

      <section className={cardClass}>
        <div className="flex items-center gap-2.5">
          <span className={cardIconClass}>
            <CalculatorIcon className="h-4 w-4" />
          </span>
          <h2 className="text-lg font-semibold text-neutral-100">
            각도 단위: {ANGLE_LABEL[angleMode]}
          </h2>
        </div>

        <div className="flex flex-col items-end gap-1 rounded-lg border border-[#2a2a2a] bg-[#111111] px-4 py-4">
          <span className="h-5 truncate text-sm text-neutral-500">{historyLine ?? ""}</span>
          <span
            className={`w-full truncate text-right text-3xl font-semibold tabular-nums ${
              errorMsg ? "text-rose-400" : "text-neutral-50"
            }`}
            title={errorMsg ?? undefined}
          >
            {displayText}
          </span>
        </div>

        <div className="grid grid-cols-6 gap-2">
          {buildRows(angleMode, isSecond, isHyp)
            .flat()
            .map((button, index) => (
              <button
                key={`${button.label}-${index}`}
                type="button"
                onClick={() => handlePress(button)}
                className={`${buttonClass(button.variant)} ${button.span === 2 ? "col-span-2" : ""}`}
              >
                {button.action === "backspace" ? <Delete className="h-4 w-4" /> : button.label}
              </button>
            ))}
        </div>
      </section>
    </div>
  );
}
