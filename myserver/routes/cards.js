const cardRouter = require("express").Router();
const { getCards, deleteCard, createCard, setLike, removeLike } = require("../controllers/cards");

cardRouter.get("/cards", getCards);

cardRouter.delete("/cards/:cardId", deleteCard);

cardRouter.post("/cards", createCard);

cardRouter.put("/cards/:cardId/likes", setLike);

cardRouter.delete("/cards/:cardId/likes", removeLike);

module.exports = cardRouter;