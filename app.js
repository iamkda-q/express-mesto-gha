const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { errors, celebrate, Joi } = require("celebrate");
const userRouter = require("./routes/users");
const cardRouter = require("./routes/cards");
const { createUser, login } = require("./controllers/users");
const auth = require("./middlewares/auth");
const { NotFoundError } = require("./errors/errors");

const PORT = 3000;

const app = express();
app.use(bodyParser.json());

/* mestodb */
mongoose
    .connect("mongodb://localhost:27017/mestodb", {
        useNewUrlParser: true,
    })
    .then(() => console.log("DB is connected"))
    .catch(err => {
        console.log(err);
    });

app.post("/signin", celebrate({
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(4),
    }),
}), login);

app.post("/signup", celebrate({
    body: Joi.object().keys({
        name: Joi.string().min(2).max(30),
        about: Joi.string().min(2).max(30),
        // eslint-disable-next-line no-useless-escape
        avatar: Joi.string().regex(/https?:\/\/(www\.)?[\w\.\+@:_'~,-=#;\!\&\[\]\/\$\|\?\*\(\)]\.[\w\.\+@:_'~,-=#;\!\&\[\]\/\$\|\?\*\(\)]/),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(4),
    }),
}), createUser);

app.use("/:path", (req, res, next) => {
    if (req.params.path !== "cards" && req.params.path !== "users") {
        throw new NotFoundError("Такой страницы не существует");
    }
    next();
});

app.use(auth, celebrate({
    headers: Joi.object().keys({
        authorization: Joi.string().required().regex(/Bearer/),
    }).unknown(true),
}));

app.use("/", cardRouter);
app.use("/", userRouter);

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    const { statusCode = 500, message } = err;
    res.status(statusCode).send({
        message: statusCode === 500 ? "На сервере произошла неизвестная ошибка" : message,
    });
});

app.listen(PORT, () => {
    console.log(`Работаем на ${PORT}`);
});
