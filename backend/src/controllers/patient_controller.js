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
      sex
    } = request.body;

    const [id] = await connection("PATIENTS").insert({
      FULL_NAME: full_name,
      BIRTH_DATE: birth_date,
      SEX: sex,
      HAS_DIABETES: has_diabetes,
      USER_ID: current_user_id,
      CREATED_AT: new Date(),
      UPDATED_AT: new Date()
    });

    return response.status(201).json({id});

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

  async index(request, response) {
    const current_user_id = request.user;
    const {page = 1} = request.query;
    const page_length = 10;

    // Pacient count for the user.
    const [pacient_count] = await connection("PATIENTS")
      .where({user_id: current_user_id})
      .count();
    response.header("X-Total-Count", pacient_count["count(*)"]);

    // Patients data.
    const patients = await connection("PATIENTS")
      .leftJoin("PREDICTIONS", {"PREDICTIONS.PATIENT_ID": "PATIENTS.ID"})
      .select("PATIENTS.*")
      .count("PREDICTIONS.ID", {as: "PREDICTION_COUNT"})
      .groupBy("PATIENTS.ID")
      .where({user_id: current_user_id})
      .limit(page_length)
      .offset((page - 1) * page_length);

    return response.status(200).json(patients);
  },

  async read(request, response) {
    const current_user_id = request.user;
    const patient_id = request.params["id"];

    // Find the requested patient.
    const patient = await connection("PATIENTS")
      .leftJoin("PREDICTIONS", {"PREDICTIONS.PATIENT_ID": "PATIENTS.ID"})
      .select("PATIENTS.*")
      .count("PREDICTIONS.ID", {as: "PREDICTION_COUNT"})
      .groupBy("PATIENTS.ID")
      .where("PATIENTS.ID", "=", patient_id)
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

  },

  async update(request, response) {
    const current_user_id = request.user;
    const patient_id = request.params["id"];
    const {
      birth_date,
      full_name,
      has_diabetes,
      sex
    } = request.body;

    // Find the requested patient.
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
      await connection("PATIENTS")
        .where({id: patient_id})
        .update({
          BIRTH_DATE: birth_date,
          FULL_NAME: full_name,
          HAS_DIABETES: has_diabetes,
          SEX: sex,
          UPDATED_AT: new Date()
        });
      return response.status(200).json(
        {success: "Patient updated successfully."}
      );
    }

  }
};
