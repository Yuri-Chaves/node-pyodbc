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
export type TInsertMultipleModel = "MULTIPLE_VALUES" | "SELECT_FROM" | "UNION_ALL";
export interface ISelect<TTableA extends object, TTableB extends object> extends IBase {
    columns: Array<{} extends TTableA ? string : keyof TTableA> | "*";
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
        columns?: Array<{} extends TTableB ? string : keyof TTableB> | "*";
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
export interface IDMResult {
    code: string;
    message: string;
    details: string;
}
export interface IInsert<T extends object> extends IBase {
    data: T;
    replace?: boolean;
}
export interface IInsertMultiple<T extends object> extends IBase {
    data: Array<T>;
    /**
     * @default "MULTIPLE_VALUES"
     * @description `MULTIPLE_VALUES` - SQL Server 2008 and later based. **limited** to `1000 records`
     * @description `SELECT_FROM` - MULTIPLE_VALUES *workaround* for more than `1000 records`
     * @description `UNION_ALL` - SQL Server 2005 and later based
     * @warning ⚠️ Make sure your [DBMS](https://www.geeksforgeeks.org/introduction-of-dbms-database-management-system-set-1/) accepts this syntax.
     * @param "MULTIPLE_VALUES" - `INSERT INTO <table> (<columns>) VALUES (...), (...), ...;`
     * @warning ⚠️ Make sure your [DBMS](https://www.geeksforgeeks.org/introduction-of-dbms-database-management-system-set-1/) accepts **"MULTIPLE_VALUES"** syntax.
     * @param "SELECT_FROM" - `INSERT INTO <table> (<columnA>, <columnA>, ...) SELECT V.<columnA>, V.<columnB>,... FROM (VALUES(<valueA>, <valueB>,...), (<valueA>, <valueB>,...), ..., (<valueA>, <valueB>,...)V(<columnA>, <columnB> ...));`
     * @warning ⚠️ Make sure your [DBMS](https://www.geeksforgeeks.org/introduction-of-dbms-database-management-system-set-1/) accepts this syntax.
     * @param "UNION_ALL" - `INSERT INTO <table> (<columns>) SELECT <values> UNION ALL SELECT <values> UNION ALL ... UNION ALL SELECT <values>;`
     */
    model?: TInsertMultipleModel;
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
export type TAggregateFunctions = "MIN" | "MAX" | "COUNT" | "SUM" | "AVG";
export interface IAggregateFunctions<T extends object> extends IBase {
    fn: TAggregateFunctions;
    /**
     * @note 🗒️ `column: '*'` is used just if `fn` = **COUNT**
     */
    column: {} extends T ? string : keyof T | "*";
    where?: string;
    groupBy?: Array<{} extends T ? string : keyof T>;
    alias?: string;
    /**
     * @description If **distinct** is true, rows with the same value for the specified column will be counted as one
     * @note 🗒️ `distinct` is used just if `fn` = **COUNT**
     */
    distinct?: boolean;
    /**
     * @note 🗒️ `expression` is used just if `fn` = **SUM**
     */
    expression?: string;
}
export type TODBCErrorCode = "QUERY_EXECUTION_ERROR" | "INVALID_OUTPUT" | "INVALID_INPUT" | "NUMBER_OF_CONNECTIONS" | "UNEXPECTED_ERROR";
export {};
