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
};
