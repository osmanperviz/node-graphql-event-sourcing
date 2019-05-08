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

  async loadEventStream({businessPartnerId, client, entityId, userId}) {
    try {
      await this.lockEventStream({client, entityId})
      const events = await this.loadEvents({entityId})
      if (events.length === 0) {
        return
      }
      if (events[events.length - 1].eventType === 'deleted') {
        return
      }
      const eventStream = new EventStream({
        client,
        entityId,
        entityType: this.entityType,
        events,
        readModelTransformations: this.readModelTransformations,
        userId,
        writeModelTransformations: this.writeModelTransformations
      })
      return eventStream
    } catch (error) {
      console.error('Failed to load event stream.', error)
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

  async loadEvents({client, entityId}) {
    const adaptedClient = client ? client : connectionPool
    const result = await adaptedClient.query({
      text: 'SELECT event FROM event WHERE entity_id = $1 ORDER BY index',
      values: [entityId]
    })
    const events = result.rows.map(row => row.event)
    return events
  }

  async lockEventStream({client, entityId}) {
    const hash = stringHash(entityId)
    await client.query({
      text: 'SELECT pg_advisory_xact_lock($1)',
      values: [hash]
    })
  }

  async generateEntityId() {
    return await idGenerator.generateEntityId({prefix: this.idPrefix})
  }
}

module.exports = EventStore
