import { fetchTicketById } from "@/app/lib/tickets";
import { formatDate, STATUS_MAP, getPriorityBadge } from "@/app/shared/helpers";
import { notFound } from "next/navigation";
import Comments from "@/app/components/Comments";

export default async function TicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ticketId = Number(id);

  if (!Number.isInteger(ticketId) || ticketId <= 0) {
    notFound();
  }

  const ticket = await fetchTicketById(ticketId);
  if (!ticket) {
    notFound();
  }

  const priorityBadge = getPriorityBadge(ticket.priority);

  return (
    <main className="mx-auto max-w-4xl space-y-5 p-6">
      <h1 className="text-2xl font-bold">Ticket #{ticket.id}</h1>
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold">{ticket.title}</h2>
        <p className="mt-2 whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
          {ticket.msg}
        </p>

        <div className="mt-4 grid gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <p>
            Requester:{" "}
            <span className="text-zinc-900 dark:text-zinc-300">
              {ticket.kerberos_requester}
            </span>
          </p>
          <p>Status: {STATUS_MAP[ticket.status]?.label ?? ticket.status}</p>
          <p>
            Priority:{" "}
            <span className={priorityBadge.className + " px-1 rounded-md"}>
              {ticket.priority} ({priorityBadge.label})
            </span>
          </p>
          <p>Opened: {formatDate(ticket.created)}</p>
          <p>Last Comment: {formatDate(ticket.last_comment_date)}</p>
        </div>
      </div>

      <Comments ticketId={ticket.id} comments={ticket.comments} />
    </main>
  );
}
