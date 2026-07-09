interface CircularTimerProps {
  /** 0~1 */
  progressRatio: number;
  isAlarming: boolean;
  timeText: string;
  phaseLabel: string;
  size?: number;
}

const STROKE_WIDTH = 10;

export function CircularTimer({
  progressRatio,
  isAlarming,
  timeText,
  phaseLabel,
  size = 260,
}: CircularTimerProps) {
  const radius = (size - STROKE_WIDTH) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progressRatio);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={STROKE_WIDTH}
          className="fill-none stroke-[#242424]"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`fill-none transition-[stroke-dashoffset] duration-1000 ease-linear ${
            isAlarming ? "stroke-rose-400" : "stroke-cyan-400"
          }`}
        />
      </svg>

      <div className="absolute flex flex-col items-center gap-1">
        <span
          className={`text-4xl font-bold tabular-nums ${isAlarming ? "text-rose-300 animate-pulse" : "text-neutral-50"}`}
        >
          {timeText}
        </span>
        <span className="text-sm font-medium text-neutral-400">{phaseLabel}</span>
      </div>
    </div>
  );
}
