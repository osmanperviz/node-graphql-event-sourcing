'use srict'

const {GraphQLID, GraphQLInterface, GraphQLNonNull, GraphQLString} = require('graphql')
const userType = require('./userType')

module.exports = {
  description: 'Get a single user',
  authorization: {
    roles: ['BUYER', 'SELLER'],
    scope: 'APPLICATION'
  },
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: ''
    }
  },
  responseType: userType,
  execute: async ({accessToken, args}) => {
    return 'hello world'
  }
}
