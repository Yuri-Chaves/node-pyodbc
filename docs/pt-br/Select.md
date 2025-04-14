# Select

A função select aceita 3 tipagens

- TableA: Tipagem da tabela principal
- TableB: Tipagem da tabela join
- Data: Tipagem dos dados de retorno

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
  columns: ["name"], // aceita '*' para selecionar todas as colunas da tabela principal
  table: "users",
  database: "example", // Apenas se o Client foi configurado de maneira explicita
  join: {
    table: "countries",
    on: {
      columnA: "id",
      columnB: "id",
      operator: "=", // Quando omitido, o padrão é '='
    },
    columns: ["country"], // aceita '*' para selecionar todas as colunas da tabela join
    type: "INNER", // "INNER" | "LEFT" | "RIGHT"
  },
  options: {
    limit: 100,
    offset: 0,
    order: {
      columns: ["users.name"], // Quando realizado o join em outra tabela, a queryString é montada utilizando o nome de cada tabela como alias
      direction: "ASC", // "ASC" | "DESC"
    },
  },
  where:
    "where countries.country = 'Brasil' or countries.country = 'United States'", // Quando realizado o join em outra tabela, a queryString é montada utilizando o nome de cada tabela como alias
});
```

#### Outras formas de utilização de `ON`

```typescript
on : {
  columnA: 'id',
  columnB: 'id',
}
```

Mesmo que `"users.id = countries.id"`

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

mesmo que `(users.id <> countries.id) AND (users.id > countries.id)`

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

mesmo que `(users.id <> countries.id) OR (users.id > countries.id)`

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

Mesmo que `(((users.id <> countries.id) AND (users.id > countries.id)) OR (users.id = countries.id))`

A função retorna um objeto ou um array de objetos contendo os dados selecionados
