import {
  Cloud,
  CloudFog,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudSun,
  CloudSunRain,
  Moon,
  Sun,
  Wind,
  type LucideIcon,
} from "lucide-react";

/**
 * Visual Crossing icon IDs (icons1) mapped to Lucide React icons.
 * Mixed = multiple conditions tied for most common.
 * @see https://www.visualcrossing.com/resources/documentation/weather-api/defining-icon-set-in-the-weather-api/
 */
export const WEATHER_ICON_MAP: Record<string, LucideIcon> = {
  snow: CloudSnow,
  rain: CloudRain,
  fog: CloudFog,
  wind: Wind,
  cloudy: Cloud,
  "partly-cloudy-day": CloudSun,
  "partly-cloudy-night": CloudMoon,
  "clear-day": Sun,
  "clear-night": Moon,
  Mixed: CloudSunRain,
};

export function getWeatherIcon(iconId: string): LucideIcon {
  return WEATHER_ICON_MAP[iconId] ?? Cloud;
}

type WeatherHour = {
  datetime: string;
  temp: number;
  conditions: string;
  windspeed: number;
  precipprob: number;
  icon?: string;
};

const EVENT_HOUR_RANGES: Record<string, number[]> = {
  "Morning (8am - 12pm)": [8, 9, 10, 11],
  "Afternoon (12pm - 5pm)": [12, 13, 14, 15, 16],
  "Evening (5pm - 9pm)": [17, 18, 19, 20],
};

/** Event hours expanded by 3 hrs before start and 4 hrs after end */
const EXPANDED_EVENT_HOUR_RANGES: Record<string, number[]> = {
  "Morning (8am - 12pm)": [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  "Afternoon (12pm - 5pm)": [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  "Evening (5pm - 9pm)": [14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
};

export type GraphHour = {
  datetime: string;
  hour: number;
  temp: number;
  precipprob: number;
  windspeed: number;
};

function parseHourFromDatetime(datetime: string): number {
  const timePart = datetime.includes("T") ? datetime.split("T")[1] ?? datetime : datetime;
  return parseInt(timePart.slice(0, 2), 10);
}

export function getExpandedHoursForEvent(
  hours: Array<{ datetime: string; temp: number; precipprob?: number; windspeed?: number }> | undefined,
  eventOfDay: string
): GraphHour[] {
  if (!hours?.length) return [];
  const allowedHours = EXPANDED_EVENT_HOUR_RANGES[eventOfDay];
  if (!allowedHours) return [];

  return hours
    .filter((h) => allowedHours.includes(parseHourFromDatetime(h.datetime)))
    .map((h) => ({
      datetime: h.datetime,
      hour: parseHourFromDatetime(h.datetime),
      temp: h.temp,
      precipprob: h.precipprob ?? 0,
      windspeed: h.windspeed ?? 0,
    }))
    .sort((a, b) => a.hour - b.hour);
}

export function getHoursForEvent(hours: WeatherHour[] | undefined, eventOfDay: string): WeatherHour[] {
  if (!hours?.length) return [];
  const allowedHours = EVENT_HOUR_RANGES[eventOfDay];
  if (!allowedHours) return hours;

  return hours.filter((h) => {
    const hour = parseInt(h.datetime.slice(0, 2), 10);
    return allowedHours.includes(hour);
  });
}

function getPrimaryCondition(conditions: string): string {
  return conditions.split(",")[0]?.trim() || conditions;
}

export function getMostCommonCondition(hours: WeatherHour[]): string {
  if (!hours.length) return "";
  const counts: Record<string, number> = {};
  for (const h of hours) {
    const primary = getPrimaryCondition(h.conditions);
    counts[primary] = (counts[primary] ?? 0) + 1;
  }
  const maxCount = Math.max(...Object.values(counts));
  const tied = Object.entries(counts).filter(([, c]) => c === maxCount);
  if (tied.length > 1) return "Mixed";
  return tied[0][0];
}

export function getMostCommonIcon(hours: WeatherHour[]): string {
  if (!hours.length) return "";
  const counts: Record<string, number> = {};
  for (const h of hours) {
    const icon = h.icon ?? "cloudy";
    counts[icon] = (counts[icon] ?? 0) + 1;
  }
  const maxCount = Math.max(...Object.values(counts));
  const tied = Object.entries(counts).filter(([, c]) => c === maxCount);
  if (tied.length > 1) return "Mixed";
  return tied[0][0];
}

export function getAverageTemp(hours: WeatherHour[]): number {
  if (!hours.length) return 0;
  const sum = hours.reduce((a, h) => a + h.temp, 0);
  return sum / hours.length;
}

export function getAverageWindspeed(hours: WeatherHour[]): number {
  if (!hours.length) return 0;
  const sum = hours.reduce((a, h) => a + (h.windspeed ?? 0), 0);
  return Math.round((sum / hours.length) * 10) / 10;
}

export function getAveragePrecipprob(hours: WeatherHour[]): number {
  if (!hours.length) return 0;
  const sum = hours.reduce((a, h) => a + (h.precipprob ?? 0), 0);
  return Math.round(sum / hours.length);
}

export type EventWeatherSummary = {
  condition: string;
  icon: LucideIcon;
  avgTemp: number;
  avgWindspeed: number;
  avgPrecipprob: number;
};

export function getEventWeatherSummary(
  day: { hours?: WeatherHour[] } | undefined,
  eventOfDay: string
): EventWeatherSummary | null {
  const hours = getHoursForEvent(day?.hours as WeatherHour[], eventOfDay);
  if (!hours.length) return null;

  const condition = getMostCommonCondition(hours);
  const iconId = condition === "Mixed" ? "Mixed" : (getMostCommonIcon(hours) || "cloudy");
  const icon = WEATHER_ICON_MAP[iconId] ?? Cloud;

  return {
    condition,
    icon,
    avgTemp: getAverageTemp(hours),
    avgWindspeed: getAverageWindspeed(hours),
    avgPrecipprob: getAveragePrecipprob(hours),
  };
}
