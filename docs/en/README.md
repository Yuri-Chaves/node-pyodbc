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
