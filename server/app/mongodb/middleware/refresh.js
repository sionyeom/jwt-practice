const auth = require("./auth");
const jwt = require("jsonwebtoken");

const fresh = async (req, res) => {
  // access token과 refresh token의 존재 유무를 체크합니다.
  if (req.headers.authorization && req.headers.refresh) {
    // header에서 토큰 값들을 가져옵니다.
    const authToken = req.headers.authorization;
    const refreshToken = req.headers.refresh;
    // access token 검증
    const authResult = auth.verify(authToken);
    // access token 디코딩하여 user의 정보 추출
    const decoded = jwt.decode(authToken);
    // 디코딩 결과가 없을 경우 권한 없음
    if (decoded === null) {
      res.status(401).send({
        ok: false,
        message: "No authorized",
      });
    }
    // 유저의 이메일을 가져와서 검증
    const refreshResult = await auth.refreshVerify(refreshToken, decoded.email);

    if (authResult.ok === false && authResult.message === "jwt expired") {
      // 1. access token 만료, refresh 만료 -> 새로 로그인
      if (refreshResult === false) {
        res.status(401).send({
          ok: false,
          message: "No Authorized!",
        });
      } else {
        // 2. accesstoken 만료, refresh O -> access 토큰 새발급
        const newAccessToken = auth.access(decoded.id, decoded.email);
        res.status(200).send({
          // 새로 발급한 access 토큰과 refresh 토큰 발급
          ok: true,
          data: {
            access: newAccessToken,
            refreshToken,
          },
        });
      }
    } else {
      // 3. access token O -> 그대로 유지
      res.status(400).send({
        ok: false,
        message: "Acess token is not expired!",
      });
    }
  } else {
    // 4. access token 또는 refresh token이 헤더에 없는 경우
    res.status(400).send({
      ok: false,
      message: "Access token and refresh token are need for refresh!",
    });
  }
};

module.exports = fresh;
