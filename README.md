# Support Tickets

A helpdesk ticket management application built with Next.js 16 (App Router), React 19, and MySQL. Designed for deployment behind an Apache reverse proxy with Kerberos authentication (`REMOTE_USER`).

## Features

- Submit and track help request tickets
- Per-ticket categories and priority (0–100 scale)
- Comment threads on tickets
- Ticket list with filtering (status, category, search, priority) and sorting
- Inline category and priority editing via dropdown menu
- Dark / light theme toggle
- Authenticated user attribution via Apache `REMOTE_USER`

## Tech Stack

| Layer     | Technology                                    |
| --------- | --------------------------------------------- |
| Framework | Next.js 16 (App Router)                       |
| UI        | React 19, Tailwind CSS v4, shadcn/ui, Base UI |
| Icons     | lucide-react                                  |
| Toasts    | sonner                                        |
| Database  | MySQL (mysql2)                                |
| Auth      | Apache `REMOTE_USER` header                   |

## Getting Started

### Prerequisites

- Node.js 20+
- MySQL 8+ database (see [docs/schema.md](docs/schema.md) for required schema)
- Apache with `mod_auth_kerb` or similar, passing `REMOTE_USER` as a request header

### Environment Variables

Create a `.env.local` file in the project root:

```env
MYSQL_URL=mysql://user:password@localhost:3306/support_tickets
# Optional fallback user when REMOTE_USER header is absent (dev only)
REMOTE_USER=dev_user
```

### Apache Header Passthrough

The application reads the authenticated user from the `X-Remote-User` request header. Add the following to your Apache virtual host config:

```apache
RequestHeader set X-Remote-User %{REMOTE_USER}e
```

### Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
app/
  actions.ts             # "use server" action wrappers (mutations)
  lib/
    db.ts                # MySQL connection pool singleton
    definitions.ts       # Shared TypeScript types
    tickets.ts           # Ticket read queries
    createTicket.ts      # Ticket insert logic
    ticketComments.ts    # Comment read/write queries
    references.ts        # Category lookup
    requestUser.ts       # Apache REMOTE_USER resolution
    recentTickets.ts     # Recent tickets query
    ticketStats.ts       # Dashboard statistics
  shared/
    helpers.ts           # Shared constants (STATUS_MAP, SORT_COLUMNS, etc.)
  components/            # React UI components
  ticket/[id]/           # Ticket detail page
  ticket-list/           # Paginated ticket list page
  help/                  # Help request form page
components/
  ui/                    # shadcn/ui primitives
docs/
  schema.md              # Database schema reference
```

## Database

See [docs/schema.md](docs/schema.md) for the full MySQL schema — tables, columns, indexes, foreign keys, and seed data.
