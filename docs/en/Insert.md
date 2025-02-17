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
  }, // if you want to insert multiple records (array), check that the DBMS accepts the syntax `INSERT INTO <table> (<columns>) VALUES (...), (...), ...
})
```

returns an object of type
```typescript
type InsertReturn = {
  code: TODBCErrorCode | 'SUCCESS'
  message: string
  details: string
}
```
