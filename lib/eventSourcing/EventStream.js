'use strict'

const _ = require('lodash')
const formatObject = require('./formatObject')
const config = require('config')

class EventStream {
  constructor({
    client,
    entityId,
    entityType,
    events,
    readModelTransformations,
    userId,
    writeModelTransformations
  }) {
    this.client = client
    this.entityId = entityId
    this.entityType = entityType
    this.errors = []
    //his.events = events ? events.slice(0) : []
    //this.newEvents = []
    this.readModel = {}
    this.readModelTransformations = readModelTransformations
    this.writeModel = {}
    this.writeModelTransformations = writeModelTransformations
    this.userId = userId
    for (const event of this.events) {
      this.updateModels(event)
    }
  }

  async add({eventType, payload, userId}) {
    try {
      const event = formatObject({
        entityId: this.entityId,
        entityType: this.entityType,
        eventType,
        index: this.events.length,
        occurredAt: new Date().toISOString(),
        payload,
        userId: userId ? userId : this.userId
      })
      // this.events.push(event)
      // this.newEvents.push(event)
      this.updateModels(event)
      await this.saveLastNewEvent()
      await this.saveReadModel()
    } catch (error) {
      console.error('Failed to add event to event stream.', error)
      throw error
    }
  }

  async saveLastNewEvent() {
    const lastEvent = this.newEvents[this.newEvents.length - 1]
    await this.client.query({
      text: 'INSERT INTO event(entity_id, index, event) VALUES ($1, $2, $3)',
      values: [this.entityId, lastEvent.index, lastEvent]
    })
  }

  async saveReadModel() {
    await this.client.query({
      text: `INSERT INTO ${
        this.readModelTransformations.tableName
      }(id, read_model, schema_version) VALUES($1, $2, $3) ON CONFLICT (id) DO UPDATE SET read_model = $2, schema_version = $3`,
      values: [this.entityId, this.readModel, this.readModelTransformations.schemaVersion]
    })
  }

  updateModels(event) {
    this.updateReadModel(event)
    this.updateWriteModel(event)
  }

  updateReadModel(event) {
    const oldReadModel = this.readModel
    let newReadModel
    const readModelTransformation = this.readModelTransformations[event.eventType]
    if (readModelTransformation) {
      newReadModel = readModelTransformation({event, model: oldReadModel})
    } else {
      newReadModel = oldReadModel
    }
    if (!newReadModel.createdAt) {
      newReadModel.createdAt = event.occurredAt
    }
    if (!newReadModel.createdByUserId) {
      newReadModel.createdByUserId = event.userId
    }
    newReadModel.lastUpdatedAt = event.occurredAt
    newReadModel.lastUpdatedByUserId = event.userId
    newReadModel.version = event.index
    this.readModel = formatObject(newReadModel)
  }

  updateWriteModel(event) {
    const oldWriteModel = this.writeModel
    let newWriteModel
    const writeModelTransformation = this.writeModelTransformations
      ? this.writeModelTransformations[event.eventType]
      : undefined
    if (writeModelTransformation) {
      newWriteModel = writeModelTransformation({event, model: oldWriteModel})
    } else {
      newWriteModel = oldWriteModel
    }
    newWriteModel.version = event.index
    this.writeModel = formatObject(newWriteModel)
  }
}

module.exports = EventStream
