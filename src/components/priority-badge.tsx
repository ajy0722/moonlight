import { PRIORITY_LABELS } from "@/lib/priority";
import type { Priority } from "@/types/task";

const PRIORITY_STYLES: Record<Priority, { pill: string; dot: string }> = {
  high: {
    pill: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20",
    dot: "bg-rose-500",
  },
  medium: {
    pill: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20",
    dot: "bg-amber-500",
  },
  low: {
    pill: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20",
    dot: "bg-emerald-500",
  },
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const style = PRIORITY_STYLES[priority];
  return (
    <span
      className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${style.pill}`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`} />
      {PRIORITY_LABELS[priority]}
    </span>
  );
}

/** 월간 캘린더처럼 공간이 좁은 곳에서 쓰는 점 표시 전용 배지 */
export function PriorityDot({ priority }: { priority: Priority }) {
  return (
    <span
      className={`h-1.5 w-1.5 shrink-0 rounded-full ${PRIORITY_STYLES[priority].dot}`}
      aria-hidden
    />
  );
}
