"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ODBCError = void 0;
class ODBCError extends Error {
    constructor(message, code, details, query) {
        super(message);
        this.name = '\x1b[31;15;1mODBCError\x1b[0m';
        this.code = code;
        this.details = details;
        this.query = query;
        Object.setPrototypeOf(this, ODBCError.prototype);
    }
}
exports.ODBCError = ODBCError;
