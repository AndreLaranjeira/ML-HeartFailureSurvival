// Package imports.
import React, {createContext, useContext, useEffect, useState} from "react";
import PropTypes from "prop-types";

// Page imports.
import LoadingPage from "../pages/loading";

// Module imports.
import {userLoggedIn} from "../utils/user";

// Variables.
const AuthContext = createContext({});

// Context component.
export function AuthProvider({children}) {

  const [reloadContext, setReloadContext] = useState("");
  const [authorized, setAuthorized] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(async() => {
    setLoading(true);
    let response = await userLoggedIn();
    setAuthorized(response);
    setLoading(false);
  }, [reloadContext]);

  function login(response) {
    localStorage.setItem("authorization", `Bearer ${response.data.token}`);
    localStorage.setItem("userFullName", response.data.user["FULL_NAME"]);

    setReloadContext("login");
  }

  function logout() {
    localStorage.clear();

    setReloadContext("logout");
  }

  return (
    <AuthContext.Provider value={{authorized: authorized, login, logout}}>
      {
        loading ?
          <LoadingPage /> :
          children
      }
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.any
};

// Context use.
export function useAuthContext() {
  const context = useContext(AuthContext);

  return context;
}
