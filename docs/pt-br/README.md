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
