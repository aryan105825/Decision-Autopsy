import { jsonrepair } from "jsonrepair";

export function safeJsonParse(raw: string) {
  try {
    const repaired = jsonrepair(raw);
    return JSON.parse(repaired);
  } catch {
    return null;
  }
}
