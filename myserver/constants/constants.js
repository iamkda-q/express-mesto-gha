const ERROR_CODE_BAD_REQ = 400;
const ERROR_CODE_NOT_FOUND = 404;
const ERROR_CODE_DEFAULT = 500;

const showUnknownError = (err) => `Произошла неизвестная ошибка ${err.name}: ${err.message}`;

module.exports = {
    showUnknownError,
    ERROR_CODE_BAD_REQ,
    ERROR_CODE_NOT_FOUND,
    ERROR_CODE_DEFAULT,
};
