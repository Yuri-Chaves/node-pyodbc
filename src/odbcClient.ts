import { spawn } from "node:child_process";
import path from "node:path";
import type {
  IAggregateFunctions,
  IDMResult,
  IDelete,
  IInsert,
  IInsertMultiple,
  IODBCDNSConfig,
  IODBCNoDNSConfig,
  IQuery,
  ISelect,
  IUpdate,
  TODBCErrorCode,
} from "./interfaces";
import { ODBCError } from "./odbcError";
import { utils } from "./odbcUtils";

interface IQueryArgs {
  connectionString: string;
  query: string;
}

type TODBCConfig = IODBCDNSConfig | IODBCNoDNSConfig;

export class ODBCClient {
  private config: TODBCConfig;
  private pythonPath: string;

  constructor(config: IODBCDNSConfig, pythonPath?: string);
  constructor(config: IODBCNoDNSConfig, pythonPath?: string);

  constructor(connectionConfig: TODBCConfig, pythonPath = "python3") {
    this.config = connectionConfig;
    this.pythonPath = pythonPath;
  }

  async query<T>({ query, database }: IQuery): Promise<T> {
    try {
      const data: T = await new Promise<T>((resolve, reject) => {
        const queryScript = path.join(
          __dirname,
          "..",
          "..",
          "python",
          "query.py"
        );
        let args: IQueryArgs;
        if ("dns" in this.config) {
          args = {
            connectionString: `DNS=${this.config.dns};UID=${this.config.user};PWD=${this.config.password};`,
            query,
          };
        } else {
          args = {
            connectionString: `DRIVER=${this.config.driver};SERVER=${
              this.config.server
            };DATABASE=${database || this.config.database};UID=${
              this.config.user
            };PWD=${this.config.password};`,
            query,
          };
        }
        let output = "";
        let err = "";

        const process = spawn(this.pythonPath, [queryScript]);

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
            } else {
              const error = JSON.parse(output) as {
                code: TODBCErrorCode;
                message: string;
                details: string;
              };
              reject(
                new ODBCError(error.message, error.code, error.details, query)
              );
            }
          }
          try {
            const result = JSON.parse(output.trim());
            if (Array.isArray(result)) {
              if (result.length > 1) {
                resolve(result as T);
              }
              resolve(result[0]);
            }
            resolve(result);
          } catch (err) {
            reject(
              new ODBCError(
                "Invalid JSON output from query",
                "INVALID_OUTPUT",
                `${err}`,
                query
              )
            );
          }
        });
      });

      return data;
    } catch (error) {
      if (error instanceof ODBCError) {
        console.error(
          `\x1b[36;15;1m${error.name}\n\x1b[0m\x1b[31;19;1m[${error.code}]\x1b[0m\n`
        );
      }
      throw error;
    }
  }

  async select<
    TTableA extends object = {},
    TTableB extends object = {},
    TResult extends object = {}
  >({
    columns,
    table,
    database,
    where,
    join,
    options,
  }: ISelect<TTableA, TTableB>): Promise<TResult> {
    let query = "SELECT ";
    if (join) {
      query += utils.mountSelectString(columns, table);
      if (join.columns) {
        query += `, ${utils.mountSelectString(join.columns, join.table)}`;
      }
      query += ` FROM ${table} ${join.type || "INNER"} JOIN ${
        join.database ? join.database + ":" : ""
      }${join.table} ON `;
      query += utils.mountOnString(join.on, table, join.table);
    } else {
      query += `${utils.mountSelectString(columns, table)} FROM ${table}`;
    }
    if (where) {
      query += ` WHERE ${where
        .split(" ")
        .filter((word) => word.toLowerCase() !== "where")
        .join(" ")}`;
    }
    if (options?.limit) {
      query += ` LIMIT ${options.limit}`;
    }
    if (options?.offset) {
      query += ` OFFSET ${options.offset}`;
    }
    if (options?.order) {
      query += ` ORDER BY ${options.order.columns} ${options.order.direction}`;
    }

    return this.query({ query, database });
  }
  async insert<T extends object>({
    data,
    database,
    table,
    replace = false,
  }: IInsert<T>): Promise<IDMResult> {
    let query = "";
    try {
      if (Array.isArray(data)) {
        throw new ODBCError(
          "If you are trying to insert multiple values, please use `insertMultiple` instead",
          "INVALID_INPUT"
        );
      }
      const columnNames = Object.entries(data)
        .filter(([_, value]) => value !== undefined)
        .map((value) => {
          return value[0];
        });
      const columnValues: Array<string> = [];
      Object.entries(data)
        .filter(([_, value]) => value !== undefined)
        .map((value) => {
          if (typeof value[1] === "string") {
            columnValues.push(`'${value[1]}'`);
          } else if (typeof value[1] === "object") {
            columnValues.push(`'${JSON.stringify(value[1])}'`);
          } else {
            columnValues.push(value[1]);
          }
        });
      query = `INSERT${
        (replace && " OR REPLACE") || ""
      } INTO ${table}(${columnNames.join(", ")}) VALUES (${columnValues.join(
        ", "
      )});`;
    } catch (error) {
      throw new ODBCError(
        "Error while creating the query",
        "INVALID_INPUT",
        `${error}`
      );
    }

    return this.query({ query, database });
  }

  async insertMultiple<T extends object>({
    data,
    table,
    database,
    model = "MULTIPLE_VALUES",
    replace,
  }: IInsertMultiple<T>) {
    if (!Array.isArray(data)) {
      throw new ODBCError(
        "If you are not trying to insert multiple values, please use `insert` instead",
        "INVALID_INPUT"
      );
    }
    const query = utils.mountMultipleInsertString(table, data, model, replace);

    return this.query({ query, database });
  }

  async update<T extends object>({
    data,
    table,
    database,
    where,
  }: IUpdate<T>): Promise<IDMResult> {
    let query = "";
    try {
      const setString = Object.entries(data)
        .filter(([_, value]) => value !== undefined)
        .map((value) => {
          let str = "";
          if (typeof value[1] === "string") {
            str = `${value[0]} = '${value[1]}'`;
          } else if (typeof value[1] === "object") {
            str = `${value[0]} = '${JSON.stringify(value[1])}'`;
          } else {
            str = `${value[0]} = ${value[1]}`;
          }
          return str;
        })
        .join(", ");
      query = `UPDATE ${table} SET ${setString}${
        (where && ` WHERE ${where}`) || ""
      }`;
    } catch (error) {
      throw new ODBCError(
        "Error while creating the query",
        "INVALID_INPUT",
        `${error}`
      );
    }
    return this.query({ query, database });
  }

  async delete({ table, database, where }: IDelete): Promise<IDMResult> {
    let query = "";
    try {
      query = `DELETE FROM ${table}${(where && ` WHERE ${where}`) || ""};`;
    } catch (error) {
      throw new ODBCError(
        "Error while creating the query",
        "INVALID_INPUT",
        `${error}`
      );
    }
    return this.query({ query, database });
  }

  async aggregateFunction<T extends object = {}, TResult extends object = {}>({
    fn,
    column,
    table,
    database,
    where,
    groupBy,
    alias,
    distinct,
    expression,
  }: IAggregateFunctions<T>): Promise<TResult> {
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
    } catch (error) {
      throw new ODBCError(
        "Error while creating the query",
        "INVALID_INPUT",
        `${error}`,
        query
      );
    }

    return this.query({ query, database });
  }
}
