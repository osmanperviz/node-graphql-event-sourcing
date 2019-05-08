'use strict'

const {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} = require('graphql')
const userEventStore = require('../user.eventStore')
const userType = require('../userType')
const {UserNotFoundError} = require('../../GraphQLErrors')

const updateUserInputType = new GraphQLInputObjectType({
  name: 'UpdateUserInput',
  description: 'A price.',
  fields: {
    firstName: {
      type: new GraphQLNonNull(GraphQLString),
      description: '',
      maximumLength: 200,
      trim: true
    },
    lastName: {
      type: new GraphQLNonNull(GraphQLString),
      description: '',
      maximumLength: 200,
      trim: true
    },
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: ''
    },
    email: {
      description: 'The email of the user.',
      format: 'email',
      maximumLength: 200,
      normalizeFormat: true,
      type: new GraphQLNonNull(GraphQLString),
      validateFormat: true
    }
  }
})

const updateUserPayloadType = new GraphQLObjectType({
  name: 'UpdateUserPayload',
  description: 'A price.',
  fields: {
    user: {
      type: new GraphQLNonNull(userType),
      description: ''
    }
  }
})

module.exports = {
  description: 'Update a User',
  inputType: new GraphQLNonNull(updateUserInputType),
  payloadType: new GraphQLNonNull(updateUserPayloadType),
  execute: async ({client, input}) => {
    debugger
    const eventStream = await userEventStore.loadEventStream({
      client,
      entityId: input.id,
      userId: input.userId
    })
    if (!eventStream) {
      throw new UserNotFoundError({field: 'id'})
    }
    const payload = {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email
    }
    await eventStream.add({
      eventType: 'UPDATED',
      payload
    })
    return {
      user: eventStream.readModel
    }
  }
}
