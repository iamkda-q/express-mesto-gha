const cardRouter = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
    getCards,
    deleteCard,
    createCard,
    setLike,
    removeLike,
} = require("../controllers/cards");

cardRouter.get("/cards", getCards);

cardRouter.delete("/cards/:cardId", deleteCard);

cardRouter.post("/cards", celebrate({
    body: Joi.object().keys({
        name: Joi.string().required().min(2).max(30),
        link: Joi.string().required(),
    }),
}), createCard);

cardRouter.put("/cards/:cardId/likes", setLike);

cardRouter.delete("/cards/:cardId/likes", removeLike);

module.exports = cardRouter;
