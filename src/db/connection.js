const mysql2 = require('mysql2/promise.js')
const { CONFIG_DB, SQL_ERRORS } = require('../constants/constants.js')

class Connection {

    async makeConnection () {

        const connection = await mysql2.createConnection(CONFIG_DB)
        
        return connection
    }

    closeConnection (connection){

        connection.end()

    }

}


module.exports = Connection