import "server-only";

import { dbQuery } from "@/app/lib/db";

export async function fetchCategories(): Promise<
  { id: number; name: string }[]
> {
  try {
    const categories = await dbQuery<{ id: number; name: string }>(
      `SELECT id, name 
       FROM categories 
       ORDER BY name ASC`,
      [],
    );
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}
