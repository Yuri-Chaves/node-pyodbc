# Query

A função query recebe 1 tipagem

O uso dessa função é recomendado para queries mais complexos, que as demais funções não atendam adequadamente
```typescript
type T = {
  COUNT: number
}

const count = await odbcClient.query<T>({
  database: 'example', // Apenas se o Client foi configurado de maneira explicita
  query: "SELECT Count(*) AS COUNT FROM (SELECT country FROM countries);"
})
```

retorna _T_
