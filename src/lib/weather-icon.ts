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

/** WMO weather code -> 아이콘 */
export function weatherIcon(code: number): LucideIcon {
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

/** 비/눈 등 강수를 나타내는 WMO 코드인지 */
export function isPrecipitationCode(code: number): boolean {
  return (code >= 51 && code <= 67) || (code >= 71 && code <= 77) || (code >= 80 && code <= 99);
}
