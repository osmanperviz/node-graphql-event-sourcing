const graphqlServer = require('./graphql/graphqlServer')

exports.start = async () => {
  try {
    await graphqlServer.start()
  } catch (error) {
    console.log('Failed to start graphql server.', error)
    throw error
  }
}

exports.stop = async () => {
  try {
    await graphqlServer.stop()
  } catch (error) {}
}
