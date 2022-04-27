// eslint-disable-next-line max-classes-per-file
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 404;
    }
}

class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 400;
    }
}

class AuthorizationError extends Error {
    constructor() {
        super();
        this.message = "Необходима авторизация";
        this.statusCode = 401;
    }
}

module.exports = { NotFoundError, BadRequestError, AuthorizationError };
