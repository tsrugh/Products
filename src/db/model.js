const fs = require('fs')
const { SQL_ERRORS } = require("../constants/constants.js")
const Connection = require("./connection.js")


class Model {

    #conn = new Connection()
    /** 
     * This method makes a insert of an employee on database.
     * 
     * ```js
     *  const model = new Model()
     *  model.insertEmployee('exemple@gmail.com','exemple name', 'DD999999999')
     * ```
     * If the query sentence is right, then `valid` is true and return the `id` of insertion
     * 
     * @param {string} email 
     * @param {string} name 
     * @param {string} phone
     * @return {{valid: boolean, result: Object, error: string, code: string}}
     */
    async insertEmployee(name, email, phone) {
        const sql = await this.#conn.makeConnection();
        try {
            const [results, fields] = await sql.query(`INSERT INTO employee (employeeName, employeeEmail, employeePhone) values (?, ?, ?)`, [
                name, email, phone
            ])
            // close the connection
            this.#conn.closeConnection(sql)

            return {
                valid: true,
                result: { id: results.insertId },
                error: '',
                code: ''
            }

        } catch (error) {
            // close the connection
            this.#conn.closeConnection(sql)
            switch (error.code) { //ER_DATA_TOO_LONG Data too long for column 'employeePhone' at row 1
                case 'ER_DUP_ENTRY':
                    return {
                        valid: false,
                        result: {},
                        error: SQL_ERRORS.SQL_DUPLICATE_ENTRY,
                        code: error.code
                    }
                case 'ER_DATA_TOO_LONG':
                    return {
                        valid: false,
                        result: {},
                        error: SQL_ERRORS.SQL_TOO_LONG,
                        code: error.code
                    }
                default:
                    return {
                        valid: false,
                        result: {},
                        error: SQL_ERRORS.SQL_UNKOWN_ERROR,
                        code: 'UNKOWN'
                    }
            }
        }
    }

    /**
     * This method update a record in database by email.
     * The name and phone must be obrigatory, even though the values don't change.
     * 
     * Use the method `searchId` with the parameter `email` to return the `id`. This method returns an object
     * with three properties: `result`, `error`, `code`. If doesn't have any issues, the update sentence will run 
     * with the id returned in `results`
     * ```js
     * const { result, error, code } = await this.searchId('employeeId', 'employee', 'employeeEmail', email)
     * ```
     * If the query sentence is right, then `valid` is true and return the amount of affected rows.
     * 
     * @param {string} name 
     * @param {string} phone 
     * @param {string} email 
     * 
     * @return {{valid: boolean, result: Object, error: string, code: string}}
     */
    async updateEmplyee(name, phone, email) {
        const sql = await this.#conn.makeConnection();
        try {
            // get id
            const { result, error, code } = await this.#searchId('employeeId', 'employee', 'employeeEmail', email)
            if (error) {
                throw {
                    code,
                    error,
                }
            }
            const { employeeId } = result
            const [results, fields] = await sql.query('UPDATE employee set employeeName = ?, employeePhone = ? WHERE employeeId = ?', [name, phone, employeeId])
            this.#conn.closeConnection(sql)

            return {
                valid: true,
                result: { affectedRows: results.affectedRows },
                error: '',
                code: ''
            }

        } catch (error) {

            this.#conn.closeConnection(sql)
            switch (error.code) {
                // none register
                case 'ER_ZERO_RECORDS':
                    return {
                        valid: false,
                        result: {},
                        error: SQL_ERRORS.SQL_DONT_HAVE_REGISTER,
                        code: error.code
                    }
                case 'ER_DATA_TOO_LONG':
                    return {
                        valid: false,
                        result: {},
                        error: SQL_ERRORS.SQL_TOO_LONG,
                        code: error.code
                    }
                default:
                    return {
                        valid: false,
                        result: {},
                        error: SQL_ERRORS.SQL_UNKOWN_ERROR,
                        code: 'UNKOWN'
                    }
            }
        }
    }

    /**
     * searchId is a private method to return the id by the email.
     * This method is flexible, being able to pass `key` of the table field you want to return;
     * the `table` you want search; the `field` you want to compare and the `value` you want to check.
     * 
     * The idea of this method is return id for make a update in table.
     * 
     * @param {string} key 
     * @param {string} table 
     * @param {string} field 
     * @param {string} value 
     * @returns {{valid: boolean, result: Object, error: string, code: string}}
     */
    async #searchId(key, table, field, value) {
        const sql = await this.#conn.makeConnection()
        try {
            const query = `SELECT ${key} FROM ${table} WHERE ${field} = ?`
            const [results, fields] = await sql.query(query, [value])
            //close connection
            this.#conn.closeConnection(sql)
            // if dosen't exists the record, throw an exception
            if (!results[0]) {
                throw {
                    code: 'ER_ZERO_RECORDS',
                }
            }
            return {
                valid: true,
                result: results[0],
                error: '',
                code: ''
            }
        } catch (error) {
            //close connection
            this.#conn.closeConnection(sql)
            switch (error.code) {
                //none register
                case 'ER_ZERO_RECORDS':
                    return {
                        valid: false,
                        result: {},
                        error: SQL_ERRORS.SQL_DONT_HAVE_REGISTER,
                        code: error.code
                    }
                default:
                    return {
                        valid: false,
                        result: {},
                        error: SQL_ERRORS.SQL_UNKOWN_ERROR,
                        code: 'UNKOWN'
                    }
            }
        }
    }

    /**
     * Method returns the data of an employee by the email
     * 
     * It returns `name`, `email` and `phone`
     * 
     * @param {string} email 
     * @returns {{valid: boolean, result: Object, error: string, code: string}} 
     * 
     * @example
     * 
     * const model = new Model()
     * const {valid, result, error, code} = await model.searchInfo('exemple@mail.com')
     * console.log(valid, result, error, code) // output {"valid":true,"result":{"employeeName":"exemple exemple","employeeEmail":"exemple@mail.com","employeePhone":"99999999999"},"error":"","code":""}
     */
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
                }
            }
            return {
                valid: true,
                result: results[0],
                error: '',
                code: ''
            }
        } catch (error) {
            this.#conn.closeConnection(sql)
            switch (error.code) {
                // none register
                case 'ER_ZERO_RECORDS':
                    return {
                        valid: false,
                        result: {},
                        error: SQL_ERRORS.SQL_DONT_HAVE_REGISTER,
                        code: error.code
                    }
                default:
                    return {
                        valid: false,
                        result: {},
                        error: SQL_ERRORS.SQL_UNKOWN_ERROR,
                        code: 'UNKOWN'
                    }
            }
        }
    }
}

module.exports = Model