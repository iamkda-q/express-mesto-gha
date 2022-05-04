const Card = require("../models/cards");

const {
    NotFoundError,
    AuthorViolationError,
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
    Card.findById(cardID)
        // eslint-disable-next-line consistent-return
        .then(card => {
            if (!card) {
                throw new NotFoundError(
                    "Карточка с данным ID не обнаружена",
                );
            }
            if (currentUser !== card.owner.toString()) {
                throw new AuthorViolationError(
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
        .catch(err => {
            if (err.name === "CastError") { next(new BadRequestError(`Карточка с ID ${cardID} не обнаружена`)); }
            next(err);
        });
};

const createCard = (req, res, next) => {
    const owner = req.user._id;
    Card.create({ ...req.body, owner })
        .then(card => {
            res.send(card);
        })
        .catch(err => {
            if (err.name === "ValidationError") { next(new BadRequestError("Переданы некорректные данные при создании карточки")); }
            next(err);
        });
};

const setLike = (req, res, next) => {
    const cardID = req.params.cardId;
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
        .catch(err => {
            if (err.name === "ValidationError") { next(new BadRequestError("Переданы некорректные данные при попытке снятия лайка")); }
            if (err.name === "CastError") { next(new BadRequestError("Карточки с данным ID не существует")); }
            next(err);
        });
};

const removeLike = (req, res, next) => {
    const cardID = req.params.cardId;
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
        .catch(err => {
            if (err.name === "ValidationError") { next(new BadRequestError("Переданы некорректные данные при попытке снятия лайка")); }
            if (err.name === "CastError") { next(new BadRequestError("Карточки с данным ID не существует")); }
            next(err);
        });
};

module.exports = {
    getCards,
    deleteCard,
    createCard,
    setLike,
    removeLike,
};
