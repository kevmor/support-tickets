import "server-only";

import { dbQuery, DbParam } from "@/app/lib/db";
import { TicketComment } from "@/app/lib/definitions";
import { ResultSetHeader } from "mysql2";
import { getRequestKerberosLogin } from "@/app/lib/requestUser";

function sanitizeTicketId(ticketId: number) {
	return Number.isInteger(ticketId) && ticketId > 0 ? ticketId : null;
}

export async function fetchTicketComments(ticketId: number) {
	const safeTicketId = sanitizeTicketId(Number(ticketId));
	if (!safeTicketId) {
		return [];
	}

	return dbQuery<TicketComment>(
		`SELECT
				id,
				ticket_id,
				msg,
				created,
				kerberos
		 FROM tickets_comments
		 WHERE ticket_id = ?
		 ORDER BY created ASC`,
		[safeTicketId],
	);
}

export async function createTicketComment(
	ticketId: number,
	message: FormDataEntryValue | string | null,
): Promise<{ success: boolean; commentId?: number; error?: string }> {
	const safeTicketId = sanitizeTicketId(Number(ticketId));
	const safeMessage = typeof message === "string" ? message.trim() : "";

	if (!safeTicketId) {
		return { success: false, error: "Invalid ticket id." };
	}

	if (!safeMessage) {
		return { success: false, error: "Comment message is required." };
	}

	try {
		const kerberos = await getRequestKerberosLogin();
		const result = await dbQuery<ResultSetHeader>(
			`INSERT INTO tickets_comments (ticket_id, msg, created, kerberos)
			 VALUES (?, ?, ?, ?)`,
			[safeTicketId, safeMessage, new Date(), kerberos] as DbParam[],
		);

		const insertId = (result as unknown as ResultSetHeader).insertId;
		return { success: true, commentId: insertId };
	} catch (error) {
		console.error("Error creating ticket comment:", error);
		return { success: false, error: "Failed to create ticket comment." };
	}
}
