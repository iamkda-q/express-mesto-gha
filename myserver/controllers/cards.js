const Card = require("../models/cards");
const {
    showUnknownError,
    ERROR_CODE_BAD_REQ,
    ERROR_CODE_NOT_FOUND,
    ERROR_CODE_DEFAULT,
} = require("../constants/constants");

const getCards = (req, res) => {
    try {
        Card.find({})
            .then((cards) => {
                if (cards.length == 0) {
                    res.send({
                        message: "Ещё нет добавленных карточек",
                    });
                }
                res.send(cards);
            })
            .catch((err) =>
                res.status(ERROR_CODE_DEFAULT).send({
                    message: `${showUnknownError(err)}`,
                })
            );
    } catch (err) {
        console.log(showUnknownError(err));
    }
};

const deleteCard = (req, res) => {
    try {
        Card.findByIdAndRemove(req.params.cardId)
            .then((card) => {
                if (card) {
                    res.send({
                        message: `Карточка "${card.name}" успешно удалена`,
                    });
                }
                res.status(ERROR_CODE_NOT_FOUND).send({
                    message: `Карточка не обнаружена`,
                });
            })
            .catch((err) =>
                res.status(ERROR_CODE_DEFAULT).send(showUnknownError(err))
            );
    } catch (err) {
        console.log(showUnknownError(err));
    }
};

const createCard = (req, res) => {
    try {
        const owner = req.user._id;
        Card.create({ ...req.body, owner })
            .then((card) => {
                res.send(card);
            })
            .catch((err) => {
                if (err.name == "ValidationError") {
                    res.status(ERROR_CODE_BAD_REQ).send({
                        message:
                            "Переданы некорректные данные при создании карточки",
                        reason: `${err.message}`,
                    });
                }
                res.status(ERROR_CODE_DEFAULT).send(showUnknownError(err));
            });
    } catch (err) {
        console.log(showUnknownError(err));
    }
};

const setLike = (req, res) => {
    try {
        const owner = req.user._id;
        Card.findByIdAndUpdate(
            req.params.cardId,
            { $addToSet: { likes: owner } },
            { new: true }
        )
            .then((card) => res.send(card))
            .catch((err) => {
                if (err.name == "ValidationError") {
                    res.status(ERROR_CODE_BAD_REQ).send({
                        message:
                            "Переданы некорректные данные при попытке постановки лайка",
                        reason: `${err.message}`,
                    });
                } else if (err.name == "CastError") {
                    res.status(ERROR_CODE_NOT_FOUND).send({
                        message: "Карточки с данным ID не существует",
                        reason: `${err.message}`,
                    });
                }
                res.status(ERROR_CODE_DEFAULT).send(showUnknownError(err));
            });
    } catch (err) {
        console.log(showUnknownError(err));
    }
};

const removeLike = (req, res) => {
    try {
        const owner = req.user._id;
        Card.findByIdAndUpdate(
            req.params.cardId,
            { $pull: { likes: owner } },
            { new: true }
        )
            .then((card) => res.send(card))
            .catch((err) => {
                if (err.name == "ValidationError") {
                    res.status(ERROR_CODE_BAD_REQ).send({
                        message:
                            "Переданы некорректные данные при попытке снятия лайка",
                        reason: `${err.message}`,
                    });
                } else if (err.name == "CastError") {
                    res.status(ERROR_CODE_NOT_FOUND).send({
                        message: "Карточки с данным ID не существует",
                        reason: `${err.message}`,
                    });
                }
                res.status(ERROR_CODE_DEFAULT).send(showUnknownError(err));
            });
    } catch (err) {
        console.log(showUnknownError(err));
    }
};

module.exports = {
    getCards,
    deleteCard,
    createCard,
    setLike,
    removeLike,
};
