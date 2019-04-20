const AWS = require('aws-sdk');
const sinon = require('sinon');
// eslint-disable-next-line prefer-destructuring
const expect = require('chai')
    .use(require('sinon-chai'))
    .use(require('chai-as-promised')).expect;
const repo = require('../db/repository');
const responseMocks = require('./mocks/ocmResponseMocks');
const ocmMapper = require('../utilities/transformOcmEntity');
const Charger = require('../entities/charger');
const mocks = require('./mocks/chargerRepositoryMocks');

describe('dynamo db charger repository', () => {
    let putFake;
    let getFake;
    let bgtFake;
    let qryFake;
    let delFake;
    let chargers;

    it('add charger should populate the id, created and updated fields', async () => {
        await repo.addCharger(chargers[0]);

        const calledCharger = putFake.getCall(0).args[0].Item;
        expect(calledCharger.id).to.not.be.undefined;
        expect(calledCharger.created).to.not.be.undefined;
        expect(calledCharger.updated).to.not.be.undefined;
    });

    it('update charger rejects object without an id', async () => {
        expect(repo.updateCharger(chargers[0])).to.be.rejectedWith(Error);
    });

    it('update charger rejects object with an empty string for an id', async () => {
        const chargerTest = chargers[0];
        chargerTest.id = '';
        expect(repo.updateCharger(chargerTest)).to.be.rejectedWith(Error);
    });

    it('update charger should set the updated field with the current time', async () => {
        const chargerTest = chargers[0];
        const dte = new Date().getTime() - 100;
        chargerTest.id = 'test_id';
        chargerTest.created = dte;
        chargerTest.updated = dte;

        await repo.updateCharger(chargerTest);
        const calledCharger = putFake.getCall(0).args[0].Item;

        expect(calledCharger.created).to.be.equal(dte);
        expect(calledCharger.updated).to.be.greaterThan(dte);
    });

    it('get chargers batches calls with a batch size of 100', async () => {
        // dynamodb batch get limit is 100, if > 100 it should make multiple calls

        const ids = [];

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < 150; i++) {
            ids.push(`key-${i}`);
        }

        await repo.getChargers(ids);
        expect(bgtFake.getCall(0).args[0].RequestItems.testTableCharger.Keys.length).to.be.equal(100);
        expect(bgtFake.getCall(1).args[0].RequestItems.testTableCharger.Keys.length).to.be.equal(50);
    });

    it('get chargers ignores empty array', async () => {
        await repo.getChargers([]);
        expect(bgtFake).to.not.be.called;
    });

    it('get chargers ignores null array as id', async () => {
        await repo.getChargers(null);
        expect(bgtFake).to.not.be.called;
    });

    it('get charger ignores empty strings as key', async () => {
        await repo.getCharger('');
        expect(getFake).to.not.be.called;
    });

    it('get charger ignores null string as id', async () => {
        await repo.getCharger(null);
        expect(getFake).to.not.be.called;
    });

    it('get charger returns null if no charger found', async () => {
        AWS.DynamoDB.DocumentClient.prototype.get.restore();
        getFake = sinon.stub(AWS.DynamoDB.DocumentClient.prototype, 'get').callsFake(() => {
            return { promise: () => Promise.resolve({}) };
        });
        const charger = await repo.getCharger('some_id');
        expect(charger).to.be.null;
    });
    it('get charger returns an instance of Charger', async () => {
        AWS.DynamoDB.DocumentClient.prototype.get.restore();
        getFake = sinon.stub(AWS.DynamoDB.DocumentClient.prototype, 'get').callsFake(() => {
            return { promise: () => Promise.resolve({ Item: mocks.allChargers()[0] }) };
        });
        const charger = await repo.getCharger('some_id');
        expect(charger).to.be.instanceOf(Charger);
    });
    it('getOcmCharger queries the OCMChargers GSI', async () => {
        await repo.getOcmCharger(1234);
        expect(qryFake.getCall(0).args[0].IndexName).to.be.equal('OCMChargers');
    });

    it('getOcmCharger returns an instance of Charger if found', async () => {
        AWS.DynamoDB.DocumentClient.prototype.query.restore();
        qryFake = sinon.stub(AWS.DynamoDB.DocumentClient.prototype, 'query').callsFake(() => {
            return {
                promise: () => Promise.resolve({ Items: [mocks.allChargers()[0]] })
            };
        });
        const charger = await repo.getOcmCharger(1234);
        expect(charger).to.be.instanceOf(Charger);
    });

    it('ocmLastModifiedDate uses OCM-MOST-RECENT key', async () => {
        AWS.DynamoDB.DocumentClient.prototype.get.restore();
        getFake = sinon.stub(AWS.DynamoDB.DocumentClient.prototype, 'get').callsFake(() => {
            return {
                promise: () =>
                    Promise.resolve({
                        Item: {
                            ocmId: 'some id',
                            uuid: 'dkdks-sjddj-sjssjs-jdjd',
                            dateLastStatusUpdate: '2019-08-03T00:23:00Z'
                        }
                    })
            };
        });

        await repo.openChargeMapLastModifiedDate();

        expect(getFake.getCall(0).args[0].Key.id).to.be.equal('OCM-MOST-RECENT');
    });

    it('ocmLastModifiedDate returns null if no records', async () => {
        AWS.DynamoDB.DocumentClient.prototype.get.restore();
        getFake = sinon.stub(AWS.DynamoDB.DocumentClient.prototype, 'get').callsFake(() => {
            return {
                promise: () => Promise.resolve({})
            };
        });

        const result = await repo.openChargeMapLastModifiedDate();
        expect(result).to.be.equal(null);
    });

    it('ocmLastModifiedDate returns dateLastStatusUpdate if found', async () => {
        AWS.DynamoDB.DocumentClient.prototype.get.restore();
        getFake = sinon.stub(AWS.DynamoDB.DocumentClient.prototype, 'get').callsFake(() => {
            return {
                promise: () =>
                    Promise.resolve({
                        Item: {
                            ocmId: 'some id',
                            uuid: 'dkdks-sjddj-sjssjs-jdjd',
                            dateLastStatusUpdate: '2019-08-03T00:23:00Z'
                        }
                    })
            };
        });

        const result = await repo.openChargeMapLastModifiedDate();

        expect(result).to.be.equal('2019-08-03T00:23:00Z');
    });

    it('setOcmLastModified uses OCM-MOST-RECENT key', async () => {
        await repo.setOpenChargeMapLastModifiedDate({
            id: 2342,
            uuid: 'edewwe',
            dateLastStatusUpdate: '2019-08-23T21:23:00Z'
        });

        expect(putFake.getCall(0).args[0].Item.id).to.be.equal('OCM-MOST-RECENT');
    });
    it('delete charger rejects an empty id', () => {
        expect(repo.deleteCharger('')).to.be.rejectedWith(Error);
    });
    it('delete charger rejects a null id', () => {
        expect(repo.deleteCharger(null)).to.be.rejectedWith(Error);
    });
    it('delete calls dynamodb delete with id as key', async () => {
        await repo.deleteCharger('some_id');
        expect(delFake.getCall(0).args[0].Key.id).to.be.equal('some_id');
    });
    beforeEach(() => {
        process.env.DYNAMODB_TABLE_CHARGER = 'testTableCharger';
        const fnc = () => {
            return { promise: () => Promise.resolve() };
        };
        chargers = JSON.parse(responseMocks.standardResponse).map(z => new Charger(ocmMapper(z)));
        delFake = sinon.stub(AWS.DynamoDB.DocumentClient.prototype, 'delete').callsFake(fnc);
        putFake = sinon.stub(AWS.DynamoDB.DocumentClient.prototype, 'put').callsFake(fnc);
        getFake = sinon.stub(AWS.DynamoDB.DocumentClient.prototype, 'get').callsFake(fnc);
        bgtFake = sinon.stub(AWS.DynamoDB.DocumentClient.prototype, 'batchGet').callsFake(request => {
            const itm = {
                Responses: {
                    testTableCharger: []
                }
            };
            request.RequestItems.testTableCharger.Keys.forEach(x => {
                const dte = new Date().getTime();
                const charger = chargers[0];
                charger.id = x.id;
                charger.created = dte;
                charger.updated = dte;

                itm.Responses.testTableCharger.push(charger);
            });
            return {
                promise: () => Promise.resolve(itm)
            };
        });
        qryFake = sinon.stub(AWS.DynamoDB.DocumentClient.prototype, 'query').callsFake(() => {
            return {
                promise: () => Promise.resolve({ Items: [] })
            };
        });
    });
    afterEach(() => {
        delete process.env.DYNAMODB_TABLE_CHARGER;

        if (AWS.DynamoDB.DocumentClient.prototype.put.restore) AWS.DynamoDB.DocumentClient.prototype.put.restore();
        if (AWS.DynamoDB.DocumentClient.prototype.get.restore) AWS.DynamoDB.DocumentClient.prototype.get.restore();
        if (AWS.DynamoDB.DocumentClient.prototype.delete.restore)
            AWS.DynamoDB.DocumentClient.prototype.delete.restore();
        if (AWS.DynamoDB.DocumentClient.prototype.batchGet.restore)
            AWS.DynamoDB.DocumentClient.prototype.batchGet.restore();
        if (AWS.DynamoDB.DocumentClient.prototype.query.restore) AWS.DynamoDB.DocumentClient.prototype.query.restore();
    });
});
