const User = require("../models/users");
const {
    showUnknownError,
    ERROR_CODE_BAD_REQ,
    ERROR_CODE_NOT_FOUND,
    ERROR_CODE_DEFAULT,
} = require("../constants/constants");

const getUsers = (req, res) => {
    try {
        User.find({})
            .then((users) => {
                if (users.length === 0) {
                    res.send({
                        message: "Пользователей на сервисе ещё нет",
                    });
                }
                res.send(users);
            })
            .catch((err) => {
                res.status(ERROR_CODE_DEFAULT).send({
                    message: `${showUnknownError(err)}`,
                });
            });
    } catch (err) {
        console.log(showUnknownError(err));
    }
};

const getUserById = (req, res) => {
    try {
        if (req.params.userId.length !== 24) {
            res.status(ERROR_CODE_BAD_REQ).send({
                message: "Передан некорректный ID пользователя",
            });
        }
        User.findById(req.params.userId)
            .then((user) => {
                if (!user) {
                    res.status(ERROR_CODE_NOT_FOUND).send({
                        message: `Пользователь не обнаружен`,
                    });
                }
                res.send(user);
            })
            .catch((err) => {
                if (err.name === "CastError") {
                    res.status(ERROR_CODE_BAD_REQ).send({
                        message: `Пользователь не обнаружен`,
                    });
                }
                res.status(ERROR_CODE_DEFAULT).send({
                    message: `${showUnknownError(err)}`,
                });
            });
    } catch (err) {
        console.log(showUnknownError(err));
    }
};

const createUser = (req, res) => {
    try {
        User.create(req.body)
            .then((user) => res.send(user))
            .catch((err) => {
                if (err.name === "ValidationError") {
                    res.status(ERROR_CODE_BAD_REQ).send({
                        message:
                            "Переданы некорректные данные при создании пользователя",
                        reason: `${err.message}`,
                    });
                }
                res.status(ERROR_CODE_DEFAULT).send({
                    message: `${showUnknownError(err)}`,
                });
            });
    } catch (err) {
        console.log(showUnknownError(err));
    }
};

const updateProfileInfo = (req, res) => {
    try {
        const { name, about, avatar } = req.body;
        if (name) {
            if (name.length < 2) {
                res.status(ERROR_CODE_BAD_REQ).send({
                    message: "Имя пользователя меньше 2 символов",
                });
            } else if (name.length > 30) {
                res.status(ERROR_CODE_BAD_REQ).send({
                    message: "Имя пользователя больше 30 символов",
                });
            }
        }
        if (about) {
            if (about.length < 2) {
                res.status(ERROR_CODE_BAD_REQ).send({
                    message:
                        "Информация о пользователе (about) меньше 2 символов",
                });
            } else if (about.length > 30) {
                res.status(ERROR_CODE_BAD_REQ).send({
                    message:
                        "Информация о пользователе (about) больше 30 символов",
                });
            }
        }
        const owner = req.user._id;
        User.findByIdAndUpdate(owner, { name, about, avatar }, { new: true })
            .then((user) => {
                res.send(user);
            })
            .catch((err) => {
                if (
                    err.name === "CastError"
                    || err.name === "ValidationError"
                ) {
                    res.status(ERROR_CODE_BAD_REQ).send({
                        message:
                            "Переданы некорректные данные при попытке обновления информации",
                        reason: `${err.message}`,
                    });
                }
                res.status(ERROR_CODE_DEFAULT).send({
                    message: `${showUnknownError(err)}`,
                });
            });
    } catch (err) {
        console.log(showUnknownError(err));
    }
};

const updateAvatar = (req, res) => {
    try {
        const owner = req.user._id;
        User.findByIdAndUpdate(owner, req.body, { new: true })
            .then((user) => res.send(user))
            .catch((err) => {
                if (
                    err.name === "CastError"
                    || err.name === "ValidationError"
                ) {
                    res.status(ERROR_CODE_BAD_REQ).send({
                        message:
                            "Переданы некорректные данные при попытке обновления информации",
                        reason: `${err.message}`,
                    });
                }
                res.status(ERROR_CODE_DEFAULT).send({
                    message: `${showUnknownError(err)}`,
                });
            });
    } catch (err) {
        console.log(showUnknownError(err));
    }
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateProfileInfo,
    updateAvatar,
};
