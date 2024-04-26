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
}

export {CONFIG_DB, SQL_ERRORS}