interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent: "blue" | "yellow" | "red" | "green" | "zinc";
  sub?: string;
}

const accentMap = {
  blue: {
    card: "border-blue-200 dark:border-blue-900",
    icon: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
    value: "text-blue-700 dark:text-blue-300",
  },
  yellow: {
    card: "border-yellow-200 dark:border-yellow-900",
    icon: "bg-yellow-100 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400",
    value: "text-yellow-700 dark:text-yellow-300",
  },
  red: {
    card: "border-red-200 dark:border-red-900",
    icon: "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400",
    value: "text-red-700 dark:text-red-300",
  },
  green: {
    card: "border-green-200 dark:border-green-900",
    icon: "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400",
    value: "text-green-700 dark:text-green-300",
  },
  zinc: {
    card: "border-zinc-200 dark:border-zinc-700",
    icon: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
    value: "text-zinc-700 dark:text-zinc-300",
  },
};

export default function StatCard({
  label,
  value,
  icon,
  accent,
  sub,
}: StatCardProps) {
  const a = accentMap[accent];
  return (
    <div
      className={`flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm dark:bg-zinc-900 ${a.card}`}
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${a.icon}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {label}
        </p>
        <p className={`text-2xl font-bold leading-tight ${a.value}`}>{value}</p>
        {sub && (
          <p className="text-xs text-zinc-400 dark:text-zinc-500">{sub}</p>
        )}
      </div>
    </div>
  );
}
