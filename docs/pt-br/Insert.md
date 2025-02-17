# Insert

A função insert aceita 1 tipagem

```typescript
type Table {
  id: number
  name: string
}

const data = await odbcClient.insert<Table>({
  table: 'users',
  database: 'example', // Apenas se o Client foi configurado de maneira explicita
  replace: false, // Substitui o registro já existente
  data: {
    id: 1,
    name: 'John Doe'
  }, // caso deseje inserir múltiplos registros (array), verifique se o DBMS aceita a sintaxe `INSERT INTO <table> (<columns>) VALUES (...), (...), ...;`
})
```

retorna um objeto do tipo
```typescript
type InsertReturn = {
  code: TODBCErrorCode | 'SUCCESS'
  message: string
  details: string
}
```
