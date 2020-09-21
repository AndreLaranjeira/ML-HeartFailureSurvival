// Package imports.
const bcrypt = require("bcryptjs");

// Module imports:
const connection = require("../../db/connection");

// Export module:
module.exports = {
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

    await connection("USERS").insert({
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

    return response.status(200).json(
      {success: "User created successfully!"}
    );

  }
};
