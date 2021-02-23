// Authorization utilities.

// Package imports.
const jwt = require("jsonwebtoken");

// Module imports.
const authConfig = require("../config/auth");

// Export module.
module.exports = {
  validate(authorization) {
    if(authorization == null) {
      return {
        valid: false,
        error: "No token provided!"
      };
    }

    const tokenParts = authorization.split(" ");

    if(tokenParts.length !== 2) {
      return {
        valid: false,
        error: "Token could not be processed!"
      };
    }

    const [scheme, token] = tokenParts;

    if(!scheme.toLowerCase().includes("bearer")) {
      return {
        valid: false,
        error: "Invalid token format!"
      };
    }

    try {
      const decoded = jwt.verify(token, authConfig.secret);
      return {
        valid: true,
        user: decoded.id
      };
    }
    catch (err) {
      return {
        valid: false,
        error: "Invalid token!"
      };
    }
  }
};
