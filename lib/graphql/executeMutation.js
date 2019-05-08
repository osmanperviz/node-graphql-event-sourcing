'use strict'
// const connectionPool = require('./connectionPool')
const {InputValidationError} = require('../GraphQLErrors')

module.exports = async ({execute, input}) => {
  try {
    //await authorize({accessToken, authorization})
    // const {cleanedInput, errors} = inputValidator.validateAndCleanInputUp({
    //   input,
    //   inputSchema,
    //   phoneCountryIsoCode
    // })
    // if (errors.length > 0) {
    //   throw new InputValidationError(errors)
    // }
    //const client = await connectionPool.getClient()
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
    if (error instanceof InputValidationError) {
      logger.warn('Failed to validate input.', error, {validationErrors: error.validationErrors})
    } else {
      logger.error('Failed to execute mutation.', error)
    }
    throw error
  }
}
