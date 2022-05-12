const errorHandler = require("express").Router();
const { NotFoundError } = require("../errors/errors");

errorHandler.use("/", () => {
    throw new NotFoundError("Такой страницы не существует");
});

module.exports = errorHandler;
