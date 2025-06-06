# Requirements

- unixODBC binaries and development libraries for module compilation
  - on **Ubuntu/Debian** `sudo apt-get install unixodbc unixodbc-dev`
  - on **RedHat/CentOS** `sudo yum install unixODBC unixODBC-devel`
  - on **OSX**
    - using *macports.org* `sudo port unixODBC`
    - using *brew* `brew install unixODBC`
  - on **FreeBSD** `from ports cd /usr/ports/databases/unixODBC; make install`
  - on **IBM i** `yum install unixODBC unixODBC-devel` (requires [yum](https://ibmi-oss-docs.readthedocs.io/en/latest/yum/README.html))
- ODBC drivers for target database
- properly configured odbc.ini and odbcinst.ini.
- [python 3.X.X](https://www.python.org/)
- [pyodbc](https://github.com/mkleehammer/pyodbc)
- Node.js >=18.20.4

## Configuring the Client
The ODBC Client accepts 2 types for configuration
```typescript
import type { IODBCDNSConfig, IODBCNoDNSConfig } from 'node-pyodbc'

// Explicit configuration
// const config : IODBCNoDNSConfig = {
//   driver: "DRIVER",
//   server: "myServer",
//   database: "myDatabase", // Opcional
//   user: "ME",
//   password: "somePa$$word",
// }

// DNS configuration
const config: IODBCDNSConfig = {
  dns: "DNS=MYDNS",
  user: "ME",
  password: "somePa$$word"
}
```
Simply create a Client instance by passing the configuration
```typescript
import { ODBCClient } from 'node-pyodbc'

const odbcClient = new ODBCClient(config)
```

## DML's

The library has some functions to perform data manipulation. They are:
- [select](https://github.com/Yuri-Chaves/node-pyodbc/blob/main/docs/en/Select.md)
- [insert](https://github.com/Yuri-Chaves/node-pyodbc/blob/main/docs/en/Insert.md)
- [update](https://github.com/Yuri-Chaves/node-pyodbc/blob/main/docs/en/Update.md)
- [delete](https://github.com/Yuri-Chaves/node-pyodbc/blob/main/docs/en/Delete.md)

And if you want to perform a more complex query, use the [query](https://github.com/Yuri-Chaves/node-pyodbc/blob/main/docs/en/Query.md) function

## Aggregate Functions

If you want to perform an aggregate function, use the [aggregateFunction](https://github.com/Yuri-Chaves/node-pyodbc/blob/main/docs/en/AggregateFunctions.md) function
