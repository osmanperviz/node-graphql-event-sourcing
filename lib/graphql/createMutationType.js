'use strict'

const fileFinder = require('./findFiles')
const {GraphQLObjectType} = require('graphql')
const executeMutation = require('./executeMutation')
const mutationSchema = require('./mutationSchema')
const path = require('path')
const process = require('process')
const validator = require('is-my-json-valid')

const validateMutation = validator(mutationSchema)

module.exports = async () => {
  const startDate = new Date()
  const directoryPath = path.join(__dirname, '../')
  const extension = '.mutation.js'
  const files = await fileFinder(directoryPath, extension)
  const fields = {}
  for (const file of files) {
    const mutationName = path.basename(file, extension)
    const mutation = require(file)
    validateMutation(mutation)
    if (validateMutation.errors) {
      logger.warn(
        'Failed to validate mutation.',
        {mutation: mutationName},
        new Error(JSON.stringify(validateMutation.errors))
      )
    }
    const args = {
      input: {
        type: mutation.inputType,
        description: mutation.description
      }
    }
    const reworkedMutation = {
      type: mutation.payloadType,
      description: mutation.description,
      args: mutation.inputType ? args : undefined,
      resolve: async (_, {input}) => {
        const result = await executeMutation({
          execute: mutation.execute,
          input
        })
        return result
      }
    }
    fields[mutationName] = reworkedMutation
  }

  const mutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields
  })
  return mutationType
}
