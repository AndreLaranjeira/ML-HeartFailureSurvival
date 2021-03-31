// Package imports.
import React, {useEffect, useState} from "react";
import Moment from "moment";
import {confirmAlert} from "react-confirm-alert";
import {IconContext} from "react-icons";
import {FaEdit, FaNotesMedical, FaTrashAlt} from "react-icons/fa";
import {FaUser, FaUserPlus} from "react-icons/fa";
import {useHistory} from "react-router-dom";

// Context imports.
import {useAuthContext} from "../../contexts/auth";

// Module imports.
import api from "../../services/api";

/* Task list:
 *  - Create page to create and edit/delete patient.
 *  - Create link to placeholder page to create a checkup.
 *  - Investigate npm packages for flash messages.
 */

// Style imports.
import "./styles.scss";

// Component.
export default function Home() {

  // Variables.
  const authContext = useAuthContext();
  const history = useHistory();
  const userAuthorization = localStorage.getItem("authorization");
  const userFullName = localStorage.getItem("userFullName");
  const [userPatients, setUserPatients] = useState([]);

  // Page effects.
  useEffect(() => {
    let isMounted = true;
    
    api.get("patients", {
      headers: {
        Authorization: userAuthorization
      }
    }).then(response => {
      if(isMounted)
        setUserPatients(response.data);
    }).catch(err => {
      alert(
        "Ocorreu um erro ao carregar os pacientes\n\n" + "Detalhes" + err
      );
    });

    return function cleanUp() {
      isMounted = false;
    };
  }, []);

  // Handler functions.
  async function handleDeletePatient(id) {
    try {
      await api.delete(`patients/${id}`, {
        headers: {
          Authorization: userAuthorization
        }
      });

      setUserPatients(userPatients.filter(patient => patient.ID !== id));
    } catch (err) {
      alert("Error on case deletion! Please try again.");
    }
  }

  function handleLogout() {
    authContext.logout();
    history.push("/login");
  }

  // JSX returned.
  return(
    <div className="home-container">
      <div className="header-row">
        <h1 className="flex-grow">Home page - {userFullName}</h1>
        <button onClick={handleLogout} className="danger-button" type="button">
          Logout
        </button>
      </div>
      <div className="content-container">
        <div className="header-row">
          <IconContext.Provider value={{ className: "header-icon" }}>
            <FaUser/>
          </IconContext.Provider>
          <h2 className="flex-grow">Patients</h2>
          <button onClick={null} className="success-button" type="button">
            <div className="buttom-row">
              Add patient
              <IconContext.Provider value={{ className: "button-icon" }}>
                <FaUserPlus/>
              </IconContext.Provider>
            </div>
          </button>
        </div>
        <ul>
          {userPatients.map(
            patient => (
              <li key={patient.ID} className="patient">
                <h3>{patient.FULL_NAME}</h3>
                <p>Nascido em: {
                  Moment(patient.BIRTH_DATE).format("DD/MM/YYYY")
                }
                </p>
                <p>Sexo: {
                  patient.SEX === "MALE" ? "Masculino" : "Feminino"
                }</p>
                <p>Possui diabetes: {
                  patient.HAS_DIABETES === 1 ? "Sim" : "Não"
                }</p>
                <p>Número de previsões: {patient.PREDICTION_COUNT}</p>
                <div className="options-row">
                  <button
                    className="patient-icon-button"
                    onClick={() => null}
                  >
                    <IconContext.Provider
                      value={{ className: "patient-prediction-icon" }}
                    >
                      <FaNotesMedical/>
                    </IconContext.Provider>
                  </button>
                  <button
                    className="patient-icon-button"
                    onClick={() => null}
                  >
                    <IconContext.Provider
                      value={{ className: "patient-edit-icon" }}
                    >
                      <FaEdit/>
                    </IconContext.Provider>
                  </button>
                  <button
                    className="patient-icon-button"
                    onClick={() =>
                      confirmAlert({
                        title: "Excluir paciente?",
                        childrenElement: function patientInfo() {
                          return(
                            <div>
                              <p>Nome do paciente: {patient.FULL_NAME}</p>
                              <p>
                                Número de checkups: {patient.PREDICTION_COUNT}
                              </p>
                            </div>
                          );
                        },
                        buttons: [
                          {
                            label: "Cancelar",
                            onClick: () => null
                          },
                          {
                            label: "Confimar",
                            onClick: () => handleDeletePatient(patient.ID),
                            className: "confirm-button"
                          }
                        ]
                      })
                    }
                  >
                    <IconContext.Provider
                      value={{ className: "patient-delete-icon" }}
                    >
                      <FaTrashAlt/>
                    </IconContext.Provider>
                  </button>
                </div>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}
