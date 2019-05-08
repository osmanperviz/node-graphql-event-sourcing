'use strict'

const _ = require('lodash')
const connectionPool = require('../../db/connectionPool')
const EventStream = require('./EventStream')
const stringHash = require('string-hash')
const idGenerator = require('../../db/idGenerator')

const EventStore = class {
  constructor({entityType, readModelTransformations, writeModelTransformations, idPrefix}) {
    this.entityType = entityType
    this.readModelTransformations = readModelTransformations
    ;(this.writeModelTransformations = writeModelTransformations), (this.idPrefix = idPrefix)
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

  async loadReadModel({entityId}) {
    const result = await connectionPool.query({
      text: `SELECT read_model FROM ${this.readModelTransformations.tableName} WHERE id = $1`,
      values: [entityId]
    })
    if (result.rows.length === 0) {
      return
    }
    debugger
    const readModel = result.rows[0].read_model
    if (readModel.isDeleted) {
      return
    }
    return readModel
  }

  async generateEntityId() {
    return await idGenerator.generateEntityId({prefix: this.idPrefix})
  }
}

module.exports = EventStore
