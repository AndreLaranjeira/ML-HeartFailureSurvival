// Package imports.
import React from "react";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";

// Context imports.
import {useAuthContext} from "./contexts/auth";

// Component imports.
import Home from "./pages/home";
import Login from "./pages/login";
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
        <Route path="/home" render=
          {() => authContext.authorized ? <Home/> : <Redirect to="/login" />}
        />
        <Route path="/login" render=
          {() => authContext.authorized ? <Redirect to="/home" /> : <Login/>}
        />
        <Route path="/register" render=
          {() => authContext.authorized ? <Redirect to="/home" /> : <Register/>}
        />
      </Switch>
    </BrowserRouter>
  );
}
