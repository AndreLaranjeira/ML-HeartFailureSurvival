// Package imports.
import React, {createContext, useContext} from "react";
import PropTypes from "prop-types";
import {NotificationContainer, NotificationManager} from "react-notifications";

// Variables.
const NotificationsContext = createContext({});

// Component.
export function NotificationsProvider({children}) {

  // Functions.
  function createNotification(
    type,
    message,
    title=null,
    timeout=5000
  ) {

    if(type === "success")
      NotificationManager.success(message, title, timeout);

    else if(type === "info")
      NotificationManager.info(message, title, timeout);

    else if(type === "warning")
      NotificationManager.warning(message, title, timeout);

    else if(type === "error")
      NotificationManager.error(message, title, timeout);

  }

  function internalServerErrorNotification() {
    createNotification(
      "error",
      "Internal server error! Please contact an administrator."
    );
  }

  function sessionTimeoutNotification() {
    createNotification(
      "warning",
      "User session timed out!"
    );
  }

  // JSX returned.
  return (
    <NotificationsContext.Provider value={{
      createNotification,
      internalServerErrorNotification,
      sessionTimeoutNotification
    }}>
      {children}
      <NotificationContainer/>
    </NotificationsContext.Provider>
  );
}

// Prop types.
NotificationsProvider.propTypes = {
  children: PropTypes.any
};

// Context use function.
export function useNotificationsContext() {
  return useContext(NotificationsContext);
}
