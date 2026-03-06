import "server-only";

import { dbQuery, DbParam } from "@/app/lib/db";
import { Ticket } from "@/app/lib/definitions";

interface FilterProps {
  status: number;
  minPriority?: number;
}

export async function fetchTickets(
  filter?: FilterProps,
  page = 1,
  perPage = 10,
): Promise<{ tickets: Ticket[]; total: number }> {
  const offset = (page - 1) * perPage;

  let whereParts: string[] = [];
  const params: DbParam[] = [];

  if (filter?.status != null) {
    whereParts.push("status = ?");
    params.push(filter.status);
  }

  if (filter?.minPriority != null) {
    whereParts.push("priority >= ?");
    params.push(filter.minPriority);
  }

  const whereClause = whereParts.length
    ? `WHERE ${whereParts.join(" AND ")}`
    : "";

  try {
    const ticketList = await dbQuery<Ticket>(
      `SELECT t.id, title, msg, kerberos_requester, created, date_due, closed, status, priority,
                          (SELECT created
                           FROM tickets_comments
                           WHERE ticket_id = t.id
                           ORDER BY created DESC
                           LIMIT 1) AS last_comment_date
                       FROM tickets t
                       LEFT JOIN category_tags ct ON ct.ticket_id = t.id
                       LEFT JOIN categories c ON c.id = ct.category_id
                       ${whereClause}
                       ORDER BY status DESC, closed DESC
                       LIMIT ? OFFSET ?`,
      [...params, perPage, offset],
    );

    const [countResult] = await dbQuery<{ count: number }>(
      `
      SELECT COUNT(*) AS count
      FROM tickets t
      ${whereClause}`,
      params,
    );
    const count = countResult?.count ?? 0;

    return { tickets: ticketList, total: count };
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }
}
