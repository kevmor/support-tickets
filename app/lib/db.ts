import "server-only";

import mysql from "mysql2/promise";

// Use a global singleton so Next.js hot-module reloading in dev doesn't
// create a new pool (and leak connections) on every file change.
declare global {
  var __mysqlPool: mysql.Pool | undefined;
}

function getPool(): mysql.Pool {
  if (!global.__mysqlPool) {
    global.__mysqlPool = mysql.createPool({
      uri: process.env.MYSQL_URL!,
      connectionLimit: 5,
      waitForConnections: true,
      queueLimit: 0,
    });
  }
  return global.__mysqlPool;
}

export const pool = getPool();

export type DbParam = string | number | boolean | null | Date | Buffer;

export async function dbQuery<T>(statement: string, params: DbParam[] = []) {
  const [rows] = await pool.query(statement, params);
  return rows as T[];
}
