"use client";

import { BellRing, Play, RotateCcw, Timer as TimerIcon } from "lucide-react";
import { CircularTimer } from "@/components/timer/circular-timer";
import { useStudyTimer } from "@/hooks/use-study-timer";
import { formatClock, formatDurationKo } from "@/lib/duration";
import { cardClass, cardIconClass, fieldClass, primaryButtonClass } from "@/lib/ui";

const PHASE_LABEL: Record<string, string> = {
  idle: "대기 중",
  studying: "공부 중",
  studyAlarm: "공부 시간 종료!",
  resting: "쉬는 시간",
  restAlarm: "휴식 종료!",
};

function clampMinutes(value: number, max: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.min(max, Math.max(1, Math.round(value)));
}

export function StudyTimer() {
  const {
    phase,
    studyMinutes,
    breakMinutes,
    remainingSeconds,
    elapsedSeconds,
    progressRatio,
    isAlarming,
    todayStudySeconds,
    start,
    dismissAlarm,
    reset,
    updateSettings,
  } = useStudyTimer();

  const isIdle = phase === "idle";
  const overtimeSeconds =
    phase === "studyAlarm" || phase === "restAlarm"
      ? Math.max(0, elapsedSeconds - (phase === "studyAlarm" ? studyMinutes * 60 : breakMinutes * 60))
      : 0;

  const timeText = isIdle
    ? formatClock(studyMinutes * 60)
    : isAlarming
      ? `+${formatClock(overtimeSeconds)}`
      : formatClock(remainingSeconds);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-50">타이머</h1>
        <p className="text-sm text-neutral-400">
          공부 시간이 끝나면 알람이 울려요. 알람을 끄면 쉬는 시간이 시작됩니다.
        </p>
      </header>

      <section className={`${cardClass} items-center`}>
        <div className="flex w-full items-center gap-2.5 self-start">
          <span className={cardIconClass}>
            <TimerIcon className="h-4 w-4" />
          </span>
          <h2 className="text-lg font-semibold text-neutral-100">{PHASE_LABEL[phase]}</h2>
        </div>

        <CircularTimer
          progressRatio={progressRatio}
          isAlarming={isAlarming}
          timeText={timeText}
          phaseLabel={
            isIdle
              ? "설정한 시간으로 시작해요"
              : isAlarming
                ? "알람을 꺼주세요"
                : phase === "studying"
                  ? "남은 공부 시간"
                  : "남은 휴식 시간"
          }
        />

        {isAlarming ? (
          <button
            type="button"
            onClick={dismissAlarm}
            className="inline-flex animate-pulse items-center justify-center gap-2 rounded-lg bg-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-rose-500/30 transition hover:bg-rose-400"
          >
            <BellRing className="h-4 w-4" />
            알람 끄기
          </button>
        ) : (
          <div className="flex items-center gap-2">
            {isIdle && (
              <button type="button" onClick={start} className={primaryButtonClass}>
                <Play className="h-4 w-4" />
                시작
              </button>
            )}
            {!isIdle && (
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#2e2e2e] px-4 py-2 text-sm font-medium text-neutral-300 transition hover:border-neutral-500 hover:text-neutral-100"
              >
                <RotateCcw className="h-4 w-4" />
                초기화
              </button>
            )}
          </div>
        )}
      </section>

      <section className={cardClass}>
        <h2 className="text-sm font-semibold tracking-wide text-neutral-400 uppercase">
          시간 설정
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-neutral-300">
            공부
            <input
              key={`study-${studyMinutes}`}
              type="number"
              min={1}
              max={180}
              defaultValue={studyMinutes}
              disabled={!isIdle}
              onBlur={(e) => updateSettings(clampMinutes(Number(e.target.value), 180), breakMinutes)}
              className={`w-20 ${fieldClass} disabled:cursor-not-allowed disabled:opacity-50`}
            />
            분
          </label>
          <label className="flex items-center gap-2 text-sm text-neutral-300">
            휴식
            <input
              key={`break-${breakMinutes}`}
              type="number"
              min={1}
              max={60}
              defaultValue={breakMinutes}
              disabled={!isIdle}
              onBlur={(e) => updateSettings(studyMinutes, clampMinutes(Number(e.target.value), 60))}
              className={`w-20 ${fieldClass} disabled:cursor-not-allowed disabled:opacity-50`}
            />
            분
          </label>
        </div>
        {!isIdle && (
          <p className="text-xs text-neutral-500">
            타이머가 진행 중일 때는 시간을 바꿀 수 없어요. 초기화 후 변경해 주세요.
          </p>
        )}
      </section>

      <section className={cardClass}>
        <h2 className="text-sm font-semibold tracking-wide text-neutral-400 uppercase">
          오늘 총 공부 시간
        </h2>
        <span className="text-3xl font-bold text-cyan-300">
          {formatDurationKo(todayStudySeconds)}
        </span>
      </section>
    </div>
  );
}
