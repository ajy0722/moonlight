"use client";

import { Send, StickyNote, X } from "lucide-react";
import { useMemo, useState, type KeyboardEvent } from "react";
import { cardClass, cardIconClass, fieldClass } from "@/lib/ui";
import type { Memo } from "@/types/memo";

interface QuickMemoCardProps {
  memos: Memo[];
  onAdd: (content: string) => void;
  onDelete: (id: string) => void;
}

export function QuickMemoCard({ memos, onAdd, onDelete }: QuickMemoCardProps) {
  const [draft, setDraft] = useState("");

  const recentFirst = useMemo(() => [...memos].reverse(), [memos]);

  const submit = () => {
    const trimmed = draft.replace(/\s+$/, "");
    if (!trimmed.trim()) return;
    onAdd(trimmed);
    setDraft("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter = 저장, Shift+Enter = 줄바꿈, Tab = 들여쓰기(공백 2칸)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const { selectionStart, selectionEnd, value } = target;
      const next = `${value.slice(0, selectionStart)}  ${value.slice(selectionEnd)}`;
      setDraft(next);
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = selectionStart + 2;
      });
    }
  };

  return (
    <section className={cardClass}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className={cardIconClass}>
            <StickyNote className="h-4 w-4" />
          </span>
          <h2 className="text-lg font-semibold text-neutral-100">퀵 메모</h2>
        </div>
        <span className="text-xs text-neutral-500">
          Enter 저장 · Shift+Enter 줄바꿈 · Tab 들여쓰기
        </span>
      </div>

      <div className="flex items-start gap-2">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={'떠오른 생각을 바로 적어두세요. "- "로 시작하면 불릿 목록이 됩니다.'}
          rows={2}
          className={`flex-1 resize-none font-mono text-sm ${fieldClass}`}
        />
        <button
          type="button"
          onClick={submit}
          aria-label="메모 저장"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 transition hover:bg-cyan-500/20"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

      {recentFirst.length === 0 ? (
        <p className="py-6 text-center text-sm text-neutral-500">저장된 메모가 없습니다.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {recentFirst.map((memo) => (
            <MemoRow key={memo.id} memo={memo} onDelete={onDelete} />
          ))}
        </ul>
      )}
    </section>
  );
}

function formatMemoDate(iso: string): string {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${d.getMonth() + 1}/${d.getDate()} ${hh}:${mm}`;
}

function MemoRow({ memo, onDelete }: { memo: Memo; onDelete: (id: string) => void }) {
  return (
    <li className="group flex items-start gap-3 rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] px-3.5 py-2.5 transition hover:border-[#3a3a3a]">
      <div className="min-w-0 flex-1">
        <MemoContent content={memo.content} />
      </div>
      <span className="shrink-0 pt-0.5 font-mono text-[11px] text-neutral-600 tabular-nums">
        {formatMemoDate(memo.createdAt)}
      </span>
      <button
        type="button"
        onClick={() => onDelete(memo.id)}
        aria-label="메모 삭제"
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-neutral-600 opacity-0 transition group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-400"
      >
        <X className="h-3 w-3" />
      </button>
    </li>
  );
}

/** "- " / "* " 로 시작하는 줄은 불릿으로, 앞의 공백 2칸당 1단계 들여쓰기로 렌더링 */
function MemoContent({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="flex flex-col gap-0.5">
      {lines.map((line, index) => {
        const indentSpaces = line.length - line.trimStart().length;
        const indentLevel = Math.floor(indentSpaces / 2);
        const trimmed = line.trimStart();
        const isBullet = trimmed.startsWith("- ") || trimmed.startsWith("* ");
        const text = isBullet ? trimmed.slice(2) : trimmed;

        return (
          <div
            key={index}
            className="flex items-baseline gap-1.5 text-sm text-neutral-200"
            style={{ paddingLeft: indentLevel * 14 }}
          >
            {isBullet && <span className="text-cyan-400">•</span>}
            <span className="break-words whitespace-pre-wrap">{text || " "}</span>
          </div>
        );
      })}
    </div>
  );
}
