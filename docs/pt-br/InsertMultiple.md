# Insert Multiple

A função insertMultiple aceita 1 tipagem

```typescript
type Table {
  id: number
  name: string
  age: number
}

const data = await odbcClient.insertMultiple<Table>({
  table: 'users',
  database: 'example', // Apenas se o Client foi configurado de maneira explicita
  replace: false, // Substitui os registros já existentes
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

retorna um objeto do tipo

```typescript
type InsertReturn = {
  code: TODBCErrorCode | "SUCCESS";
  message: string;
  details: string;
};
```

## Propriedade Model

Define a sintaxe de inserção de múltiplos valores

### Valores

###### MULTIPLE_VALUES

SQL Server 2008 e posteriores. **limitado** a `1000 registros`

```sql
INSERT INTO <table> (<columns>) VALUES (...), (...), ...;
```

**exemplo**:

```sql
INSERT INTO example(id, name) VALUES (1, 'John Doe'), (2, 'Jane Doe');
```

> ⚠️ Certifique-se de que seu [DBMS](https://www.geeksforgeeks.org/introduction-of-dbms-database-management-system-set-1/) suporta essa sintaxe.

###### SELECT_FROM

MULTIPLE_VALUES _workaround_ para mais de `1000 registros`

```sql
INSERT INTO <table> (<columnA>, <columnB>, ...) SELECT V.<columnA>, V.<columnB>,... FROM (VALUES(<valueA>, <valueB>,...), (<valueA>, <valueB>,...), ..., (<valueA>, <valueB>,...)V(<columnA>, <columnB> ...));
```

**exemplo**:

```sql
INSERT INTO example(id, name) SELECT V.id, V.name FROM (VALUES(1, 'John Doe'), (2, 'Jane Doe')V(id, name));
```

> ⚠️ Certifique-se de que seu [DBMS](https://www.geeksforgeeks.org/introduction-of-dbms-database-management-system-set-1/) suporta a sintaxe `MULTIPLE_VALUES`.

###### UNION_ALL

SQL Server 2005 e posteriores

> Pode ser usado para [DBMS](https://www.geeksforgeeks.org/introduction-of-dbms-database-management-system-set-1/) que não suportam a sintaxe `MULTIPLE_VALUES`.

```sql
INSERT INTO <table> (<columns>) SELECT <values> UNION ALL SELECT <values> UNION ALL ... UNION ALL SELECT <values>;
```

**exemplo**:

```sql
INSERT INTO example(id, name) SELECT 1, 'John Doe' UNION ALL SELECT 2, 'Jane Doe';
```
