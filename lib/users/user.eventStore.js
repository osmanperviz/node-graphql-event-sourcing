const EventStore = require('../eventSourcing/EventStore')
const userReadModel = require('./userReadModel')
const userWriteModel = require('./userWriteModel')

const userEventStore = new EventStore({
  entityType: 'USER',
  readModelTransformations: userReadModel,
  writeModelTransformations: userWriteModel,
  idPrefix: 'US'
})

module.exports = userEventStore
