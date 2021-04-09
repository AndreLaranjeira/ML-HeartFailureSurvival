// Package imports.
import React, {useEffect, useState} from "react";
import Lodash from "lodash";
import Moment from "moment";
import {IconContext} from "react-icons";
import {FaArrowLeft, FaNotesMedical, FaUser} from "react-icons/fa";
import {useHistory, useParams} from "react-router-dom";

// Context imports.
import {useAuthContext} from "../../contexts/auth";

// Module imports.
import api from "../../services/api";

// Style imports.
import "./styles.scss";

// Component.
export default function Home() {

  // Variables.
  const authContext = useAuthContext();
  const history = useHistory();
  const patient_id = useParams().id;
  const userAuthorization = localStorage.getItem("authorization");
  const [patientBirthDate, setPatientBirthDate] = useState(null);
  const [patientFullName, setPatientFullName] = useState("");
  const [patientHasDiabetes, setPatientHasDiabetes] = useState(undefined);
  const [patientSex, setPatientSex] = useState(undefined);

  function goToHomePage() {
    history.push("/home");
  }

  function handleLogout() {
    authContext.logout();
    history.push("/login");
  }

  // Page effects.
  useEffect(() => {
    // Get the patient's information.
    api.get(`patients/${patient_id}`, {
      headers: {
        Authorization: userAuthorization
      }
    }).then(response => {
      const patient = response.data.patient;
      setPatientFullName(patient["FULL_NAME"]);
      setPatientBirthDate(Moment(patient["BIRTH_DATE"]).format("MM/DD/YYYY"));
      setPatientSex(Lodash.capitalize(patient["SEX"]));
      setPatientHasDiabetes(patient["HAS_DIABETES"] === 1 ? "Yes" : "No");
    }).catch(err => {
      if(err.response?.data?.statusCode === 401) {
        alert("Session timed out! returning to login page!");
        authContext.logout();
        history.push("/login");
      }

      else {
        alert(
          `There was an error loading the patient #${patient_id}'s data!\n`
          + "Returning to landing page.\n\n"
          + "Error details: " + err + "."
        );
        history.push("/");
      }
    });

  });

  // JSX returned.
  return(
    <div className="patient-predictions-container">
      <div className="header-row">
        <h1 className="flex-grow">Patient predictions</h1>
        <button onClick={handleLogout} className="danger-button" type="button">
          Logout
        </button>
      </div>
      <div className="content-container">
        <div className="back-button-row">
          <button onClick={goToHomePage} className="info-button" type="button">
            <div className="button-row">
              <IconContext.Provider value={{ className: "button-icon" }}>
                <FaArrowLeft />
              </IconContext.Provider>
              Home page
            </div>
          </button>
        </div>
        <div className="header-row">
          <IconContext.Provider value={{ className: "header-icon" }}>
            <FaUser/>
          </IconContext.Provider>
          <h2 className="flex-grow">Patient information</h2>
        </div>
        <div className="patient-info">
          <p>Full name: {patientFullName}</p>
          <p>Birth date: {patientBirthDate}</p>
          <p>Sex: {patientSex}</p>
          <p>Diabetic: {patientHasDiabetes}</p>
        </div>
        <div className="header-row">
          <IconContext.Provider value={{ className: "header-icon" }}>
            <FaNotesMedical/>
          </IconContext.Provider>
          <h2 className="flex-grow">Patient predictions</h2>
        </div>
      </div>
    </div>
  );
}
