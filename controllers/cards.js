const Card = require("../models/cards");
const {
    showUnknownError,
    ERROR_CODE_BAD_REQ,
    ERROR_CODE_NOT_FOUND,
    ERROR_CODE_DEFAULT,
} = require("../constants/constants");

const getCards = (req, res) => {
    Card.find({})
        .then(cards => {
            res.send(cards);
        })
        .catch(err => {
            console.log(showUnknownError(err));
            res.status(ERROR_CODE_DEFAULT).send({
                message: `${showUnknownError(err)}`,
            });
        });
};

const deleteCard = (req, res) => {
    const cardID = req.params.cardId;
    if (cardID.length !== 24) {
        res.status(ERROR_CODE_BAD_REQ).send({
            message: "Передан некорректный ID карточки",
        });
    }
    Card.findByIdAndRemove(cardID)
        .then(card => {
            if (!card) {
                res.status(ERROR_CODE_NOT_FOUND).send({
                    message: "Карточка с данным ID не обнаружена",
                });
                return;
            }
            res.send({
                message: `Карточка "${card.name}" успешно удалена`,
            });
        })
        .catch(err => {
            console.log(showUnknownError(err));
            if (err.name === "CastError") {
                res.status(ERROR_CODE_NOT_FOUND).send({
                    message: `Карточка с ID ${req.params.cardId} не обнаружена`,
                });
                return;
            }
            res.status(ERROR_CODE_DEFAULT).send(showUnknownError(err));
        });
};

const createCard = (req, res) => {
    const owner = req.user._id;
    Card.create({ ...req.body, owner })
        .then(card => {
            res.send(card);
        })
        .catch(err => {
            console.log(showUnknownError(err));
            if (err.name === "ValidationError") {
                res.status(ERROR_CODE_BAD_REQ).send({
                    message:
                        "Переданы некорректные данные при создании карточки",
                    reason: `${err.message}`,
                });
                return;
            }
            res.status(ERROR_CODE_DEFAULT).send(showUnknownError(err));
        });
};

const setLike = (req, res) => {
    const cardID = req.params.cardId;
    if (cardID.length !== 24) {
        res.status(ERROR_CODE_BAD_REQ).send({
            message: "Передан некорректный ID карточки",
        });
    }
    const owner = req.user._id;
    Card.findByIdAndUpdate(
        cardID,
        { $addToSet: { likes: owner } },
        { new: true },
    )
        .then(card => {
            if (!card) {
                res.status(ERROR_CODE_NOT_FOUND).send({
                    message: "Карточка с данным ID не обнаружена",
                });
                return;
            }
            res.send(card);
        })
        .catch(err => {
            console.log(showUnknownError(err));
            if (err.name === "ValidationError") {
                res.status(ERROR_CODE_BAD_REQ).send({
                    message:
                        "Переданы некорректные данные при попытке постановки лайка",
                    reason: `${err.message}`,
                });
                return;
            }
            if (err.name === "CastError") {
                res.status(ERROR_CODE_NOT_FOUND).send({
                    message: "Карточки с данным ID не существует",
                    reason: `${err.message}`,
                });
                return;
            }
            res.status(ERROR_CODE_DEFAULT).send(showUnknownError(err));
        });
};

const removeLike = (req, res) => {
    const cardID = req.params.cardId;
    if (cardID.length !== 24) {
        res.status(ERROR_CODE_BAD_REQ).send({
            message: "Передан некорректный ID карточки",
        });
    }
    const owner = req.user._id;
    Card.findByIdAndUpdate(cardID, { $pull: { likes: owner } }, { new: true })
        .then(card => {
            if (!card) {
                res.status(ERROR_CODE_NOT_FOUND).send({
                    message: "Карточка с данным ID не обнаружена",
                });
                return;
            }
            res.send(card);
        })
        .catch(err => {
            console.log(showUnknownError(err));
            if (err.name === "ValidationError") {
                res.status(ERROR_CODE_BAD_REQ).send({
                    message:
                        "Переданы некорректные данные при попытке снятия лайка",
                    reason: `${err.message}`,
                });
                return;
            }
            if (err.name === "CastError") {
                res.status(ERROR_CODE_NOT_FOUND).send({
                    message: "Карточки с данным ID не существует",
                    reason: `${err.message}`,
                });
                return;
            }
            res.status(ERROR_CODE_DEFAULT).send(showUnknownError(err));
        });
};

module.exports = {
    getCards,
    deleteCard,
    createCard,
    setLike,
    removeLike,
};
