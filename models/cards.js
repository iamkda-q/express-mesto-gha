const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30,
    },
    link: {
        type: String,
        validate: {
            validator(v) {
                // eslint-disable-next-line no-useless-escape
                return /^https?:\/\/(www\.)?([a-zA-Z0-9]([a-zA-Z0-9-]+[a-zA-Z0-9])|([a-zA-Z0-9]*)\.)+[a-zA-Z]{2,}\/[\w\.\+@:_'~,-=#;\!\&\[\]\/\$\|\?\*\(\)]+$/.test(v);
            },
            message: "Your link is not a valid link!",
        },
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "user",
        required: true,
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model("card", cardSchema);
