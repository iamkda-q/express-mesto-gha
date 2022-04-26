const userRouter = require("express").Router();
const {
    getUsers,
    getUserById,
    updateProfileInfo,
    updateAvatar,
} = require("../controllers/users");

userRouter.get("/users", getUsers);

userRouter.get("/users/:userId", getUserById);

userRouter.patch("/users/me", updateProfileInfo);

userRouter.patch("/users/me/avatar", updateAvatar);

module.exports = userRouter;
