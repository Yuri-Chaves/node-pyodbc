import { TInsertMultipleModel } from "./interfaces";
declare function mountSelectString(columns: Array<any> | string, prefix?: string): string;
declare function mountMultipleInsertString(table: string, data: Array<object>, model: TInsertMultipleModel, replace?: boolean): string;
export declare const utils: {
    mountSelectString: typeof mountSelectString;
    mountMultipleInsertString: typeof mountMultipleInsertString;
};
export {};
