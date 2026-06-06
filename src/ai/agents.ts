import { Ollama } from "ollama";
import { tools, get_users } from "./tools.js";

const ollama = new Ollama({ host: "http://localhost:11434" });

const MODEL = "qwen3:4b";

export async function ask(question: string) {
    try {
        console.log("1. Sending question to AI...");

        // stream: true عشان ميتقطعش بسبب timeout
        const stream = await ollama.chat({
            model: MODEL,
            messages: [{ role: "user", content: question }],
            tools,
            think: false,
            stream: true,
        });

        // استنى لحد ما يخلص
        let msg: any;
        for await (const chunk of stream) {
            msg = chunk.message;
        }

        console.log("2. AI response:", JSON.stringify(msg, null, 2));

        if (!msg.tool_calls?.length) return msg.content;

        console.log("3. Tool called:", msg.tool_calls[0].function.name);
        const args = msg.tool_calls[0].function.arguments as { limit?: number };
        const data = await get_users(args.limit);
        console.log("4. Got", data.length, "users from DB");

        const finalStream = await ollama.chat({
            model: MODEL,
            messages: [
                { role: "user", content: question },
                msg,
                { role: "tool", content: JSON.stringify(data) },
            ],
            stream: true,
        });

        let finalMsg: any;
        for await (const chunk of finalStream) {
            finalMsg = chunk.message;
        }

        console.log("5. Final:", finalMsg.content);
        return finalMsg.content;

    } catch (error) {
        console.error("ERROR:", error);
        return "An error occurred.";
    }
}