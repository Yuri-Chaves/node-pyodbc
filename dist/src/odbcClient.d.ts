import type { IDelete, IInsert, IODBCDNSConfig, IODBCNoDNSConfig, IQuery, ISelect, IUpdate } from './interfaces';
export declare class ODBCClient {
    private config;
    private pythonPath;
    constructor(config: IODBCDNSConfig, pythonPath?: string);
    constructor(config: IODBCNoDNSConfig, pythonPath?: string);
    query<T>({ query, database }: IQuery): Promise<T>;
    select<TTableA extends object = {}, TTableB extends object = {}>({ columns, table, database, where, join, options }: ISelect<TTableA, TTableB>): Promise<unknown>;
    insert<T extends object>({ data, database, table, replace }: IInsert<T>): Promise<unknown>;
    update<T extends object>({ data, table, database, where }: IUpdate<T>): Promise<unknown>;
    delete({ table, database, where }: IDelete): Promise<unknown>;
}
