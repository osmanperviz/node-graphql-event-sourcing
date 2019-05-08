'use strict'

const createMutationType = require('./createMutationType')
const createQueryType = require('./createQueryType')
const {GraphQLSchema} = require('graphql')

module.exports = async () => {
  try {
    const queryType = await createQueryType()
    const mutationType = await createMutationType()
    const schema = new GraphQLSchema({
      query: queryType,
      mutation: mutationType
    })
    console.log('Created GraphQL schema.')
    return schema
  } catch (error) {
    console.log('Failed to create GraphQL schema.', error)
    throw error
  }
}
