import { WeatherProvider } from "@/contexts/WeatherContext";
import LocationPicker from "@/components/LocationPicker";
import ScheduleSelector from "@/components/ScheduleSelector";
import WeatherCard from "@/components/WeatherCard";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <WeatherProvider>
      <div className="flex flex-1 flex-col items-center justify-start bg-zinc-50 px-8 pt-20 pb-4 dark:bg-black">
        <div className="w-full max-w-5xl">
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
            <LocationPicker />
            <ScheduleSelector />
          </div>
          <Separator className="mt-6 bg-black dark:bg-black" />
          <WeatherCard />
        </div>
      </div>
    </WeatherProvider>
  );
}
