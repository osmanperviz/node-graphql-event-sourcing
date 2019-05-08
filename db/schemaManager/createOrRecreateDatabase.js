'use strict'

const pg = require('pg')
const {stripIndent} = require('common-tags')

module.exports = async ({modus, postgres}) => {
  const client = new pg.Client(Object.assign({}, postgres, {database: 'postgres'}))
  try {
    await client.connect()
    try {
      const database = postgres.database
      const databaseExists = await doesDatabaseExist({client, database})
      if (databaseExists && modus === 'recreate') {
        await dropDatabase({client, database})
      }
      const databaseHasToBeCreated = !databaseExists || modus === 'recreate'
      if (databaseHasToBeCreated) {
        await createDatabase({client, database})
      }
      return databaseHasToBeCreated
    } finally {
      await client.end()
    }
  } catch (error) {
    console.error('Failed to create or recreate database.', error)
    throw error
  }
}

const doesDatabaseExist = async ({client, database}) => {
  const query = {
    text: stripIndent`
      SELECT *
      FROM pg_catalog.pg_database
      WHERE upper(datname)=upper($1)`,
    values: [database]
  }
  try {
    const result = await client.query(query)
    return result.rows.length === 1
  } catch (error) {
    console.error('Failed to determine if database exists.', error)
    throw error
  }
}

const dropDatabase = async ({client, database}) => {
  try {
    await client.query({
      text: stripIndent`
        SELECT pg_terminate_backend(pg_stat_activity.pid)
        FROM pg_stat_activity
        WHERE pg_stat_activity.datname = $1`,
      values: [database]
    })
    await client.query(`DROP DATABASE IF EXISTS ${database}`)
    console.debug('Database dropped.')
  } catch (error) {
    console.error('Failed to drop database.', error)
    throw error
  }
}

const createDatabase = async ({client, database}) => {
  try {
    await client.query(`CREATE DATABASE ${database}`)
    console.debug('Database created.')
  } catch (error) {
    console.error('Failed to create database.', error)
    throw error
  }
}
