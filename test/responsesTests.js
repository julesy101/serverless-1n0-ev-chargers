const sinon = require('sinon');
const expect = require('chai').expect;

const BadRequestError = require('../utilities/responses').BadRequestError;
const FileNotFoundError = require('../utilities/responses').FileNotFoundError;
const UnauthorizedError = require('../utilities/responses').UnauthorizedError;
const ForbiddenError = require('../utilities/responses').ForbiddenError;
const UnprocessableEntityError = require('../utilities/responses').UnprocessableEntityError;
const InternalServerError = require('../utilities/responses').InternalServerError;
const BadGatewayError = require('../utilities/responses').BadGatewayError;
const GatewayTimeoutError = require('../utilities/responses').GatewayTimeoutError;
const response = require('../utilities/responses');

describe("http response handling", () => {
    it("bad request throws a BadRequestError", () => {
        expect(response.badRequest).to.throw(BadRequestError);
    });
    it("unprocessable throws an UnprocessableEntityError", () => {
        expect(response.unprocessableEntity).to.throw(UnprocessableEntityError);
    });
    it("server error throws an InternalServerError", () => {
        expect(response.serverError).to.throw(InternalServerError);
    });
    it("not found throws a FileNotFoundError", () => {
        expect(response.notFound).to.throw(FileNotFoundError);
    });
});

describe("http error responses", () => {
    it("bad request populates correct error message for template", () => {
        let error = new BadRequestError();
        expect(error.message).to.be.equal("[400] Bad Request");
    });
    it("unauthorized populates correct error message for template", () => {
        let error = new UnauthorizedError();
        expect(error.message).to.be.equal("[401] Unauthorized");
    });
    it("forbidden populates correct error message for template", () => {
        let error = new ForbiddenError();
        expect(error.message).to.be.equal("[403] Forbidden");
    });
    it("file not found populates correct error message for template", () => {
        let error = new FileNotFoundError();
        expect(error.message).to.be.equal("[404] Not found");
    });
    it("unprocessable populates correct error message for template", () => {
        let error = new UnprocessableEntityError();
        expect(error.message).to.be.equal("[422] Unprocessable Entity");
    });
    it("internal server error populates correct error message for template", () => {
        let error = new InternalServerError();
        expect(error.message).to.be.equal("[500] Internal Server Error");
    });
    it("bad gateway populates correct error message for template", () => {
        let error = new BadGatewayError();
        expect(error.message).to.be.equal("[502] Bad Gateway");
    });
    it("gateway timeout populates correct error message for template", () => {
        let error = new GatewayTimeoutError();
        expect(error.message).to.be.equal("[504] Gateway Timeout");
    });

});