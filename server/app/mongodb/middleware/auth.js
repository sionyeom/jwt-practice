const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { promisify } = require("util");
const redisClient = require("./redis");

dotenv.config();

exports.auth = (req, res, next) => {
  const key = process.env.SECRET_KEY;
  // 인증 완료
  try {
    // 요청 헤더에 저장된 토큰(req.headers.authorization)과 비밀키를 사용하여 토큰을 req.decoded에 반환
    req.decoded = jwt.verify(req.headers.authorization, key);

    return next();
  } catch (error) {
    // 인증 실패
    // 유효시간이 초과된 경우
    if (error.name === "TokenExpiredError") {
      try {
        // refresh 토큰 검사 후 refresh가 만료되지 않으면 새로운 access 부여
      } catch {
        // refresh 토큰 검사 후 refresh가 유효하지 않을 경우 로그아웃 (access x, refresh x)
        if (error.name === "JsonWebTokenError") {
          return res.status(401).json({
            code: 401,
            message: "유효하지 않은 ACCESS 토큰입니다.",
          });
        }
      }

      return res.status(419).json({
        code: 419,
        message: "ACCESS 토큰이 만료되었습니다.",
      });
    }
    // 토큰의 비밀키가 일치하지 않는 경우
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        code: 401,
        message: "유효하지 않은 ACCESS 토큰입니다.",
      });
    }
  }
};

// access 생성
exports.access = (_id, email) => {
  const key = process.env.SECRET_KEY;
  return jwt.sign(
    {
      type: "JWT",
      id: _id,
      email: email,
    },
    key,
    {
      expiresIn: "15m",
      issuer: "sion",
    }
  );
};

// access 검증
exports.verify = (token) => {
  const key = process.env.SECRET_KEY;
  let decoded = null;

  try {
    decoded = jwt.verify(token, key);
    return {
      ok: true,
      id: decoded.id,
    };
  } catch (err) {
    return {
      ok: false,
      message: err.message,
    };
  }
};
// refresh 생성
exports.refresh = () => {
  const key = process.env.SECRET_KEY;

  return jwt.sign({}, key, { expiresIn: "20m", issuer: "sion" });
};

// refresh 검증
exports.refreshVerify = async (token, email) => {
  const key = process.env.SECRET_KEY;
  const getAsync = promisify(redisClient.get).bind(redisClient);
  try {
    const data = await getAsync(email);
    if (token === data) {
      try {
        jwt.verify(token, key);
        return true;
      } catch (err) {
        return false;
      }
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};
