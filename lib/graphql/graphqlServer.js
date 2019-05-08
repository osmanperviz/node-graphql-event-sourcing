const cors = require('cors')
const graphqlHTTP = require('express-graphql')
const express = require('express')
const createSchema = require('./createSchema')
const schemaManager = require('../../db/schemaManager')
const path = require('path')
const config = require('../../config')

const scriptsPath = path.join(__dirname, '../../db/scripts')

exports.recreateSchema = async () =>
  await schemaManager.recreate({postgres: config.postgres, scriptsPath})

exports.start = async () => {
  try {
    const schema = await createSchema()
    const app = express()
    app.use(cors())
    app.use(
      '/graphql',
      graphqlHTTP({
        schema,
        graphiql: true
      })
    )
    // app.use(
    //   '/graphql',
    //   graphqlHTTP(async (request, response) => {
    //     debugger
    //     console.log('----hijaaaa----')
    //     const startTime = Date.now()
    //     return {
    //       context: {},
    //       extensions: ({document, operationName, result, variables}) => {
    //         formatErrors(result)
    //         const durationInMilliseconds = new Date() - startTime
    //         const errors = result.errors
    //         if (errors) {
    //           console.log('Failed to process GraphQL request.', {
    //             durationInMilliseconds,
    //             errors
    //           })
    //         } else {
    //           console.log('Processed GraphQL request.', {
    //             durationInMilliseconds
    //           })
    //         }
    //       },
    //       customFormatErrorFn: error => {
    //         return {
    //           code: error.code,
    //           field: error.field,
    //           locations: error.locations,
    //           message: error.message,
    //           path: error.path
    //         }
    //       },
    //       graphiql: true,
    //       schema
    //     }
    //   })
    // )
    await app.listen(9090)
    console.log('Started GraphQL server.', {port: 9090})
  } catch (error) {
    console.log('Failed to stop GraphQL server.', error)
    throw error
  }
}
