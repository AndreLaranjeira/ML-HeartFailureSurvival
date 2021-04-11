// Package imports.
import React from "react";

// Style imports.
import "./global.scss";

// Context imports.
import {AuthProvider} from "./contexts/auth";

// Component imports.
import Routes from "./routes";

// Component.
export default function App() {

  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}
