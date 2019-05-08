const createOrRecreateDatabase = require('./createOrRecreateDatabase')
const upgradeDatabaseSchema = require('./upgradeDatabaseSchema')
const createTableForSchemaVersions = require('./createTableForSchemaVersions')

module.exports = async ({modus, postgres, scriptsPath}) => {
  try {
    console.info('Managing database schema.')
    const now = new Date()
    if (modus === 'deleteAllData') {
      //await deleteAllData({postgres, scriptsPath})
    } else {
      const databaseHasBeenCreated = await createOrRecreateDatabase({
        modus,
        postgres
      })
      if (databaseHasBeenCreated) {
        await createTableForSchemaVersions({postgres})
      }
      await upgradeDatabaseSchema({postgres, scriptsPath})
    }
    console.info('Database schema managed.', {durationInMilliseconds: new Date() - now})
  } catch (error) {
    console.error('Failed to manage database schema.', error)
    throw error
  }
}
