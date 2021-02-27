// Helper functions to identify and handle errors from Celebrate middleware.

// Helper functions.
export function celebrateErrorContent(err) {
  const celebrate_validation = err.response.data.validation;
  const default_celebrate_message = err.response.data.message;

  if(celebrate_validation.body != null)
    return {
      key: celebrate_validation.body.keys[0],
      message: celebrate_validation.body.message
    };
  else
    return default_celebrate_message;
}

export function celebrateErrorMessage(err) {
  const celebrate_validation = err.response.data.validation;
  const default_celebrate_message = err.response.data.message;

  if(celebrate_validation.body != null)
    return celebrate_validation.body.message;
  else
    return default_celebrate_message;
}

export function formatCelebrateMessage(message) {
  const messageWithoutQuotesAroundField = message.replace(/"(.*)"/, "$1");
  const messageCapitalized =
    messageWithoutQuotesAroundField.charAt(0).toUpperCase() +
    messageWithoutQuotesAroundField.slice(1) + ".";

  return messageCapitalized;
}

export function isCelebrateError(err) {
  const response_data = err.response.data;

  if(response_data.message != null && response_data.validation != null) {
    return (response_data.message === "celebrate request validation failed");
  }
  else {
    return false;
  }
}
