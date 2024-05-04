const { describe, it, before } = require('mocha')
const assert = require('assert')
const { SQL_ERRORS } = require("../constants/constants.js");
const { createSandbox } = require('sinon');
const Model = require("./model.js");

const model = new Model()

const sinon = createSandbox()


const mocks = {
    duplicateEntry: require('../../mocks/db_mocks/invalid_duplicate_entry_error.json'),
    syntaxError: require('../../mocks/db_mocks/invalid_syntax_error.json'),
    unknownError: require('../../mocks/db_mocks/invalid_unknow_error.json'),
    invalidId: require('../../mocks/db_mocks/invalid_update_id.json'),
    zeroRecords: require('../../mocks/db_mocks/invalid_zero_occurrences.json'),
    validInsert: require('../../mocks/db_mocks/valid_insert_employee.json'),
    validSelect: require('../../mocks/db_mocks/valid_select_employee.json'),
    validUpdate: require('../../mocks/db_mocks/valid_update.json'),
}


const stubInsertEmployee = sinon.stub(model, model.insertEmployee.name)
const stubUpdateEmployee = sinon.stub(model, model.updateEmplyee.name)
const stubSelectEmployee = sinon.stub(model, model.searchInfo.name)

// INSERT
stubInsertEmployee.withArgs(null, null, null)
.resolves(mocks.unknownError)

stubInsertEmployee.withArgs('matheus matheus', 'matheus@gmail.com', '11964881935')
.resolves(mocks.duplicateEntry)

stubInsertEmployee.withArgs('juliano neves', 'juliano@gmail.com', '119748514285')
.resolves(mocks.unknownError)

stubInsertEmployee.withArgs('juliano neves', 'julianocmn@gmail.com', '11986249481')
.resolves(mocks.validInsert)

// UPDATE
stubUpdateEmployee.withArgs('lucas pereira', '564654657465465465', 'lucaspdsts@gmail.com')
.resolves(mocks.unknownError)

stubUpdateEmployee.withArgs('lucas pereira', '11987456325', 'lucaspdsts@gmail.co')
.resolves(mocks.zeroRecords)

stubUpdateEmployee.withArgs('lucas pereira', '11987456982', 'lucaspdsts@gmail.com')
.resolves(mocks.validUpdate)

//SELECT
stubSelectEmployee.withArgs('some@mail.com')
.resolves(mocks.zeroRecords)

stubSelectEmployee.withArgs({glass: 'brew'})
.resolves(mocks.unknownError)

stubSelectEmployee.withArgs('lucaspdsts@gmail.com')
.resolves(mocks.validSelect)

describe('Test all insert statements', () => {


    it('should return the error unkown to null parameters', async () => {

        const excepted = { valid: false, result: {}, error: "An unknown error has occurred.", code: "UNKOWN" }
        const results = await model.insertEmployee(null, null, null)
        assert.deepStrictEqual(results, excepted)

    })

    it('should return the error unkown to length of phone number bigger than 11', async () => {

        const excepted = { valid: false, result: {}, error: "An unknown error has occurred.", code: "UNKOWN" }
        const results = await model.insertEmployee('juliano neves', 'juliano@gmail.com', '119748514285')
        assert.deepStrictEqual(results, excepted)

    })

    it('should return the error duplicate key', async () => {

        const excepted = {"valid": false,"result": {},"error": "Error, you try to add a duplicate key.", "code": "ER_DUP_ENTRY"}
        const results = await model.insertEmployee('matheus matheus', 'matheus@gmail.com', '11964881935')
        assert.deepStrictEqual(results, excepted)

    })

    it('should return valid true', async () => {

        const excepted = {"valid":true,"result":{"id":82},"error":"","code":""}
        const results = await model.insertEmployee('juliano neves', 'julianocmn@gmail.com', '11986249481')
        assert.deepStrictEqual(results, excepted)

    })

})

describe('Test all update statements', () => {


    it('should return the error unkown to length of phone number bigger than 11', async () => {

        const excepted = { valid: false, result: {}, error: "An unknown error has occurred.", code: "UNKOWN" }
        const results = await model.updateEmplyee('lucas pereira', '564654657465465465', 'lucaspdsts@gmail.com')
        assert.deepStrictEqual(results, excepted)

    })

    it('should return the error zero records if not able to find the email', async () => {

        const excepted = {"valid":false,"result":{},"error":"No records found.","code":"ER_ZERO_RECORDS"}
        const results = await model.updateEmplyee('lucas pereira', '11987456325', 'lucaspdsts@gmail.co')
        assert.deepStrictEqual(results, excepted)

    })

    it('should return valid true if update success', async () => {

        const excepted = {"valid":true,"result":{"affectedRows":1},"error":"","code":""}
        const results = await model.updateEmplyee('lucas pereira', '11987456982', 'lucaspdsts@gmail.com')
        assert.deepStrictEqual(results, excepted)

    })

})

describe('Test all select statements', () => {


    it('Should return zero records to a wrong email', async () => {

        const excepted = {"valid":false,"result":{},"error":"No records found.","code":"ER_ZERO_RECORDS"}
        const results = await model.searchInfo('some@mail.com')
        assert.deepStrictEqual(results, excepted)

    })

    it('Should return unkown error', async () => {

        const excepted = {"valid":false,"result":{},"error":"An unknown error has occurred.","code":"UNKOWN"}
        const results = await model.searchInfo({glass: 'brew'})
        assert.deepStrictEqual(results, excepted)

    })

    it('Should return the object with database informations', async () => {
        const excepted = {"valid": true,"result": {"employeeName": "lucas pereira dos santos","employeeEmail": "lucaspdsts@gmail.com","employeePhone": "11971008836"},"error": "","code": ""}
        const results = await model.searchInfo('lucaspdsts@gmail.com')
        assert.deepStrictEqual(results, excepted)

    })


})