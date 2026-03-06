"use client";

import { usePathname, useRouter } from "next/navigation";

export default function HelpRequestButton() {
  const router = useRouter();
  const path = usePathname();

  const isHelpPath = path === "/help";

  return (
    <button
      onClick={() => router.push("/help")}
      aria-label="Create new help request"
      disabled={isHelpPath}
      className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 shadow-sm transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-blue-500 dark:hover:bg-blue-950 dark:hover:text-blue-300 dark:disabled:text-zinc-600 disabled:text-zinc-300"
    >
      New Help Request
    </button>
  );
}
