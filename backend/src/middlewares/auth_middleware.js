// Module imports.
const authUtils = require("../utils/auth_utils");

// Export module.
module.exports = function(request, response, next) {
  const authHeader = request.headers.authorization;
  const validation_result = authUtils.validate(authHeader);

  if(validation_result.valid) {
    request.user = validation_result.user;
    return next();
  }
  else {
    return response.status(401).json({
      statusCode: 401,
      error: "Unauthorized",
      message: validation_result.error
    });
  }

};
