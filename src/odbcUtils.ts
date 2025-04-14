import { TInsertMultipleModel, TJoinOn } from "./interfaces";

function mountSelectString(columns: Array<any> | string, prefix?: string) {
  let selectString: string;
  const _prefix = `${prefix}.` || "";
  if (Array.isArray(columns)) {
    selectString = columns
      .map((column) => `${_prefix}${column.toString()}`)
      .join(", ");
  } else {
    selectString = `${_prefix}${columns}`;
  }
  return selectString;
}

function mountOnString<TTableA extends object, TTableB extends object>(
  condition: TJoinOn<TTableA, TTableB>,
  prefixA: string,
  prefixB: string
): string {
  if (!condition) {
    return "";
  }
  if (!Array.isArray(condition)) {
    const operator = condition.operator || "=";
    return `${prefixA}.${condition.columnA} ${operator} ${prefixB}.${condition.columnB}`;
  }
  const [clause, conditions] = condition;
  return `( ${conditions
    .map((con) => mountOnString(con, prefixA, prefixB))
    .join(`) ${clause} (`)} )`;
}

function mountMultipleInsertString(
  table: string,
  data: Array<object>,
  model: TInsertMultipleModel,
  replace: boolean = false
) {
  const columnNames = Object.entries(data[0])
    .filter(([_, value]) => value !== undefined)
    .map((value) => {
      return value[0];
    });
  const columnValues: Array<string> = [];

  data.map((d) => {
    const arr: Array<string> = [];
    Object.entries(d)
      .filter(([_, value]) => value !== undefined)
      .map((value) => {
        if (typeof value[1] === "string") {
          arr.push(`'${value[1]}'`);
        } else if (typeof value[1] === "object") {
          arr.push(`'${JSON.stringify(value[1])}'`);
        } else {
          arr.push(value[1]);
        }
      });
    columnValues.push(`(${arr.join(", ")})`);
  });

  if (model === "MULTIPLE_VALUES") {
    return `INSERT${
      (replace && " OR REPLACE") || ""
    } INTO ${table}(${columnNames.join(", ")}) VALUES ${columnValues.join(
      ", "
    )};`;
  } else if (model === "SELECT_FROM") {
    return `INSERT${
      (replace && " OR REPLACE") || ""
    } INTO ${table}(${columnNames.join(", ")}) SELECT ${columnNames
      .map((item) => `V.${item}`)
      .join(", ")} FROM (VALUES ${columnValues.join(", ")})V(${columnNames.join(
      ", "
    )});`;
  }
  return `INSERT${
    (replace && " OR REPLACE") || ""
  } INTO ${table}(${columnNames.join(", ")}) SELECT ${columnValues
    .map((item) => item.replace(/^\(|\)$/g, ""))
    .join(" UNION ALL SELECT ")}`;
}

export const utils = {
  mountSelectString,
  mountOnString,
  mountMultipleInsertString,
};
