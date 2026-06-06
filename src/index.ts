import express from "express";
import { ask } from "./ai/agents";

const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
    const { question } = req.body;
    console.log(question);

    const answer = await ask(question);
    console.log(answer);
    res.json({ answer });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});