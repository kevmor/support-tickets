import "server-only";

import { dbQuery, DbParam } from "@/app/lib/db";
import { Ticket, Category, TicketComment } from "@/app/lib/definitions";
import { SORT_COLUMNS, SORT_DIRS } from "../shared/helpers";
import { fetchTicketComments } from "./ticketComments";

interface FilterProps {
  status?: string;
  minPriority?: number;
  category?: string;
  sort?: string;
  dir?: string;
  search?: string;
}

const isNumeric = (value: any) => !isNaN(value) && value.trim() !== "";

export async function fetchTickets(
  filter?: FilterProps,
  page = 1,
  perPage = 10,
): Promise<{ tickets: Ticket[]; total: number }> {
  // pagination
  const offset = (page - 1) * perPage;

  // params
  let whereParts: string[] = [];
  const params: DbParam[] = [];

  if (filter?.status == null) {
    whereParts.push("status = ?");
    params.push(2); // default to "Open"
  } else if (filter.status !== "all") {
    whereParts.push("status = ?");
    params.push(filter.status);
  }

  if (filter?.minPriority != null) {
    whereParts.push("priority >= ?");
    params.push(filter.minPriority);
  }

  if (filter?.category != null && filter.category !== "all") {
    whereParts.push("c.id = ?");
    params.push(filter.category);
  }

  if (filter?.search != null) {
    if (isNumeric(filter.search)) {
      whereParts.push("(t.id = ? OR t.title LIKE ? OR t.msg LIKE ?)");
      params.push(filter.search, `%${filter.search}%`, `%${filter.search}%`);
    } else {
      whereParts.push("(t.title LIKE ? OR t.msg LIKE ?)");
      params.push(`%${filter.search}%`, `%${filter.search}%`);
    }
  }

  const sortCol = SORT_COLUMNS[filter?.sort ?? ""] ?? "t.created";
  const sortDir = SORT_DIRS.has(filter?.dir ?? "") ? filter!.dir : "desc";

  const whereClause = whereParts.length
    ? `WHERE ${whereParts.join(" AND ")}`
    : "";

  const query = `SELECT
          t.id,
          title,
          msg,
          kerberos_requester,
          created,
          date_due,
          closed,
          status,
          priority,
          (SELECT created
             FROM tickets_comments
             WHERE ticket_id = t.id
             ORDER BY created DESC
             LIMIT 1) AS last_comment_date,
          GROUP_CONCAT(DISTINCT c.id) AS category_ids,
          GROUP_CONCAT(DISTINCT c.name) AS category_names,
          MIN(c.name) AS category_sort
       FROM tickets t
       LEFT JOIN category_tags ct ON ct.ticket_id = t.id
       LEFT JOIN categories c ON c.id = ct.category_id
       ${whereClause}
       GROUP BY t.id
       ORDER BY ${sortCol} ${sortDir}
       LIMIT ? OFFSET ?`;

  // console.log(query);
  try {
    const ticketList = await dbQuery<
      Ticket & { category_ids?: string; category_names?: string }
    >(query, [...params, perPage, offset]);

    const [countResult] = await dbQuery<{ count: number }>(
      `
      SELECT COUNT(DISTINCT t.id) AS count
      FROM tickets t
      LEFT JOIN category_tags ct ON ct.ticket_id = t.id
      LEFT JOIN categories c ON c.id = ct.category_id
      ${whereClause}`,
      params,
    );
    const count = countResult?.count ?? 0;

    // parse category strings into arrays of objects
    const ticketsWithCats: Ticket[] = ticketList.map((t) => {
      if (t.category_ids && t.category_names) {
        const ids = t.category_ids.split(",");
        const names = t.category_names.split(",");
        const cats: Category[] = ids.map((id, i) => ({
          id: Number(id),
          name: names[i] || "",
        }));
        return { ...t, categories: cats };
      }
      return t;
    });

    return { tickets: ticketsWithCats, total: count };
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }
}

export async function fetchTicketById(
  ticketId: number,
): Promise<Ticket | null> {
  const safeTicketId = Number(ticketId);
  if (!Number.isInteger(safeTicketId) || safeTicketId <= 0) {
    return null;
  }

  try {
    const [ticket] = await dbQuery<
      Ticket & { category_ids?: string; category_names?: string }
    >(
      `SELECT
          t.id,
          t.title,
          t.msg,
          t.kerberos_requester,
          t.kerberos_resolver,
          t.created,
          t.date_due,
          t.closed,
          t.status,
          t.priority,
          t.emails,
          (SELECT created
             FROM tickets_comments
             WHERE ticket_id = t.id
             ORDER BY created DESC
             LIMIT 1) AS last_comment_date,
          GROUP_CONCAT(DISTINCT c.id) AS category_ids,
          GROUP_CONCAT(DISTINCT c.name) AS category_names
       FROM tickets t
       LEFT JOIN category_tags ct ON ct.ticket_id = t.id
       LEFT JOIN categories c ON c.id = ct.category_id
       WHERE t.id = ?
       GROUP BY t.id
       LIMIT 1`,
      [safeTicketId],
    );

    if (!ticket) {
      return null;
    }

    const comments = await fetchTicketComments(safeTicketId);

    if (ticket.category_ids && ticket.category_names) {
      const ids = ticket.category_ids.split(",");
      const names = ticket.category_names.split(",");
      const categories: Category[] = ids.map((id, i) => ({
        id: Number(id),
        name: names[i] || "",
      }));
      return { ...ticket, categories, comments };
    }

    return { ...ticket, comments };
  } catch (error) {
    console.error("Error fetching ticket by id:", error);
    throw error;
  }
}
