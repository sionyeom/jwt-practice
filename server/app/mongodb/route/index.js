const router = require("express").Router();

router.use("/user", require("./userRouter"));

router.all("*", (req, res, next) => {
  next(createError(404, e.message));
});
