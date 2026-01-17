"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paramToString = paramToString;
function paramToString(param) {
    if (!param)
        return undefined;
    return Array.isArray(param) ? param[0] : param;
}
