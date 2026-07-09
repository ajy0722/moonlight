"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { committedTodaySeconds } from "@/lib/study-storage";
import {
  checkPhaseTransition,
  dismissAlarm,
  getServerSnapshot,
  getSnapshot,
  resetTimer,
  startStudying,
  subscribe,
  updateSettings,
} from "@/lib/study-timer-store";
import { getTickServerSnapshot, getTickSnapshot, subscribeTick } from "@/lib/tick-store";

/** 알람 비프음 반복 간격(ms) */
const ALARM_INTERVAL_MS = 1200;

type AudioContextCtor = typeof AudioContext;

function getAudioContextCtor(): AudioContextCtor | undefined {
  if (typeof window === "undefined") return undefined;
  return (
    window.AudioContext ??
    (window as typeof window & { webkitAudioContext?: AudioContextCtor }).webkitAudioContext
  );
}

function playBeep(ctx: AudioContext): void {
  const now = ctx.currentTime;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(880, now);
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.25, now + 0.02);
  gain.gain.linearRampToValueAtTime(0, now + 0.35);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.4);
}

export function useStudyTimer() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const nowMs = useSyncExternalStore(subscribeTick, getTickSnapshot, getTickServerSnapshot);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const alarmTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (nowMs > 0) checkPhaseTransition(nowMs);
  }, [nowMs]);

  const isAlarming = state.phase === "studyAlarm" || state.phase === "restAlarm";

  useEffect(() => {
    if (!isAlarming) {
      if (alarmTimerRef.current) {
        clearInterval(alarmTimerRef.current);
        alarmTimerRef.current = null;
      }
      return;
    }

    if (!audioCtxRef.current) {
      const Ctor = getAudioContextCtor();
      audioCtxRef.current = Ctor ? new Ctor() : null;
    }
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    playBeep(ctx);
    alarmTimerRef.current = setInterval(() => playBeep(ctx), ALARM_INTERVAL_MS);

    return () => {
      if (alarmTimerRef.current) {
        clearInterval(alarmTimerRef.current);
        alarmTimerRef.current = null;
      }
    };
  }, [isAlarming]);

  const start = () => {
    if (!audioCtxRef.current) {
      const Ctor = getAudioContextCtor();
      audioCtxRef.current = Ctor ? new Ctor() : null;
    }
    startStudying();
  };

  const elapsedMs = state.phaseAnchorMs !== null && nowMs > 0 ? Math.max(0, nowMs - state.phaseAnchorMs) : 0;
  const elapsedSeconds = Math.floor(elapsedMs / 1000);
  const targetSeconds =
    state.phase === "studying" || state.phase === "studyAlarm"
      ? state.studyMinutes * 60
      : state.phase === "resting" || state.phase === "restAlarm"
        ? state.breakMinutes * 60
        : 0;
  const remainingSeconds = Math.max(0, targetSeconds - elapsedSeconds);
  const progressRatio = targetSeconds > 0 ? Math.min(1, elapsedSeconds / targetSeconds) : 0;

  const todayStudySeconds =
    committedTodaySeconds(state) +
    (state.phase === "studying" || state.phase === "studyAlarm" ? elapsedSeconds : 0);

  return {
    phase: state.phase,
    studyMinutes: state.studyMinutes,
    breakMinutes: state.breakMinutes,
    elapsedSeconds,
    remainingSeconds,
    progressRatio,
    isAlarming,
    todayStudySeconds,
    start,
    dismissAlarm,
    reset: resetTimer,
    updateSettings,
  };
}
