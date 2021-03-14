// Package imports.
import React from "react";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";

// Module imports.
import {userLoggedIn} from "./utils/user";

// Component imports.
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";

// Component.
export default function Routes() {
  return(
    <BrowserRouter>
      <Switch>
        <Route exact path="/" render=
          {() => userLoggedIn() ? <Redirect to="/home" /> : <Redirect to="/login" />}
        />
        <Route path="/home" render=
          {() => userLoggedIn() ? <Home/> : <Redirect to="/login" />}
        />
        <Route path="/login" render=
          {() => userLoggedIn() ? <Redirect to="/home" /> : <Login/>}
        />
        <Route path="/register" render=
          {() => userLoggedIn() ? <Redirect to="/home" /> : <Register/>}
        />
      </Switch>
    </BrowserRouter>
  );
}
