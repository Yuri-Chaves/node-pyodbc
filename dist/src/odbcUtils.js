"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.utils = void 0;
function mountSelectString(columns, prefix) {
    let selectString;
    const _prefix = `${prefix}.` || "";
    if (Array.isArray(columns)) {
        selectString = columns
            .map((column) => `${_prefix}${column.toString()}`)
            .join(", ");
    }
    else {
        selectString = `${_prefix}${columns}`;
    }
    return selectString;
}
function mountMultipleInsertString(table, data, model, replace = false) {
    const columnNames = Object.entries(data[0])
        .filter(([_, value]) => value !== undefined)
        .map((value) => {
        return value[0];
    });
    const columnValues = [];
    data.map((d) => {
        const arr = [];
        Object.entries(d)
            .filter(([_, value]) => value !== undefined)
            .map((value) => {
            if (typeof value[1] === "string") {
                arr.push(`'${value[1]}'`);
            }
            else if (typeof value[1] === "object") {
                arr.push(`'${JSON.stringify(value[1])}'`);
            }
            else {
                arr.push(value[1]);
            }
        });
        columnValues.push(`(${arr.join(", ")})`);
    });
    if (model === "MULTIPLE_VALUES") {
        return `INSERT${(replace && " OR REPLACE") || ""} INTO ${table}(${columnNames.join(", ")}) VALUES ${columnValues.join(", ")};`;
    }
    else if (model === "SELECT_FROM") {
        return `INSERT${(replace && " OR REPLACE") || ""} INTO ${table}(${columnNames.join(", ")}) SELECT ${columnNames
            .map((item) => `V.${item}`)
            .join(", ")} FROM (VALUES ${columnValues.join(", ")})V(${columnNames.join(", ")});`;
    }
    return `INSERT${(replace && " OR REPLACE") || ""} INTO ${table}(${columnNames.join(", ")}) SELECT ${columnValues
        .map((item) => item.replace(/^\(|\)$/g, ""))
        .join(" UNION ALL SELECT ")}`;
}
exports.utils = {
    mountSelectString,
    mountMultipleInsertString,
};
//# sourceMappingURL=odbcUtils.js.map