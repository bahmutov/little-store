'use strict'

const check = require('check-more-types')
const curry = require('lodash.curry')

function littleStore (o, name, value) {
  check.verify.object(o, 'missing object')
  check.verify.unemptyString(name, 'missing property name')
  check.verify.length(3, arguments.length, 'expected 3 arguments')
  o[name] = value
  return value
}

module.exports = curry(littleStore)
