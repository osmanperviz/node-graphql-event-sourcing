'use strict'

const {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} = require('graphql')
const userType = require('../userType')

const signUpUserInputType = new GraphQLInputObjectType({
  name: 'SignUpUserInput',
  description: 'A price.',
  fields: {
    email: {
      description: 'The email of the user.',
      format: 'email',
      maximumLength: 200,
      normalizeFormat: true,
      type: new GraphQLNonNull(GraphQLString),
      validateFormat: true
    },
    firstName: {
      description: 'The first name of the user.',
      maximumLength: 200,
      trim: true,
      type: new GraphQLNonNull(GraphQLString)
    },
    lastName: {
      description: 'The last name of the user.',
      maximumLength: 200,
      trim: true,
      type: new GraphQLNonNull(GraphQLString)
    }
  }
})

const signUpUserPayloadType = new GraphQLObjectType({
  name: 'SignUpUserPayload',
  description: 'A price.',
  fields: {
    user: {
      description: '',
      type: new GraphQLNonNull(userType)
    }
  }
})

module.exports = {
  description: 'Create a User',
  inputType: new GraphQLNonNull(signUpUserInputType),
  payloadType: new GraphQLNonNull(signUpUserPayloadType),
  execute: async ({accessToken, client, id, input, logger}) => {
    return {
      heloo: 'lo'
    }
    // const eventStream = await userEventStore.createEventStream({
    //   client,
    //   entityId: id,
    //   logger,
    //   userId: accessToken.userId
    // })
    // await loginCredentials.addEmail({
    //   client,
    //   email: input.email,
    //   passwordHash,
    //   userId: eventStream.entityId
    // })
    // if (input.mobile) {
    //   await loginCredentials.addMobile({
    //     client,
    //     mobile: input.mobile,
    //     passwordHash,
    //     userId: eventStream.entityId
    //   })
    // }
    // const payload = {
    //   businessPartnerId: accessToken.businessPartnerId,
    //   email: input.email,
    //   emailVerificationCode,
    //   emailVerificationCodeExpiresAt,
    //   firstName: input.firstName,
    //   lastName: input.lastName,
    //   mobile: input.mobile,
    //   passwordHash,
    //   salutationId: input.salutationId
    // }
    // await eventStream.add({
    //   eventType: 'SIGNED_UP',
    //   payload
    // })
    // return {
    //   user: eventStream.readModel,
    //   userEventStream: eventStream
    // }
  }
}
