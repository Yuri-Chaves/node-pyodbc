import type { IAggregateFunctions, IDMResult, IDelete, IInsert, IInsertMultiple, IODBCDNSConfig, IODBCNoDNSConfig, IPaginated, IPaginatedResponse, IQuery, ISelect, IUpdate } from "./interfaces";
export declare class ODBCClient {
    private config;
    private pythonPath;
    constructor(config: IODBCDNSConfig, pythonPath?: string);
    constructor(config: IODBCNoDNSConfig, pythonPath?: string);
    query<T>({ query, database }: IQuery): Promise<T>;
    select<TTableA extends object = {}, TTableB extends object = {}, TResult extends object = {}>({ columns, table, database, where, join, options, }: ISelect<TTableA, TTableB>): Promise<TResult>;
    insert<T extends object>({ data, database, table, replace, }: IInsert<T>): Promise<IDMResult>;
    insertMultiple<T extends object>({ data, table, database, model, replace, }: IInsertMultiple<T>): Promise<unknown>;
    update<T extends object>({ data, table, database, where, }: IUpdate<T>): Promise<IDMResult>;
    delete({ table, database, where }: IDelete): Promise<IDMResult>;
    aggregateFunction<TTableA extends object = {}, TResult extends object = {}, TTableB extends object = {}>({ fn, column, table, database, where, groupBy, alias, distinct, expression, join, }: IAggregateFunctions<TTableA, TTableB>): Promise<TResult>;
    getPaginated<TResult extends object = {}, TTableA extends object = {}, TTableB extends object = {}>({ page, perPage, totalPagesError, order, ...rest }: IPaginated): Promise<IPaginatedResponse<TResult>>;
}
