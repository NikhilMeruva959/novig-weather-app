import { Separator } from "@/components/ui/separator";
import LocationPicker from "@/components/LocationPicker";
import ScheduleSelector from "@/components/ScheduleSelector";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-start bg-zinc-50 px-8 pt-20 pb-4 dark:bg-black">
      <div className="w-full max-w-4xl bg-zinc-200 dark:bg-zinc-900">
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
          <LocationPicker />
          <ScheduleSelector />
        </div>
        <Separator className="mt-6 bg-black dark:bg-black" />
      </div>
    </div>
  );
}
