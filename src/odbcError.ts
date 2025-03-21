import type { TODBCErrorCode } from "./interfaces";

export class ODBCError extends Error {
  public code: TODBCErrorCode;
  public details?: string;
  public query?: string;

  constructor(
    message: string,
    code: TODBCErrorCode,
    details?: string,
    query?: string
  ) {
    super(message);
    this.name = "\x1b[31;15;1mODBCError\x1b[0m";
    this.code = code;
    this.details = details;
    this.query = query;

    Object.setPrototypeOf(this, ODBCError.prototype);
  }
}
