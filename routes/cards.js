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

cardRouter.delete("/cards/:cardId", celebrate({
    params: Joi.object().keys({
        cardId: Joi.string().alphanum().length(24),
    }),
}), deleteCard);

cardRouter.post("/cards", celebrate({
    body: Joi.object().keys({
        name: Joi.string().required().min(2).max(30),
        link: Joi.string().required(),
    }),
}), createCard);

cardRouter.put("/cards/:cardId/likes", celebrate({
    params: Joi.object().keys({
        cardId: Joi.string().alphanum().length(24),
    }),
}), setLike);

cardRouter.delete("/cards/:cardId/likes", celebrate({
    params: Joi.object().keys({
        cardId: Joi.string().alphanum().length(24),
    }),
}), removeLike);

module.exports = cardRouter;
