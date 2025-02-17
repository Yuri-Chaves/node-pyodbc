# Update

The update function accepts 1 type

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
  database: 'example', // Only if the Client has been explicitly configured
  where: 'id = 1', // ⚠️ WARNING ⚠️ Updates without the *where* clause will update all records
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
