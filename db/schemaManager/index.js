'use strict'

const manageDatabaseSchema = require('./menageDatebaseSchema')

exports.deleteAllData = async ({postgres, scriptsPath}) => {
  await manageDatabaseSchema({
    modus: 'deleteAllData',
    postgres,
    scriptsPath
  })
}

exports.recreate = async ({postgres, scriptsPath}) => {
  await manageDatabaseSchema({
    modus: 'recreate',
    postgres,
    scriptsPath
  })
}

exports.upgrade = async ({postgres, scriptsPath}) => {
  await manageDatabaseSchema({
    modus: 'upgrade',
    postgres,
    scriptsPath
  })
}
