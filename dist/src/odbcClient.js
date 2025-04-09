"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ODBCClient = void 0;
const node_child_process_1 = require("node:child_process");
const node_path_1 = __importDefault(require("node:path"));
const odbcError_1 = require("./odbcError");
const odbcUtils_1 = require("./odbcUtils");
class ODBCClient {
    constructor(connectionConfig, pythonPath = "python3") {
        this.config = connectionConfig;
        this.pythonPath = pythonPath;
    }
    query(_a) {
        return __awaiter(this, arguments, void 0, function* ({ query, database }) {
            try {
                const data = yield new Promise((resolve, reject) => {
                    const queryScript = node_path_1.default.join(__dirname, "..", "..", "python", "query.py");
                    let args;
                    if ("dns" in this.config) {
                        args = {
                            connectionString: `DNS=${this.config.dns};UID=${this.config.user};PWD=${this.config.password};`,
                            query,
                        };
                    }
                    else {
                        args = {
                            connectionString: `DRIVER=${this.config.driver};SERVER=${this.config.server};DATABASE=${database || this.config.database};UID=${this.config.user};PWD=${this.config.password};`,
                            query,
                        };
                    }
                    let output = "";
                    let err = "";
                    const process = (0, node_child_process_1.spawn)(this.pythonPath, [queryScript]);
                    process.stdin.write(JSON.stringify(args));
                    process.stdin.end();
                    process.stdout.on("data", (chunk) => {
                        output += chunk.toString();
                    });
                    process.stderr.on("data", (chunk) => {
                        console.error("stderr", chunk.toString());
                        err += chunk.toString();
                    });
                    process.on("close", (code) => {
                        if (code !== 0) {
                            if (err) {
                                reject(new Error(err));
                            }
                            else {
                                const error = JSON.parse(output);
                                reject(new odbcError_1.ODBCError(error.message, error.code, error.details, query));
                            }
                        }
                        try {
                            const result = JSON.parse(output.trim());
                            if (Array.isArray(result)) {
                                if (result.length > 1) {
                                    resolve(result);
                                }
                                resolve(result[0]);
                            }
                            resolve(result);
                        }
                        catch (err) {
                            reject(new odbcError_1.ODBCError("Invalid JSON output from query", "INVALID_OUTPUT", `${err}`, query));
                        }
                    });
                });
                return data;
            }
            catch (error) {
                if (error instanceof odbcError_1.ODBCError) {
                    console.error(`\x1b[36;15;1m${error.name}\n\x1b[0m\x1b[31;19;1m[${error.code}]\x1b[0m\n`);
                }
                throw error;
            }
        });
    }
    select(_a) {
        return __awaiter(this, arguments, void 0, function* ({ columns, table, database, where, join, options, }) {
            let query = "SELECT ";
            if (join) {
                query += odbcUtils_1.utils.mountSelectString(columns, table);
                if (join.columns) {
                    query += `, ${odbcUtils_1.utils.mountSelectString(join.columns, join.table)}`;
                }
                query += ` FROM ${table} ${join.type || "INNER"} JOIN ${join.table} ON ${table}.${join.on.columnA.toString()} = ${join.table}.${join.on.columnB.toString()}`;
            }
            else {
                query += `${odbcUtils_1.utils.mountSelectString(columns, table)} FROM ${table}`;
            }
            if (where) {
                query += ` WHERE ${where
                    .split(" ")
                    .filter((word) => word.toLowerCase() !== "where")
                    .join(" ")}`;
            }
            if (options === null || options === void 0 ? void 0 : options.limit) {
                query += ` LIMIT ${options.limit}`;
            }
            if (options === null || options === void 0 ? void 0 : options.offset) {
                query += ` OFFSET ${options.offset}`;
            }
            if (options === null || options === void 0 ? void 0 : options.order) {
                query += ` ORDER BY ${options.order.columns} ${options.order.direction}`;
            }
            return this.query({ query, database });
        });
    }
    insert(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data, database, table, replace = false, }) {
            let query = "";
            try {
                if (Array.isArray(data)) {
                    throw new odbcError_1.ODBCError("If you are trying to insert multiple values, please use `insertMultiple` instead", "INVALID_INPUT");
                }
                const columnNames = Object.entries(data)
                    .filter(([_, value]) => value !== undefined)
                    .map((value) => {
                    return value[0];
                });
                const columnValues = [];
                Object.entries(data)
                    .filter(([_, value]) => value !== undefined)
                    .map((value) => {
                    if (typeof value[1] === "string") {
                        columnValues.push(`'${value[1]}'`);
                    }
                    else if (typeof value[1] === "object") {
                        columnValues.push(`'${JSON.stringify(value[1])}'`);
                    }
                    else {
                        columnValues.push(value[1]);
                    }
                });
                query = `INSERT${(replace && " OR REPLACE") || ""} INTO ${table}(${columnNames.join(", ")}) VALUES (${columnValues.join(", ")});`;
            }
            catch (error) {
                throw new odbcError_1.ODBCError("Error while creating the query", "INVALID_INPUT", `${error}`);
            }
            return this.query({ query, database });
        });
    }
    insertMultiple(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data, table, database, model = "MULTIPLE_VALUES", replace, }) {
            if (!Array.isArray(data)) {
                throw new odbcError_1.ODBCError("If you are not trying to insert multiple values, please use `insert` instead", "INVALID_INPUT");
            }
            const query = odbcUtils_1.utils.mountMultipleInsertString(table, data, model, replace);
            return this.query({ query, database });
        });
    }
    update(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data, table, database, where, }) {
            let query = "";
            try {
                const setString = Object.entries(data)
                    .filter(([_, value]) => value !== undefined)
                    .map((value) => {
                    let str = "";
                    if (typeof value[1] === "string") {
                        str = `${value[0]} = '${value[1]}'`;
                    }
                    else if (typeof value[1] === "object") {
                        str = `${value[0]} = '${JSON.stringify(value[1])}'`;
                    }
                    else {
                        str = `${value[0]} = ${value[1]}`;
                    }
                    return str;
                })
                    .join(", ");
                query = `UPDATE ${table} SET ${setString}${(where && ` WHERE ${where}`) || ""}`;
            }
            catch (error) {
                throw new odbcError_1.ODBCError("Error while creating the query", "INVALID_INPUT", `${error}`);
            }
            return this.query({ query, database });
        });
    }
    delete(_a) {
        return __awaiter(this, arguments, void 0, function* ({ table, database, where }) {
            let query = "";
            try {
                query = `DELETE FROM ${table}${(where && ` WHERE ${where}`) || ""};`;
            }
            catch (error) {
                throw new odbcError_1.ODBCError("Error while creating the query", "INVALID_INPUT", `${error}`);
            }
            return this.query({ query, database });
        });
    }
    aggregateFunction(_a) {
        return __awaiter(this, arguments, void 0, function* ({ fn, column, table, database, where, groupBy, alias, distinct, expression, }) {
            let query = "";
            try {
                query += "SELECT ";
                query += fn;
                query += distinct && fn === "COUNT" ? " (DISTINCT " : " (";
                query += column.toString();
                query += expression && fn === "SUM" ? ` ${expression}` : "";
                query += alias ? `) AS ${alias}` : ")";
                query += groupBy ? `, ${groupBy.join(", ").toString()}` : "";
                query += ` FROM ${table}`;
                query += where ? ` WHERE ${where}` : "";
                query += groupBy ? ` GROUP BY ${groupBy.join(", ").toString()}` : "";
                query += ";";
            }
            catch (error) {
                throw new odbcError_1.ODBCError("Error while creating the query", "INVALID_INPUT", `${error}`, query);
            }
            return this.query({ query, database });
        });
    }
}
exports.ODBCClient = ODBCClient;
//# sourceMappingURL=odbcClient.js.map