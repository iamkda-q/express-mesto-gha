const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const User = require("./models/users");
const Card = require("./models/cards");
const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
    req.user = {
      _id: '6254a61132c7e1487faba4a4' // вставьте сюда _id созданного в предыдущем пункте пользователя
    };

    next();
  });

/* mestodb */
mongoose.connect(
    "mongodb://localhost:27017/mestodb", {
    useNewUrlParser: true,
/*     useCreateIndex: true,
    useFindAndModify: false, */
}).then(db => console.log('DB is connected'))
.catch(err => console.log(err));


app.post("/", (req, res) => {
    const { name, about, avatar } = req.body;
    User.create({ name, about, avatar });
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});

app.get("/users", (req, res) => {
    User.find({})
        .then(user => res.send(user))
        .catch((err) => res.status(500).send("Ошибка"));
});

app.get("/users/:userId", (req, res) => {
    User.findById(req.params.userId)
        .then(user => res.send(user))
        .catch((err) => res.status(500).send("Ошибка"));
});

app.post("/users", (req, res) => {
    User.create(req.body)
        .then(user => res.send("Новый пользователь успешно создан"))
        .catch((err) => res.status(500).send("Ошибка"));
});
