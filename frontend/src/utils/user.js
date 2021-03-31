// Helper functions to return user data and conditions.

// Module imports.
import api from "../services/api";

// Helper functions.
export async function userLoggedIn() {
  const authorization = localStorage.getItem("authorization");
  if(authorization != null) {
    try {
      await api.get("auth/validate", {
        headers: {
          Authorization: authorization
        }
      });
      return true;
    }
    catch {
      return false;
    }
  }
  else {
    return false;
  }
}
