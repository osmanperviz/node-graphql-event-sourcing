'use strict'

const config = require('config')
const Cursor = require('pg-cursor')
const {Pool} = require('pg')
const util = require('util')

let pool

exports.initialize = async () => {
  try {
    pool = new Pool({
      host: config.postgres.host,
      port: config.postgres.port,
      database: config.postgres.database,
      user: config.postgres.user,
      password: config.postgres.password
    })
    console.log('Initialized connection pool.')
  } catch (error) {
    console.error('Failed to initalize connection pool.', error)
    throw error
  }
}

exports.finalize = async () => {
  try {
    if (!pool) {
      return
    }
    await pool.end()
    console.info('Finalized connection pool.')
  } catch (error) {
    console.error('Failed to finalize connection pool.', error)
    throw error
  }
}

exports.getClient = async () => {
  return await pool.connect()
}

exports.performReadTransaction = async action => {
  const client = await pool.connect()
  try {
    return await action(client)
  } finally {
    client.release()
  }
}

exports.performWriteTransaction = async action => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await action(client)
    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

exports.query = async query => {
  try {
    const client = await pool.connect()
    try {
      const result = await client.query(query)
      return result
    } finally {
      client.release()
    }
  } catch (error) {
    throw error
  }
}

exports.queryBulk = async ({processRow, rowCount = 10, text, values}) => {
  const client = await pool.connect()
  try {
    const cursor = client.query(new Cursor(text, values))
    let rows
    const read = util.promisify(cursor.read)
    do {
      rows = await read.apply(cursor, [rowCount])
      for (const row of rows) {
        await processRow(row)
      }
    } while (rows.length > 0)
    const close = util.promisify(cursor.close)
    await close.apply(cursor)
  } finally {
    client.release()
  }
}
