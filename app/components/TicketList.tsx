import Link from "next/link";
import { Ticket } from "../lib/definitions";
import { getPriorityBadge, STATUS_MAP, formatDate } from "@/app/shared/helpers";

type Props = {
  tickets: Ticket[];
  page: number;
  total: number;
  perPage?: number;
  basePath?: string;
};

function Badge({
  label,
  className,
  title,
}: {
  label: string;
  className: string;
  title?: string;
}) {
  return (
    <span
      title={title}
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}

export default function RecentTickets({
  tickets,
  page,
  total,
  perPage = 20,
  basePath = "/",
}: Props) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const pageLink = (p: number) =>
    `${basePath}${basePath.includes("?") ? "&" : "?"}page=${p}`;
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {/* header */}
      <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3 dark:border-zinc-800">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Tickets
        </h2>
        <div className="text-xs">
          <input
            type="text"
            className="ml-2 rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs  text-zinc-600 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 "
            placeholder="Search tickets..."
          />
        </div>
        <div className="text-xs">
          Category:
          <select
            name="category"
            className="ml-2 rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs  text-zinc-600 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 "
          >
            <option value="all">All</option>
          </select>
        </div>
        <div className="text-xs">
          Sort by:
          <select
            name="sort"
            className="ml-2 rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs  text-zinc-600 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 "
          >
            <option value="priority">Priority (highest first)</option>
            <option value="updated">Updated (latest first)</option>
            <option value="created_desc">Created (newest first)</option>
          </select>
        </div>
        <div className="text-xs">
          Show:
          <select
            name="show"
            className="ml-2 rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs  text-zinc-600 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 "
          >
            <option value="20">20</option>
          </select>
        </div>
        <Link
          href="/ticket-list"
          className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 shadow-sm transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-blue-500 dark:hover:bg-blue-950 dark:hover:text-blue-300"
        >
          View all
        </Link>
      </div>

      {tickets.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-zinc-400">
          No open tickets — you're all caught up!
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50 text-left dark:border-zinc-800 dark:bg-zinc-950">
                <th className="px-5 py-2.5 font-medium text-zinc-500 dark:text-zinc-400">
                  #
                </th>
                <th className="px-5 py-2.5 font-medium text-zinc-500 dark:text-zinc-400">
                  Title
                </th>
                <th className="px-5 py-2.5 font-medium text-zinc-500 dark:text-zinc-400">
                  Requester
                </th>
                <th className="px-5 py-2.5 font-medium text-zinc-500 dark:text-zinc-400">
                  Priority
                </th>
                <th className="px-5 py-2.5 font-medium text-zinc-500 dark:text-zinc-400">
                  Status
                </th>
                <th className="px-5 py-2.5 font-medium text-zinc-500 dark:text-zinc-400">
                  Opened
                </th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket: Ticket, i: number) => {
                return (
                  <tr
                    key={ticket.id}
                    className={`border-b border-zinc-100 transition-colors last:border-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50 ${
                      i % 2 === 1 ? "bg-zinc-50/50 dark:bg-zinc-900/50" : ""
                    }`}
                  >
                    <td className="px-5 py-3 font-mono text-xs text-zinc-400 dark:text-zinc-500">
                      {ticket.id}
                    </td>
                    <td className="max-w-xs px-5 py-3">
                      <Link
                        href={`/ticket/${ticket.id}`}
                        className="font-medium text-zinc-900 hover:text-blue-600 hover:underline dark:text-zinc-100 dark:hover:text-blue-400"
                      >
                        {ticket.title}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-zinc-600 dark:text-zinc-400">
                      {ticket.kerberos_requester}
                    </td>
                    <td className="px-5 py-3">
                      <Badge {...getPriorityBadge(ticket.priority)} />
                    </td>
                    <td className="px-5 py-3">
                      <Badge
                        {...(STATUS_MAP[ticket.status] ?? {
                          label: String(ticket.status),
                          className: "",
                        })}
                      />
                    </td>
                    <td className="px-5 py-3 text-zinc-500 dark:text-zinc-400">
                      {formatDate(ticket.created)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination footer */}
      <div className="flex items-center justify-between border-t border-zinc-200 px-5 py-3 dark:border-zinc-800">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Page {page} of {totalPages}
          <span className="ml-2 text-zinc-400 dark:text-zinc-500">
            ({total} ticket{total !== 1 ? "s" : ""})
          </span>
        </p>
        <div className="flex gap-2">
          {hasPrev ? (
            <Link
              href={pageLink(page - 1)}
              className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 shadow-sm transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-blue-500 dark:hover:bg-blue-950 dark:hover:text-blue-300"
            >
              &larr; Prev
            </Link>
          ) : (
            <span className="cursor-not-allowed rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-600">
              &larr; Prev
            </span>
          )}
          {hasNext ? (
            <Link
              href={pageLink(page + 1)}
              className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 shadow-sm transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-blue-500 dark:hover:bg-blue-950 dark:hover:text-blue-300"
            >
              Next &rarr;
            </Link>
          ) : (
            <span className="cursor-not-allowed rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-600">
              Next &rarr;
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
