const jwt = require("jsonwebtoken");

const {
    AuthorizationError,
} = require("../errors/errors");

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer ")) {
        throw new AuthorizationError();
    }

    const token = authorization.replace("Bearer ", "");
    let payload;

    try {
        payload = jwt.verify(token, "some-secret-key");
    } catch (err) {
        throw new AuthorizationError("Необходимо авторизоваться");
    }

    req.user = payload;

    next();
};
