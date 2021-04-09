// Package imports.
import React from "react";
import {useParams} from "react-router-dom";

// Style imports.
import "./styles.scss";

// Component.
export default function Home() {

  // Variables.
  const patient_id = useParams().id;

  // JSX returned.
  return(
    <h1>Create prediction for patient #{patient_id} placeholder</h1>
  );
}
