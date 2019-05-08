'use strict'

const _ = require('lodash')

module.exports = object => {
  const beautifulObject = {}
  const keys = Object.keys(object)
  keys.sort((key1, key2) => {
    key1 = key1.toLowerCase()
    key2 = key2.toLowerCase()
    if (key1 < key2) {
      return -1
    }
    if (key1 > key2) {
      return 1
    }
    return 0
  })
  for (const index in keys) {
    const key = keys[index]
    let value = object[key]
    if (value instanceof Date) {
      value = value.toISOString()
    }
    if (_.isNil(value) || value === '') {
      continue
    }
    if (typeof value === 'object' && !(value instanceof Array)) {
      beautifulObject[key] = module.exports(value)
    } else if (value instanceof Array) {
      beautifulObject[key] = value.map(item =>
        typeof item === 'object' ? module.exports(item) : item
      )
    } else {
      beautifulObject[key] = value
    }
  }
  return beautifulObject
}
