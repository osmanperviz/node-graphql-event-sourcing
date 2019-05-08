'use srict'

const {GraphQLID, GraphQLInterface, GraphQLNonNull, GraphQLString} = require('graphql')
const userType = require('../userType')
const userEventStore = require('../user.eventStore')

module.exports = {
  description: 'Get a single user',
  authorization: {
    roles: ['BUYER', 'SELLER'],
    scope: 'APPLICATION'
  },
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'Id of a user'
    }
  },
  responseType: userType,
  execute: async ({args}) => {
    return await userEventStore.loadReadModel({entityId: args.id})
  }
}
