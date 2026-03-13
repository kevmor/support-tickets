import { TicketComment } from "../lib/definitions";
import { formatDate } from "../shared/helpers";
import { saveTicketComment } from "@/app/actions";

export default function TicketComments({
  ticketId,
  comments,
}: {
  ticketId: number;
  comments: TicketComment[] | undefined;
}) {
  return (
    <>
      <section className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold">Comments</h2>

        {comments && comments.length > 0 ? (
          <div className="mt-4 space-y-3">
            {comments.map((comment) => (
              <article
                key={comment.id}
                className="rounded-md border border-zinc-200 p-3 dark:border-zinc-700"
              >
                <div className="mb-2 flex items-center justify-between gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                  <span>{comment.kerberos}</span>
                  <span>{formatDate(comment.created)}</span>
                </div>
                <p className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
                  {comment.msg}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            No comments yet.
          </p>
        )}
      </section>
      <section className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold">Add Comment:</h2>
        <form action={saveTicketComment} className="mt-3 flex flex-col gap-2">
          <input type="hidden" name="ticketId" value={ticketId} />
          <textarea
            name="message"
            rows={4}
            className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1 text-sm text-zinc-600 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
            placeholder="Write your comment here..."
            required
          />
          <button
            type="submit"
            className="self-end rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Add Comment
          </button>
        </form>
      </section>
    </>
  );
}
