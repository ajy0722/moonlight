export const WEEKDAY_LABELS_KO = ["월", "화", "수", "목", "금", "토", "일"];

/** Date -> "YYYY-MM-DD" (로컬 타임존 기준, UTC 변환 없음) */
export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function isSameDay(a: Date, b: Date): boolean {
  return toDateKey(a) === toDateKey(b);
}

/** 주어진 날짜가 속한 주의 월요일을 반환 */
export function startOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0 = Sun ... 6 = Sat
  const diffToMonday = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diffToMonday);
  return d;
}

/** 월요일 시작 7일치 Date 배열 */
export function getWeekDates(baseDate: Date): Date[] {
  const start = startOfWeek(baseDate);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

/** 월요일 시작 6주(42일) 그리드. 이전/다음 달의 날짜도 채워서 표시한다. */
export function getMonthGrid(baseDate: Date): Date[] {
  const gridStart = startOfWeek(startOfMonth(baseDate));
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
}
