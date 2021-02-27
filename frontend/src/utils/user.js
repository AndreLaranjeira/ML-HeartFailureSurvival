// Helper functions to return user data and conditions.

// Module imports.
import api from "../services/api";

// Helper functions.
export function userLoggedIn() {
  const authorization = localStorage.getItem("authorization");

  if(authorization != null) {
    try {
      api.post("auth/validate", null, {
        headers: {
          Authorization: authorization
        }
      });
      return true;
    }
    catch(err) {
      return false;
    }
  }
  else {
    return false;
  }
}
