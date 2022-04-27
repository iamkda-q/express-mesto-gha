/* eslint-disable consistent-return */
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const validator = require("validator");
const User = require("../models/users");

const {
    NotFoundError,
    BadRequestError,
    AuthorizationError,
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
    if (owner.length !== 24) {
        throw BadRequestError("Передан некорректный ID пользователя");
    }
    User.findById(owner)
        .then(user => {
            if (!user) {
                throw NotFoundError("Пользователь не обнаружен");
            }
            const { name, about, avatar } = user;
            res.send({ name, about, avatar });
        })
        .catch(next);
};

const createUser = (req, res, next) => {
    const { email, password, ...other } = req.body;
    if (!validator.isEmail(email)) {
        throw BadRequestError("Переданы некорректные данные электронной почты");
    }
    bcrypt
        .hash(password, 10)
        .then(hash => User.create({ ...other, email, password: hash }))
        .then(() => res.send({ message: "Регистрация прошла успешно" }))
        .catch(next);
};

const updateProfileInfo = (req, res, next) => {
    const { name, about } = req.body;
    if (name) {
        if (name.length < 2) {
            throw BadRequestError("Имя пользователя меньше 2 символов");
        } else if (name.length > 30) {
            throw BadRequestError("Имя пользователя больше 30 символов");
        }
    }
    if (about) {
        if (about.length < 2) {
            throw BadRequestError(
                "Информация о пользователе (about) меньше 2 символов",
            );
        } else if (about.length > 30) {
            throw BadRequestError(
                "Информация о пользователе (about) больше 30 символов",
            );
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
        .catch(next);
};

const updateAvatar = (req, res, next) => {
    const owner = req.user._id;
    User.findByIdAndUpdate(owner, req.body, {
        new: true,
        runValidators: true,
    })
        .then(user => res.send(user))
        .catch(next);
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
                throw AuthorizationError();
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
