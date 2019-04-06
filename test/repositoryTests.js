const AWS = require('aws-sdk');
const sinon = require('sinon');
const expect = require('chai').use(require('sinon-chai')).expect;
const ChargerRepository = require('../db/repository').ChargerRepository;
const responseMocks = require('./mocks/ocmResponseMocks');
const ocmMapper = require("../charger").transformOcmEntity;

describe("dynamo db charger repository", () => {
    let dbFake;
    let chargers = JSON.parse(responseMocks.standardResponse).map(z => ocmMapper(z));
    
    beforeEach(() => {
        dbFake = sinon.stub(AWS.DynamoDB.DocumentClient.prototype, 'put')
                      .callsFake((charger) => {
                          let prom = Promise.resolve();
                          return {
                            promise: () => prom
                          };
                      });
    })
    afterEach(() => {
        if(AWS.DynamoDB.DocumentClient.prototype.put.restore)
            AWS.DynamoDB.DocumentClient.prototype.put.restore();
    })
    it("add charger should populate the id, created and updated fields", async () => {
        let repo = new ChargerRepository();
        await repo.addCharger(chargers[0]);

        let calledCharger = dbFake.getCall(0).args[0].Item;
        expect(calledCharger.id).to.not.be.undefined;
        expect(calledCharger.created).to.not.be.undefined;
        expect(calledCharger.updated).to.not.be.undefined;
    });
    
    it("update charger rejects object without an id", async () => {
        let repo = new ChargerRepository();
        expect(() => repo.updateCharger(chargers[0])).to.throw(Error, 'id must be provided to update charger')
    });

    it("update charger should set the updated field with the current time", async () => {
        
    });

    it("get chargers batches calls with a batch size of 100", async () => {

    });
});