const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const pg = require('pg')
const {stripIndent} = require('common-tags')
const util = require('util')

const readdir = util.promisify(fs.readdir)
const readFile = util.promisify(fs.readFile)

module.exports = async ({postgres, scriptsPath}) => {
  try {
    const client = new pg.Client(postgres)
    await client.connect()
    try {
      const currentVersion = await getCurrentVersion({client})
      const missingSchemaVersions = await getMissingSchemaVersions({
        currentVersion,
        scriptsPath
      })
      for (const missingSchemaVersion of missingSchemaVersions) {
        await migrateSchema({
          client,
          description: missingSchemaVersion.description,
          path: missingSchemaVersion.path,
          version: missingSchemaVersion.version
        })
      }
    } finally {
      await client.end()
    }
  } catch (error) {
    console.error('Failed to upgrade database schema.', error)
    throw error
  }
}

const getCurrentVersion = async ({client}) => {
  try {
    const result = await client.query(stripIndent`
      SELECT MAX(version) AS current_version
      FROM schema_version`)
    const currentVersion = result.rows[0].current_version
    console.debug('Got current database schema version.', {currentVersion})
    return currentVersion
  } catch (error) {
    console.error('Failed to get current schema version.', error)
    throw error
  }
}

const getMissingSchemaVersions = async ({currentVersion, scriptsPath}) => {
  try {
    const directory = scriptsPath ? scriptsPath : './scripts'
    const missingSchemaVersions = []
    const files = await readdir(directory)
    files.forEach(file => {
      var myRegexp = /^([0-9]+)-([a-zA-Z0-9_]+)\.(sql|js)$/g
      var match = myRegexp.exec(file)
      if (match) {
        const version = parseInt(match[1])
        if (version !== 9999 && (currentVersion === undefined || version > currentVersion)) {
          missingSchemaVersions.push({
            description: match[2].replace(/_/g, ' '),
            path: path.resolve(directory, file),
            version
          })
        }
      }
    })
    return _.sortBy(missingSchemaVersions, 'index')
  } catch (error) {
    console.error('Failed to get missing database schema versions.', error)
    throw error
  }
}

const migrateSchema = async ({client, description, path, version}) => {
  try {
    const now = new Date()
    console.debug('Applying database schema script.', {version})
    // await client.query({
    //   text: stripIndent`
    //     INSERT INTO schema_version(version, description, state, begin_date)
    //     VALUES($1, $2, $3, now())`,
    //   values: [version, description, 'Pending']
    // })
    if (path.endsWith('.js')) {
      const javaScript = require(path)
      await javaScript(client)
    } else {
      const sql = await readFile(path, 'utf8')
      await client.query(sql)
    }
    // await client.query({
    //   text: stripIndent`
    //     UPDATE schema_version
    //     SET state = $2, end_date = now(), duration = 1000 * extract(epoch from now() - begin_date)
    //     WHERE version = $1`,
    //   values: [version, 'Succeeded']
    // })
    console.debug('Applied database schema script.', {
      version,
      durationInMilliseconds: new Date() - now
    })
  } catch (error) {
    console.error('Failed to migrate database schema.', {version}, error)
    throw error
  }
}
