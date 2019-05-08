"use strict";

const { GraphQLError } = require("graphql");

class ExtendedGraphQLError extends GraphQLError {
  constructor({ code, field, message }) {
    super(message);
    this.code = code;
    this.field = field;
  }
}

exports.ExtendedGraphQLError = ExtendedGraphQLError;

exports.BankAccountNotFoundError = class extends ExtendedGraphQLError {
  constructor({ field, message } = {}) {
    super({
      code: "BANK_ACCOUNT_NOT_FOUND",
      field,
      message: message || "Die Bankverbindung wurde nicht gefunden."
    });
  }
};
