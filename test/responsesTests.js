// eslint-disable-next-line prefer-destructuring
const expect = require('chai').expect;
const BadRequestError = require('../utilities/errors/BadRequestError');
const UnprocessableEntityError = require('../utilities/errors/UnprocessableEntityError');
const InternalServerError = require('../utilities/errors/InternalServerError');
const FileNotFoundError = require('../utilities/errors/FileNotFoundError');
const UnauthorizedError = require('../utilities/errors/UnauthorizedError');
const ForbiddenError = require('../utilities/errors/ForbiddenError');
const BadGatewayError = require('../utilities/errors/BadGatewayError');
const GatewayTimeoutError = require('../utilities/errors/GatewayTimeoutError');
const response = require('../utilities/responses');

describe('http response handling', () => {
    it('bad request throws a BadRequestError', () => {
        expect(response.badRequest).to.throw(BadRequestError);
    });
    it('unprocessable throws an UnprocessableEntityError', () => {
        expect(response.unprocessableEntity).to.throw(UnprocessableEntityError);
    });
    it('server error throws an InternalServerError', () => {
        expect(response.serverError).to.throw(InternalServerError);
    });
    it('not found throws a FileNotFoundError', () => {
        expect(response.notFound).to.throw(FileNotFoundError);
    });
});

describe('http error responses', () => {
    it('bad request populates correct error message for template', () => {
        const error = new BadRequestError();
        expect(error.message).to.be.equal('[400] Bad Request');
    });
    it('unauthorized populates correct error message for template', () => {
        const error = new UnauthorizedError();
        expect(error.message).to.be.equal('[401] Unauthorized');
    });
    it('forbidden populates correct error message for template', () => {
        const error = new ForbiddenError();
        expect(error.message).to.be.equal('[403] Forbidden');
    });
    it('file not found populates correct error message for template', () => {
        const error = new FileNotFoundError();
        expect(error.message).to.be.equal('[404] Not found');
    });
    it('unprocessable populates correct error message for template', () => {
        const error = new UnprocessableEntityError();
        expect(error.message).to.be.equal('[422] Unprocessable Entity');
    });
    it('internal server error populates correct error message for template', () => {
        const error = new InternalServerError();
        expect(error.message).to.be.equal('[500] Internal Server Error');
    });
    it('bad gateway populates correct error message for template', () => {
        const error = new BadGatewayError();
        expect(error.message).to.be.equal('[502] Bad Gateway');
    });
    it('gateway timeout populates correct error message for template', () => {
        const error = new GatewayTimeoutError();
        expect(error.message).to.be.equal('[504] Gateway Timeout');
    });
});
