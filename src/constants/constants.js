const CONFIG_DB = {
    host: 'localhost',
    user: 'root',
    password: 'senha123',
    database: 'product_sys',
    insecureAuth: true
}

const SQL_ERRORS = {
    SQL_CONNECTION_ERROR: 'Failed to connect msql, try again later.',
    SQL_STATEMENT_ERROR: 'Error in sql statement, please try again later.',
    SQL_DUPLICATE_ENTRY: 'Error, you try to add a duplicate key.',
    SQL_SYNTAX: 'You have an error in your SQL syntax.',
    SQL_DONT_HAVE_REGISTER: 'No records found.',
    SQL_UPDATE_ERROR: 'Cannot update, the id is invalid.',
    SQL_TOO_LONG: 'The passed value is too long.',
    SQL_UNKOWN_ERROR: 'An unknown error has occurred.',
}

module.exports = {CONFIG_DB, SQL_ERRORS}