"use client";

/** 1초마다 갱신되는 공용 시계. 구독자가 있을 때만 인터벌을 돌린다. */

type Listener = () => void;

const listeners = new Set<Listener>();
let intervalId: ReturnType<typeof setInterval> | null = null;
let current = Date.now();

function ensureRunning(): void {
  if (intervalId !== null) return;
  intervalId = setInterval(() => {
    current = Date.now();
    listeners.forEach((listener) => listener());
  }, 1000);
}

function stopIfIdle(): void {
  if (listeners.size === 0 && intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

export function subscribeTick(listener: Listener): () => void {
  listeners.add(listener);
  ensureRunning();
  return () => {
    listeners.delete(listener);
    stopIfIdle();
  };
}

export function getTickSnapshot(): number {
  return current;
}

export function getTickServerSnapshot(): number {
  return 0;
}
