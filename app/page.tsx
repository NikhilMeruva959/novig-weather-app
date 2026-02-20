import { Separator } from "@/components/ui/separator";
import LocationPicker from "@/components/LocationPicker";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-8 py-4 dark:bg-black">
      <div className="w-full max-w-4xl bg-zinc-200 dark:bg-zinc-900">
        <div className="pl-6">
          <LocationPicker />
        </div>
        <Separator className="mt-6 bg-black dark:bg-black" />
      </div>
    </div>
  );
}
