'use strict'
const {GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLString} = require('graphql')
const nodeType = require('../graphql/nodeType')

const userType = new GraphQLObjectType({
  name: 'User',
  description: '',
  interfaces: [nodeType],
  fields: () => ({
    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
      description: ''
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
      description: ''
    },
    firstName: {
      type: new GraphQLNonNull(GraphQLString),
      description: ''
    },
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: ''
    },
    lastName: {
      type: new GraphQLNonNull(GraphQLString),
      description: ''
    }
  })
})

module.exports = userType
