const circularJSON = require('circular-json')

const {
  LOG_LEVEL = '30',
  LOG_PRETTY,
} = process.env

module.exports = {
  fatal: buildLogFunc(60, console.error.bind(console)),
  error: buildLogFunc(50, console.error.bind(console)),
  warn: buildLogFunc(40, console.error.bind(console)),
  info: buildLogFunc(30, console.info.bind(console)),
  debug: buildLogFunc(20, console.info.bind(console)),
  trace: buildLogFunc(10, console.info.bind(console), addTrace)
}

function buildLogFunc (level, log, modifyOutput = emptyFunc) {
  if (level < LOG_LEVEL) return emptyFunc

  const formatOutput = !!LOG_PRETTY
    ? (output) => circularJSON.stringify(output)
    : (output) => circularJSON.stringify(output, null, 2)

  return function (...args) {
    let output = Object.assign(
      {level},
      ...fieldsBuilders.map(buildFields => buildFields(args))
    )
    modifyOutput(output)
    output = formatOutput(output)

    log(output)
  }
}

const fieldsBuilders = [
  function buildMessage (args) {
    const messages = args.filter(isMessage)
    if (messages.length === 0) return {}
    else if (messages.length === 1) return {message: messages[0]}
    else return {messages}
  },

  function buildError (args) {
    const errors = args.filter(isError).map(formatError)
    if (errors.length === 0) return {}
    else if (errors.length === 1) return {error: errors[0]}
    else return {errors}
  },

  function buildDetail (args) {
    const details = args.filter(isDetail)
    if (details.length === 0) return {}
    else if (details.length === 1) return {detail: details[0]}
    else return {details}
  }
]

function formatError (err) {
  return Object.assign({
    name: err.name,
    message: err.message,
    stack: err.stack.split('\n').map(trim),
  }, err)
}

function addTrace (output) {
  output.trace = (new Error()).stack.split('\n').slice(3).map(trim)
}

function trim (str) {
  return str.trim()
}

function isMessage (arg) {
  return !isError(arg) && !isDetail(arg)
}

function isError (arg) {
  return arg instanceof Error
}

function isDetail (arg) {
  return typeof arg === 'object'
    && arg !== null
    && !isError(arg)
}

function emptyFunc () {}
