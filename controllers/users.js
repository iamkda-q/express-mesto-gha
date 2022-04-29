/* eslint-disable consistent-return */
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/users");

const { ERROR_CODE_BAD_REQ } = require("../constants/constants");
const {
    NotFoundError,
    AuthorizationError,
    ConflictError,
} = require("../errors/errors");

const getUsers = (req, res, next) => {
    User.find({})
        .then(users => {
            res.send(users);
        })
        .catch(next);
};

const getUserById = (req, res, next) => {
    const owner = req.params.userId === "me" ? req.user._id : req.params.userId;
    User.findById(owner)
        .then(user => {
            if (!user) {
                throw new NotFoundError("Пользователь не обнаружен");
            }
            res.send(user);
        })
        .catch(err => {
            if (err.name === "ValidationError") {
                res.status(ERROR_CODE_BAD_REQ).send({
                    message:
                  "Переданы невалидные данные",
                });
                return;
            }
            if (err.name === "CastError") {
                res.status(ERROR_CODE_BAD_REQ).send({
                    message: "Пользователя с данным ID не существует",
                });
                return;
            }
            next(err);
        });
};

const createUser = (req, res, next) => {
    const { email, password, ...other } = req.body;
    User.findOne({ email })
        .then(user => {
            if (user) {
                throw new ConflictError(
                    "Пользователь с данным email уже зарегистрирован",
                );
            }
        })
        .then(() => {
            bcrypt
                .hash(password, 10)
                .then(hash => User.create(
                    { ...other, email, password: hash },
                ))
                .then(() => User.findOne({ email }))
                .then(user => res.send(user));
        })
        .catch(err => {
            if (err.name === "ValidationError") {
                res.status(ERROR_CODE_BAD_REQ).send({
                    message:
                  "Переданы невалидные данные",
                });
                return;
            }
            next(err);
        });
};

const updateProfileInfo = (req, res, next) => {
    const { name, about } = req.body;
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
            if (err.name === "ValidationError") {
                res.status(ERROR_CODE_BAD_REQ).send({
                    message:
                  "Переданы невалидные данные",
                });
                return;
            }
            next(err);
        });
};

const updateAvatar = (req, res, next) => {
    const owner = req.user._id;
    User.findByIdAndUpdate(owner, req.body, {
        new: true,
        runValidators: true,
    })
        .then(user => res.send(user))
        .catch(err => {
            if (err.name === "ValidationError") {
                res.status(ERROR_CODE_BAD_REQ).send({
                    message:
                  "Переданы невалидные данные",
                });
                return;
            }
            next(err);
        });
};

const login = (req, res, next) => {
    const { email, password } = req.body;
    return User.findUserByCredentials(email, password)
        .then(user => {
            try {
                const token = jwt.sign({ _id: user._id }, "some-secret-key", {
                    expiresIn: "7d",
                });
                res.send({ token });
            } catch (err) {
                throw new AuthorizationError("Необходимо авторизоваться");
            }
        })
        .catch(next);
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateProfileInfo,
    updateAvatar,
    login,
};
