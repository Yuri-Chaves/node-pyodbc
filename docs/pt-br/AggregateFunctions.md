# Aggregate functions

Uma função de agregação é uma função que realiza um cálculo em um conjunto de valores e retorna um único valor.

As funções agregadas são:
- `MIN()`: Retorna o menor valor presente na coluna selecionada.
- `MAX()`: Retorna o maior valor presente na coluna selecionada.
- `COUNT()`: Retorna o número de linhas em um conjunto.
- `SUM()`: Retorna a soma total de uma coluna numérica.
- `AVG()`: Retorna o valor médio de uma coluna numérica.

Funções agregadas ignoram valores **NULL** (exceto `COUNT()`)

```typescript
type Table = {
  productName: string
  categoryID: number
  price: number
}

type Result = {
  categoryID: Table["categoryID"]
  aggregateFn: number
}

const result = await odbcClient.aggregateFunction<Table, Result>({
  fn: 'SUM',
  column: 'price',
  table: 'products',
  groupBy: ['categoryID'],
  alias: 'aggregateFn',
  distinct: true,
  database: 'myDatabase',
  expression: '* .10', // Adiciona 10% em cada valor
  where: 'price > 50',
})

console.log(result.aggregateFn)
```

| **Parâmetro** | **Tipo** | **Descrição** | **Observação** | **Obrigatório** |
| :-------: | :--: | :-------: | :--------: | :---------: |
| fn | 'MIN' \| 'MAX' \| 'COUNT' \| 'SUM' \| 'AVG' | Função agregada que será executada | | ✔️ |
| column | string \| keyof T \| '\*' | Coluna onde será executada a função | **'*'** somente funciona na função `COUNT()` | ✔️ |
| table | string | Nome da tabela onde a função será executada | | ✔️ |
| groupBy | Array<string \| keyof T> | Agrupa o conjunto de resultados da função em uma ou mais colunas | | |
| alias | string | Cria um 'apelido' para a coluna contendo os resultados da função | | |
| distinct | boolean | Quando `true`, ignora duplicatas | Somente funciona na função `COUNT()` | |
| database | string | Nome do banco de dados | É **obrigatório** caso você não tenha especificado um durante a configuração do [client](https://github.com/Yuri-Chaves/node-pyodbc/blob/main/docs/pt-br/README.md#configurando-o-client) | |
| expression | string | Expressão usada para manipular os valores | Somente funciona na função `SUM()` | |
|where | string | Filtra os dados que serão usados na função | | |
| **Parâmetro** | **Tipo** | **Descrição** | **Observação** | **Obrigatório** |