const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { errors, celebrate, Joi } = require("celebrate");
const userRouter = require("./routes/users");
const cardRouter = require("./routes/cards");
const { createUser, login } = require("./controllers/users");
const auth = require("./middlewares/auth");
const { NotFoundError } = require("./errors/errors");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const PORT = 3000;

const app = express();

/* const allowedCors = [
    "mydomain.mesto.nomoredomains.xyz",
    "localhost:3000",
];

app.use((req, res, next) => {
    const { origin } = req.headers;
    if (allowedCors.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    const requestHeaders = req.headers["access-control-request-headers"];
    const { method } = req;
    if (method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", requestHeaders);
    }
    next();
});
 */

/* CORS */
app.use(cors());
app.use(helmet());

/* Парсер из JSON */
app.use(bodyParser.json());

/* мидлвара логирования запросов */
app.use(requestLogger);

app.post("/signin", celebrate({
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
    }),
}), login);

app.post("/signup", celebrate({
    body: Joi.object().keys({
        name: Joi.string().min(2).max(30),
        about: Joi.string().min(2).max(30),
        // eslint-disable-next-line no-useless-escape
        avatar: Joi.string().regex(/^https?:\/\/(www\.)?([a-zA-Z0-9]([a-zA-Z0-9-]+[a-zA-Z0-9])|([a-zA-Z0-9]*)\.)+[a-zA-Z]{2,}\/[\w\.\+@:_'~,-=#;\!\&\[\]\/\$\|\?\*\(\)]+$/),
        email: Joi.string().required().email(),
        password: Joi.string().required(),
    }),
}), createUser);

app.use(auth, celebrate({
    headers: Joi.object().keys({
        authorization: Joi.string().required().regex(/Bearer/),
    }).unknown(true),
}));

app.use("/", cardRouter);
app.use("/", userRouter);

app.use("/", () => {
    throw new NotFoundError("Такой страницы не существует");
});

/* мидлвара логирования ошибок */
app.use(errorLogger);

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    const { statusCode = 500, message } = err;
    res.status(statusCode).send({
        message: statusCode === 500 ? "На сервере произошла неизвестная ошибка" : message,
    });
});

mongoose
    .connect("mongodb://localhost:27017/mestodb", {
        useNewUrlParser: true,
    })
    .then(() => console.log("DB is connected"))
    .catch(err => {
        console.log(err);
    });

app.listen(PORT, () => {
    console.log(`Работаем на ${PORT}`);
});
