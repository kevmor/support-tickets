# Database Schema

MySQL 8+ database schema for the Support Tickets application.

---

## Tables

### `tickets`

The primary ticket record.

```sql
CREATE TABLE tickets (
  id                 INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  title              VARCHAR(100)     NOT NULL,
  msg                TEXT             NOT NULL,
  status             TINYINT UNSIGNED NOT NULL DEFAULT 2,
  priority           TINYINT UNSIGNED NOT NULL DEFAULT 50,
  created            DATETIME         NOT NULL,
  date_due           DATETIME             NULL,
  closed             DATETIME             NULL,
  kerberos_requester VARCHAR(100)     NOT NULL,
  kerberos_resolver  VARCHAR(100)         NULL,
  emails             VARCHAR(500)         NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Column               | Type         | Description                                        |
| -------------------- | ------------ | -------------------------------------------------- |
| `id`                 | INT UNSIGNED | Auto-increment primary key                         |
| `title`              | VARCHAR(100) | Short summary of the help request                  |
| `msg`                | TEXT         | Full description / body                            |
| `status`             | TINYINT      | Status code (see [Status Values](#status-values))  |
| `priority`           | TINYINT      | 0–100; higher = more urgent                        |
| `created`            | DATETIME     | When the ticket was submitted                      |
| `date_due`           | DATETIME     | Optional due date                                  |
| `closed`             | DATETIME     | Set when the ticket is resolved/closed             |
| `kerberos_requester` | VARCHAR(100) | Kerberos login of the person who opened the ticket |
| `kerberos_resolver`  | VARCHAR(100) | Kerberos login of the person who resolved it       |
| `emails`             | VARCHAR(500) | Comma-separated notification email addresses       |

---

### `categories`

Lookup table for ticket categories / labels.

```sql
CREATE TABLE categories (
  id   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categories_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

### `category_tags`

Junction table associating tickets with one or more categories.

```sql
CREATE TABLE category_tags (
  ticket_id   INT UNSIGNED NOT NULL,
  category_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (ticket_id, category_id),
  CONSTRAINT fk_ct_ticket   FOREIGN KEY (ticket_id)   REFERENCES tickets(id)    ON DELETE CASCADE,
  CONSTRAINT fk_ct_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

### `tickets_comments`

Comment thread entries for a ticket.

```sql
CREATE TABLE tickets_comments (
  id        INT UNSIGNED NOT NULL AUTO_INCREMENT,
  ticket_id INT UNSIGNED NOT NULL,
  msg       TEXT         NOT NULL,
  created   DATETIME     NOT NULL,
  kerberos  VARCHAR(100) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_tc_ticket_id (ticket_id),
  CONSTRAINT fk_tc_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Column      | Type         | Description                     |
| ----------- | ------------ | ------------------------------- |
| `id`        | INT UNSIGNED | Auto-increment primary key      |
| `ticket_id` | INT UNSIGNED | FK to `tickets.id`              |
| `msg`       | TEXT         | Comment body                    |
| `created`   | DATETIME     | When the comment was posted     |
| `kerberos`  | VARCHAR(100) | Kerberos login of the commenter |

---

## Status Values

The `tickets.status` column uses the following integer codes:

| Value | Label       | Description                                     |
| ----- | ----------- | ----------------------------------------------- |
| `1`   | In Progress | Actively being worked on                        |
| `2`   | Open        | New / awaiting assignment (default on creation) |
| `3`   | Pending     | Waiting on requester or third party             |
| `4`   | Closed      | Resolved and closed                             |

---

## Priority Scale

`tickets.priority` is an integer from **0 to 100**.

| Range    | Label                 |
| -------- | --------------------- |
| 0 – 10   | Eventually / sometime |
| 11 – 30  | Low                   |
| 31 – 60  | Medium                |
| 61 – 70  | High                  |
| 71 – 90  | Urgent                |
| 91 – 100 | Extremely urgent      |

---

## Seed Data

Sample categories to get started:

```sql
INSERT INTO categories (name) VALUES
  ('Hardware'),
  ('Software'),
  ('Network'),
  ('Access / Permissions'),
  ('Email'),
  ('Printing'),
  ('Other');
```

---

## Recommended Indexes

The following indexes improve common query patterns (filtering by status/priority, sorting by `last_comment_date`):

```sql
-- Filter by status
ALTER TABLE tickets ADD INDEX idx_tickets_status (status);

-- Filter by priority threshold
ALTER TABLE tickets ADD INDEX idx_tickets_priority (priority);

-- Sort by created date
ALTER TABLE tickets ADD INDEX idx_tickets_created (created);
```
