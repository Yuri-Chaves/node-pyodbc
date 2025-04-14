# Select

The select function accepts 3 types

- TableA: Main table type
- TableB: Join table type
- Data: Data return type

```typescript
type TableA = {
  id: number;
  name: string;
};

type TableB = {
  id: number;
  country: string;
};

type Data = TableA["name"] & TableB["country"];

const data = await odbcClient.select<TableA, TableB, Data>({
  columns: ["name"], // accept '*' to select all columns of the main table
  table: "users",
  database: "example", // Only if the Client has been explicitly configured
  join: {
    table: "countries",
    on: {
      columnA: "id",
      columnB: "id",
      operator: "=", // When omitted, the default is '='
    },
    columns: ["country"], // accept '*' to select all columns of the join table
    type: "INNER", // "INNER" | "LEFT" | "RIGHT"
  },
  options: {
    limit: 100,
    offset: 0,
    order: {
      columns: ["users.name"], // When joining another table, the queryString is mounted using each table name as an alias
      direction: "ASC", // "ASC" | "DESC"
    },
  },
  where:
    "where countries.country = 'Brasil' or countries.country = 'United States'", // When joining another table, the queryString is mounted using each table name as an alias
});
```

#### Another way to use `ON`

```typescript
on : {
  columnA: 'id',
  columnB: 'id',
}
```

Same as `"users.id = countries.id"`

```typescript
on: [
  "AND",
  [
    {
      columnA: "id",
      columnB: "id",
      operator: "<>",
    },
    {
      columnA: "id",
      columnB: "id",
      operator: ">",
    },
  ],
];
```

Same as `(users.id <> countries.id) AND (users.id > countries.id)`

```typescript
on: [
  "OR",
  [
    {
      columnA: "id",
      columnB: "id",
      operator: "<>",
    },
    {
      columnA: "id",
      columnB: "id",
      operator: ">",
    },
  ],
];
```

Same as `(users.id <> countries.id) OR (users.id > countries.id)`

```typescript
on: [
  "OR",
  [
    [
      "AND",
      [
        {
          columnA: "id",
          columnB: "id",
          operator: "<>",
        },
        {
          columnA: "id",
          columnB: "id",
          operator: ">",
        },
      ],
    ],
    {
      columnA: "id",
      columnB: "id",
    },
  ],
];
```

Same as `(((users.id <> countries.id) AND (users.id > countries.id)) OR (users.id = countries.id))`

The function returns an object or an array of objects containing the selected data
