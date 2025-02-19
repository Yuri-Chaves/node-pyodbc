# Select

A função select aceita 2 tipagens
- TableA: Tipagem da tabela principal
- TableB: Tipagem da tabela join
- Data: Tipagem dos dados de retorno
```typescript
type TableA = {
  id: number
  name: string
}

type TableB = {
  id: number
  country: string
}

type Data = TableA["name"] & TableB["country"]

const data = await odbcClient.select<TableA, TableB, Data>({
  columns: ['name'], // aceita '*' para selecionar todas as colunas da tabela principal
  table: 'users',
  database: 'example', // Apenas se o Client foi configurado de maneira explicita
  join: {
    table: 'countries',
    on: {
      columnA: 'id',
      columnB: 'id'
    },
    columns: ['country'], // aceita '*' para selecionar todas as colunas da tabela join
    type: 'INNER' // "INNER" | "LEFT" | "RIGHT"
  },
  options: {
    limit: 100,
    offset: 0,
    order: {
      columns: ['users.name'], // Quando realizado o join em outra tabela, a queryString é montada utilizando o nome de cada tabela como alias
      direction: 'ASC' // "ASC" | "DESC"
    }
  },
  where: "where countries.country = 'Brasil' or countries.country = 'United States'", // Quando realizado o join em outra tabela, a queryString é montada utilizando o nome de cada tabela como alias
})
```

A função retorna um objeto ou um array de objetos contendo os dados selecionados
