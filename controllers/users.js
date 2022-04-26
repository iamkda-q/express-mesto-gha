/* eslint-disable consistent-return */
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const validator = require("validator");
const User = require("../models/users");
const {
    showUnknownError,
    ERROR_CODE_BAD_REQ,
    ERROR_CODE_NOT_FOUND,
    ERROR_CODE_DEFAULT,
} = require("../constants/constants");

const getUsers = (req, res) => {
    User.find({})
        .then(users => {
            res.send(users);
        })
        .catch(err => {
            console.log(showUnknownError(err));
            res.status(ERROR_CODE_DEFAULT).send({
                message: `${showUnknownError(err)}`,
            });
        });
};

const getUserById = (req, res) => {
    if (req.params.userId.length !== 24) {
        res.status(ERROR_CODE_BAD_REQ).send({
            message: "Передан некорректный ID пользователя",
        });
    }
    User.findById(req.params.userId)
        .then(user => {
            if (!user) {
                res.status(ERROR_CODE_NOT_FOUND).send({
                    message: "Пользователь не обнаружен",
                });
                return;
            }
            res.send(user);
        })
        .catch(err => {
            console.log(showUnknownError(err));
            if (err.name === "CastError") {
                res.status(ERROR_CODE_BAD_REQ).send({
                    message: "Пользователь не обнаружен",
                });
                return;
            }
            res.status(ERROR_CODE_DEFAULT).send({
                message: `${showUnknownError(err)}`,
            });
        });
};

const createUser = (req, res) => {
    const { email, password, ...other } = req.body;
    if (!validator.isEmail(email)) {
        res.status(ERROR_CODE_BAD_REQ).send({
            message: "Переданы некорректные данные электронной почты'",
        });
        return;
    }
    bcrypt
        .hash(password, 10)
        .then(hash => User.create({ ...other, email, password: hash }))
        .then(user => res.send(user))
        .catch(err => {
            console.log(showUnknownError(err));
            if (err.name === "ValidationError") {
                res.status(ERROR_CODE_BAD_REQ).send({
                    message:
                        "Переданы некорректные данные при создании пользователя",
                    reason: `${err.message}`,
                });
                return;
            }
            res.status(ERROR_CODE_DEFAULT).send({
                message: `${showUnknownError(err)}`,
            });
        });
};

const updateProfileInfo = (req, res) => {
    const { name, about } = req.body;
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
                message: "Информация о пользователе (about) меньше 2 символов",
            });
        } else if (about.length > 30) {
            res.status(ERROR_CODE_BAD_REQ).send({
                message: "Информация о пользователе (about) больше 30 символов",
            });
        }
    }
    const owner = req.user._id;
    User.findByIdAndUpdate(
        owner,
        { name, about },
        { new: true, runValidators: true },
    )
        .then(user => {
            res.send(user);
        })
        .catch(err => {
            console.log(showUnknownError(err));
            if (err.name === "CastError" || err.name === "ValidationError") {
                res.status(ERROR_CODE_BAD_REQ).send({
                    message:
                        "Переданы некорректные данные при попытке обновления информации",
                    reason: `${err.message}`,
                });
                return;
            }
            res.status(ERROR_CODE_DEFAULT).send({
                message: `${showUnknownError(err)}`,
            });
        });
};

const updateAvatar = (req, res) => {
    const owner = req.user._id;
    User.findByIdAndUpdate(owner, req.body, {
        new: true,
        runValidators: true,
    })
        .then(user => res.send(user))
        .catch(err => {
            console.log(showUnknownError(err));
            if (err.name === "CastError" || err.name === "ValidationError") {
                res.status(ERROR_CODE_BAD_REQ).send({
                    message:
                        "Переданы некорректные данные при попытке обновления информации",
                    reason: `${err.message}`,
                });
                return;
            }
            res.status(ERROR_CODE_DEFAULT).send({
                message: `${showUnknownError(err)}`,
            });
        });
};

const login = (req, res) => {
    const { email, password } = req.body;
    return User.findUserByCredentials(email, password)
        .then(user => {
            const token = jwt.sign({ _id: user._id }, "some-secret-key", { expiresIn: "7d" });
            res.send({ token });
        })
        .catch(err => {
            res.status(401).send({ message: err.message });
        });
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateProfileInfo,
    updateAvatar,
    login,
};
