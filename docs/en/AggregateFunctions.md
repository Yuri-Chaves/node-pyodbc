# Aggregate functions

An aggregate function is a function that performs a calculation on a set of values, and returns a single value.

The aggregate functions are:
- `MIN()`: Returns the smallest value within the selected column
- `MAX()`: Returns the largest value within the selected column
- `COUNT()`: Returns the number of rows in a set
- `SUM()`: Returns the total sum of a numerical column
- `AVG()`: Returns the average value of a numerical column

Aggregate functions ignore **NULL** values (except for `COUNT()`)

```typescript
type Table = {
  productName: string
  categoryID: number
  price: number
}

type Result = {
  categoryID: Table["categoryID"]
  aggregateFn: number
}

const result = await odbcClient.aggregateFunction<Table, Result>({
  fn: 'SUM',
  column: 'price',
  table: 'products',
  groupBy: ['categoryID'],
  alias: 'aggregateFn',
  distinct: true,
  database: 'myDatabase',
  expression: '* .10', // Add 10% in each value
  where: 'price > 50',
})

console.log(result.aggregateFn)
```

| **Parâmetro** | **Tipo** | **Descrição** | **Observação** | **Obrigatório** |
| :-------: | :--: | :-------: | :--------: | :---------: |
| fn | 'MIN' \| 'MAX' \| 'COUNT' \| 'SUM' \| 'AVG' | Aggregate function to be executed | | ✔️ |
| column | string \| keyof T \| '\*' | Column where the function will be executed| **'*'** works only in `COUNT()` function | ✔️ |
| table | string | Table name where the function will be executed| | ✔️ |
| groupBy | Array<string \| keyof T> | Group the result-set by one or more columns | | |
| alias | string | Used to give the result-set column a temporary name   | | |
| distinct | boolean | When `true`, ignore duplicates | Works only in `COUNT()` function | |
| database | string | Database name | Is **required** if you didn't specified one while config the [client](https://github.com/Yuri-Chaves/node-pyodbc/blob/main/docs/en/README.md#configuring-the-client)  | |
| expression | string | You can manipulate the values using expression | Works only on `SUM()` function | |
|where | string | Filter the records | | |
| **Parâmetro** | **Tipo** | **Descrição** | **Observação** | **Obrigatório** |