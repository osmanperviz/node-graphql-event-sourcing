'use strict'

const fs = require('fs')
const path = require('path')
const pg = require('pg')
const util = require('util')

const readFile = util.promisify(fs.readFile)

module.exports = async ({postgres}) => {
  try {
    const createTableForSchemaVersionsPath = path.join(
      __dirname,
      'createTableForSchemaVersions.sql'
    )
    const createTableForSchemaVersionsSql = await readFile(createTableForSchemaVersionsPath, 'utf8')
    const client = new pg.Client(postgres)
    await client.connect()
    try {
      await client.query(createTableForSchemaVersionsSql)
    } finally {
      await client.end()
    }
    console.debug('Created table for schema versions.')
  } catch (error) {
    console.error('Failed to create table for schema versions.', error)
    throw error
  }
}
