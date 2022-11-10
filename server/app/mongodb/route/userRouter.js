const router = require("express").Router();
const user = require("../controller/userController");
const auth = require("../middleware/auth");
const db = require("../model/index");
const User = db.user;

router.post("/", user.createUser);
router.post("/login", user.loginUser);
router.get("/token/payload", auth.auth, (req, res) => {
  const id = req.decoded.id;
  return res.status(200).json({
    code: 200,
    message: "토큰이 정상입니다.",
    data: {
      id: id,
    },
  });
});
router.get("/get/:id", auth.auth, (req, res) => {
  let { id } = req.params;

  const user = User.findOne({ _id: id }).exec((err, user) => {
    // console.log(user);
  });

  return res.status(200).json({});
});
module.exports = router;
