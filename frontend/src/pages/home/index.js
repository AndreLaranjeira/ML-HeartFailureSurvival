// Package imports.
import React, {useEffect, useState} from "react";
import Moment from "moment";
import {confirmAlert} from "react-confirm-alert";
import {IconContext} from "react-icons";
import {FaArrowLeft, FaArrowRight, FaEdit} from "react-icons/fa";
import {FaNotesMedical, FaTrashAlt, FaUser, FaUserPlus} from "react-icons/fa";
import ReactPaginate from "react-paginate";
import {useHistory} from "react-router-dom";

// Context imports.
import {useAuthContext} from "../../contexts/auth";

// Module imports.
import api from "../../services/api";

/* Task list:
 *  - Tweak patient details page to allow patient to be edited;
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
  const [userPage, setUserPage] = useState(1);
  const [userPatients, setUserPatients] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  // Page effects.
  useEffect(() => {
    updateUserPatients();
  }, [userPage]);

  // Handler functions.
  async function handleDeletePatient(id) {
    try {
      await api.delete(`patients/${id}`, {
        headers: {
          Authorization: userAuthorization
        }
      });

      updateUserPatients();
    } catch (err) {
      alert("Error on patient deletion! Please try again.");
    }
  }

  function updateUserPatients() {
    api.get("patients", {
      headers: {
        Authorization: userAuthorization
      },
      params: {
        page: userPage
      }
    }).then(response => {
      setUserPatients(response.data);
      setTotalPages(response.headers["x-total-pages"]);
    }).catch(err => {
      alert(
        "Ocorreu um erro ao carregar os pacientes\n\n" + "Detalhes" + err
      );
    });
  }

  function goToCreatePatient() {
    history.push("/patients/create");
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
          <button onClick={goToCreatePatient} className="success-button" type="button">
            <div className="buttom-row">
              Add patient
              <IconContext.Provider value={{ className: "button-icon" }}>
                <FaUserPlus/>
              </IconContext.Provider>
            </div>
          </button>
        </div>
        <div className="center-container">
          <ul className="patients-list">
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
          <ReactPaginate
            breakLabel={"..."}
            marginPagesDisplayed={1}
            nextLabel={
              <IconContext.Provider
                value={{ className: "next-icon" }}
              >
                <FaArrowRight />
              </IconContext.Provider>
            }
            onPageChange={data => setUserPage(data.selected + 1)}
            pageCount={totalPages}
            pageRangeDisplayed={5}
            previousLabel={
              <IconContext.Provider
                value={{ className: "previous-icon" }}
              >
                <FaArrowLeft />
              </IconContext.Provider>
            }
            activeClassName={"active"}
            breakClassName={"break"}
            breakLinkClassName={"break-link"}
            containerClassName={"react-paginate"}
            nextClassName={"next"}
            pageClassName={"page"}
            previousClassName={"previous"}
          />
        </div>
      </div>
    </div>
  );
}
