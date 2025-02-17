# Select

The select function accepts 2 types
- TableA: Main table type
- TableB: Join table type
```typescript
type TableA = {
  id: number
  name: string
}

type TableB = {
  id: number
  country: string
}

const data = await odbcClient.select<TableA, TableB>({
  columns: ['name'], // accept '*' to select all columns of the main table
  table: 'users',
  database: 'example', // Only if the Client has been explicitly configured
  join: {
    table: 'countries',
    on: {
      columnA: 'id',
      columnB: 'id'
    },
    columns: ['country'], // accept '*' to select all columns of the join table
    type: 'INNER' // "INNER" | "LEFT" | "RIGHT"
  },
  options: {
    limit: 100,
    offset: 0,
    order: {
      columns: ['users.name'], // When joining another table, the queryString is mounted using each table name as an alias
      direction: 'ASC' // "ASC" | "DESC"
    }
  },
  where: "where countries.country = 'Brasil' or countries.country = 'United States'", // When joining another table, the queryString is mounted using each table name as an alias
})
```

The function returns an object or an array of objects containing the selected data
