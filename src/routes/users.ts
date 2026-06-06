import { db } from "../db/client";

export async function getUsers(limit = 10) {
  const result = await db.query(
    `SELECT * FROM users ORDER BY created_at DESC LIMIT $1`,
    [limit]
  );
  return result.rows;
}