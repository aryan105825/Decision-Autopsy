import { Router } from "express";
import { groq } from "../ai/groq";
import { PARSE_PROMPT } from "../ai/parsePrompt";
import { safeJsonParse } from "../utils/jsonSafeParse";
import { Request, Response } from "express";
const router = Router();

router.post("/", async (req:Request, res:Response) => {
    const { rawContext } = req.body;

    const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
            { role: "system", content: PARSE_PROMPT },
            { role: "user", content: rawContext },
        ],
    });

    const raw = completion.choices[0].message.content || "";
    const parsed = safeJsonParse(raw);

    if (!parsed) {
        return res.json({
            status: "LOW_CONFIDENCE",
            raw,
        });
    }

    res.json({
        status: "OK",
        parsed,
    });
});

export default router;
