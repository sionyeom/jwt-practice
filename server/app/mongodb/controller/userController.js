const jwt = require("jsonwebtoken");
const db = require("../model/index.js");
const User = db.user;

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
  const key = process.env.SECRET_KEY;
  let acess = "";
  let refresh = "";
  try {
    const user = User.findOne({ $and: [{ id: id }, { pw: pw }] }).exec(
      (err, result) => {
        if (result) {
          acess = jwt.sign(
            {
              type: "JWT",
              id: id,
              pw: pw,
            },
            key,
            {
              expiresIn: "15m",
              issuer: "sion",
            }
          );
          res
            .status(200)
            .send({ user: result, token: { access: acess, refresh: refresh } });
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
