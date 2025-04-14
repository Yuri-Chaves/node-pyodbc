import { TInsertMultipleModel, TJoinOn } from "./interfaces";
declare function mountSelectString(columns: Array<any> | string, prefix?: string): string;
declare function mountOnString<TTableA extends object, TTableB extends object>(condition: TJoinOn<TTableA, TTableB>, prefixA: string, prefixB: string): string;
declare function mountMultipleInsertString(table: string, data: Array<object>, model: TInsertMultipleModel, replace?: boolean): string;
export declare const utils: {
    mountSelectString: typeof mountSelectString;
    mountOnString: typeof mountOnString;
    mountMultipleInsertString: typeof mountMultipleInsertString;
};
export {};
