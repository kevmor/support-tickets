"use server";

import "server-only";
import { revalidatePath } from "next/cache";
import { createTicket } from "./lib/createTicket";
import { pool } from "./lib/db";
import { dbQuery } from "./lib/db";
import { createTicketComment } from "./lib/ticketComments";

const MIN_PRIORITY = 0;
const MAX_PRIORITY = 100;

type TicketUpdateResult = {
  success: boolean;
  error?: string;
};

type PriorityUpdateResult = TicketUpdateResult & {
  priority?: number;
};

function revalidateTicketViews() {
  revalidatePath("/");
  revalidatePath("/ticket-list");
}

function revalidateTicketDetail(ticketId: number) {
  revalidatePath(`/ticket/${ticketId}`);
}

function sanitizeTicketId(ticketId: number) {
  return Number.isInteger(ticketId) && ticketId > 0 ? ticketId : null;
}

function sanitizeCategoryIds(categoryIds: number[]) {
  return [...new Set(categoryIds)]
    .map((categoryId) => Number(categoryId))
    .filter((categoryId) => Number.isInteger(categoryId) && categoryId > 0);
}

export async function saveTicket(
  formData: FormData,
): Promise<{ success: boolean; ticketId?: number; error?: string }> {
  const res = await createTicket(
    formData.get("title"),
    formData.get("description"),
    formData.get("priority"),
  );
  if (!res.success) {
    return { success: false, error: res.error };
  }
  return { success: true, ticketId: res.ticketId };
}

export async function saveTicketComment(formData: FormData): Promise<void> {
  const ticketId = Number(formData.get("ticketId"));
  const result = await createTicketComment(ticketId, formData.get("message"));

  if (!result.success) {
    throw new Error(result.error ?? "Failed to save ticket comment.");
  }

  revalidateTicketViews();
  revalidateTicketDetail(ticketId);
}

export async function updateTicketCategories(
  ticketId: number,
  categoryIds: number[],
): Promise<TicketUpdateResult> {
  const safeTicketId = sanitizeTicketId(ticketId);
  if (!safeTicketId) {
    return { success: false, error: "Invalid ticket id." };
  }

  const safeCategoryIds = sanitizeCategoryIds(categoryIds);
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await connection.query("DELETE FROM category_tags WHERE ticket_id = ?", [
      safeTicketId,
    ]);

    if (safeCategoryIds.length > 0) {
      const placeholders = safeCategoryIds.map(() => "(?, ?)").join(", ");
      const params = safeCategoryIds.flatMap((categoryId) => [
        safeTicketId,
        categoryId,
      ]);

      await connection.query(
        `INSERT INTO category_tags (ticket_id, category_id) VALUES ${placeholders}`,
        params,
      );
    }

    await connection.commit();
    revalidateTicketViews();
    return { success: true };
  } catch (error) {
    await connection.rollback();
    console.error("Error updating ticket categories:", error);
    return { success: false, error: "Failed to update ticket categories." };
  } finally {
    connection.release();
  }
}

export async function adjustTicketPriority(
  ticketId: number,
  delta: number,
): Promise<PriorityUpdateResult> {
  const safeTicketId = sanitizeTicketId(ticketId);
  const safeDelta = Number(delta);

  if (!safeTicketId || !Number.isFinite(safeDelta)) {
    return { success: false, error: "Invalid ticket update request." };
  }

  try {
    await pool.query(
      `UPDATE tickets
       SET priority = LEAST(?, GREATEST(?, priority + ?))
       WHERE id = ?`,
      [MAX_PRIORITY, MIN_PRIORITY, safeDelta, safeTicketId],
    );

    const [row] = await dbQuery<{ priority: number }>(
      "SELECT priority FROM tickets WHERE id = ? LIMIT 1",
      [safeTicketId],
    );

    const nextPriority = row?.priority;
    if (typeof nextPriority !== "number") {
      return { success: false, error: "Ticket not found." };
    }

    revalidateTicketViews();
    return { success: true, priority: nextPriority };
  } catch (error) {
    console.error("Error updating ticket priority:", error);
    return { success: false, error: "Failed to update ticket priority." };
  }
}
