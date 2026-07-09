"use client";

import {
  DEFAULT_STUDY_TIMER_STATE,
  readStudyTimerState,
  withAddedStudySeconds,
  writeStudyTimerState,
  type StudyTimerState,
} from "@/lib/study-storage";

/** localStorage 백업이 있는 공용 스토어. 페이지 이동/새로고침에도 진행 상태가 유지된다. */

type Listener = () => void;

let state: StudyTimerState | null = null;
const listeners = new Set<Listener>();

function ensureLoaded(): StudyTimerState {
  if (state === null) {
    state = readStudyTimerState();
  }
  return state;
}

function commit(next: StudyTimerState): void {
  state = next;
  writeStudyTimerState(next);
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): StudyTimerState {
  return ensureLoaded();
}

export function getServerSnapshot(): StudyTimerState {
  return DEFAULT_STUDY_TIMER_STATE;
}

export function startStudying(): void {
  const prev = ensureLoaded();
  if (prev.phase !== "idle") return;
  commit({ ...prev, phase: "studying", phaseAnchorMs: Date.now() });
}

/** 공부/휴식 타깃 시간을 넘겼으면 알람 상태로 전환한다 (매초 호출됨). */
export function checkPhaseTransition(nowMs: number): void {
  const prev = ensureLoaded();
  if (prev.phaseAnchorMs === null) return;

  const elapsedMs = nowMs - prev.phaseAnchorMs;

  if (prev.phase === "studying" && elapsedMs >= prev.studyMinutes * 60_000) {
    commit({ ...prev, phase: "studyAlarm" });
  } else if (prev.phase === "resting" && elapsedMs >= prev.breakMinutes * 60_000) {
    commit({ ...prev, phase: "restAlarm" });
  }
}

/** 알람을 끄면 다음 phase로 넘어간다. 공부 알람이었다면 그 구간 시간을 오늘 기록에 반영한다. */
export function dismissAlarm(): void {
  const prev = ensureLoaded();
  if (prev.phaseAnchorMs === null) return;

  if (prev.phase === "studyAlarm") {
    const elapsedSeconds = Math.floor((Date.now() - prev.phaseAnchorMs) / 1000);
    const logged = withAddedStudySeconds(prev, elapsedSeconds);
    commit({ ...logged, phase: "resting", phaseAnchorMs: Date.now() });
    return;
  }

  if (prev.phase === "restAlarm") {
    commit({ ...prev, phase: "studying", phaseAnchorMs: Date.now() });
  }
}

/** 진행 중인 사이클을 멈추고 대기 상태로 되돌린다. 공부 중이었다면 그때까지의 시간은 기록에 반영한다. */
export function resetTimer(): void {
  const prev = ensureLoaded();

  if ((prev.phase === "studying" || prev.phase === "studyAlarm") && prev.phaseAnchorMs !== null) {
    const elapsedSeconds = Math.floor((Date.now() - prev.phaseAnchorMs) / 1000);
    const logged = withAddedStudySeconds(prev, elapsedSeconds);
    commit({ ...logged, phase: "idle", phaseAnchorMs: null });
    return;
  }

  commit({ ...prev, phase: "idle", phaseAnchorMs: null });
}

export function updateSettings(studyMinutes: number, breakMinutes: number): void {
  const prev = ensureLoaded();
  if (prev.phase !== "idle") return;
  commit({ ...prev, studyMinutes, breakMinutes });
}
