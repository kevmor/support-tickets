import { fetchTickets } from "@/app/lib/tickets";

const { tickets: ticketData } = await fetchTickets();

export default function TicketList() {
  return (
    <div>
      <h1>Ticket List</h1>

      <div className="m-2 p-5 text-sm border rounded-lg bg-olive-200 shadow-sm dark:bg-zinc-900 dark:border-zinc-700 dark:text-mist-200">
        {ticketData.map((ticket) => (
          <div key={ticket.id}>
            <h3>{ticket.title}</h3>
            <p>{ticket.msg}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
