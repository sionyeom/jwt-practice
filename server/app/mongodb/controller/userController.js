const jwt = require("jsonwebtoken");
const db = require("../model/index.js");
const User = db.user;
const auth = require("../middleware/auth");
const redisClient = require("../middleware/redis");

// 회원가입
exports.createUser = async (req, res) => {
  const user = req.body;
  const { id, pw, name, email } = user;
  try {
    const user = await new User({
      id: id,
      pw: pw,
      name: name,
      email: email,
    });

    await user
      .save()
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Register Failure",
        });
      });
  } catch {
    res.status(500).send({
      message: "Register Failure",
    });
  }
};

// 로그인
exports.loginUser = async (req, res) => {
  const user = req.body;
  const { id, pw } = user;

  let access = "";
  let refresh = "";

  try {
    User.findOne({ $and: [{ id: id }, { pw: pw }] }).exec(
      async (err, result) => {
        if (result) {
          // access, refresh 토큰 발급
          refresh = await auth.refresh();
          access = await auth.access(result._id, result.email);

          // redis에서 유저의 이메일(key):refresh토큰(value)의 형태로 저장
          redisClient.set(result.email, refresh);

          // 로그인 성공시 회원정보와 token 값 전달
          res.status(200).send({
            user: result,
            token: { access: access, refresh: refresh },
          });
        } else {
          res.status(404).send("Login Faliure");
        }
      }
    );
  } catch {
    res.status(500).send({
      message: "Login Failure",
    });
  }
};
