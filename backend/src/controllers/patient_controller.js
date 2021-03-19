// Module imports.
const connection = require("../../db/connection");

// Export module.
module.exports = {
  async create(request, response) {
    const current_user_id = request.user;
    const {
      birth_date,
      full_name,
      has_diabetes,
      patient_user_id,
      sex
    } = request.body;

    if(current_user_id !== patient_user_id) {
      return response.status(401).json({
        statusCode: 401,
        error: "Unauthorized",
        message: "You cannot create a patient for another user!"
      });
    }

    else {
      const [id] = await connection("PATIENTS").insert({
        FULL_NAME: full_name,
        BIRTH_DATE: birth_date,
        SEX: sex,
        HAS_DIABETES: has_diabetes,
        USER_ID: patient_user_id,
        CREATED_AT: new Date(),
        UPDATED_AT: new Date()
      });
      return response.status(200).json({id});
    }

  },

  async delete(request, response) {
    const current_user_id = request.user;
    const patient_id = request.params["id"];

    // Find the requested patient's user id.
    const patient = await connection("PATIENTS")
      .select("USER_ID")
      .where({id: patient_id})
      .first();

    // Check if the patient exists and if the user is authorized.
    if(patient == null)
      return response.status(404).json({
        statusCode: 404,
        error: "Not found",
        message: "Patient does not exist!"
      });
    else if(patient["USER_ID"] !== current_user_id)
      return response.status(401).json({
        statusCode: 401,
        error: "Unauthorized",
        message: "Operation not permitted!"
      });
    else {
      await connection("PATIENTS").where({id: patient_id}).delete();
      return response.status(200).json(
        {success: "Patient deleted successfully."}
      );
    }
  },

  async read(request, response) {
    const current_user_id = request.user;
    const patient_id = request.params["id"];

    // Find the requested patient.
    const patient = await connection("PATIENTS")
      .select("*")
      .where({id: patient_id})
      .first();

    // Check if the patient exists and if the user is authorized.
    if(patient == null)
      return response.status(404).json({
        statusCode: 404,
        error: "Not found",
        message: "Patient does not exist!"
      });
    else if(patient["USER_ID"] !== current_user_id)
      return response.status(401).json({
        statusCode: 401,
        error: "Unauthorized",
        message: "Operation not permitted!"
      });
    else {
      return response.status(200).json({patient});
    }

  }
};
