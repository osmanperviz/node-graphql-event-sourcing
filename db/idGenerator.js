const base32 = require('hi-base32')
const crypto = require('crypto')
const util = require('util')

const randomBytes = util.promisify(crypto.randomBytes)

exports.generateEntityId = async ({
  blockLength = 4,
  delimiter = '-',
  prefix = '',
  randomLength = 12
} = {}) => {
  let id = ''
  if (prefix !== '') {
    id = `${prefix}${delimiter}`
  }
  const bytes = await randomBytes(randomLength)
  const randomString = base32.encode(bytes)
  for (let randomStringIndex = 0; randomStringIndex < randomLength; randomStringIndex++) {
    if (randomStringIndex > 0 && randomStringIndex % blockLength === 0) {
      id += delimiter
    }
    id += randomString[randomStringIndex]
  }
  return id
}
