// Package imports.
const jwt = require("jsonwebtoken");

// Module imports:
const authConfig = require("../config/auth");

// Export module:
module.exports = function(request, response, next) {
  const authHeader = request.headers.authorization;

  if(authHeader == null) {
    return response.status(401).json({
      statusCode: 401,
      error: "Unauthorized",
      message: "No token provided!"
    });
  }

  const tokenParts = authHeader.split(" ");

  if(tokenParts.length !== 2) {
    return response.status(401).json({
      statusCode: 401,
      error: "Unauthorized",
      message: "Token could not be processed!"
    });
  }

  const [scheme, token] = tokenParts;

  if(!scheme.toLowerCase().includes("bearer")) {
    return response.status(401).json({
      statusCode: 401,
      error: "Unauthorized",
      message: "Invalid token format!"
    });
  }

  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if(err) {
      return response.status(401).json({
        statusCode: 401,
        error: "Unauthorized",
        message: "Invalid token!"
      });
    }

    else {
      request.userId = decoded.id;
      return next();
    }
  });

};
