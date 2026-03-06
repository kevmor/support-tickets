"use client";

import { useParams } from "next/navigation";

export default function Ticket() {
  const { id } = useParams() as { id: string };
  return <div>Ticket # {id}</div>;
}
