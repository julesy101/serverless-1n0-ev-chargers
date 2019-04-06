const sinon = require('sinon');
const expect = require('chai').use(require('sinon-chai')).expect;
const dynamodb = require('../db/dynamoDb').DynamoDB;
const baseRepo = require('../db/repository').ChargerRepository;

describe("dynamodb geo enabled repository", () => {
    it("deletes main charger table entry if error occurs saving geo point", async () => {

    });
    it("does not save geo point if error saving to main table", async () => {

    });
    
});