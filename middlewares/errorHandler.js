const errorHandler = require("express").Router();
const { NotFoundError } = require("../errors/errors");

errorHandler.use("/", () => {
  throw new NotFoundError("Такой страницы не существует");
});

// eslint-disable-next-line no-unused-vars
errorHandler.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "На сервере произошла неизвестная ошибка" : message,
  });
});

module.exports = errorHandler;
