import "server-only";

import { dbQuery, DbParam } from "@/app/lib/db";
import { ResultSetHeader } from "mysql2";
import { getRequestKerberosLogin } from "@/app/lib/requestUser";

export async function createTicket(
  title: FormDataEntryValue | null,
  description: FormDataEntryValue | null,
  priority: FormDataEntryValue | null,
): Promise<{ success: boolean; ticketId?: number; error?: string }> {
  try {
    const kerberosRequester = await getRequestKerberosLogin();
    const safeTitle = typeof title === "string" ? title.trim() : "";
    const safeDescription =
      typeof description === "string" ? description.trim() : "";
    const numericPriority = Number(priority);
    const safePriority = Number.isFinite(numericPriority)
      ? Math.min(100, Math.max(0, numericPriority))
      : 50;

    if (!safeTitle) {
      return { success: false, error: "Title is required." };
    }

    if (!safeDescription) {
      return { success: false, error: "Description is required." };
    }

    const result = await dbQuery<ResultSetHeader>(
      `INSERT INTO tickets (title, msg, status, priority, created, kerberos_requester) 
        VALUES (?, ?, ?, ?, ?, ?)`,
      [
        safeTitle,
        safeDescription,
        2,
        safePriority,
        new Date(),
        kerberosRequester,
      ] as DbParam[],
    );
    const insertId = (result as unknown as ResultSetHeader).insertId;
    return { success: true, ticketId: insertId };
  } catch (error) {
    console.error("Error creating ticket:", error);

    if (error instanceof Error && error.message) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "Failed to create ticket." };
  }
}
