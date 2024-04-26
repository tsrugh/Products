import { SQL_ERRORS } from "../constants/constants.js";
import Connection from "./connection.js";


function main () {

    const teste = new Connection();

    const sql = teste.makeConnection()

    sql.query('SELECT * FROM employee', (err, result, fields) => {

        if(err) {
            
            teste.closeConnection(sql)
            throw new Error(SQL_ERRORS.SQL_STATEMENT_ERROR)
        }

        console.log(err)
        console.log(result)
        console.log(fields) 
        teste.closeConnection(sql)

    })

}


main();