const AWS = require('aws-sdk');
const sinon = require('sinon');
const expect = require('chai').use(require('sinon-chai')).use(require('chai-as-promised')).expect;
const ChargerRepository = require('../db/repository').ChargerRepository;
const responseMocks = require('./mocks/ocmResponseMocks');
const ocmMapper = require("../charger").transformOcmEntity;
const Charger = require("../charger");

describe("dynamo db charger repository", () => {
    let putFake;
    let getFake;
    let delFake;
    let bgtFake;
    let qryFake;
    let chargers;
    
    it("add charger should populate the id, created and updated fields", async () => {
        let repo = new ChargerRepository();
        await repo.addCharger(chargers[0]);

        let calledCharger = putFake.getCall(0).args[0].Item;
        expect(calledCharger.id).to.not.be.undefined;
        expect(calledCharger.created).to.not.be.undefined;
        expect(calledCharger.updated).to.not.be.undefined;
    });
    
    it("update charger rejects object without an id", async () => {
        let repo = new ChargerRepository();
        expect(repo.updateCharger(chargers[0])).to.be.rejectedWith(Error);
    });

    it("update charger rejects object with an empty string for an id", async () => {
        let repo = new ChargerRepository();
        let chargerTest = chargers[0];
        chargerTest.id = "";
        expect(repo.updateCharger(chargerTest)).to.be.rejectedWith(Error);
    });

    it("update charger should set the updated field with the current time", async () => {
        let repo = new ChargerRepository();
        let chargerTest = chargers[0];
        let dte = new Date().getTime() - 100;
        chargerTest.id = "test_id";
        chargerTest.created = dte;
        chargerTest.updated = dte;
        
        await repo.updateCharger(chargerTest);
        let calledCharger = putFake.getCall(0).args[0].Item;

        expect(calledCharger.created).to.be.equal(dte);
        expect(calledCharger.updated).to.be.greaterThan(dte);
    });

    it("get chargers batches calls with a batch size of 100", async () => {
        // dynamodb batch get limit is 100, if > 100 it should make multiple calls 
        let repo = new ChargerRepository();
        let ids = [];

        for(let i = 0; i < 150; i++){
            ids.push("key-" + i);
        }

        await repo.getChargers(ids);
        expect(bgtFake.getCall(0).args[0].RequestItems.testTableCharger.Keys.length).to.be.equal(100);
        expect(bgtFake.getCall(1).args[0].RequestItems.testTableCharger.Keys.length).to.be.equal(50);
    });

    it("get chargers ignores empty array", async () => {
        let repo = new ChargerRepository();
        await repo.getChargers([]);
        expect(bgtFake).to.not.be.called;
    });

    it("get chargers ignores null array as id", async () => {
        let repo = new ChargerRepository();
        await repo.getChargers(null);
        expect(bgtFake).to.not.be.called;
    });

    it("get charger ignores empty strings as key", async () => {
        let repo = new ChargerRepository();
        await repo.getCharger("");
        expect(getFake).to.not.be.called;
    });

    it("get charger ignores null string as id", async () => {
        let repo = new ChargerRepository();
        await repo.getCharger(null);
        expect(getFake).to.not.be.called;
    });

    it("getOcmCharger queries the OCMChargers GSI", async () => {
        let repo = new ChargerRepository();
        await repo.getOcmCharger(1234);
        expect(qryFake.getCall(0).args[0].IndexName).to.be.equal("OCMChargers");
    });

    it("ocmLastModifiedDate uses OCM-MOST-RECENT key", async () => {
        AWS.DynamoDB.DocumentClient.prototype.get.restore();
        getFake = sinon.stub(AWS.DynamoDB.DocumentClient.prototype, 'get').callsFake(() => {
            return {
                promise: () => Promise.resolve({
                    Item: {
                        ocmId: "some id",
                        uuid: "dkdks-sjddj-sjssjs-jdjd",
                        dateLastStatusUpdate: "2019-08-03T00:23:00Z"
                    }
                })
            }
        });
        let repo = new ChargerRepository();
        let result = await repo.openChargeMapLastModifiedDate();

        expect(getFake.getCall(0).args[0].Key.id).to.be.equal("OCM-MOST-RECENT");
    });

    it("ocmLastModifiedDate returns null if no records", async () => {
        AWS.DynamoDB.DocumentClient.prototype.get.restore();
        getFake = sinon.stub(AWS.DynamoDB.DocumentClient.prototype, 'get').callsFake(() => {
            return {
                promise: () => Promise.resolve({})
            }
        });
        let repo = new ChargerRepository();
        let result = await repo.openChargeMapLastModifiedDate();
        expect(result).to.be.equal(null);
    });

    it("ocmLastModifiedDate returns dateLastStatusUpdate if found", async () => {
        AWS.DynamoDB.DocumentClient.prototype.get.restore();
        getFake = sinon.stub(AWS.DynamoDB.DocumentClient.prototype, 'get').callsFake(() => {
            return {
                promise: () => Promise.resolve({
                    Item: {
                        ocmId: "some id",
                        uuid: "dkdks-sjddj-sjssjs-jdjd",
                        dateLastStatusUpdate: "2019-08-03T00:23:00Z"
                    }
                })
            }
        });
        let repo = new ChargerRepository();
        let result = await repo.openChargeMapLastModifiedDate();

        expect(result).to.be.equal("2019-08-03T00:23:00Z");
    });

    it("setOcmLastModified uses OCM-MOST-RECENT key", async() => {
        let repo = new ChargerRepository();
        let result = await repo.setOpenChargeMapLastModifiedDate({
            id: 2342,
            uuid: "edewwe",
            dateLastStatusUpdate: "2019-08-23T21:23:00Z"
        });

        expect(putFake.getCall(0).args[0].Item.id).to.be.equal("OCM-MOST-RECENT");
    });

    beforeEach(() => {
        process.env.DYNAMODB_TABLE_CHARGER = "testTableCharger"
        let fnc = (chrger) => {return { promise: () => Promise.resolve() }}; 
        chargers = JSON.parse(responseMocks.standardResponse).map(z => new Charger(ocmMapper(z)));

        putFake = sinon.stub(AWS.DynamoDB.DocumentClient.prototype, 'put').callsFake(fnc);
        getFake = sinon.stub(AWS.DynamoDB.DocumentClient.prototype, 'get').callsFake(fnc);
        delFake = sinon.stub(AWS.DynamoDB.DocumentClient.prototype, 'delete').callsFake(fnc);
        bgtFake = sinon.stub(AWS.DynamoDB.DocumentClient.prototype, 'batchGet').callsFake((request) => {
            let itm = {
                Responses: {
                    testTableCharger: []
                }
            }            
            request.RequestItems.testTableCharger.Keys.forEach(x => {
                let dte = new Date().getTime();
                let charger = chargers[0];
                charger.id = x.id;
                charger.created = dte;
                charger.updated = dte;
                
                itm.Responses.testTableCharger.push(charger);
            })
            return {
                promise: () => Promise.resolve(itm)
            };
        });
        qryFake = sinon.stub(AWS.DynamoDB.DocumentClient.prototype, 'query').callsFake((id) => {
            return { 
                promise: () => Promise.resolve({ Items: [] })
            }
        });
        
    })
    afterEach(() => {
        delete process.env.DYNAMODB_TABLE_CHARGER;

        if(AWS.DynamoDB.DocumentClient.prototype.put.restore)
            AWS.DynamoDB.DocumentClient.prototype.put.restore();
        if(AWS.DynamoDB.DocumentClient.prototype.get.restore)
            AWS.DynamoDB.DocumentClient.prototype.get.restore();
        if(AWS.DynamoDB.DocumentClient.prototype.delete.restore)
            AWS.DynamoDB.DocumentClient.prototype.delete.restore();
        if(AWS.DynamoDB.DocumentClient.prototype.batchGet.restore)
            AWS.DynamoDB.DocumentClient.prototype.batchGet.restore();
        if(AWS.DynamoDB.DocumentClient.prototype.query.restore)
            AWS.DynamoDB.DocumentClient.prototype.query.restore();
    })
});