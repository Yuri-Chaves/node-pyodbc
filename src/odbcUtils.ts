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

export const utils = {
  mountSelectString,
};
