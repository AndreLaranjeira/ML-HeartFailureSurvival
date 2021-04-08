// Package imports.
import React, {createContext, useContext, useEffect, useState} from "react";
import PropTypes from "prop-types";

// Component imports.
import Loading from "../components/loading";

// Module imports.
import {getUserPatientsIds, userLoggedIn} from "../utils/user";

// Variables.
const AuthContext = createContext({});

// Context component.
export function AuthProvider({children}) {

  const [reloadContext, setReloadContext] = useState("");
  const [authorized, setAuthorized] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userPatientsIds, setUserPatientsIds] = useState([]);

  useEffect(async() => {
    setLoading(true);

    const authorizedReceived = await userLoggedIn();
    await setAuthorized(authorizedReceived);

    const userPatientsIdsReceived = await getUserPatientsIds();
    await setUserPatientsIds(userPatientsIdsReceived);

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
    <AuthContext.Provider value={{
      authorized: authorized,
      userPatientsIds: userPatientsIds,
      login,
      logout
    }}>
      {
        loading ?
          <Loading /> :
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
