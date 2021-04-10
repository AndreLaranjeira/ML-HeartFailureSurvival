// Package imports.
import React, {useEffect, useState} from "react";
import Lodash from "lodash";
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

// Style imports.
import "./styles.scss";

// Component.
export default function Home() {

  // Variables.
  const authContext = useAuthContext();
  const history = useHistory();
  const userAuthorization = localStorage.getItem("authorization");
  const userFullName = localStorage.getItem("userFullName");
  const [patientPage, setPatientPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userPatients, setUserPatients] = useState([]);

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

  function confirmDeletePatientModal(patient) {
    return confirmAlert({
      title: "Delete patient?",
      childrenElement: function patientInfo() {
        return(
          <div>
            <p>Patient name: {patient.FULL_NAME}</p>
            <p>
              Number of predictions: {patient.PREDICTION_COUNT}
            </p>
          </div>
        );
      },
      buttons: [
        {
          label: "Cancel",
          onClick: () => null
        },
        {
          label: "Confim",
          onClick: () => handleDeletePatient(patient.ID),
          className: "confirm-button"
        }
      ]
    });
  }

  function goToCreatePatient() {
    history.push("/patients/create");
  }

  function goToPatientPredictions(patientId) {
    history.push(`/patients/${patientId}/predictions`);
  }

  function goToUpdatePatient(patientId) {
    history.push(`/patients/${patientId}/edit`);
  }

  function handleLogout() {
    authContext.logout();
    history.push("/login");
  }

  function renderPatient(patient) {
    return (
      <li key={patient.ID} className="patient">
        <h3>{patient.FULL_NAME}</h3>
        <p>Birth date: {
          Moment(patient.BIRTH_DATE).format("MM/DD/YYYY")
        }
        </p>
        <p>Sex: {
          Lodash.capitalize(patient.SEX)
        }</p>
        <p>Diabetic: {
          patient.HAS_DIABETES === 1 ? "Yes" : "No"
        }</p>
        <p>Number of predictions: {patient.PREDICTION_COUNT}</p>
        <div className="options-row">
          <button
            className="patient-icon-button"
            onClick={() => goToPatientPredictions(patient.ID)}
          >
            <IconContext.Provider
              value={{ className: "patient-icon success-color" }}
            >
              <FaNotesMedical/>
            </IconContext.Provider>
          </button>
          <button
            className="patient-icon-button"
            onClick={() => goToUpdatePatient(patient.ID)}
          >
            <IconContext.Provider
              value={{ className: "patient-icon info-color" }}
            >
              <FaEdit/>
            </IconContext.Provider>
          </button>
          <button
            className="patient-icon-button"
            onClick={() => confirmDeletePatientModal(patient)}
          >
            <IconContext.Provider
              value={{ className: "patient-icon danger-color" }}
            >
              <FaTrashAlt/>
            </IconContext.Provider>
          </button>
        </div>
      </li>
    );
  }

  function updateUserPatients() {
    api.get("patients", {
      headers: {
        Authorization: userAuthorization
      },
      params: {
        page: patientPage
      }
    }).then(response => {
      setUserPatients(response.data);
      setTotalPages(response.headers["x-total-pages"]);
    }).catch(err => {
      if(err.response?.data?.statusCode === 401) {
        alert("Session timed out! returning to login page!");
        authContext.logout();
      }

      else {
        alert(
          "There was an error loading the patients' data!\n"
          + "Please, try again later.\n\n"
          + "Error details: " + err + "."
        );
      }
    });
  }

  // Page effects.
  useEffect(() => {
    updateUserPatients();
  }, [patientPage]);

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
            <div className="button-row">
              Add patient
              <IconContext.Provider value={{ className: "button-icon" }}>
                <FaUserPlus/>
              </IconContext.Provider>
            </div>
          </button>
        </div>
        <div className="center-container">
          <ul className="patients-list">
            {userPatients.map(patient => renderPatient(patient))}
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
            onPageChange={data => setPatientPage(data.selected + 1)}
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
