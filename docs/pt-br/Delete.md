# Delete

A função delete não aceita nenhuma tipagem

```typescript
const data = await odbcClient.delete({
  table: 'users',
  database: 'example', // Apenas se o Client foi configurado de maneira explicita
  where: 'id = 1', // ⚠️ ATENÇÃO ⚠️ Delete sem a clausula *where* irá remover todos os registros da tabela
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
