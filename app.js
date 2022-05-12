const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const { errors } = require("celebrate");
const mongoose = require("mongoose");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const router = require("./routes/router");
const errorHandler = require("./middlewares/errorHandler");

const PORT = 3000;

const app = express();

/* CORS */
app.use(cors());
app.use(helmet());

/* мидлвара логирования запросов */
app.use(requestLogger);

/* Парсер из JSON */
app.use(bodyParser.json());

app.use("/api", router);

/* мидлвара логирования ошибок */
app.use(errorLogger);

/* мидлвара централизованной обработки ошибок Celebrate */
app.use(errors());

/* мидлвара на остальные ошибки */
app.use(errorHandler);
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
