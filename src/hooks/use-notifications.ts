"use client";

import { useCallback, useEffect, useState } from "react";
import { toDateKey } from "@/lib/date-utils";
import { getEventRepository, getTaskRepository } from "@/lib/repositories";
import type { AppNotification } from "@/types/notification";

const STORAGE_KEY = "moonlight:notifications";
const NOTIFIED_KEY = "moonlight:notified-keys";
/** 일정 시작 몇 분 전부터 알림을 띄울지 */
const EVENT_LEAD_MINUTES = 30;
const MAX_NOTIFICATIONS = 50;
const MAX_NOTIFIED_KEYS = 300;
const CHECK_INTERVAL_MS = 60 * 1000;

export type PermissionState = NotificationPermission | "unsupported";

function readNotifications(): AppNotification[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as AppNotification[];
  } catch {
    return [];
  }
}

function writeNotifications(list: AppNotification[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function readNotifiedKeys(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(NOTIFIED_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

function writeNotifiedKeys(keys: string[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(NOTIFIED_KEY, JSON.stringify(keys.slice(-MAX_NOTIFIED_KEYS)));
}

function fireBrowserNotification(notification: AppNotification): void {
  if (typeof Notification === "undefined") return;
  if (Notification.permission !== "granted") return;
  new Notification(notification.title, { body: notification.body });
}

/**
 * 마감 임박 일정(시작 30분 전)과 오늘 마감 할 일을 감지해
 * 브라우저 알림을 띄우고 헤더 벨 아이콘의 알림 목록에 쌓는다.
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [permission, setPermission] = useState<PermissionState>("default");

  useEffect(() => {
    let cancelled = false;
    let initialized = false;

    const check = async () => {
      const [tasks, events] = await Promise.all([
        getTaskRepository().list(),
        getEventRepository().list(),
      ]);
      if (cancelled) return;

      if (!initialized) {
        initialized = true;
        setNotifications(readNotifications());
        setPermission(
          typeof Notification === "undefined" ? "unsupported" : Notification.permission
        );
      }

      const now = new Date();
      const todayKey = toDateKey(now);
      const notifiedKeys = readNotifiedKeys();
      const fresh: AppNotification[] = [];
      const newKeys: string[] = [];

      for (const event of events) {
        if (event.date !== todayKey || !event.time) continue;
        const [hour, minute] = event.time.split(":").map(Number);
        const startsAt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);
        const minutesLeft = Math.floor((startsAt.getTime() - now.getTime()) / 60_000);
        if (minutesLeft < 0 || minutesLeft > EVENT_LEAD_MINUTES) continue;

        const key = `event:${event.id}:${event.date}`;
        if (notifiedKeys.includes(key)) continue;
        fresh.push({
          id: crypto.randomUUID(),
          title: "곧 시작하는 일정",
          body: `${event.time} ${event.title}`,
          createdAt: now.toISOString(),
          read: false,
        });
        newKeys.push(key);
      }

      for (const task of tasks) {
        if (task.dueDate !== todayKey || task.completed) continue;
        const key = `task:${task.id}:${todayKey}`;
        if (notifiedKeys.includes(key)) continue;
        fresh.push({
          id: crypto.randomUUID(),
          title: "오늘 마감 할 일",
          body: task.title,
          createdAt: now.toISOString(),
          read: false,
        });
        newKeys.push(key);
      }

      if (fresh.length === 0) return;

      writeNotifiedKeys([...notifiedKeys, ...newKeys]);
      setNotifications((prev) => {
        const next = [...fresh, ...prev].slice(0, MAX_NOTIFICATIONS);
        writeNotifications(next);
        return next;
      });
      fresh.forEach(fireBrowserNotification);
    };

    check();
    const timer = setInterval(check, CHECK_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => {
      if (prev.every((n) => n.read)) return prev;
      const next = prev.map((n) => ({ ...n, read: true }));
      writeNotifications(next);
      return next;
    });
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof Notification === "undefined") return;
    const result = await Notification.requestPermission();
    setPermission(result);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, unreadCount, markAllRead, permission, requestPermission };
}
