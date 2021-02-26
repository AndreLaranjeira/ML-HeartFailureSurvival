// Package imports.
import React from "react";
import {useHistory} from "react-router-dom";

// Module imports.
// import api from "../../services/api";

// Style imports.
import "./styles.scss";

// Component.
export default function Home() {

  // Variables.
  const history = useHistory();

  // Handler functions.
  function handleLogout() {
    localStorage.clear();
    history.push("/login");
  }

  // JSX returned.
  return(
    <div>
      <h1>Home placeholder</h1>
      <button onClick={handleLogout} className="danger-button" type="button">
        Logout
      </button>
    </div>
  );
}
