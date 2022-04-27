const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
const userRouter = require("./routes/users");
const cardRouter = require("./routes/cards");
const { createUser, login } = require("./controllers/users");
const auth = require("./middlewares/auth");
const { ERROR_CODE_NOT_FOUND } = require("./constants/constants");

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

app.post("/signin", login);
app.post("/signup", createUser);

app.use(auth);

app.use("/", cardRouter);
app.use("/", userRouter);

app.use("/", (req, res) => {
    res.status(ERROR_CODE_NOT_FOUND).send({
        message: "Такой страницы не существует",
    });
});

app.use((err, req, res) => {
    const { statusCode = 500, message } = err;
    res.status(statusCode).send({
        message: statusCode === 500 ? "На сервере произошла неизвестная ошибка" : message,
    });
});

app.listen(PORT, () => {
    console.log(`Работаем на ${PORT}`);
});
