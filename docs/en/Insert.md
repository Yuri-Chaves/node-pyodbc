# Insert

The insert function accepts 1 type

```typescript
type Table {
  id: number
  name: string
}

const data = await odbcClient.insert<Table>({
  table: 'users',
  database: 'example', // Only if the Client has been explicitly configured
  replace: false, // Replace the existing register
  data: {
    id: 1,
    name: 'John Doe'
  }, // if you want to insert multiple records (array), use the [insertMultiple](https://github.com/Yuri-Chaves/node-pyodbc/blob/main/docs/en/InsertMultiple.md) method
})
```

returns an object of type

```typescript
type InsertReturn = {
  code: TODBCErrorCode | "SUCCESS";
  message: string;
  details: string;
};
```
