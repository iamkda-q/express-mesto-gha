const userRouter = require("express").Router();
const { celebrate, Joi } = require("celebrate");

// const nameValidator = { name: Joi.string().required().min(2).max(30) };
// const aboutValidator = { about: Joi.string().min(2).max(30) };
// const avatarValidator = { about: Joi.string() };
// const emailValidator = { email: Joi.string().required().email() };
// const passwordValidator = { password: Joi.string().required().min(4) };

const {
    getUsers,
    getUserById,
    updateProfileInfo,
    updateAvatar,
} = require("../controllers/users");

userRouter.get("/users", getUsers);

userRouter.get("/users/:userId", celebrate({
    params: Joi.object().keys({
        userId: Joi.alternatives().try(Joi.string().alphanum().valid("me"), Joi.string().alphanum().length(24)),
    }),
}), getUserById);

userRouter.patch("/users/me", celebrate({
    body: Joi.object().keys({
        name: Joi.string().min(2).max(30),
        about: Joi.string().min(2).max(30),
    }),
}), updateProfileInfo);

userRouter.patch("/users/me/avatar", celebrate({
    body: Joi.object().keys({
        // eslint-disable-next-line no-useless-escape
        avatar: Joi.string().regex(/https?:\/\/(www\.)?[\w\.\+@:_'~,-=#;\!\&\[\]\/\$\|\?\*\(\)]\.[\w\.\+@:_'~,-=#;\!\&\[\]\/\$\|\?\*\(\)]/),
    }),
}), updateAvatar);

module.exports = userRouter;
