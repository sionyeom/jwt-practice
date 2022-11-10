const auth = require("./auth");

const authJWT = (req, res, next) => {
  // authorization 값이 있을 경우
  if (req.header.authorization) {
    // 토큰 값을 가져온다
    const token = req.header.authorization;
    // 토큰을 검증한다.
    const result = auth.verify(token);
    // 토큰의 ok값이 true일 경우
    if (result.ok) {
      // req 파라미터 값에 추가하여 보낸다.
      req.id = result.id;
      next();
    } else {
      // 검증에 실패하거나 만료일 경우 클라이언트에게 메시지를 담아서 응답
      // 클라이언트에서 401 상태일 경우 토큰을 재요청해야 함
      resizeTo.status(401).send({
        ok: false,
        message: result.message,
      });
    }
  }
};
module.exports = authJWT;
