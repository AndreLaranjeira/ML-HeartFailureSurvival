// Package imports.
import React from "react";

// Style imports.
import "./global.scss";

// Context imports.
import {AuthProvider} from "./contexts/auth";
import {NotificationsProvider} from "./contexts/notifications";

// Component imports.
import Routes from "./routes";

// Component.
export default function App() {

  return (
    <NotificationsProvider>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </NotificationsProvider>
  );
}
