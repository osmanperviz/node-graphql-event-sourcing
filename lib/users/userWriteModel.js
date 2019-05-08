'use strict'

module.exports = {
  SIGNED_UP: ({event, model}) => {
    return Object.assign({}, model, {
      email: event.payload.email,
      firstName: event.payload.firstName,
      id: event.entityId,
      lastName: event.payload.lastName
    })
  }
}
