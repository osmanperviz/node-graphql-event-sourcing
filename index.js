const server = require('./lib/server')
const graphqlServer = require('./lib/graphql/graphqlServer')
const appServer = require('./lib/server')

const run = async () => {
  try {
    if (process.argv[2] === '-deleteAllData') {
      await graphqlServer.deleteAllData()
    } else if (process.argv[2] === '-recreateSchema') {
      await graphqlServer.recreateSchema()
    } else if (process.argv[2] === '-start') {
      await graphqlServer.start()
    } else if (process.argv[2] === '-upgradeSchema') {
      await graphqlServer.upgradeSchema()
    }
    await graphqlServer.start()
  } catch (error) {
    process.exitCode = 1
    console.log(error)
  }
}

run()
