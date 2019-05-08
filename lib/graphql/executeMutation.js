'use strict'
const connectionPool = require('../../db/connectionPool')
const {InputValidationError} = require('../GraphQLErrors')

module.exports = async ({execute, input}) => {
  try {
    const client = await connectionPool.getClient()
    try {
      await client.query('BEGIN')
      const result = await execute({
        client,
        input
      })
      await client.query('COMMIT')
      console.log('Executed mutation.')
      return result
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    debugger
    if (error instanceof InputValidationError) {
      console.warn('Failed to validate input.', error, {validationErrors: error.validationErrors})
    } else {
      console.error('Failed to execute mutation.', error)
    }
    throw error
  }
}
