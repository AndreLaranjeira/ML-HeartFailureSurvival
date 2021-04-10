// Package imports.
import React from "react";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";

// Context imports.
import {useAuthContext} from "./contexts/auth";

// Component imports.
import CreatePrediction from "./pages/create_prediction";
import Home from "./pages/home";
import Login from "./pages/login";
import PatientDetais from "./pages/patient_details";
import PatientPredictions from "./pages/patient_predictions";
import Register from "./pages/register";

// Component.
export default function Routes() {

  // Variables.
  const authContext = useAuthContext();

  // JSX returned.
  return(
    <BrowserRouter>
      <Switch>
        <Route exact path="/" render=
          {() => authContext.authorized ? <Redirect to="/home" /> : <Redirect to="/login" />}
        />
        <Route exact path="/home" render=
          {() => authContext.authorized ? <Home/> : <Redirect to="/login" />}
        />
        <Route exact path="/patients/create" render=
          {() => authContext.authorized ? <PatientDetais/> : <Redirect to="/login" />}
        />
        <Route exact path="/patients/:id/edit" render=
          {({match}) =>
            authContext.userPatientsIds.includes(Number(match.params.id)) ?
              <PatientDetais/> :
              <Redirect to="/" />
          }
        />
        <Route exact path="/patients/:id/predictions" render=
          {({match}) =>
            authContext.userPatientsIds.includes(Number(match.params.id)) ?
              <PatientPredictions/> :
              <Redirect to="/" />
          }
        />
        <Route exact path="/patients/:id/predictions/create" render=
          {({match}) =>
            authContext.userPatientsIds.includes(Number(match.params.id)) ?
              <CreatePrediction/> :
              <Redirect to="/" />
          }
        />
        <Route exact path="/login" render=
          {() => authContext.authorized ? <Redirect to="/home" /> : <Login/>}
        />
        <Route exact path="/register" render=
          {() => authContext.authorized ? <Redirect to="/home" /> : <Register/>}
        />
      </Switch>
    </BrowserRouter>
  );
}
