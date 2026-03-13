"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "../lib/definitions";
import { STATUS_MAP } from "../shared/helpers";

export default function TicketListHeader({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearchValue = searchParams.get("search") ?? "";
  const [searchValue, setSearchValue] = useState(currentSearchValue);

  const updateParam = useCallback(
    (key: string, value: string, replace = false) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      params.delete("page"); // reset to first page on filter/sort change
      const nextUrl = `?${params.toString()}`;

      if (replace) {
        router.replace(nextUrl);
        return;
      }

      router.push(nextUrl);
    },
    [router, searchParams],
  );

  useEffect(() => {
    setSearchValue(currentSearchValue);
  }, [currentSearchValue]);

  useEffect(() => {
    const nextSearchValue = searchValue.trim();
    if (nextSearchValue === currentSearchValue) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      updateParam("search", nextSearchValue, true);
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [currentSearchValue, searchValue, updateParam]);

  return (
    <>
      {/* header */}
      <div
        className="flex flex-col md:flex-row md:items-center md:justify-between
                    border-b border-zinc-200 px-5 py-3 dark:border-zinc-800
                    gap-3"
      >
        {/* left side – title + search */}
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl lg:mr-8 font-semibold text-zinc-900 dark:text-zinc-100">
            Tickets
          </h2>
          <div className="text-xs flex-shrink">
            <input
              name="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              type="text"
              className="w-full max-w-xs rounded-md border border-zinc-300
                       bg-white px-2 py-1 text-xs text-zinc-600
                       dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
              placeholder="Search tickets or ticket #"
            />
          </div>
        </div>

        {/* right side – filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <label className="flex items-center gap-1">
            Category:
            <select
              onChange={(e) => updateParam("category", e.target.value)}
              defaultValue={searchParams.get("category") ?? "all"}
              className="ml-1 rounded-md border border-zinc-300 bg-white px-2 py-1
                       text-xs text-zinc-600 dark:border-zinc-600
                       dark:bg-zinc-800 dark:text-zinc-300"
            >
              <option value="all">All</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-1">
            Status:
            <select
              onChange={(e) => updateParam("status", e.target.value)}
              defaultValue={searchParams.get("status") ?? "2"}
              className="ml-1 rounded-md border border-zinc-300 bg-white px-2 py-1
                       text-xs text-zinc-600 dark:border-zinc-600
                       dark:bg-zinc-800 dark:text-zinc-300"
            >
              <option value="all">All</option>
              {Object.entries(STATUS_MAP).map(([k, { label }]) => (
                <option key={k} value={k}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          {/* <label className="flex items-center gap-1">
            Sort:
            <select
              name="sort"
              defaultValue={searchParams.get("sort") ?? "priority"}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="ml-1 rounded-md border border-zinc-300 bg-white px-2 py-1
                       text-xs text-zinc-600 dark:border-zinc-600
                       dark:bg-zinc-800 dark:text-zinc-300"
            >
              {Object.entries(SORTS).map(([key, { label }]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label> */}

          <label className="flex items-center gap-1">
            Show:
            <select
              name="show"
              defaultValue={searchParams.get("show") ?? "10"}
              onChange={(e) => updateParam("show", e.target.value)}
              className="ml-1 rounded-md border border-zinc-300 bg-white px-2 py-1
                       text-xs text-zinc-600 dark:border-zinc-600
                       dark:bg-zinc-800 dark:text-zinc-300"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </label>

          {/* <Link
            href="/ticket-list"
            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5
                       text-xs font-medium text-zinc-600 shadow-sm
                       transition-colors hover:border-blue-400 hover:bg-blue-50
                       hover:text-blue-700 dark:border-zinc-600
                       dark:bg-zinc-800 dark:text-zinc-300
                       dark:hover:border-blue-500 dark:hover:bg-blue-950
                       dark:hover:text-blue-300"
          >
            View all
          </Link> */}
        </div>
      </div>
    </>
  );
}
