# Products

The project with focus in tests. I create a insert, update and select statements for a simple table, with focuos in unitary tests. Testing all errors and try cause this errors. I use the sinon to mock the result for don't need access everytime the database in tests, and use the nyc istanbul to check if all is coverage.

This project use the `mocha`, `sinon` and `nyc istanbul` for tests and `mysql2` for connect to mysql database

#### Result of coverage



File            | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s |
----------------|---------|----------|---------|---------|-------------------|
All files       |     100 |      100 |     100 |     100 |                   |
 constants      |     100 |      100 |     100 |     100 |                   |
  constants.js  |     100 |      100 |     100 |     100 |                   |
 db             |     100 |      100 |     100 |     100 |                   |
  connection.js |     100 |      100 |     100 |     100 |                   |
  model.js      |     100 |      100 |     100 |     100 |                   |

  ## Functionalities

- Insert, update and select records from database
- Test all cases of errors
- Separate test suite