const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (request, response, next) => {
  let token;
  let authHeader =
    request.headers.Authorization || request.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    console.log("authHeader ", request.headers.Authorization);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
      if (error) {
        console.log(error);
        return response.status(401).json({ message: "Unauthorised Access!!" });
      }
      console.log("decoded", decoded);
      request.user = decoded.user;
      next();
    });
    if (!token) {
      response
        .status(401)
        .json({ message: "User is not authorized or token is missing" });
    }
  }
});

module.exports = validateToken;
