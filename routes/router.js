const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const userRouter = require("./users");
const cardRouter = require("./cards");
const { createUser, login } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.post("/signin", celebrate({
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
    }),
}), login);

router.post("/signup", celebrate({
    body: Joi.object().keys({
        name: Joi.string().min(2).max(30),
        about: Joi.string().min(2).max(30),
        // eslint-disable-next-line no-useless-escape
        avatar: Joi.string().regex(/^https?:\/\/(www\.)?([a-zA-Z0-9]([a-zA-Z0-9-]+[a-zA-Z0-9])|([a-zA-Z0-9]*)\.)+[a-zA-Z]{2,}\/[\w\.\+@:_'~,-=#;\!\&\[\]\/\$\|\?\*\(\)]+$/),
        email: Joi.string().required().email(),
        password: Joi.string().required(),
    }),
}), createUser);

router.use(auth, celebrate({
    headers: Joi.object().keys({
        authorization: Joi.string().required().regex(/Bearer/),
    }).unknown(true),
}));

router.use("/", cardRouter);
router.use("/", userRouter);

module.exports = router;
