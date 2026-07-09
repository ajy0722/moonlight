"use client";

import { useEffect, useState } from "react";

export interface HourlyWeatherPoint {
  /** "YYYY-MM-DDTHH:00" (Asia/Seoul 로컬시간, open-meteo 원본 그대로) */
  time: string;
  hourLabel: string;
  temperature: number;
  precipitationProbability: number;
  weatherCode: number;
  uvIndex: number;
}

const SEOUL = { latitude: 37.5665, longitude: 126.978 };
const REFRESH_INTERVAL_MS = 30 * 60 * 1000;
const HOURS_TO_SHOW = 12;

/** "YYYY-MM-DDTHH:00" 형식의 현재 시각 키 (로컬 기준, 문자열 비교로 정렬 가능) */
function currentHourKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const h = String(now.getHours()).padStart(2, "0");
  return `${y}-${m}-${d}T${h}:00`;
}

interface OpenMeteoHourlyResponse {
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    weather_code: number[];
    uv_index: number[];
  };
}

async function fetchSeoulHourly(): Promise<HourlyWeatherPoint[]> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${SEOUL.latitude}&longitude=${SEOUL.longitude}` +
    `&hourly=temperature_2m,precipitation_probability,weather_code,uv_index` +
    `&timezone=Asia%2FSeoul&forecast_days=2`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`hourly weather fetch failed: ${res.status}`);
  const data = (await res.json()) as OpenMeteoHourlyResponse;

  const from = currentHourKey();

  return data.hourly.time
    .map((time, i) => ({
      time,
      hourLabel: `${Number(time.slice(11, 13))}시`,
      temperature: Math.round(data.hourly.temperature_2m[i]),
      precipitationProbability: data.hourly.precipitation_probability[i],
      weatherCode: data.hourly.weather_code[i],
      uvIndex: data.hourly.uv_index[i],
    }))
    .filter((point) => point.time >= from)
    .slice(0, HOURS_TO_SHOW);
}

/** 서울 시간별 예보(현재 시각부터 12시간). 실패하면 빈 배열을 유지한다. */
export function useHourlySeoulWeather() {
  const [hours, setHours] = useState<HourlyWeatherPoint[]>([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const points = await fetchSeoulHourly();
        if (!cancelled) setHours(points);
      } catch {
        // 네트워크 실패 시 조용히 무시 (다음 주기에 재시도)
      }
    };

    load();
    const timer = setInterval(load, REFRESH_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  return hours;
}
