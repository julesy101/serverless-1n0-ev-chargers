const BadRequestError = require('./errors/BadRequestError');
const UnprocessableEntityError = require('./errors/UnprocessableEntityError');
const InternalServerError = require('./errors/InternalServerError');
const FileNotFoundError = require('./errors/FileNotFoundError');

class Responses {
    static badRequest() {
        throw new BadRequestError();
    }

    static unprocessableEntity() {
        throw new UnprocessableEntityError();
    }

    static serverError() {
        throw new InternalServerError();
    }

    static notFound() {
        throw new FileNotFoundError();
    }

    static ok(payload) {
        return payload;
    }
}

module.exports = Responses;
