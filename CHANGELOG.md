# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2025-03-21

### Changed

- Restricted the `insert` to only insert one value.

### Added

- Insert multiple values function (`insertMultiple`) to insert multiple values at once.

## [0.2.1]

### Fixed

- Enable array in `groupBy`
- Aggregate function error ('SyntaxError: Unexpected token S in JSON at position 0')

## [0.2.0] - 2025-02-18

### Added

- Aggregate Functions
  - Min()
  - Max()
  - Count()
  - Sum()
  - Avg()

### Fixed

- Join feature in select function

## [0.1.0] - 2025-02-17

### Added

- First experimental version of the library.
- Client class
- Error class
- Base ODBC connection using Python ([pyodbc](https://github.com/mkleehammer/pyodbc))
- Query function
- Basic DML functions
  - Delete
  - Insert
  - Select
  - Update
- Types definition
