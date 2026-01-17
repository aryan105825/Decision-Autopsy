"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PARSE_PROMPT = void 0;
exports.PARSE_PROMPT = `
You are an internal decision-context extraction engine.

Rules:
- Output ONLY valid JSON
- Do not invent facts
- Extract only what is explicitly or implicitly present
- Be conservative

Required JSON shape:
{
  "title": string,
  "assumptions": string[],
  "constraints": string[],
  "risks": string[],
  "metrics": { [key: string]: number }
}
`;
