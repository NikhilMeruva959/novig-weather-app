"use client";

import { useAuth } from "@clerk/nextjs";
import {
  createContext,
  useContext,
  useEffect,
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
  const { isLoaded, isSignedIn } = useAuth();
  const [location, setLocation] = useState<string | null>(null);
  const [dayOfWeek, setDayOfWeek] = useState<string | undefined>(undefined);
  const [eventOfDay, setEventOfDay] = useState<string | undefined>(undefined);

  // Step 11: Fetch and apply last location when user signs in
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    fetch("/api/user/last-location")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const loc = data?.lastSearchedLocation;
        if (typeof loc === "string" && loc.length > 0) {
          setLocation(loc);
        }
      })
      .catch(() => {});
  }, [isLoaded, isSignedIn]);

  // Step 10: Clear location, dayOfWeek, and eventOfDay when user signs out
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      setLocation(null);
      setDayOfWeek(undefined);
      setEventOfDay(undefined);
    }
  }, [isLoaded, isSignedIn]);

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
