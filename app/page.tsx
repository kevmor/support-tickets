import StatCard from "./components/StatCard";
import { fetchCategories } from "./lib/references";
import { fetchTicketStats } from "./lib/ticketStats";
import TicketList from "@/app/components/TicketList";
import { fetchTickets } from "@/app/lib/tickets";
import { Button } from "@/components/ui/button";

const PER_PAGE = 10;
const MIN_PRIORITY = 0;

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    status?: string;
    category?: string;
    sort?: string;
    dir?: string;
    show?: string;
    search?: string;
  }>;
}) {
  const {
    page: pageParam,
    status: statusParam,
    category: categoryParam,
    sort: sortParam,
    dir: dirParam,
    show: showParam,
    search: searchParam,
  } = await searchParams;
  const currentPage = Math.max(1, Number(pageParam) || 1);
  const perPage = Number(showParam) || PER_PAGE;
  // const status = statusParam || 2; // default to "Open"

  const [stats, { tickets: recentTickets, total: recentTotal }] =
    await Promise.all([
      fetchTicketStats(),
      fetchTickets(
        {
          minPriority: MIN_PRIORITY,
          category: categoryParam,
          status: statusParam,
          sort: sortParam,
          dir: dirParam,
          search: searchParam,
        },
        currentPage,
        perPage,
      ),
    ]);

  const categories = await fetchCategories();

  return (
    <main className="mx-auto space-y-6 p-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Dashboard
        </h1>
        <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
          Help ticket overview
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Open Tickets"
          value={stats.open}
          accent="blue"
          sub={`${stats.inProgress} in progress`}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
              <path d="M13 5v2M13 17v2M13 11v2" />
            </svg>
          }
        />
        <StatCard
          label="High Priority"
          value={stats.highPriority}
          accent="yellow"
          sub="high or critical"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          }
        />
        {/* <StatCard
          label="Overdue"
          value={stats.overdue}
          accent="red"
          sub="past due date"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          }
        /> */}
        <StatCard
          label="Closed Today"
          value={stats.closedToday}
          accent="green"
          sub={`${stats.total} total tickets`}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          }
        />
      </div>

      <TicketList
        tickets={recentTickets}
        total={recentTotal}
        page={currentPage}
        perPage={PER_PAGE}
        categories={categories}
      />
    </main>
  );
}
