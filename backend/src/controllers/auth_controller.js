// Package imports.
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Module imports.
const authConfig = require("../config/auth");
const connection = require("../../db/connection");

// Auxiliary functions.
function generateToken(params = {}) {
  return jwt.sign(
    params,
    authConfig.secret,
    {expiresIn: 14400}
  );
}

// Export module.
module.exports = {
  async authenticate(request, response) {
    const {email, password} = request.body;

    const user_being_authenticated = await connection("USERS")
      .select("*")
      .where(
        {email: email}
      )
      .first();

    if(user_being_authenticated == null) {
      return response.status(400).json({
        statusCode: 400,
        error: "Bad Request",
        message: "This email address is not registered to any user!"
      });
    }

    else if(!await bcrypt.compare(password, user_being_authenticated["HASHED_PASSWORD"])) {
      return response.status(400).json({
        statusCode: 400,
        error: "Bad Request",
        message: "Invalid password! Please, try again."
      });
    }

    else {
      // Remove hashed password for security purposes.
      user_being_authenticated["HASHED_PASSWORD"] = undefined;

      return response.status(200).json({
        user: user_being_authenticated,
        token: generateToken({id: user_being_authenticated["ID"]})
      });
    }

  },

  async register(request, response) {
    const {email, password, full_name, role_id} = request.body;

    const user_with_the_same_email = await connection("USERS")
      .select("ID")
      .where(
        {email: email}
      )
      .first();

    if(user_with_the_same_email != null) {
      return response.status(400).json({
        statusCode: 400,
        error: "Bad Request",
        message: "This email address is already taken!"
      });
    }

    const hashed_password = await bcrypt.hash(password, 10);

    const [created_user_id] = await connection("USERS").insert({
      EMAIL: email,
      FULL_NAME: full_name,
      HASHED_PASSWORD: hashed_password,
      IS_ACTIVE: true,
      ROLE_ID: role_id,
      CREATED_AT: new Date(),
      UPDATED_AT: new Date()
    }).catch((e) => {
      return response.status(500).json({
        statusCode: 500,
        error: "Internal Server Error",
        details: e
      });
    });

    const created_user = await connection("USERS")
      .select("*")
      .where(
        {id: created_user_id}
      )
      .first();

    // Remove password hash for security purposes.
    created_user["HASHED_PASSWORD"] = undefined;

    return response.status(200).json({
      user: created_user,
      token: generateToken({id: created_user["ID"]})
    });

  }
};
