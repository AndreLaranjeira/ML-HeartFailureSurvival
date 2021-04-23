// Package imports.
const pythonBridge = require("python-bridge");

// Module imports.
const connection = require("../../db/connection");

// Export module.
module.exports = {
  processBacklog: {
    recurrenceRule: {minute: 0},

    executedFunction: async function processBacklog() {

      console.log("[Job - Process prediction backlog] Status: Running...");

      const predictionModelFile = "prediction_model/prediction_model.rf.sav";
      const predictionsAwaitingProcessing = await connection("PREDICTIONS")
        .select("*")
        .where({prediction_processing_status: "WAITING"});

      // Start python bridge and import make_prediction function.
      const python = pythonBridge();

      await python.ex`
        import sys
        sys.path.insert(1, './prediction_model')
        from make_prediction import make_prediction
      `;

      // Make predictions.
      for(let i = 0; i < predictionsAwaitingProcessing.length; i++) {

        const prediction = predictionsAwaitingProcessing[i];

        try {
          await python.ex`result = make_prediction(
            model_filename=${predictionModelFile},
            age=${prediction["AGE"]},
            anaemia=${prediction["ANEMIA"]},
            creatinine_phosphokinase=${prediction["CREATININE_PHOSPHOKINASE"]},
            diabetes=${prediction["DIABETES"]},
            ejection_fraction=${prediction["EJECTION_FRACTION"]},
            high_blood_pressure=${prediction["HIGH_BLOOD_PRESSURE"]},
            platelets=${prediction["PLATELETS"]},
            serum_creatinine=${prediction["SERUM_CREATININE"]},
            sex=${prediction["SEX"]},
            smoking=${prediction["SMOKING"]}
          )`;
          const predictionResult = await python`int(result)`;

          await connection("PREDICTIONS")
            .where({id: prediction["ID"]})
            .update({
              death_prediction: predictionResult,
              prediction_processing_status: "COMPLETED",
              updated_at: new Date()
            });
        }
        catch(err) {
          await connection("PREDICTIONS")
            .where({id: prediction["ID"]})
            .update({
              prediction_processing_status: "ERROR",
              updated_at: new Date()
            });
        }

      }

      // Close python bridge.
      python.end();

      console.log("[Job - Process prediction backlog] Status: Finished!");

    }

  }
};
