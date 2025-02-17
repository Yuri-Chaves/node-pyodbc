# Requisitos

- Binários unixODBC e bibliotecas de desenvolvimento para compilação de módulos
  - No **Ubuntu/Debian** `sudo apt-get install unixodbc unixodbc-dev`
  - No **RedHat/CentOS** `sudo yum install unixODBC unixODBC-devel`
  - No **OSX**
    - usando *macports.org* `sudo port unixODBC`
    - usando *brew* `brew install unixODBC`
  - No **FreeBSD** `from ports cd /usr/ports/databases/unixODBC; make install`
  - No **IBM i** `yum install unixODBC unixODBC-devel` (requer [yum](https://ibmi-oss-docs.readthedocs.io/en/latest/yum/README.html))
- Drivers ODBC para banco de dados de destino
- Configuração correta de odbc.ini e odbcinst.ini.
- [python 3.X.X](https://www.python.org/)
- [pyodbc](https://github.com/mkleehammer/pyodbc)
- Node.js >=18.20.4

## Configurando o Client
O Client ODBC aceita 2 tipagens para a configuração
```typescript
import type { IODBCDNSConfig, IODBCNoDNSConfig } from 'node-pyodbc'

// Configuração explícita
// const config : IODBCNoDNSConfig = {
//   driver: "DRIVER",
//   server: "myServer",
//   database: "myDatabase", // Opcional
//   user: "ME",
//   password: "somePa$$word",
// }

// Configuração DNS
const config: IODBCDNSConfig = {
  dns: "DNS=MYDNS",
  user: "ME",
  password: "somePa$$word"
}
```
Basta criar uma instância do Client passando a configuração
```typescript
import { ODBCClient } from 'node-pyodbc'

const odbcClient = new ODBCClient(config)
```

## DML's

A biblioteca dispõe de algumas funções para realizar a manipulação de dados. Sendo:
- [select](https://github.com/Yuri-Chaves/node-pyodbc/blob/main/docs/pt-br/Select.md)
- [insert](https://github.com/Yuri-Chaves/node-pyodbc/blob/main/docs/pt-br/Insert.md)
- [update](https://github.com/Yuri-Chaves/node-pyodbc/blob/main/docs/pt-br/Update.md)
- [delete](https://github.com/Yuri-Chaves/node-pyodbc/blob/main/docs/pt-br/Delete.md)

E caso você deseje realizar uma query mais complexa, utilize a função [query](https://github.com/Yuri-Chaves/node-pyodbc/blob/main/docs/pt-br/Query.md)
