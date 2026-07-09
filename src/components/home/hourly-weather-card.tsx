"use client";

import { CloudSun, ShieldAlert, Umbrella } from "lucide-react";
import { useMemo } from "react";
import { useHourlySeoulWeather } from "@/hooks/use-hourly-weather";
import { cardClass, cardIconClass } from "@/lib/ui";
import { isPrecipitationCode, weatherIcon } from "@/lib/weather-icon";

const UV_HIGH_THRESHOLD = 6;
const RAIN_PROBABILITY_THRESHOLD = 50;

export function HourlyWeatherCard() {
  const hours = useHourlySeoulWeather();

  const rainExpected = useMemo(
    () =>
      hours.some(
        (h) => isPrecipitationCode(h.weatherCode) || h.precipitationProbability >= RAIN_PROBABILITY_THRESHOLD
      ),
    [hours]
  );
  const strongSun = useMemo(() => hours.some((h) => h.uvIndex >= UV_HIGH_THRESHOLD), [hours]);

  return (
    <section className={cardClass}>
      <div className="flex items-center gap-2.5">
        <span className={cardIconClass}>
          <CloudSun className="h-4 w-4" />
        </span>
        <h2 className="text-lg font-semibold text-neutral-100">서울 시간별 날씨</h2>
      </div>

      {(rainExpected || strongSun) && (
        <div className="flex flex-col gap-2">
          {rainExpected && (
            <p className="flex items-center gap-2 rounded-lg bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200">
              <Umbrella className="h-4 w-4 shrink-0" />
              비 소식이 있어요, 우산을 챙기세요.
            </p>
          )}
          {strongSun && (
            <p className="flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              자외선이 강해요, 선크림을 발라주세요.
            </p>
          )}
        </div>
      )}

      {hours.length === 0 ? (
        <p className="py-8 text-center text-sm text-neutral-500">날씨 정보를 불러오는 중...</p>
      ) : (
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {hours.map((hour) => {
            const Icon = weatherIcon(hour.weatherCode);
            return (
              <div
                key={hour.time}
                className="flex shrink-0 flex-col items-center gap-1.5 rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] px-3 py-2.5"
              >
                <span className="text-xs text-neutral-400">{hour.hourLabel}</span>
                <Icon className="h-4 w-4 text-cyan-400" />
                <span className="font-mono text-sm font-medium text-neutral-100 tabular-nums">
                  {hour.temperature}°
                </span>
                {hour.precipitationProbability > 0 && (
                  <span className="font-mono text-[11px] text-cyan-300 tabular-nums">
                    {hour.precipitationProbability}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
