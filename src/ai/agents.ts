import { Ollama } from "ollama";
import { tools, get_users } from "./tools.js";

const ollama = new Ollama();

export async function ask(question: string) {
    // Step 1: ابعت السؤال للـ AI مع الـ tools
    const response = await ollama.chat({
        model: "qwen3:4b",
        messages: [{ role: "user", content: question }],
        tools,
    });

    const msg = response.message;

    // Step 2: لو الـ AI مطلبش tool → رد مباشرة
    if (!msg.tool_calls?.length) return msg.content;

    // Step 3: نفّذ الـ tool اللي طلبه الـ AI
    const call = msg.tool_calls[0];
    const args = call.function.arguments as { limit?: number };
    const data = await get_users(args.limit);

    // Step 4: ابعت النتيجة للـ AI عشان يصيغ الرد
    const final = await ollama.chat({
        model: "qwen3:8b",
        messages: [
            { role: "user", content: question },
            msg,
            { role: "tool", content: JSON.stringify(data) },
        ],
    });

    return final.message.content;
}