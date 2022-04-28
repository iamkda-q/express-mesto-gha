/* eslint-disable consistent-return */
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const validator = require("validator");
const User = require("../models/users");

const {
    NotFoundError,
    BadRequestError,
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
    if (owner.length !== 24) {
        throw new BadRequestError("Передан некорректный ID пользователя");
    }
    User.findById(owner)
        .then(user => {
            if (!user) {
                throw new NotFoundError("Пользователь не обнаружен");
            }
            res.send(user);
        })
        .catch(next);
};

const createUser = (req, res, next) => {
    const { email, password, ...other } = req.body;
    if (!validator.isEmail(email)) {
        throw new BadRequestError("Переданы некорректные данные электронной почты");
    }
    User.findOne({ email })
        .then(user => {
            if (user) {
                throw new ConflictError("Пользователь с данным email уже зарегистрирован");
            }
        })
        .then(() => {
            bcrypt
                .hash(password, 10)
                .then(hash => User.create({ ...other, email, password: hash }))
                .then(user => res.send(user));
        })
        .catch(next);
};

const updateProfileInfo = (req, res, next) => {
    const { name, about } = req.body;
    if (name) {
        if (name.length < 2) {
            throw new BadRequestError("Имя пользователя меньше 2 символов");
        } else if (name.length > 30) {
            throw new BadRequestError("Имя пользователя больше 30 символов");
        }
    }
    if (about) {
        if (about.length < 2) {
            throw new BadRequestError(
                "Информация о пользователе (about) меньше 2 символов",
            );
        } else if (about.length > 30) {
            throw new BadRequestError(
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
