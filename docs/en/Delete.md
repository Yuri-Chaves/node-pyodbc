# Delete

The delete function doesn't accept any type

```typescript
const data = await odbcClient.delete({
  table: 'users',
  database: 'example', // Only if the Client has been explicitly configured
  where: 'id = 1', // ⚠️ WARNING ⚠️ Delete without the *where* clause will remove all records from the table
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
