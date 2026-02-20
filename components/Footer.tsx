import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white px-4 py-6 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          © {new Date().getFullYear()} WHETHER.IO
        </p>
        <div className="flex gap-6 text-sm text-zinc-500 dark:text-zinc-400">
          <Link href="/help" className="hover:text-zinc-900 dark:hover:text-zinc-100">
            Help
          </Link>
        </div>
      </div>
    </footer>
  );
}
