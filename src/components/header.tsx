"use client";

import { Bell, CircleUser, Settings } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useNotifications } from "@/hooks/use-notifications";
import type { AppNotification } from "@/types/notification";

const WEEKDAY_SHORT = ["일", "월", "화", "수", "목", "금", "토"];

function formatClock(date: Date): string {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${WEEKDAY_SHORT[date.getDay()]}) ${hh}:${mm}`;
}

function formatNotificationTime(iso: string): string {
  const diffMinutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
  if (diffMinutes < 1) return "방금 전";
  if (diffMinutes < 60) return `${diffMinutes}분 전`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;
  return `${Math.floor(diffHours / 24)}일 전`;
}

const iconButtonClass =
  "relative flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-[#242424] hover:text-neutral-200";

function subscribeToClock(callback: () => void) {
  const timer = setInterval(callback, 1000);
  return () => clearInterval(timer);
}

export function Header() {
  // 서버 스냅샷은 빈 문자열이라 하이드레이션 불일치가 없다
  const clock = useSyncExternalStore(
    subscribeToClock,
    () => formatClock(new Date()),
    () => ""
  );

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[#242424] bg-[#0a0a0a]/90 px-6 backdrop-blur">
      <Link href="/" className="font-mono text-sm font-bold tracking-widest text-neutral-100">
        <span className="text-cyan-400">[</span>
        MOONLIGHT
        <span className="text-cyan-400">]</span>
      </Link>

      <div className="flex items-center gap-1.5">
        <span className="mr-2 hidden font-mono text-xs text-neutral-400 tabular-nums sm:block">
          {clock}
        </span>

        <button type="button" aria-label="설정" className={iconButtonClass}>
          <Settings className="h-[18px] w-[18px]" />
        </button>

        <NotificationBell />

        <button type="button" aria-label="프로필" className={iconButtonClass}>
          <CircleUser className="h-[19px] w-[19px]" />
        </button>
      </div>
    </header>
  );
}

function NotificationBell() {
  const { notifications, unreadCount, markAllRead, permission, requestPermission } =
    useNotifications();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", onMouseDown);
    return () => window.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  const toggle = () => {
    setOpen((prev) => {
      if (!prev) markAllRead();
      return !prev;
    });
  };

  return (
    <div ref={containerRef} className="relative">
      <button type="button" aria-label="알림" onClick={toggle} className={iconButtonClass}>
        <Bell className="h-[18px] w-[18px]" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-cyan-400 px-1 text-[10px] font-bold text-black">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-[#2e2e2e] bg-[#1a1a1a] shadow-xl shadow-black/50">
          <div className="flex items-center justify-between border-b border-[#2e2e2e] px-4 py-2.5">
            <span className="text-sm font-semibold text-neutral-100">알림</span>
            {permission === "default" && (
              <button
                type="button"
                onClick={requestPermission}
                className="rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-300 transition hover:bg-cyan-500/20"
              >
                브라우저 알림 켜기
              </button>
            )}
            {permission === "denied" && (
              <span className="text-xs text-neutral-500">브라우저 알림 차단됨</span>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-neutral-500">알림이 없습니다.</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {notifications.map((notification) => (
                <NotificationRow key={notification.id} notification={notification} />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function NotificationRow({ notification }: { notification: AppNotification }) {
  return (
    <li className="flex flex-col gap-0.5 border-b border-[#242424] px-4 py-3 last:border-b-0">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-cyan-300">{notification.title}</span>
        <span className="shrink-0 text-[11px] text-neutral-500">
          {formatNotificationTime(notification.createdAt)}
        </span>
      </div>
      <span className="text-sm text-neutral-200">{notification.body}</span>
    </li>
  );
}
