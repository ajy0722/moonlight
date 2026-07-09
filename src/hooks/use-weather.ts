"use client";

import { useEffect, useState } from "react";

export interface CityWeather {
  city: string;
  temperature: number;
  weatherCode: number;
}

const CITIES = [
  { city: "서울", latitude: 37.5665, longitude: 126.978 },
  { city: "세종", latitude: 36.4801, longitude: 127.2891 },
];

const REFRESH_INTERVAL_MS = 30 * 60 * 1000;

async function fetchCityWeather(city: (typeof CITIES)[number]): Promise<CityWeather> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${city.latitude}&longitude=${city.longitude}` +
    `&current=temperature_2m,weather_code&timezone=Asia%2FSeoul`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`weather fetch failed: ${res.status}`);
  const data = (await res.json()) as {
    current: { temperature_2m: number; weather_code: number };
  };
  return {
    city: city.city,
    temperature: Math.round(data.current.temperature_2m),
    weatherCode: data.current.weather_code,
  };
}

/** 서울/세종 현재 날씨. 실패하면 빈 배열을 유지한다. */
export function useWeather() {
  const [weather, setWeather] = useState<CityWeather[]>([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const results = await Promise.all(CITIES.map(fetchCityWeather));
        if (!cancelled) setWeather(results);
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

  return weather;
}
