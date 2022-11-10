const router = require("express").Router();
const user = require("../controller/userController");
const auth = require("../middleware/auth");

router.post("/", user.createUser);
router.post("/login", user.loginUser);
router.get("/token/payload", auth.auth, (req, res) => {
  const nickname = req.decoded.nickname;
  const profile = req.decoded.profile;
  return res.status(200).json({
    code: 200,
    message: "토큰이 정상입니다.",
    data: {
      nickname: nickname,
      profile: profile,
    },
  });
});

module.exports = router;
