// Package imports.
import React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";

// Component imports.
import Placeholder from "./pages/placeholder";

// Component.
export default function Routes() {
  return(
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Placeholder}/>
      </Switch>
    </BrowserRouter>
  );
}
