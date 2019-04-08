const sinon = require('sinon');
const expect = require('chai').use(require('sinon-chai')).use(require('chai-as-promised')).expect;
const ChargerRepository = require('../db/repository').ChargerRepository;
const GeoEnabledChargerRepository = require('../db/geoEnabledRepository').GeoChargerRepository;
const GeoDataManager = require('dynamodb-geo').GeoDataManager;

describe("dynamodb geo enabled repository", () => {
    it("deletes main charger table entry if error occurs saving geo point", async () => {
        sinon.stub(GeoDataManager.prototype, 'putPoint')
        .callsFake((o) => {throw new Error("test failure")});
        sinon.stub(ChargerRepository.prototype, 'addCharger')
        .callsFake(c => { return {
                id: 'ddggdfggdfgd',
                address: {
                    lat: 56.7955,
                    lng: -3.434
                }
            };
        });
        let delCharger = sinon.stub(ChargerRepository.prototype, 'deleteCharger').callsFake((chrger) => chrger);
        let geoRepo = new GeoEnabledChargerRepository();
        try{
            await geoRepo.addCharger({ test: "charger" })
        } catch(e){

        }
        expect(delCharger).to.be.called;
    });
    it("throws an error if saving failed", () => {
        sinon.stub(GeoDataManager.prototype, 'putPoint')
        .callsFake((o) => {throw new Error("test failure")});
        sinon.stub(ChargerRepository.prototype, 'addCharger')
        .callsFake(c => { return {
                id: 'ddggdfggdfgd',
                address: {
                    lat: 56.7955,
                    lng: -3.434
                }
            };
        });
        sinon.stub(ChargerRepository.prototype, 'deleteCharger').callsFake((chrger) => chrger);
        let geoRepo = new GeoEnabledChargerRepository();
        expect(geoRepo.addCharger({ test: "charger" })).to.be.rejectedWith(Error);
    })
    it("does not save geo point if error saving to main table", async () => {
        let putFake = sinon.stub(GeoDataManager.prototype, 'putPoint')
        .callsFake((o) => {});
        sinon.stub(ChargerRepository.prototype, 'addCharger')
        .callsFake(c => { return null });
        
        let geoRepo = new GeoEnabledChargerRepository();
        await geoRepo.addCharger({test: "charger"});
        
        expect(putFake).to.not.be.called;
    });
    it("radius search ensures lat lng and radius are numbers", () => {
        let geoRepo = new GeoEnabledChargerRepository();
        expect(geoRepo.radiusSearch("not number", -3.42, 20)).to.be.rejectedWith(Error);
        expect(geoRepo.radiusSearch(34.56, "not number", 20)).to.be.rejectedWith(Error);
        expect(geoRepo.radiusSearch(54.34, -3.42, "not number")).to.be.rejectedWith(Error);
    });
    
    afterEach(() => {
        if(ChargerRepository.prototype.addCharger.restore)
            ChargerRepository.prototype.addCharger.restore();
        if(ChargerRepository.prototype.deleteCharger.restore)
            ChargerRepository.prototype.deleteCharger.restore();
        if(GeoDataManager.prototype.putPoint.restore)
            GeoDataManager.prototype.putPoint.restore();
    });
});