import mysql2 from 'mysql2'
import { CONFIG_DB, SQL_ERRORS } from '../constants/constants.js'

class Connection {

    makeConnection () {

        const connection = mysql2.createConnection(CONFIG_DB)
        
        connection.connect((err) =>{
            if(err) throw new Error(SQL_ERRORS.SQL_CONNECTION_ERROR)
        })
        return connection
    }

    closeConnection (connection){

        connection.end()

    }

}

export default Connection