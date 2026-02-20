"use client";

import { useWeather } from "@/contexts/WeatherContext";
import { getDateForDayOfWeek } from "@/lib/date-utils";
import { useState, useEffect } from "react";

export default function WeatherCard() {
  const { location, dayOfWeek, eventOfDay } = useWeather();
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  
  useEffect(() =>{
    if(location && dayOfWeek && eventOfDay){
        const controller = new AbortController();
        setLoading(true);
  
        const date = getDateForDayOfWeek(dayOfWeek);

        fetch(`/api/weather?location=${encodeURIComponent(location)}&date=${date}`, {
            signal: controller.signal,
          })
            .then((res) => res.json())
            .then((data) => {
              setWeatherData(data ?? []);
            })
            .catch((err) => {
              if (err.name === "AbortError") return;
              setError(err.message);
            })
            .finally(() => setLoading(false));
      
          return () => controller.abort();
    }
  }, [location, dayOfWeek, eventOfDay, page]);

  console.log(weatherData);

  return (
    <div className="px-6 py-4">
      {location && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          <span className="font-medium text-zinc-900 dark:text-zinc-100">Location:</span> {location}
        </p>
      )}
      {dayOfWeek && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          <span className="font-medium text-zinc-900 dark:text-zinc-100">Day:</span> {dayOfWeek}
        </p>
      )}
      {eventOfDay && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          <span className="font-medium text-zinc-900 dark:text-zinc-100">Time:</span> {eventOfDay}
        </p>
      )}
      {!location && !dayOfWeek && !eventOfDay && (
        <p className="text-sm text-zinc-500 dark:text-zinc-500">
          Select a location and schedule to see weather
        </p>
      )}
    </div>
  );
}
