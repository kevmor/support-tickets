export function formatDate(d: Date | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const STATUS_MAP: Record<number, { label: string; className: string }> =
  {
    1: {
      label: "In Progress",
      className:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
    },
    2: {
      label: "Open",
      className:
        "bg-blue-100   text-blue-700   dark:bg-blue-950  dark:text-blue-300",
    },
    3: {
      label: "Pending",
      className:
        "bg-zinc-100   text-zinc-600   dark:bg-zinc-800  dark:text-zinc-400",
    },
    4: {
      label: "Closed",
      className:
        "bg-green-100  text-green-700  dark:bg-green-950 dark:text-green-300",
    },
  };

export function getPriorityBadge(value: number) {
  if (value <= 20) {
    return {
      label: "Not urgent",
      className:
        "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
      title: "Not urgent (Whenever there is extra time, probably never ;))",
    };
  } else if (value <= 40) {
    return {
      label: "Low",
      className:
        "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
      title: "Low priority (Eventually, sometime)",
    };
  } else if (value <= 60) {
    return {
      label: "Medium",
      className:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
      title:
        "Medium priority (After high priority projects, or split time resolving medium tickets)",
    };
  } else if (value <= 80) {
    return {
      label: "High",
      className:
        "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
      title: "High priority (Alongside high priority projects)",
    };
  } else if (value <= 90) {
    return {
      label: "Urgent",
      className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
      title: "Urgent priority (Needs immediate attention)",
    };
  } else {
    return {
      label: "Critical",
      className: "bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200",
      title:
        "Critical priority (blocker to all other requests, usually security or critical business function related)",
    };
  }
}
