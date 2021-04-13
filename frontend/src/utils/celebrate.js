// Helper functions to identify and handle errors from Celebrate middleware.

// Package imports.
var lodash = require("lodash");

// Helper functions.
export function celebrateErrorContent(err) {
  const celebrate_validation = err.response.data.validation;
  const default_celebrate_message = err.response.data.message;

  if(celebrate_validation.body != null)
    return {
      key: lodash.camelCase(celebrate_validation.body.keys[0]),
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
  const fieldNameRegex = /"(.*)"/;
  const fieldNameMatch = fieldNameRegex.exec(message);

  if(fieldNameMatch != null) {
    const fieldName = fieldNameMatch[0];
    const formattedFieldName = fieldName.replace(/"/g, "").replace(/_/g, " ");

    const messageWithFormattedField = message.replace(
      fieldNameRegex,
      formattedFieldName
    );

    const messageCapitalizedWithPunctuation = lodash.capitalize(
      messageWithFormattedField
    ) + ".";

    return messageCapitalizedWithPunctuation;
  }

  else {
    const messageCapitalizedWithPunctuation = lodash.capitalize(message) + ".";
    return messageCapitalizedWithPunctuation;
  }
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
