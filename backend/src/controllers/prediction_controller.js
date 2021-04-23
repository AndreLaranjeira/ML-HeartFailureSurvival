// Module imports.
const connection = require("../../db/connection");

// Export module.
module.exports = {
  async create(request, response) {
    const current_user_id = request.user;
    const patient_id = request.params["patient_id"];
    const {
      age,
      anemia,
      creatinine_phosphokinase,
      diabetes,
      ejection_fraction,
      high_blood_pressure,
      platelets,
      serum_creatinine,
      sex,
      smoking
    } = request.body;

    // Find the requested patient's user id.
    const patient = await connection("PATIENTS")
      .select("USER_ID")
      .where({id: patient_id})
      .first();

    // Check if the patient exists and if the user is authorized.
    if(patient == null) {
      return response.status(404).json({
        statusCode: 404,
        error: "Not found",
        message: "Patient does not exist!"
      });
    }

    else if(patient["USER_ID"] !== current_user_id) {
      return response.status(401).json({
        statusCode: 401,
        error: "Unauthorized",
        message: "Operation not permitted!"
      });
    }

    else {

      const [id] = await connection("PREDICTIONS").insert({
        AGE: age,
        ANEMIA: anemia,
        CREATININE_PHOSPHOKINASE: creatinine_phosphokinase,
        DIABETES: diabetes,
        EJECTION_FRACTION: ejection_fraction,
        HIGH_BLOOD_PRESSURE: high_blood_pressure,
        PLATELETS: platelets,
        SERUM_CREATININE: serum_creatinine,
        SEX: sex,
        SMOKING: smoking,
        DEATH_PREDICTION: null,
        PREDICTION_PROCESSING_STATUS: "WAITING",
        PATIENT_ID: patient_id,
        CREATED_AT: new Date(),
        UPDATED_AT: new Date()
      });
      return response.status(201).json({id});
    }

  },

  async delete(request, response) {
    const current_user_id = request.user;
    const patient_id = request.params["patient_id"];
    const prediction_id = request.params["prediction_id"];

    // Find the requested resources and their owners.
    const patient = await connection("PATIENTS")
      .select("USER_ID")
      .where({id: patient_id})
      .first();

    const prediction = await connection("PREDICTIONS")
      .select("PATIENT_ID")
      .where({id: prediction_id})
      .first();

    // Check if the resources exist and if the ownership and authorizations
    // match.
    if(patient == null)
      return response.status(404).json({
        statusCode: 404,
        error: "Not found",
        message: "Patient does not exist!"
      });
    else if(prediction == null)
      return response.status(404).json({
        statusCode: 404,
        error: "Not found",
        message: "Prediction does not exist!"
      });
    else if(
      patient["USER_ID"] !== current_user_id ||
      prediction["PATIENT_ID"] !== patient_id
    )
      return response.status(401).json({
        statusCode: 401,
        error: "Unauthorized",
        message: "Operation not permitted!"
      });
    else {
      await connection("PREDICTIONS").where({id: prediction_id}).delete();
      return response.status(200).json(
        {success: "Prediction deleted successfully."}
      );
    }
  },

  async index(request, response) {
    const current_user_id = request.user;
    const {page = 1} = request.query;
    const page_length = 5;
    const patient_id = request.params["patient_id"];

    // Find the requested patient's user id.
    const patient = await connection("PATIENTS")
      .select("USER_ID")
      .where({id: patient_id})
      .first();

    // Check if the patient exists and if the user is authorized.
    if(patient == null) {
      return response.status(404).json({
        statusCode: 404,
        error: "Not found",
        message: "Patient does not exist!"
      });
    }

    else if(patient["USER_ID"] !== current_user_id) {
      return response.status(401).json({
        statusCode: 401,
        error: "Unauthorized",
        message: "Operation not permitted!"
      });
    }

    else {

      // Prediction count for the patient.
      const [prediction_count] = await connection("PREDICTIONS")
        .where({patient_id: patient_id})
        .count();
      response.header("X-Total-Count", prediction_count["count(*)"]);
      response.header(
        "X-Total-Pages",
        Math.max(Math.ceil(prediction_count["count(*)"]/page_length), 1)
      );

      // Predictions data.
      const predictions = await connection("PREDICTIONS")
        .select("*")
        .where({patient_id})
        .limit(page_length)
        .offset((page - 1) * page_length)
        .orderBy("created_at", "desc");

      return response.status(200).json(predictions);

    }
  }
};
