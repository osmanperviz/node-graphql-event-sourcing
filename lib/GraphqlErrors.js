'use strict'

const {GraphQLError} = require('graphql')

class ExtendedGraphQLError extends GraphQLError {
  constructor({code, field, message}) {
    super(message)
    this.code = code
    this.field = field
  }
}

exports.ExtendedGraphQLError = ExtendedGraphQLError

exports.UserNotFoundError = class extends ExtendedGraphQLError {
  constructor({field, message} = {}) {
    super({
      code: 'USER_NOT_FOUND',
      field,
      message: message || 'Der Benutzer wurde nicht gefunden.'
    })
  }
}
