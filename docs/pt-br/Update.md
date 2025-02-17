# Update

A função update aceita 1 tipagem

```typescript
type Table = {
  id: number
  name: string
}

const data = await odbcClient.update<Partial<Table>>({
  data: {
    name: 'name',
  },
  table: 'users',
  database: 'example', // Apenas se o Client foi configurado de maneira explicita
  where: 'id = 1', // ⚠️ ATENÇÃO ⚠️ Updates sem a clausula *where* irão atualizar todos os registros
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
