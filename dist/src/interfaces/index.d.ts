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
type TClauses = "AND" | "OR";
type TJoinConditions<TTableA extends object, TTableB extends object> = {
    columnA: {} extends TTableA ? string : Extract<keyof TTableA, string>;
    operator?: "=" | "<>" | ">" | "<" | ">=" | "<=";
    columnB: {} extends TTableB ? string : Extract<keyof TTableB, string>;
};
export type TJoinOn<TTableA extends object = {}, TTableB extends object = {}> = TJoinConditions<TTableA, TTableB> | [TClauses, Array<TJoinConditions<TTableA, TTableB>>] | [TClauses, Array<TJoinOn<TTableA, TTableB>>];
export type TKeyOfValue<T> = {} extends T ? string : keyof T;
export interface ISelect<TTableA extends object, TTableB extends object> extends IBase {
    columns: Array<TKeyOfValue<TTableA>> | "*";
    /**
     * @note 🗒️ If you are joining tables, you need to specify the table name of the column
     * @example If `table: "users"` then use `where: "where users.name"` or just `where: "users.name"`
     */
    where?: string;
    join?: {
        table: string;
        on: TJoinOn<TTableA, TTableB>;
        columns?: Array<TKeyOfValue<TTableB>> | "*";
        type?: "INNER" | "LEFT" | "RIGHT";
        database?: string;
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
export interface IAggregateFunctions<TTableA extends object, TTableB extends object> extends IBase {
    fn: TAggregateFunctions;
    /**
     * @note 🗒️ `column: '*'` is used just if `fn` = **COUNT**
     */
    column: TKeyOfValue<TTableA> | "*";
    where?: string;
    /**
     * @note ⚠️ Joins may introduce duplicate rows, which can affect aggregate results.
     */
    join?: {
        table: string;
        on: TJoinOn<TTableA, TTableB>;
        columns?: Array<TKeyOfValue<TTableB>> | "*";
        type?: "INNER" | "LEFT" | "RIGHT";
        database?: string;
    };
    groupBy?: Array<string>;
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
export interface IPaginatedResponse<T extends object> {
    meta: {
        /**
         * @description Total number of records in the table matching the `WHERE` clause
         */
        total: number;
        /**
         * @description Number of records per page
         */
        perPage: number;
        /**
         * @description Length of the current page
         */
        dataLength: number;
        /**
         * @description Last page number
         */
        lastPage: number;
        /**
         * @description URL to the next page
         * @example `?page=2`
         */
        nextPageUrl: string | null;
        /**
         * @description URL to the previous page
         * @example `?page=1`
         */
        previousPageUrl: string | null;
        /**
         * @description Current page number
         */
        currentPage: number;
        /**
         * @description Whether there is a next page
         */
        hasNextPage: boolean;
        /**
         * @description Whether there is a previous page
         */
        hasPreviousPage: boolean;
    };
    data: Array<T>;
}
export interface IPaginated<TTableA extends object = {}, TTableB extends object = {}> extends Omit<ISelect<TTableA, TTableB>, "join" | "options"> {
    /**
     * @description Page number
     * @default 1
     */
    page?: number;
    /**
     * @description Number of records per page
     * @default 25
     */
    perPage?: number;
    /**
     * @description Exception message to be thrown when the page number is greater than the total number of pages
     * @default "Page not found"
     */
    totalPagesError?: string;
    order?: {
        /**
         * @note 🗒️ If you are joining tables, you need to specify the table name of the column
         * @example If `table: "users"` then use `order.columns: ["users.name"]`
         */
        columns: Array<string>;
        direction: "ASC" | "DESC";
    };
}
export type TODBCErrorCode = "QUERY_EXECUTION_ERROR" | "UNIQUE_KEY_VIOLATION" | "INVALID_OUTPUT" | "INVALID_INPUT" | "NUMBER_OF_CONNECTIONS" | "UNEXPECTED_ERROR" | "INDEX_OUT_OF_RANGE";
export {};
