"use client";

import { useWeather } from "@/contexts/WeatherContext";
import { getDateForDayOfWeek, addDays, formatDateTitle } from "@/lib/date-utils";
import { getEventWeatherSummary } from "@/lib/weather-utils";
import { Droplets, Wind } from "lucide-react";
import { useState, useEffect } from "react";

type WeatherResponse = {
  days?: Array<{
    hours?: Array<{
      datetime: string;
      temp: number;
      conditions: string;
      windspeed: number;
      precipprob: number;
      icon: string;
    }>;
  }>;
};

export default function WeatherCard() {
  const { location, dayOfWeek, eventOfDay } = useWeather();
  const [weatherData, setWeatherData] = useState<{
    date: WeatherResponse;
    nextDate: WeatherResponse;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (location && dayOfWeek && eventOfDay) {
      const controller = new AbortController();
      setLoading(true);
      setWeatherData(null);

      const date = getDateForDayOfWeek(dayOfWeek);
      const nextDate = addDays(date, 7);

      Promise.all([
        fetch(`/api/weather?location=${encodeURIComponent(location)}&date=${date}&iconSet=icons1`, {
          signal: controller.signal,
        }).then((res) => res.json()),
        fetch(`/api/weather?location=${encodeURIComponent(location)}&date=${nextDate}&iconSet=icons1`, {
          signal: controller.signal,
        }).then((res) => res.json()),
      ])
        .then(([dateData, nextDateData]) => {
          setWeatherData({
            date: dateData ?? {},
            nextDate: nextDateData ?? {},
          });
        })
        .catch((err) => {
          if (err.name === "AbortError") return;
          setError(err.message);
        })
        .finally(() => setLoading(false));

      return () => controller.abort();
    }
  }, [location, dayOfWeek, eventOfDay]);

  if (!location || !dayOfWeek || !eventOfDay) {
    return (
      <div className="px-6 py-4">
        <p className="text-sm text-zinc-500 dark:text-zinc-500">
          Select a location and schedule to see weather
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="px-6 py-4">
        <p className="text-sm text-zinc-500 dark:text-zinc-500">Loading weather...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-4">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  const date = getDateForDayOfWeek(dayOfWeek);
  const nextDate = addDays(date, 7);
  const dateTitle = formatDateTitle(date, dayOfWeek, false);
  const nextDateTitle = formatDateTitle(nextDate, dayOfWeek, true);

  const dayDate = weatherData?.date?.days?.[0];
  const dayNextDate = weatherData?.nextDate?.days?.[0];

  const summaryDate = getEventWeatherSummary(dayDate, eventOfDay);
  const summaryNextDate = getEventWeatherSummary(dayNextDate, eventOfDay);

  return (
    <div className="px-6 py-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-3 text-center text-xl font-semibold text-red-500 dark:text-red-400">{dateTitle}</h3>
          {summaryDate ? (
            <div className="flex justify-center gap-3">
              {(() => {
                const Icon = summaryDate.icon;
                return <Icon className="size-20 shrink-0 text-zinc-600 dark:text-zinc-400" />;
              })()}
              <div className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
                <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                  <span>{summaryDate.condition}</span>{" "}
                  <span>{Math.round(summaryDate.avgTemp)}°F</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Wind className="size-3.5 shrink-0" />
                  winds {summaryDate.avgWindspeed.toFixed(1)} mph
                </p>
                <p className="flex items-center gap-1.5">
                  <Droplets className="size-3.5 shrink-0" />
                  {Math.round(summaryDate.avgPrecipprob) === 0
                    ? "No rain"
                    : `${Math.round(summaryDate.avgPrecipprob)}% chance rain`}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-zinc-500">No data for this time range</p>
          )}
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="mb-3 text-center text-xl font-semibold text-zinc-900 dark:text-zinc-100">{nextDateTitle}</h3>

          {summaryNextDate ? (
            <div className="flex justify-center gap-3">
              {(() => {
                const Icon = summaryNextDate.icon;
                return <Icon className="size-20 shrink-0 text-zinc-600 dark:text-zinc-400" />;
              })()}
              <div className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
                <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                  <span>{summaryNextDate.condition}</span>{" "}
                  <span>{Math.round(summaryNextDate.avgTemp)}°F</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Wind className="size-3.5 shrink-0" />
                  winds {summaryNextDate.avgWindspeed.toFixed(1)} mph
                </p>
                <p className="flex items-center gap-1.5">
                  <Droplets className="size-3.5 shrink-0" />
                  {Math.round(summaryNextDate.avgPrecipprob) === 0
                    ? "No rain"
                    : `${Math.round(summaryNextDate.avgPrecipprob)}% chance rain`}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-zinc-500">No data for this time range</p>
          )}
        </div>
      </div>
    </div>
  );
}
