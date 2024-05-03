import { SQL_ERRORS } from "../constants/constants.js";
import Connection from "./connection.js";
import { promisify } from 'util'
import fs from 'fs'

class Model {

    #conn = new Connection()

    async insertEmployee(name, email, phone) {

        const sql = await this.#conn.makeConnection();

        try {
            const [results, fields] = await sql.query(`INSERT INTO employee (employeeName, employeeEmail, employeePhone) values (?, ?, ?)`, [
                name, email, phone
            ])

            // close the connection
            this.#conn.closeConnection(sql)
            if (results.affectedRows == 1) {
                return {
                    valid: true,
                    id: results.insertId,
                    error: undefined,
                    message: 'Success registration'
                }
            }

        } catch (error) {
            // close the connection
            console.log(error)
            this.#conn.closeConnection(sql)
            switch (error.code) { //ER_DATA_TOO_LONG Data too long for column 'employeePhone' at row 1
                case 'ER_PARSE_ERROR':
                    return {
                        valid: false,
                        error: SQL_ERRORS.SQL_SYNTAX,
                        message: error.sqlMessage
                    }
                case 'ER_DUP_ENTRY':
                    return {
                        valid: false,
                        error: SQL_ERRORS.SQL_DUPLICATE_ENTRY,
                        message: error.sqlMessage
                    }
                default:
                    return {
                        result: undefined,
                        error: SQL_ERRORS.SQL_UNKOWN_ERROR,
                        message: 'An unknown error has occurred',
                        code: 'UNKOWN'
                    }
            }

        }

    }

    async updateEmplyee(name, phone, email) {

        const sql = await this.#conn.makeConnection();
        try {
            // get id
            const { result, error, message, code } = await this.searchId('employeeId', 'employee', 'employeeEmail', email)
            if (error) {
                throw {
                    code,
                    error,
                    message
                }
            }

            const { employeeId } = result
            const [results, fields] = await sql.query('UPDATE employee set employeeName = ?, employeePhone = ? WHERE employeeId = ?', [name, phone, 0])
            this.#conn.closeConnection(sql)
            if (results.affectedRows == 1) {
                return {
                    valid: true,
                    error: undefined,
                    message: 'Update success'
                }
            } else {

                throw {
                    error: SQL_ERRORS.SQL_UPDATE_ERROR,
                    valid: false,
                    code: 'ER_UPDATE',
                    message: 'Cannot update, try again.'
                }

            }

        } catch (error) {
            console.log(error)
            this.#conn.closeConnection(sql)
            //console.log(error)
            switch (error.code) {
                // syntax error
                case 'ER_PARSE_ERROR':
                    return {
                        result: undefined,
                        error: SQL_ERRORS.SQL_SYNTAX,
                        message: error.sqlMessage,
                        code: error.code
                    }
                // none register
                case 'ER_ZERO_RECORDS':
                    return {
                        result: undefined,
                        error: SQL_ERRORS.SQL_DONT_HAVE_REGISTER,
                        message: error.message,
                        code: error.code
                    }
                case 'ER_UPDATE':
                    return {
                        result: undefined,
                        error: SQL_ERRORS.SQL_UPDATE_ERROR,
                        message: error.message,
                        code: error.code
                    }
                default:
                    return {
                        result: undefined,
                        error: SQL_ERRORS.SQL_UNKOWN_ERROR,
                        message: 'An unknown error has occurred',
                        code: 'UNKOWN'
                    }
            }
        }

    }

    // search id for the update
    async searchId(key, table, field, value) {

        const sql = await this.#conn.makeConnection()
        try {
            const query = `SELECT ${key} FROM ${table} WHERE ${field} = ?`
            const [results, fields] = await sql.query(query, [value])

            this.#conn.closeConnection(sql)
            // if dosen't exists the record, throw an exception
            if (!results[0]) {
                throw {
                    code: 'ER_ZERO_RECORDS',
                    message: SQL_ERRORS.SQL_DONT_HAVE_REGISTER,
                }
            }
            // close connection
            return {
                valid: true,
                result: results[0],
                error: undefined,

            }
        } catch (error) {
            this.#conn.closeConnection(sql)
            switch (error.code) {
                // syntax error
                case 'ER_PARSE_ERROR':
                    return {
                        result: undefined,
                        error: SQL_ERRORS.SQL_SYNTAX,
                        message: error.sqlMessage,
                        code: error.code
                    }
                // none register
                case 'ER_ZERO_RECORDS':
                    return {
                        result: undefined,
                        error: SQL_ERRORS.SQL_DONT_HAVE_REGISTER,
                        message: error.message,
                        code: error.code
                    }
                default:
                    return {
                        result: undefined,
                        error: SQL_ERRORS.SQL_UNKOWN_ERROR,
                        message: 'An unknown error has occurred',
                        code: 'UNKOWN'
                    }
            }
        }
    }

    async searchInfo(email) {

        const sql = await this.#conn.makeConnection();

        try {
            const query = `SELECT employeeName, employeeEmail, employeePhone from employee WHERE employeeEmail = ?`
            const [results, fields] = await sql.query(query, [email])

            this.#conn.closeConnection(sql)
            // if dosen't exists the record, throw an exception
            if (!results[0]) {
                throw {
                    code: 'ER_ZERO_RECORDS',
                    message: SQL_ERRORS.SQL_DONT_HAVE_REGISTER,
                }
            }

            return {
                valid: true,
                result: results,
                error: undefined
            }


        } catch (error) {
            this.#conn.closeConnection(sql)
            switch (error.code) {
                // syntax error
                case 'ER_PARSE_ERROR':
                    return {
                        result: undefined,
                        error: SQL_ERRORS.SQL_SYNTAX,
                        message: error.sqlMessage,
                        code: error.code
                    }
                // none register
                case 'ER_ZERO_RECORDS':
                    return {
                        result: undefined,
                        error: SQL_ERRORS.SQL_DONT_HAVE_REGISTER,
                        message: error.message,
                        code: error.code
                    }
                default:
                    return {
                        result: undefined,
                        error: SQL_ERRORS.SQL_UNKOWN_ERROR,
                        message: 'An unknown error has occurred',
                        code: 'UNKOWN'
                    }
            }
        }

    }
}

async function main() {

    const model = new Model()
    //const result = await model.insertEmployee('maria lucida', 'marialucida3@gmail.com', '11987456325');
    //const result = await model.insertEmployee('matheus matheus', 'matheus@gmail.com', '11964881935');
    //console.log(result)

    const result = await model.searchId('employeeId', 'employee', 'employeeEmail', 'lucaspdsts@gmail.com')
    //model.searchId('userEmployeeId', 'userEmployee', 'userEmployeeLogin', 'tsrugh')

    // const result = await model.updateEmplyee('lucas pereira dos santos', '11971008836', 'lucaspdsts@gmail.com')
    // console.log(result)

    // const result = await model.searchInfo('lucaspdsts@gmail.com')
    // console.log(result)

    fs.appendFileSync('../../mocks/db_mocks/invalid_seachId_zero_occurrences.json', JSON.stringify(result))

}

main()

export default Model