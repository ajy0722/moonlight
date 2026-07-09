import { toDateKey } from "@/lib/date-utils";

export type TimerPhase = "idle" | "studying" | "studyAlarm" | "resting" | "restAlarm";

export interface StudyTimerState {
  studyMinutes: number;
  breakMinutes: number;
  phase: TimerPhase;
  /** 현재 phase가 시작된 시각(ms). idle이면 null */
  phaseAnchorMs: number | null;
  /** 날짜별(YYYY-MM-DD) 누적 공부 시간(초). 진행 중인 구간은 포함하지 않음 */
  studyLog: Record<string, number>;
}

const STORAGE_KEY = "moonlight:study-timer";

export const DEFAULT_STUDY_TIMER_STATE: StudyTimerState = {
  studyMinutes: 50,
  breakMinutes: 10,
  phase: "idle",
  phaseAnchorMs: null,
  studyLog: {},
};

export function readStudyTimerState(): StudyTimerState {
  if (typeof window === "undefined") return DEFAULT_STUDY_TIMER_STATE;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === null) return DEFAULT_STUDY_TIMER_STATE;

  try {
    return { ...DEFAULT_STUDY_TIMER_STATE, ...(JSON.parse(raw) as Partial<StudyTimerState>) };
  } catch {
    return DEFAULT_STUDY_TIMER_STATE;
  }
}

export function writeStudyTimerState(state: StudyTimerState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function todayKey(): string {
  return toDateKey(new Date());
}

export function committedTodaySeconds(state: StudyTimerState): number {
  return state.studyLog[todayKey()] ?? 0;
}

export function withAddedStudySeconds(state: StudyTimerState, seconds: number): StudyTimerState {
  if (seconds <= 0) return state;
  const key = todayKey();
  return {
    ...state,
    studyLog: { ...state.studyLog, [key]: (state.studyLog[key] ?? 0) + seconds },
  };
}
