import type { TODBCErrorCode } from "./interfaces";
export declare class ODBCError extends Error {
    code: TODBCErrorCode;
    details?: string;
    query?: string;
    constructor(message: string, code: TODBCErrorCode, details?: string, query?: string);
}
