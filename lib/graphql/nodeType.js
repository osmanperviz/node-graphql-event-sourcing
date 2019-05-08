'use srict'

const {GraphQLID, GraphQLInterfaceType, GraphQLNonNull} = require('graphql')

module.exports = new GraphQLInterfaceType({
  name: 'Node',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  }
})
