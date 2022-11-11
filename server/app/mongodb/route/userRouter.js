const router = require("express").Router();
const user = require("../controller/userController");
const auth = require("../middleware/auth");
const db = require("../model/index");
const authJWT = require("../middleware/new_auth");
const fresh = require("../middleware/refresh");

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

router.get("/get/:id", authJWT, (req, res) => {
  let { id } = req.params;

  // User.findOne({ _id: id }).exec((err, user) => {
  //   // console.log(user);
  // });

  return res.status(200).json({});
});

router.get("/refresh", fresh);

module.exports = router;
