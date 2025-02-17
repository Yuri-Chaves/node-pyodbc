"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.utils = void 0;
function mountSelectString(columns, prefix) {
    let selectString;
    const _prefix = `${prefix}.` || '';
    if (Array.isArray(columns)) {
        selectString = columns.map(column => `${_prefix}${column.toString()}`).join(', ');
    }
    else {
        selectString = `${_prefix}${columns}`;
    }
    return selectString;
}
exports.utils = {
    mountSelectString
};
