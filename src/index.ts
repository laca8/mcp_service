import express from "express";
import { ask } from "./ai/agents";

const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
    const { question } = req.body;
    const answer = await ask(question);
    res.json({ answer });
});

app.listen(3000, () => console.log("http://localhost:3000"));