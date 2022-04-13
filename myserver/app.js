const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const userRouter = require("./routes/users");
const cardRouter = require("./routes/cards");

const PORT = 3000;

//const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
    req.user = {
      _id: '625609794e9cdb117177b623'
    };

    next();
  });

/* mestodb */
mongoose.connect(
    "mongodb://localhost:27017/mestodb", {
    useNewUrlParser: true,
}).then(db => console.log('DB is connected'))
.catch(err => console.log(err));
app.use("/", cardRouter);
app.use("/", userRouter);

app.listen(3000);

/* app.get("/", (req, res, next) => {
    res.send(`<h1>Привет</h1>`);

    next();
}); */




