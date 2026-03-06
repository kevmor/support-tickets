import "server-only";

import { dbQuery } from "@/app/lib/db";

export interface TicketStats {
  open: number;
  inProgress: number;
  highPriority: number;
  overdue: number;
  closedToday: number;
  total: number;
}

export async function fetchTicketStats(): Promise<TicketStats> {
  const [row] = await dbQuery<{
    open: number;
    inProgress: number;
    highPriority: number;
    overdue: number;
    closedToday: number;
    total: number;
  }>(`
    SELECT
      SUM(status = 2)                                                          AS \`open\`,
      SUM(status = 1)                                                          AS inProgress,
      SUM(status = 4 AND priority >= 70)                                   AS highPriority,
      SUM(status IN (1,2) AND date_due IS NOT NULL AND date_due < NOW())        AS overdue,
      SUM(status = 4 AND DATE(closed) = CURDATE())                             AS closedToday,
      COUNT(*)                                                                  AS total
    FROM tickets
  `);

  return {
    open: Number(row?.open ?? 0),
    inProgress: Number(row?.inProgress ?? 0),
    highPriority: Number(row?.highPriority ?? 0),
    overdue: Number(row?.overdue ?? 0),
    closedToday: Number(row?.closedToday ?? 0),
    total: Number(row?.total ?? 0),
  };
}
