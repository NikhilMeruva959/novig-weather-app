"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

type WeatherContextType = {
  location: string | null;
  setLocation: (location: string | null) => void;
  dayOfWeek: string | undefined;
  setDayOfWeek: (day: string | undefined) => void;
  eventOfDay: string | undefined;
  setEventOfDay: (event: string | undefined) => void;
};

const WeatherContext = createContext<WeatherContextType | null>(null);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<string | null>(null);
  const [dayOfWeek, setDayOfWeek] = useState<string | undefined>(undefined);
  const [eventOfDay, setEventOfDay] = useState<string | undefined>(undefined);

  return (
    <WeatherContext.Provider
      value={{
        location,
        setLocation,
        dayOfWeek,
        setDayOfWeek,
        eventOfDay,
        setEventOfDay,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeather must be used within a WeatherProvider");
  }
  return context;
}
