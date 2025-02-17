# Query

The query function accepts 1 type

The use of this function is recommended for more complex queries, that the other functions do not work properly
```typescript
type T = {
  COUNT: number
}

const count = await odbcClient.query<T>({
  database: 'example', // Only if the Client has been explicitly configured
  query: "SELECT Count(*) AS COUNT FROM (SELECT country FROM countries);"
})
```

returns _T_
