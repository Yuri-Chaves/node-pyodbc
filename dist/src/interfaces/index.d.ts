export interface IODBCNoDNSConfig {
    driver: string;
    server: string;
    database?: string;
    user: string;
    password: string;
}
export interface IODBCDNSConfig {
    dns: string;
    user: string;
    password: string;
}
export interface IQuery {
    query: string;
    database?: string;
}
interface IBase {
    table: string;
    database?: string;
}
export interface ISelect<TTableA extends object, TTableB extends object> extends IBase {
    columns: Array<{} extends TTableA ? string : keyof TTableA> | '*';
    /**
     * @note 🗒️ If you are joining tables, you need to specify the table name of the column
     * @example If `table: "users"` then use `where: "where users.name"` or just `where: "users.name"`
     */
    where?: string;
    join?: {
        table: string;
        on: {
            columnA: {} extends TTableA ? string : keyof TTableA;
            columnB: {} extends TTableB ? string : keyof TTableB;
        };
        columns?: Array<{} extends TTableB ? string : keyof TTableB> | '*';
        type?: "INNER" | "LEFT" | "RIGHT";
    };
    options?: {
        limit?: number;
        offset?: number;
        order?: {
            /**
             * @note 🗒️ If you are joining tables, you need to specify the table name of the column
             * @example If `table: "users"` then use `order.columns: ["users.name"]`
             */
            columns: Array<string>;
            direction: "ASC" | "DESC";
        };
    };
}
export interface IInsert<T extends object> extends IBase {
    /**
     * @warning ⚠️ If you are trying to use `data` as an Array, make sure your [DBMS](https://www.geeksforgeeks.org/introduction-of-dbms-database-management-system-set-1/) accepts the syntax for multiple inserts:
     *
     * `INSERT INTO <table> (<columns>) VALUES (...), (...), ...;`
     */
    data: T | Array<T>;
    replace?: boolean;
}
export interface IUpdate<T extends object> extends IBase {
    data: T;
    /**
     * @warning ⚠️ Be careful when updating records. If you omit the `where` clause, __ALL__ records will be updated!
     */
    where?: string;
}
export interface IDelete extends IBase {
    /**
     * @warning ⚠️ Be careful when deleting records. If you omit the `where` clause, __ALL__ records will be deleted!
     */
    where?: string;
}
export type TODBCErrorCode = "QUERY_EXECUTION_ERROR" | "INVALID_OUTPUT" | "INVALID_INPUT" | "NUMBER_OF_CONNECTIONS" | "UNEXPECTED_ERROR";
export {};
