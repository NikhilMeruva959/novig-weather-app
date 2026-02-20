"use client";

import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
const EVENTS_OF_DAY = [
  { label: "Morning", time: "8am - 12pm", value: "Morning (8am - 12pm)" },
  { label: "Afternoon", time: "12pm - 5pm", value: "Afternoon (12pm - 5pm)" },
  { label: "Evening", time: "5pm - 9pm", value: "Evening (5pm - 9pm)" },
] as const;

type DayOfWeek = (typeof DAYS_OF_WEEK)[number];
type EventOfDay = (typeof EVENTS_OF_DAY)[number]["value"];

export default function ScheduleSelector() {
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek | undefined>(undefined);
  const [eventOfDay, setEventOfDay] = useState<EventOfDay | undefined>(undefined);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-9 w-[180px] justify-between border-zinc-200 font-normal dark:border-zinc-800"
          >
            <span className={!dayOfWeek ? "text-muted-foreground" : ""}>
              {dayOfWeek ?? "Day of week"}
            </span>
            <ChevronDownIcon className="size-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-[180px] border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
        >
          {DAYS_OF_WEEK.map((day) => (
            <DropdownMenuItem
              key={day}
              onSelect={() => setDayOfWeek(day)}
              className="focus:bg-zinc-100 hover:bg-zinc-100 dark:focus:bg-zinc-800 dark:hover:bg-zinc-800"
            >
              {day}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-9 w-[220px] justify-between border-zinc-200 font-normal dark:border-zinc-800"
          >
            <span className={!eventOfDay ? "text-muted-foreground" : ""}>
              {eventOfDay ?? "Time of day"}
            </span>
            <ChevronDownIcon className="size-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-[220px] border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
        >
          {EVENTS_OF_DAY.map((event) => (
              <DropdownMenuItem
                key={event.label}
                onSelect={() => setEventOfDay(event.value)}
                className="focus:bg-zinc-100 hover:bg-zinc-100 dark:focus:bg-zinc-800 dark:hover:bg-zinc-800"
              >
                <span className="flex w-full justify-between gap-4">
                  <span>{event.label}</span>
                  <span className="text-muted-foreground shrink-0">({event.time})</span>
                </span>
              </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
