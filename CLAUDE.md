@AGENTS.md





---

# 계산기 기능 추가 스펙

\# 공학용 계산기 (Casio FX-570 계열 + CAS 수준) — 기능 스펙



> 이 파일은 프로젝트 루트에 두면 Claude Code가 자동으로 컨텍스트로 읽습니다.

> 구현 시 모드별로 별도 컴포넌트/모듈로 분리 권장 (아래 각 섹션 = 1 모듈).


\## 1. Arithmetic

`add, sub, mul, div, fraction(mixed↔improper), decToFrac(S⇔D), percent, negate, mod, round(Rnd)`



\## 2. Power / Root / Log

`square(x²), cube(x³), pow(x^y), sqrt, cbrt, nthroot(x^y√), log10, ln, logBase(a,b), tenPow(10^x), expPow(e^x)`



\## 3. Trig / Hyperbolic

`sin, cos, tan, asin, acos, atan, sinh, cosh, tanh, asinh, acosh, atanh`

angleUnit: `DEG | RAD | GRAD`

convert: `dms↔decimal`



\## 4. Calculus / Series

`derivative(f, x0)` — 수치미분(점 x0)

`integral(f, a, b)` — 정적분

`sum(f, start, end)` — Σ

`product(f, start, end)` — Π



\## 5. Complex (CMPLX)

`complexAdd/Sub/Mul/Div, conjugate, arg, abs, toRect(a+bi), toPolar(r∠θ)`



\## 6. Base-N

bases: `DEC | HEX | BIN | OCT`

ops: `AND, OR, XOR, NOT, XNOR, twosComplement(NEG)`



\## 7. Equation Solver (EQN/SOLVE)

`linearSystem(n=2|3|4)` — 연립방정식

`polynomial(deg=2|3|4)` — 실근/복소근 (2차는 vertex min/max 포함)

`numericSolve(expr, guess)` — Newton's Method



\## 8. Matrix (MAT)

storage: `A,B,C,D`

ops: `add, sub, mul, scalarMul, det, inverse, transpose, identity(n), pow(mat,2|3)`



\## 9. Vector (VCT)

storage: `A,B,C,D` (2D/3D)

ops: `add, sub, dot, cross, abs, angleBetween, unitVector`



\## 10. Statistics (STAT)

input: `1-var, linReg(y=A+Bx), quadReg(y=A+Bx+Cx²), logReg, expReg, powReg`

aggregates: `sumX, sumX2, sumY, sumY2, sumXY, meanX, meanY, popStdDev(σ), sampleStdDev(s), min, max, median, Q1, Q3`

regression: `coeffA, coeffB, coeffC, corrCoeff(r), predict(x̂/ŷ)`

combinatorics: `factorial, nPr, nCr`

distribution: `normalPDF(P), normalCDF(Q,R), tValue`

random: `rand(), randInt(min,max)`



\## 11. Differential Equations (DEQ)

order: `1st | 2nd | higher`

solve: `generalSolution(withConstants: C1,C2,...)`

classify: `separable | homogeneous | exact`

linear: `homogeneousPart + particularPart`

ivp: `applyInitialConditions(...)`

numeric: `eulerMethod(step), rk4(step, adaptive?)`

transform: `laplace(f), inverseLaplace(F)`

parsing: `parseDerivativeNotation(y', y'', dy/dx, d²y/dx²)`, independent/dependent var 지정

visualization: `slopeField, solutionTrajectory` (그래프)



\## 12. Constants \& Unit Conversion

constants: 40+ (planck, g, c, e\_charge, avogadro, ...) — 별도 JSON 테이블로 분리 권장

units: `length, area, volume, mass, velocity, pressure, energy, power, temperature` (양방향 변환)

math: `pi, e`



\## 13. System / Memory

memory: `M+, M-, MR, MC`

variables: `STO/RCL — A,B,C,D,E,F,X,Y`

history: `Ans, PreAns`

display: `ENG notation, Fix(n), Sci(n), Norm`

input history: `scroll/edit previous expressions`

reset: `factory reset`



\---

\## 구현 우선순위 제안

1\. Arithmetic + Power/Root/Log + Trig (기본 계산기)

2\. EQN Solver + Matrix + Vector

3\. STAT + Complex + Base-N

4\. Calculus + DEQ (가장 복잡, 별도 심볼릭/수치 엔진 필요 — mathjs 또는 자체 수치해석 모듈 검토)

