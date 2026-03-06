import "server-only";

import { dbQuery, DbParam } from "@/app/lib/db";
import { Ticket } from "@/app/lib/definitions";

interface FilterProps {
  status: number;
}

export async function fetchRecentTickets(
  filter?: FilterProps,
): Promise<Ticket[]> {
  try {
    const whereClause = filter ? `WHERE status = 1` : "";

    const ticketList = await dbQuery<Ticket>(
      `SELECT * FROM tickets ${whereClause}
      ORDER BY created DESC
      LIMIT 10`,
      filter ? [filter.status] : ([] as DbParam[]),
    );
    return ticketList;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }
}
