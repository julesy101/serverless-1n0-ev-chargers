class Responses {
    badRequest(){
      throw new BadRequestError();
    }
    
    unprocessableEntity(){
      throw new UnprocessableEntityError();
    }
    
    serverError(){
      throw new InternalServerError();
    }
    
    notFound(){
      throw new FileNotFoundError();
    }

    ok(payload){
        return payload;
    }   
}

class BadRequestError extends Error {
  constructor(){
    super('[400] Bad Request');
  }
}
class UnauthorizedError extends Error {
  constructor(){
    super('[401] Unauthorized');
  }
}
class ForbiddenError extends Error {
  constructor(){
    super('[403] Forbidden');
  }
}
class FileNotFoundError extends Error {
  constructor(){
    super('[404] Not found');
  }
}
class UnprocessableEntityError extends Error {
  constructor(){
    super('[422] Unprocessable Entity');
  }
}
class InternalServerError extends Error {
  constructor(){
    super('[500] Internal Server Error');
  }
}
class BadGatewayError extends Error {
  constructor(){
    super('[502] Bad Gateway');
  }
}
class GatewayTimeoutError extends Error {
  constructor(){
    super('[504] Gateway Timeout');
  }
}

module.exports = new Responses();
module.exports.BadRequestError = BadRequestError;
module.exports.FileNotFoundError = FileNotFoundError;
module.exports.UnauthorizedError = UnauthorizedError;
module.exports.ForbiddenError = ForbiddenError;
module.exports.UnprocessableEntityError = UnprocessableEntityError;
module.exports.InternalServerError = InternalServerError;
module.exports.BadGatewayError = BadGatewayError;
module.exports.GatewayTimeoutError = GatewayTimeoutError;