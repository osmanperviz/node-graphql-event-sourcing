'use strict'

module.exports = {
  schemaVersion: 0,
  tableName: 'user_read_model',
  SIGNED_UP: ({event, model}) => {
    return Object.assign({}, model, {
      email: event.payload.email,
      firstName: event.payload.firstName,
      id: event.entityId,
      lastName: event.payload.lastName
    })
  }
}
