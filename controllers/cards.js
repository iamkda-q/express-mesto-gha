const Card = require("../models/cards");

const {
    NotFoundError,
    BadRequestError,
} = require("../errors/errors");

const getCards = (req, res, next) => {
    Card.find({})
        .then(cards => {
            res.send(cards);
        })
        .catch(next);
};

const deleteCard = (req, res, next) => {
    const currentUser = req.user._id;
    const cardID = req.params.cardId;
    if (cardID.length !== 24) {
        throw new BadRequestError(
            "Передан некорректный ID карточки",
        );
    }
    Card.findById(cardID)
        // eslint-disable-next-line consistent-return
        .then(card => {
            if (!card) {
                throw new NotFoundError(
                    "Карточка с данным ID не обнаружена",
                );
            }
            if (currentUser !== card.owner.toString()) {
                throw new BadRequestError(
                    "Вы не являетесь владельцем данной карточки",
                );
            }
        })
        .then(() => Card.findByIdAndRemove(cardID))
        .then(card => {
            res.send({
                message: `Карточка "${card.name}" успешно удалена`,
            });
        })
        .catch(next);
};

const createCard = (req, res, next) => {
    const owner = req.user._id;
    Card.create({ ...req.body, owner })
        .then(card => {
            res.send(card);
        })
        .catch(next);
};

const setLike = (req, res, next) => {
    const cardID = req.params.cardId;
    if (cardID.length !== 24) {
        throw new BadRequestError(
            "Передан некорректный ID карточки",
        );
    }
    const owner = req.user._id;
    Card.findByIdAndUpdate(
        cardID,
        { $addToSet: { likes: owner } },
        { new: true },
    )
        .then(card => {
            if (!card) {
                throw new NotFoundError(
                    "Карточка с данным ID не обнаружена",
                );
            }
            res.send(card);
        })
        .catch(next);
};

const removeLike = (req, res, next) => {
    const cardID = req.params.cardId;
    if (cardID.length !== 24) {
        throw new BadRequestError(
            "Передан некорректный ID карточки",
        );
    }
    const owner = req.user._id;
    Card.findByIdAndUpdate(cardID, { $pull: { likes: owner } }, { new: true })
        .then(card => {
            if (!card) {
                throw new NotFoundError(
                    "Карточка с данным ID не обнаружена",
                );
            }
            res.send(card);
        })
        .catch(next);
};

module.exports = {
    getCards,
    deleteCard,
    createCard,
    setLike,
    removeLike,
};
