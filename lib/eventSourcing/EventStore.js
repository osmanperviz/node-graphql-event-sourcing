'use strict'

const _ = require('lodash')
const connectionPool = require('../../db/connectionPool')
const EventStream = require('./EventStream')
const stringHash = require('string-hash')

const EventStore = class {
  constructor({entityType, readModelTransformations, writeModelTransformations}) {
    this.entityType = entityType
    this.readModelTransformations = readModelTransformations
    this.writeModelTransformations = writeModelTransformations
  }

  async createEventStream({client, entityId, userId}) {
    try {
      const eventStream = new EventStream({
        client,
        entityId: entityId === undefined ? await this.generateEntityId() : entityId,
        entityType: this.entityType,
        readModelTransformations: this.readModelTransformations,
        userId,
        writeModelTransformations: this.writeModelTransformations
      })
      return eventStream
    } catch (error) {
      console.error('Failed to create event stream.', error)
      throw error
    }
  }
}

module.exports = EventStore
