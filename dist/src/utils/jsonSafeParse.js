"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeJsonParse = safeJsonParse;
const jsonrepair_1 = require("jsonrepair");
function safeJsonParse(raw) {
    try {
        const repaired = (0, jsonrepair_1.jsonrepair)(raw);
        return JSON.parse(repaired);
    }
    catch {
        return null;
    }
}
