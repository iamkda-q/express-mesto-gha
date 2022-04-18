const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRouter = require("./routes/users");
const cardRouter = require("./routes/cards");
const { ERROR_CODE_NOT_FOUND } = require("./constants/constants");

const PORT = 3000;

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
    req.user = {
        _id: "625609794e9cdb117177b623",
    };

    next();
});

/* mestodb */
mongoose
    .connect("mongodb://localhost:27017/mestodb", {
        useNewUrlParser: true,
    })
    .then(() => console.log("DB is connected"))
    .catch((err) => {
        console.log(err);
    });
app.use("/", cardRouter);
app.use("/", userRouter);

app.use("/", (req, res) => {
    res.status(ERROR_CODE_NOT_FOUND).send({
        message: "Такой страницы не существует",
    });
});

app.listen(PORT, () => {
    console.log(`Работаем на ${PORT}`);
});
