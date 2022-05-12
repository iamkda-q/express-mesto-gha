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
