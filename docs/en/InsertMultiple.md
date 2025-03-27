# Insert Multiple

The insertMultiple function accepts 1 type

```typescript
type Table {
  id: number
  name: string
  age: number
}

const data = await odbcClient.insertMultiple<Table>({
  table: 'users',
  database: 'example', // Only if the Client has been explicitly configured
  replace: false, // Replace the existing register
  data: [
    {
      id: 1,
      name: 'John Doe'
    },
    {
      id: 2,
      name: 'Jane Doe'
    }
  ],
  model: 'UNION_ALL'
})
```

returns an object of type

```typescript
type InsertReturn = {
  code: TODBCErrorCode | "SUCCESS";
  message: string;
  details: string;
};
```

## Property Model

Define the insertion multiple values syntax

### Values

###### MULTIPLE_VALUES

SQL Server 2008 and later. **limited** to `1000 records`

```sql
INSERT INTO <table> (<columns>) VALUES (...), (...), ...;
```

**example**:

```sql
INSERT INTO example(id, name) VALUES (1, 'John Doe'), (2, 'Jane Doe');
```

> ⚠️ Make sure your [DBMS](https://www.geeksforgeeks.org/introduction-of-dbms-database-management-system-set-1/) accepts this syntax.

###### SELECT_FROM

MULTIPLE*VALUES \_workaround* for more than `1000 records`

```sql
INSERT INTO <table> (<columnA>, <columnB>, ...) SELECT V.<columnA>, V.<columnB>,... FROM (VALUES(<valueA>, <valueB>,...), (<valueA>, <valueB>,...), ..., (<valueA>, <valueB>,...)V(<columnA>, <columnB> ...));
```

**example**:

```sql
INSERT INTO example(id, name) SELECT V.id, V.name FROM (VALUES(1, 'John Doe'), (2, 'Jane Doe')) V(id, name);
```

> ⚠️ Make sure your [DBMS](https://www.geeksforgeeks.org/introduction-of-dbms-database-management-system-set-1/) accepts `MULTIPLE_VALUES` syntax.

###### UNION_ALL

SQL Server 2005 and later based

> Can be used for [DBMS](https://www.geeksforgeeks.org/introduction-of-dbms-database-management-system-set-1/) that do not support the `MULTIPLE_VALUES` syntax.

```sql
INSERT INTO <table> (<columns>) SELECT <values> UNION ALL SELECT <values> UNION ALL ... UNION ALL SELECT <values>;
```

**example**:

```sql
INSERT INTO example(id, name) SELECT 1, 'John Doe' UNION ALL SELECT 2, 'Jane Doe';
```
