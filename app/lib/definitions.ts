export type Ticket = {
  id: number;
  title: string;
  msg: string;
  kerberos_requester: string;
  kerberos_resolver: string;
  created: Date;
  date_due: Date;
  closed: Date;
  status: number;
  priority: number;
  emails: string;
  last_comment_date: Date;
  // categories associated with the ticket; may be empty
  categories?: Category[];
  comments?: TicketComment[];
};

export type TicketComment = {
  id: number;
  ticket_id: number;
  msg: string;
  created: Date;
  kerberos: string;
};

export type Category = {
  id: number;
  name: string;
};
