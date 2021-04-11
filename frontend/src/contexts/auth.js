// Package imports.
import React, {createContext, useContext, useEffect, useState} from "react";
import PropTypes from "prop-types";

// Component imports.
import Loading from "../components/loading";

// Module imports.
import {getUserPatientsIds, userLoggedIn} from "../utils/user";

// Variables.
const AuthContext = createContext({});

// Component.
export function AuthProvider({children}) {

  // Variables.
  const [authorized, setAuthorized] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reloadContext, setReloadContext] = useState("");
  const [userPatientsIds, setUserPatientsIds] = useState([]);

  // Functions.
  function login(response) {
    localStorage.setItem("authorization", `Bearer ${response.data.token}`);
    localStorage.setItem("userFullName", response.data.user["FULL_NAME"]);

    setReloadContext("login");
  }

  function logout() {
    localStorage.clear();

    setReloadContext("logout");
  }

  // Page effects.
  useEffect(async() => {
    setLoading(true);

    const authorizedReceived = await userLoggedIn();
    await setAuthorized(authorizedReceived);

    const userPatientsIdsReceived = await getUserPatientsIds();
    await setUserPatientsIds(userPatientsIdsReceived);

    setLoading(false);
  }, [reloadContext]);

  // JSX returned.
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

// Prop types.
AuthProvider.propTypes = {
  children: PropTypes.any
};

// Context use function.
export function useAuthContext() {
  return useContext(AuthContext);
}
