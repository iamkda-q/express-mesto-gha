const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const {
    AuthorizationError,
} = require("../errors/errors");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 2,
        maxlength: 30,
        default: "Жак-Ив Кусто",
    },
    about: {
        type: String,
        minlength: 2,
        maxlength: 30,
        default: "Исследователь",
    },
    avatar: {
        type: String,
        validate: {
            validator(v) {
                // eslint-disable-next-line no-useless-escape
                return /^https?:\/\/(www\.)?[\w\.\+@:_'~,-=#;\!\&\[\]\/\$\|\?\*\(\)]+$/.test(v);
            },
            message: "Your link is not a valid link!",
        },
        default:
      "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
});

userSchema.statics.findUserByCredentials = function (email, password) {
    return this.findOne({ email }).select("+password").then(user => {
        if (!user) {
            throw new AuthorizationError("Неправильные почта или пароль");
        }
        return bcrypt.compare(password, user.password).then(matched => {
            if (!matched) {
                throw new AuthorizationError("Неправильные почта или пароль");
            }
            return user;
        });
    });
};

module.exports = mongoose.model("user", userSchema);
