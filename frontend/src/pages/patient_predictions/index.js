// Package imports.
import React, {useEffect, useState} from "react";
import { format } from "date-fns";
import Lodash from "lodash";
import {confirmAlert} from "react-confirm-alert";
import {IconContext} from "react-icons";
import {FaArrowLeft, FaArrowRight, FaFileMedical} from "react-icons/fa";
import {FaNotesMedical, FaTrashAlt, FaUser} from "react-icons/fa";
import ReactPaginate from "react-paginate";
import {useHistory, useParams} from "react-router-dom";

// Context imports.
import {useAuthContext} from "../../contexts/auth";
import {useNotificationsContext} from "../../contexts/notifications";

// Module imports.
import api from "../../services/api";

// Style imports.
import "./styles.scss";

// Component.
export default function PatientPredictions() {

  // Variables.
  const authContext = useAuthContext();
  const history = useHistory();
  const notificationsContext = useNotificationsContext();
  const patientId = useParams().id;
  const userAuthorization = localStorage.getItem("authorization");
  const [patientBirthDate, setPatientBirthDate] = useState(null);
  const [patientFullName, setPatientFullName] = useState("");
  const [patientHasDiabetes, setPatientHasDiabetes] = useState(undefined);
  const [patientPredictions, setPatientPredictions] = useState([]);
  const [patientSex, setPatientSex] = useState(undefined);
  const [predictionPage, setPredictionPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Functions.
  async function handleDeletePrediction(id) {
    try {
      await api.delete(`patients/${patientId}/predictions/${id}`, {
        headers: {
          Authorization: userAuthorization
        }
      });

      const remainingPredictions = patientPredictions
        .filter(prediction => prediction.ID !== id);

      if(remainingPredictions.length === 0 && predictionPage > 1)
        setPredictionPage(predictionPage - 1);

      else
        updatePatientPredictions();

      notificationsContext.createNotification(
        "success",
        "Prediction deleted successfully."
      );

    } catch (err) {
      notificationsContext.createNotification(
        "error",
        "Could not delete prediction! Please try again."
      );
    }
  }

  function confirmDeletePredictionModal(prediction) {
    function renderPredictionResult(predictionStatus, predictionResult) {
      if(predictionStatus === "COMPLETED") {
        if(predictionResult)
          return(
            <p>Heart disease prediction: Positive</p>
          );

        else
          return(
            <p>Heart disease prediction: Negative</p>
          );
      }

      else
        return null;
    }

    return confirmAlert({
      title: "Delete prediction?",
      childrenElement: function predictionInfo() {
        return(
          <div>
            <p>Prediction created on: {
              formatPredictionCreationDateTime(prediction.created_at)
            }
            </p>
            <p>Prediction status: {
              Lodash.capitalize(prediction.PREDICTION_PROCESSING_STATUS)
            }
            </p>
            {
              renderPredictionResult(
                prediction.PREDICTION_PROCESSING_STATUS,
                prediction.DEATH_PREDICTION
              )
            }
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
          onClick: () => handleDeletePrediction(prediction.ID),
          className: "confirm-button"
        }
      ]
    });
  }

  function formatPredictionCreationDateTime(dateTime) {
    return format(new Date(dateTime), "HH:mm:ss - MM/dd/yyyy");
  }

  function goToCreatePatientPrediction() {
    history.push(`/patients/${patientId}/predictions/create`);
  }

  function goToHomePage() {
    history.push("/home");
  }

  function handleLogout() {
    authContext.logout();
    history.push("/login");
  }

  function renderPrediction(prediction) {

    function renderPredictionResult(predictionStatus, predictionResult) {
      if(predictionStatus === "COMPLETED") {
        if(predictionResult)
          return(
            <p className="prediction-result danger-color">
              Heart disease prediction: Positive
            </p>
          );

        else
          return(
            <p className="prediction-result success-color">
              Heart disease prediction: Negative
            </p>
          );
      }

      else
        return null;
    }

    function renderPredictionStatus(status) {
      if(status === "WAITING")
        return (
          <p>Prediction status: Waiting</p>
        );
      else if(status === "COMPLETED")
        return(
          <p>
            Prediction status: <span className="success-color">Completed</span>
          </p>
        );
      else if(status === "ERROR")
        return(
          <p>
            Prediction status: <span className="danger-color">Error</span>
          </p>
        );
    }

    return(
      <li key={prediction.ID} className="prediction">
        <div className="prediction-header-row">
          <h3>
            Created on: {
              formatPredictionCreationDateTime(prediction.created_at)
            }
          </h3>
          <button
            className="prediction-icon-button"
            onClick={() => confirmDeletePredictionModal(prediction)}
          >
            <IconContext.Provider
              value={{ className: "prediction-delete-icon danger-color" }}
            >
              <FaTrashAlt/>
            </IconContext.Provider>
          </button>
        </div>
        <div className="prediction-info-row">
          <p>Age: {prediction.AGE}</p>
          <p>Anemia: {prediction.ANEMIA === 1 ? "Yes" : "No"}</p>
          <p>Creatinine kinase: {
            prediction.CREATININE_PHOSPHOKINASE.toLocaleString()
          }
          </p>
        </div>
        <div className="prediction-info-row">
          <p>Ejection fraction: {prediction.EJECTION_FRACTION}</p>
          <p>
            High blood pressure: {
              prediction.HIGH_BLOOD_PRESSURE === 1 ? "Yes" : "No"
            }
          </p>
          <p>Platelets: {prediction.PLATELETS.toLocaleString()}</p>
        </div>
        <div className="prediction-info-row">
          <p>Serum creatinine: {prediction.SERUM_CREATININE}</p>
          <p>Smoking: {prediction.SMOKING === 1 ? "Yes" : "No"}</p>
        </div>
        <div className="prediction-result-row">
          {renderPredictionStatus(prediction.PREDICTION_PROCESSING_STATUS)}
          {
            renderPredictionResult(
              prediction.PREDICTION_PROCESSING_STATUS,
              prediction.DEATH_PREDICTION
            )
          }
        </div>
      </li>
    );
  }

  function updatePatientPredictions() {
    api.get(`patients/${patientId}/predictions`, {
      headers: {
        Authorization: userAuthorization
      },
      params: {
        page: predictionPage
      }
    }).then(response => {
      setPatientPredictions(response.data);
      setTotalPages(response.headers["x-total-pages"]);
    }).catch(err => {
      if(err.response?.data?.statusCode === 401) {
        authContext.logout();
        notificationsContext.sessionTimeoutNotification();
        history.push("/login");
      }

      else {
        notificationsContext.createNotification(
          "error",
          "Could not load the patients's predictions! Please try again."
        );
      }
    });
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

      setPatientFullName(patient["FULL_NAME"]);
      setPatientBirthDate(format(new Date(patient["BIRTH_DATE"]), "MM/dd/yyyy"));
      setPatientSex(Lodash.capitalize(patient["SEX"]));
      setPatientHasDiabetes(patient["HAS_DIABETES"] === 1 ? "Yes" : "No");

    }).catch(err => {
      if(err.response?.data?.statusCode === 401) {
        authContext.logout();
        notificationsContext.sessionTimeoutNotification();
        history.push("/login");
      }

      else {
        notificationsContext.createNotification(
          "error",
          "Could not load patient data!"
        );
        history.push("/");
      }
    });

  }, [patientId]);

  useEffect(() => {
    updatePatientPredictions();
  }, [predictionPage]);

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
        <div className="return-to-last-page-row">
          <button onClick={goToHomePage} className="info-button" type="button">
            <div className="button-row">
              <IconContext.Provider value={{ className: "left-button-icon" }}>
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
        <div className="center-container">
          <div className="patient-info-container">
            <div className="patient-info">
              <p>Full name: {patientFullName}</p>
              <p>Birth date: {patientBirthDate}</p>
              <p>Sex: {patientSex}</p>
              <p>Diabetic: {patientHasDiabetes}</p>
            </div>
          </div>
        </div>
        <div className="header-row">
          <IconContext.Provider value={{ className: "header-icon" }}>
            <FaNotesMedical/>
          </IconContext.Provider>
          <h2 className="flex-grow">Patient predictions</h2>
          <button
            onClick={goToCreatePatientPrediction}
            className="success-button"
            type="button"
          >
            <div className="button-row">
              Create prediction
              <IconContext.Provider
                value={{ className: "right-button-icon" }}
              >
                <FaFileMedical/>
              </IconContext.Provider>
            </div>
          </button>
        </div>
        <div className="center-container">
          <ul className="predictions-list">
            {patientPredictions.map(prediction => renderPrediction(prediction))}
          </ul>
          <ReactPaginate
            breakLabel={"..."}
            forcePage={predictionPage - 1}
            marginPagesDisplayed={1}
            nextLabel={
              <IconContext.Provider
                value={{ className: "next-icon" }}
              >
                <FaArrowRight />
              </IconContext.Provider>
            }
            onPageChange={data => setPredictionPage(data.selected + 1)}
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
