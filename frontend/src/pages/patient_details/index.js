// Package imports.
import React, {useEffect, useState} from "react";
import DatePicker from "react-datepicker";
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
export default function Register() {

  // Variables.
  const authContext = useAuthContext();
  const history = useHistory();
  const patientId = useParams().id;
  const userAuthorization = localStorage.getItem("authorization");
  const [birthDate, setBirthDate] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [fullName, setFullName] = useState("");
  const [hasDiabetes, setHasDiabetes] = useState(undefined);
  const [pageTitle, setPageTitle] = useState("");
  const [sex, setSex] = useState(undefined);
  const [submitButtonText, setSubmitButtonText] = useState("");

  // Handler functions.
  async function handleCreatePatient(e) {
    e.preventDefault();     // Prevent default page submit behavior.

    const responseCelebrateErrors = {};

    try {
      const data = {
        full_name: fullName,
        birth_date: birthDate,
        sex: sex,
        has_diabetes: hasDiabetes
      };

      await api.post("patients", data, {
        headers: {
          Authorization: userAuthorization
        }
      });
      alert("Patient creation successfull! Taking you to the home page.");
      history.push("/home");
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

  async function handleFormSubmit(e) {
    if(patientId != undefined)
      handleUpdatePatient(e);

    else
      handleCreatePatient(e);
  }

  async function handleUpdatePatient(e) {
    e.preventDefault();     // Prevent default page submit behavior.

    const responseCelebrateErrors = {};

    try {
      const data = {
        full_name: fullName,
        birth_date: birthDate,
        sex: sex,
        has_diabetes: hasDiabetes
      };

      await api.put(`patients/${patientId}`, data, {
        headers: {
          Authorization: userAuthorization
        }
      });
      alert("Patient updated successfull! Taking you to the home page.");
      history.push("/home");
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

  function returnToHome() {
    history.push("/home");
  }

  // Page effects.
  useEffect(() => {
    if(patientId != undefined) {
      // Configure page.
      setPageTitle("Update patient");
      setSubmitButtonText("Update patient");

      // Get the patient's information.
      api.get(`patients/${patientId}`, {
        headers: {
          Authorization: userAuthorization
        }
      }).then(response => {
        const patient = response.data.patient;
        setFullName(patient["FULL_NAME"]);
        setBirthDate(new Date(patient["BIRTH_DATE"]));
        setSex(patient["SEX"]);
        setHasDiabetes(patient["HAS_DIABETES"] === 1);
      }).catch(err => {
        if(err.response?.data?.statusCode === 401) {
          alert("Session timed out! returning to login page!");
          authContext.logout();
          history.push("/login");
        }

        else {
          alert(
            `There was an error loading the patient #${patientId}'s data!\n`
            + "Returning to landing page.\n\n"
            + "Error details: " + err + "."
          );
          history.push("/");
        }
      });
    }

    else {
      setPageTitle("Create patient");
      setSubmitButtonText("Create patient");
    }
  }, [patientId]);

  // JSX returned.
  return(
    <div className="patient-details-container">
      <div className="patient-details-title">
        <h1>{pageTitle}</h1>
      </div>
      <div className="patient-details-form">
        <form onSubmit={handleFormSubmit}>
          <div className="form-input-with-title">
            <p className="input-title">Patient name</p>
            <input
              className="form-input"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
            />
            <p className="form-error">{formErrors.fullName}</p>
          </div>
          <div className="form-input-with-title">
            <p className="input-title">Patient birth date</p>
            <DatePicker
              className="form-input"
              selected={birthDate}
              onChange={date => setBirthDate(date)}
              dateFormat="dd/MM/yyyy"
              dropdownMode="select"
              maxDate={new Date()}
              minDate={new Date(1900, 0, 1)}
              showDisabledMonthNavigation
              showMonthDropdown
              showYearDropdown
            />
            <p className="form-error">{formErrors.birthDate}</p>
          </div>
          <div className="form-input-with-title">
            <p className="input-title">Patient sex</p>
            <div className="radio-button-row">
              <div className="radio-button-with-label">
                <label htmlFor="patient_sex_male">Male</label>
                <input
                  className="radio-input"
                  type="radio"
                  id="patient_sex_male"
                  value="MALE"
                  onChange={e => setSex(e.target.value)}
                  checked={sex === "MALE"}
                />
              </div>
              <div className="radio-button-with-label">
                <label htmlFor="patient_sex_female">Female</label>
                <input
                  className="radio-input"
                  type="radio"
                  id="patient_sex_female"
                  value="FEMALE"
                  onChange={e => setSex(e.target.value)}
                  checked={sex === "FEMALE"}
                />
              </div>
            </div>
            <p className="form-error">{formErrors.sex}</p>
          </div>
          <div className="form-input-with-title">
            <p className="input-title">Patient has Diabetes?</p>
            <div className="radio-button-row">
              <div className="radio-button-with-label">
                <label htmlFor="patient_has_diabetes_yes">Yes</label>
                <input
                  className="radio-input"
                  type="radio"
                  id="patient_has_diabetes_yes"
                  value={true}
                  onChange={() => setHasDiabetes(true)}
                  checked={hasDiabetes === true}
                />
              </div>
              <div className="radio-button-with-label">
                <label htmlFor="patient_has_diabetes_no">No</label>
                <input
                  className="radio-input"
                  type="radio"
                  id="patient_has_diabetes_no"
                  value={false}
                  onChange={() => setHasDiabetes(false)}
                  checked={hasDiabetes === false}
                />
              </div>
            </div>
            <p className="form-error">{formErrors.hasDiabetes}</p>
          </div>
          <button className="submit-button success-button" type="submit">
            {submitButtonText}
          </button>
        </form>
      </div>
      <div className="return-to-home">
        <div className="button-wrapper">
          <button className="danger-button" onClick={returnToHome}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
