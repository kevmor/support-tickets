"use client";

import Link from "next/link";
import { Category, Ticket } from "../lib/definitions";
import { useRouter, useSearchParams } from "next/navigation";
import { getPriorityBadge, STATUS_MAP, formatDate } from "@/app/shared/helpers";
import TicketListHeader from "./TicketListHeader";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import EditTicketDropDownMenu from "./EditTicketDropDownMenu";

type Props = {
  tickets: Ticket[];
  page: number;
  total: number;
  perPage?: number;
  basePath?: string;
  categories: Category[];
  sort?: string;
  dir?: string;
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

function renderPageLinks(page: number, totalPages: number) {
  const items: (number | "ellipsis")[] = [];

  items.push(1); // first page
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  if (start > 2) items.push("ellipsis");

  for (let p = start; p <= end; p++) {
    items.push(p);
  }

  if (end < totalPages - 1) items.push("ellipsis");

  if (totalPages > 1) items.push(totalPages); // last page

  return items;
}

export default function TicketList({
  tickets,
  page,
  total,
  perPage = 20,
  basePath = "/",
  categories,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort");
  const currentDir = searchParams.get("dir");

  function toggleSort(column: string) {
    const params = new URLSearchParams(searchParams.toString());
    const currentSort = params.get("sort");
    const currentDir = params.get("dir");

    if (currentSort === column) {
      if (currentDir === "asc") {
        params.set("dir", "desc");
      } else {
        params.set("dir", "asc");
      }
    } else {
      params.set("sort", column);
      params.set("dir", "asc");
    }
    params.delete("page"); // reset to first page on filter/sort change
    router.push(`?${params.toString()}`);
  }

  const pageLink = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    return `${basePath}${basePath.includes("?") ? "&" : "?"}${params.toString()}`;
  };

  function renderSortHeader(column: string, label: string) {
    const isActive = currentSort === column;
    const arrow = isActive ? (currentDir === "asc" ? "↑" : "↓") : "";

    return (
      <button
        onClick={() => toggleSort(column)}
        className={`hover:underline hover:text-zinc-900 dark:hover:text-zinc-100 `}
      >
        {label}{" "}
        <span className={`${isActive ? "text-blue-500" : "text-zinc-400"}`}>
          {arrow}
        </span>
      </button>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {/* Ticket List Header */}
      <TicketListHeader categories={categories} />
      {/* Show ticket list */}
      {tickets.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-zinc-400">
          No open tickets - you&apos;re all caught up!
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50 text-left dark:border-zinc-800 dark:bg-zinc-950">
                <th className="px-5 py-2.5 font-medium text-zinc-500 dark:text-zinc-400">
                  {renderSortHeader("id", "ID")}
                </th>
                <th className="px-5 py-2.5 font-medium text-zinc-500 dark:text-zinc-400">
                  {renderSortHeader("title", "Title")}
                </th>
                <th className="px-5 py-2.5 font-medium text-zinc-500 dark:text-zinc-400">
                  {renderSortHeader("category", "Category")}
                </th>
                <th className="px-5 py-2.5 font-medium text-zinc-500 dark:text-zinc-400">
                  {renderSortHeader("kerberos_requester", "Requester")}
                </th>
                <th className="px-5 py-2.5 font-medium text-zinc-500 dark:text-zinc-400">
                  {renderSortHeader("priority", "Priority")}
                </th>
                <th className="px-5 py-2.5 font-medium text-zinc-500 dark:text-zinc-400">
                  {renderSortHeader("priority", "Priority #")}
                </th>
                <th className="px-5 py-2.5 font-medium text-zinc-500 dark:text-zinc-400">
                  {renderSortHeader("status", "Status")}
                </th>
                <th className="px-5 py-2.5 font-medium text-zinc-500 dark:text-zinc-400">
                  {renderSortHeader("created", "Opened")}
                </th>
                <th className="px-5 py-2.5 font-medium text-zinc-500 dark:text-zinc-400">
                  {renderSortHeader("last_comment_date", "Last Comment")}
                </th>
                <th className="px-3 py-2.5"></th>
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
                    <td className="px-5 py-3 font-mono text-sm text-zinc-400 dark:text-zinc-500">
                      {ticket.id}
                    </td>
                    <td className="max-w-xs px-5 py-3">
                      <Link
                        href={`/ticket/${ticket.id}`}
                        className="font-medium text-zinc-900 hover:text-blue-600 hover:underline dark:text-zinc-100 dark:hover:text-blue-400"
                      >
                        {ticket.title}
                      </Link>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 whitespace-pre-wrap overflow-hidden line-clamp-2">
                        {ticket.msg}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      {ticket.categories?.map((cat) => {
                        const colors = [
                          "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
                          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                          "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
                          "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
                          "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
                          "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
                          "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
                        ];
                        let h = 0;
                        for (let i = 0; i < cat.name.length; i++) {
                          h = (Math.imul(31, h) + cat.name.charCodeAt(i)) | 0;
                        }
                        const colorClass = colors[Math.abs(h) % colors.length];
                        return (
                          <span
                            key={cat.id}
                            className={`inline-block mr-1 rounded-full px-2 py-0.5 text-xs font-medium ${colorClass}`}
                            title={cat.name}
                          >
                            {cat.name.split(" ")[0]}
                          </span>
                        );
                      })}
                    </td>
                    <td className="px-5 py-3 text-zinc-600 dark:text-zinc-400">
                      {ticket.kerberos_requester}
                    </td>
                    <td className="px-5 py-3">
                      <Badge {...getPriorityBadge(ticket.priority)} />
                    </td>
                    <td className="px-5 py-3">{ticket.priority}</td>
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
                    <td className="px-5 py-3 text-zinc-500 dark:text-zinc-400">
                      {formatDate(ticket.last_comment_date)}
                    </td>
                    <td>
                      <EditTicketDropDownMenu
                        ticket={ticket}
                        categories={categories}
                      />
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

        <Pagination>
          <PaginationContent>
            <PaginationPrevious
              href={pageLink(page - 1)}
              aria-disabled={!hasPrev}
              onClick={(e) => {
                e.preventDefault();
                if (hasPrev) router.push(pageLink(page - 1));
              }}
            />
            {renderPageLinks(page, totalPages).map((p, i) => {
              if (p === "ellipsis") {
                return (
                  <li key={`ellipsis-${i}`}>
                    <PaginationEllipsis />
                  </li>
                );
              }
              return (
                <li key={p}>
                  <PaginationLink
                    href={pageLink(p)}
                    isActive={p === page}
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(pageLink(p));
                    }}
                  >
                    {p}
                  </PaginationLink>
                </li>
              );
            })}
            <PaginationNext
              href={pageLink(page + 1)}
              aria-disabled={!hasNext}
              onClick={(e) => {
                e.preventDefault();
                if (hasNext) router.push(pageLink(page + 1));
              }}
            />
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
