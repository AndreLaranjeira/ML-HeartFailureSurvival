// Helper functions to identify and handle errors from Celebrate middleware.

// Helper functions.
export function isCelebrateError(err) {
  const response_data = err.response.data;

  if(response_data.message != null && response_data.validation != null) {
    return (response_data.message === "celebrate request validation failed");
  }
  else {
    return false;
  }
}

export function celebrateErrorMessage(err) {
  const celebrate_validation = err.response.data.validation;
  const default_celebrate_message = err.response.data.message;

  if(celebrate_validation.body != null)
    return celebrate_validation.body.message;
  else
    return default_celebrate_message;
}
