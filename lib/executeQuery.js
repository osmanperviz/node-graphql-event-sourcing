'use strict'

module.exports = async ({args, execute}) => {
  try {
    const result = await execute({args})
    console.log('Executed query.')
    return result
  } catch (error) {
    console.log('Failed to execute query.', error)
    throw error
  }
}
