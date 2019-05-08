'use strict'

module.exports = {
  type: 'object',
  properties: {
    authorization: {
      type: 'object',
      properties: {
        roles: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['BUYER', 'SELLER', 'SHIPPER']
          }
        },
        scope: {
          type: 'string',
          enum: [
            'APPLICATION',
            'EMAIL_VERIFICATION',
            'MOBILE_VERIFICATION',
            'PASSWORD_RECOVERY',
            'PASSWORD_RECOVERY_CODE_VERIFICATION',
            'TERMS_AND_CONDITIONS'
          ]
        }
      },
      additionalProperties: false
    },
    description: {
      type: 'string'
    },
    execute: {},
    inputType: {
      type: 'object'
    },
    payloadType: {
      type: 'object'
    }
  },
  required: ['description', 'execute', 'payloadType'],
  additionalProperties: false
}
