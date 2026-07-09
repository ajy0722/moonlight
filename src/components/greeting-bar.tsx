"use client";

import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { useSyncExternalStore } from "react";
import { CHEER_MESSAGES, USER_NAME } from "@/lib/config";
import { useWeather } from "@/hooks/use-weather";

/** WMO weather code -> 아이콘 */
function weatherIcon(code: number): LucideIcon {
  if (code === 0) return Sun;
  if (code <= 2) return CloudSun;
  if (code === 3) return Cloud;
  if (code === 45 || code === 48) return CloudFog;
  if (code <= 57) return CloudDrizzle;
  if (code <= 67) return CloudRain;
  if (code <= 77) return CloudSnow;
  if (code <= 82) return CloudRain;
  if (code <= 86) return CloudSnow;
  return CloudLightning;
}

const emptySubscribe = () => () => {};

export function GreetingBar() {
  const weather = useWeather();
  // 날짜 기준으로 응원 문구를 로테이션한다 (서버 스냅샷은 빈 문자열 → 하이드레이션 안전)
  const cheer = useSyncExternalStore(
    emptySubscribe,
    () => CHEER_MESSAGES[new Date().getDate() % CHEER_MESSAGES.length],
    () => ""
  );

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-50">
          Hello, <span className="text-cyan-400">{USER_NAME}</span>님!
        </h1>
        <p className="min-h-5 text-sm text-neutral-400">{cheer}</p>
      </div>

      {weather.length > 0 && (
        <div className="flex items-center gap-2">
          {weather.map(({ city, temperature, weatherCode }) => {
            const Icon = weatherIcon(weatherCode);
            return (
              <span
                key={city}
                className="flex items-center gap-2 rounded-xl border border-[#262626] bg-[#1a1a1a] px-3.5 py-2 text-sm"
              >
                <span className="text-neutral-400">{city}</span>
                <Icon className="h-4 w-4 text-cyan-400" />
                <span className="font-mono font-medium text-neutral-100 tabular-nums">
                  {temperature}°
                </span>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
