import Link from "next/link";

export default function HelpPage() {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-8 pt-20 pb-16 dark:bg-black">
      <div className="w-full max-w-2xl">
        <h1 className="mb-8 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Help
        </h1>

        <section className="mb-8">
          <h2 className="mb-3 text-lg font-medium text-zinc-900 dark:text-zinc-100">
            What is WHETHER.IO?
          </h2>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            WHETHER.IO helps you plan around the weather for recurring weekly activities. Whether you
            have a standing Monday morning run, a Wednesday afternoon soccer game, or a Sunday
            evening walk, you can quickly see the forecast for multiple weeks so you know
            what to expect.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-lg font-medium text-zinc-900 dark:text-zinc-100">
            What do I need to input?
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            To get your weather forecast, you need to provide three things:
          </p>
          <ul className="space-y-5 text-sm">
            <li className="flex flex-col gap-1.5">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                1. Location
              </span>
              <span className="leading-relaxed text-zinc-600 dark:text-zinc-400">
                Search for a city, address, or place (e.g., &quot;San Francisco&quot; or
                &quot;Central Park, New York&quot;). Start typing and select a suggestion from the
                dropdown. You can clear your selection with the X button.
              </span>
            </li>
            <li className="flex flex-col gap-1.5">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                2. Day of week
              </span>
              <span className="leading-relaxed text-zinc-600 dark:text-zinc-400">
                Choose which day your activity happens: Monday, Tuesday, Wednesday, Thursday,
                Friday, Saturday, or Sunday. The app uses the next occurrence of that day (e.g., if
                today is Thursday and you pick Monday, you&apos;ll see next Monday&apos;s weather).
              </span>
            </li>
            <li className="flex flex-col gap-1.5">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                3. Time of day
              </span>
              <span className="leading-relaxed text-zinc-600 dark:text-zinc-400">
                Pick when your activity typically occurs: Morning (8am–12pm), Afternoon (12pm–5pm),
                or Evening (5pm–9pm). This helps narrow the forecast to the most relevant hours.
              </span>
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-lg font-medium text-zinc-900 dark:text-zinc-100">
            What will I see?
          </h2>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Once you&apos;ve selected a location, day, and time, the app fetches weather data for that
            date and for the same day one week later. You can use this to compare conditions between
            weeks for your recurring activities.
          </p>
        </section>

        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-100"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
