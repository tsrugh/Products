import mysql2 from 'mysql2/promise.js'
import { CONFIG_DB, SQL_ERRORS } from '../constants/constants.js'

class Connection {

    async makeConnection () {

        const connection = await mysql2.createConnection(CONFIG_DB)
        
        return connection
    }

    closeConnection (connection){

        connection.end()

    }

}


export default Connection