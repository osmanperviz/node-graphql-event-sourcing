"use strict";

const _ = require("lodash");
const {
  ExtendedGraphQLError,
  InputValidationError
} = require("../GraphQLErrors");

module.exports = result => {
  if (!result.errors) {
    return;
  }
  const errors = [];
  for (const error of result.errors) {
    if (
      error.originalError &&
      error.originalError instanceof ExtendedGraphQLError
    ) {
      errors.push({
        ...error.originalError
      });
    } else {
      errors.push(error);
    }
  }
  const sortedErrors = _.orderBy(errors, ["code", "field"]);
  delete result.data;
  result.errors = sortedErrors;
};
