const auth = require("./auth");
const jwt = require("jsonwebtoken");

const fresh = async (req, res) => {
  // access token과 refresh token의 존재 유무를 체크합니다.
  if (req.header.authorization && req.headers.refresh) {
    const authToken = req.header.authorization;
    const refreshTotken = req.headers.refresh;
  }
};
