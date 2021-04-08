// Package imports.
import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

// Style imports.
import "./styles.scss";

// Component.
export default function Loading() {
  return(
    <div className="loading-container">
      <p>Loading...</p>
      <CircularProgress />
    </div>
  );
}
