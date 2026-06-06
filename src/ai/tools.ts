import { db } from "../db/client"
// تعريف الـ tool للـ AI
export const tools = [
    {
        type: "function",
        function: {
            name: "get_users",
            description: "Fetch users from the database",
            parameters: {
                type: "object",
                properties: {
                    limit: { type: "number", description: "How many users to return" },
                },
            },
        },
    },
];

// 
export async function get_users(limit = 10) {
    const result = await db.query(
        `SELECT * FROM users ORDER BY created_at DESC LIMIT $1`,
        [limit]
    );
    return result.rows;
}