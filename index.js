const Logger = require('./logger')

const options = {
  printLevel: numberEnv('LOG_PRINT_LEVEL'),
  printPretty: boolEnv('LOG_PRINT_PRETTY'),
  logTimestamp: boolEnv('LOG_TIMESTAMP'),
  logTrace: boolEnv('LOG_TRACE'),
  logPosition: boolEnv('LOG_POSITION'),
}
const logger = new Logger(options)

module.exports = logger

function numberEnv (name) {
  const value = trim(process.env[name])
  if (value === undefined || value === '') return undefined
  else return Number(value)
}

function boolEnv (name) {
  const value = process.env[name]
  if (value === 'true') return true
  else if (value === 'false') return false
  else return undefined
}

function trim (str) {
  if (typeof str === 'string') return str.trim()
  else return str
}