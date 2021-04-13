// Package imports.
import React, {useEffect, useState} from "react";
import Moment from "moment";
import {useHistory, useParams} from "react-router-dom";

// Context imports.
import {useAuthContext} from "../../contexts/auth";

// Module imports.
import api from "../../services/api";
import {celebrateErrorContent} from "../../utils/celebrate";
import {formatCelebrateMessage, isCelebrateError} from "../../utils/celebrate";

// Style imports.
import "./styles.scss";

// Component.
export default function CreatePrediction() {

  // Variables.
  const authContext = useAuthContext();
  const history = useHistory();
  const patientId = useParams().id;
  const userAuthorization = localStorage.getItem("authorization");
  const [age, setAge] = useState(null);
  const [creatinePhosphokinase, setCreatinePhosphokinase] = useState("");
  const [ejectionFraction, setEjectionFraction] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [hasAnemia, setHasAnemia] = useState(undefined);
  const [hasDiabetes, setHasDiabetes] = useState(undefined);
  const [hasHighBloodPressure, setHasHighBloodPressure] = useState(undefined);
  const [platelets, setPlatelets] = useState("");
  const [serumCreatinine, setSerumCreatinine] = useState("");
  const [serumSodium, setSerumSodium] = useState("");
  const [sex, setSex] = useState(undefined);
  const [smoking, setSmoking] = useState(undefined);
  const [time, setTime] = useState("");

  // JSX returned.
  async function handleCreatePrediction(e) {
    e.preventDefault();     // Prevent default page submit behavior.

    const responseCelebrateErrors = {};

    try {
      const data = {
        "age": age,
        "anemia": hasAnemia,
        "creatinine_phosphokinase": creatinePhosphokinase,
        "diabetes": hasDiabetes,
        "ejection_fraction": ejectionFraction,
        "high_blood_pressure": hasHighBloodPressure,
        "platelets": platelets,
        "serum_creatinine": serumCreatinine,
        "serum_sodium": serumSodium,
        "sex": sex,
        "smoking": smoking,
        "time": time
      };

      await api.post(
        `/patients/${patientId}/predictions`,
        data,
        {
          headers: {
            Authorization: userAuthorization
          }
        }
      );

      alert(
        "Prediction creation successfull! " +
        "Taking you to the patient predictions page."
      );
      returnToPatientPredictions();
    } catch(err) {
      if(isCelebrateError(err)) {
        const errorContent = celebrateErrorContent(err);
        responseCelebrateErrors[errorContent.key] = formatCelebrateMessage(
          errorContent.message
        );
        setFormErrors(responseCelebrateErrors);
      }
      else if(err.response.data.message != null) {
        setFormErrors({});
        alert(err.response.data.message);
      }
      else {
        setFormErrors({});
        alert("Internal server error! Please contact an administrator.");
      }
    }
  }

  function returnToPatientPredictions() {
    history.push(`/patients/${patientId}/predictions`);
  }

  // Page effects.
  useEffect(() => {

    // Get the patient's information.
    api.get(`patients/${patientId}`, {
      headers: {
        Authorization: userAuthorization
      }
    }).then(response => {
      const patient = response.data.patient;

      setAge(
        Moment.duration(Moment().diff(patient["BIRTH_DATE"])).years()
      );
      setHasDiabetes(patient["HAS_DIABETES"] === 1);
      setSex(patient["SEX"] === "FEMALE" ? 0 : 1);

    }).catch(err => {
      if(err.response?.data?.statusCode === 401) {
        alert("Session timed out! returning to login page!");
        authContext.logout();
        history.push("/login");
      }

      else {
        alert(
          `There was an error loading patient #${patientId}'s data!\n`
          + "Returning to landing page.\n\n"
          + "Error details: " + err + "."
        );
        history.push("/");
      }
    });

  }, [patientId]);

  // JSX returned.
  return(
    <div className="create-prediction-container">
      <div className="form-title">
        <h1>Create prediction</h1>
      </div>
      <div className="create-prediction-form">
        <form onSubmit={handleCreatePrediction}>
          <p className="form-section">Health measurements</p>
          <div className="form-row">
            <div className="form-input-with-title short-width">
              <p className="input-title">Creatine Phosphokinase</p>
              <input
                className="number-input"
                type="number"
                value={creatinePhosphokinase}
                onChange={e => setCreatinePhosphokinase(e.target.value)}
              />
              <p className="form-error">
                {formErrors.creatininePhosphokinase}
              </p>
            </div>
            <div className="form-input-with-title short-width">
              <p className="input-title">Ejection fraction</p>
              <input
                className="number-input"
                type="number"
                value={ejectionFraction}
                onChange={e => setEjectionFraction(e.target.value)}
              />
              <p className="form-error">
                {formErrors.ejectionFraction}
              </p>
            </div>
          </div>
          <div className="form-row">
            <div className="form-input-with-title short-width">
              <p className="input-title">Platelets</p>
              <input
                className="number-input"
                type="number"
                value={platelets}
                onChange={e => setPlatelets(e.target.value)}
              />
              <p className="form-error">
                {formErrors.platelets}
              </p>
            </div>
            <div className="form-input-with-title short-width">
              <p className="input-title">Serum Creatinine</p>
              <input
                className="number-input"
                step="0.01"
                type="number"
                value={serumCreatinine}
                onChange={e => setSerumCreatinine(e.target.value)}
              />
              <p className="form-error">
                {formErrors.serumCreatinine}
              </p>
            </div>
          </div>
          <div className="form-row">
            <div className="form-input-with-title short-width">
              <p className="input-title">Serum Sodium</p>
              <input
                className="number-input"
                type="number"
                value={serumSodium}
                onChange={e => setSerumSodium(e.target.value)}
              />
              <p className="form-error">
                {formErrors.serumSodium}
              </p>
            </div>
            <div className="form-input-with-title short-width">
              <p className="input-title">Days in treatment</p>
              <input
                className="number-input"
                type="number"
                value={time}
                onChange={e => setTime(e.target.value)}
              />
              <p className="form-error">
                {formErrors.time}
              </p>
            </div>
          </div>
          <p className="form-section">Patient conditions</p>
          <div className="form-row">
            <div className="form-input-with-title short-width">
              <p className="input-title">Anemia</p>
              <div className="radio-button-row short-width">
                <div className="radio-button-with-label">
                  <label htmlFor="patient_has_anemia_yes">Yes</label>
                  <input
                    className="radio-input"
                    type="radio"
                    id="patient_has_anemia_yes"
                    value={true}
                    onChange={() => setHasAnemia(true)}
                    checked={hasAnemia === true}
                  />
                </div>
                <div className="radio-button-with-label">
                  <label htmlFor="patient_has_anemia_no">No</label>
                  <input
                    className="radio-input"
                    type="radio"
                    id="patient_has_anemia_no"
                    value={false}
                    onChange={() => setHasAnemia(false)}
                    checked={hasAnemia === false}
                  />
                </div>
              </div>
              <p className="form-error">{formErrors.anemia}</p>
            </div>
            <div className="form-input-with-title short-width">
              <p className="input-title">High blood pressure</p>
              <div className="radio-button-row short-width">
                <div className="radio-button-with-label">
                  <label htmlFor="patient_has_high_blood_pressure_yes">
                    Yes
                  </label>
                  <input
                    className="radio-input"
                    type="radio"
                    id="patient_has_high_blood_pressure_yes"
                    value={true}
                    onChange={() => setHasHighBloodPressure(true)}
                    checked={hasHighBloodPressure === true}
                  />
                </div>
                <div className="radio-button-with-label">
                  <label htmlFor="patient_has_high_blood_pressure_no">
                    No
                  </label>
                  <input
                    className="radio-input"
                    type="radio"
                    id="patient_has_high_blood_pressure_no"
                    value={false}
                    onChange={() => setHasHighBloodPressure(false)}
                    checked={hasHighBloodPressure === false}
                  />
                </div>
              </div>
              <p className="form-error">
                {formErrors.highBloodPressure}
              </p>
            </div>
          </div>
          <div className="form-row">
            <div className="form-input-with-title short-width justify-center">
              <p className="input-title">Smoking</p>
              <div className="radio-button-row short-width">
                <div className="radio-button-with-label">
                  <label htmlFor="patient_smoking_yes">Yes</label>
                  <input
                    className="radio-input"
                    type="radio"
                    id="patient_smoking_yes"
                    value={true}
                    onChange={() => setSmoking(true)}
                    checked={smoking === true}
                  />
                </div>
                <div className="radio-button-with-label">
                  <label htmlFor="patient_smoking_no">No</label>
                  <input
                    className="radio-input"
                    type="radio"
                    id="patient_smoking_no"
                    value={false}
                    onChange={() => setSmoking(false)}
                    checked={smoking === false}
                  />
                </div>
              </div>
              <p className="form-error">
                {formErrors.smoking}
              </p>
            </div>
          </div>
          <button className="submit-button success-button" type="submit">
            Create prediction
          </button>
        </form>
      </div>
      <div className="cancel-row">
        <button className="danger-button" onClick={returnToPatientPredictions}>
          <div className="button-row">
            Cancel
          </div>
        </button>
      </div>
    </div>
  );
}
