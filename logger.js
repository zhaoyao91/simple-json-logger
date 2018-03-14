const circularJSON = require('circular-json')

const {
  LOG_LEVEL = '30',
  LOG_PRETTY,
} = process.env

const stdout = console.log.bind(console)
const stderr = console.error.bind(console)

function buildLogger (options = {}) {
  const {
    meta,
    logLevel = Number(LOG_LEVEL),
    logPretty = Boolean(LOG_PRETTY),
  } = options
  return {
    error: buildLogFunc({level: 50, log: stderr, meta, logLevel, logPretty}),
    warn: buildLogFunc({level: 40, log: stderr, meta, logLevel, logPretty}),
    info: buildLogFunc({level: 30, log: stdout, meta, logLevel, logPretty}),
    log: buildLogFunc({level: 30, log: stdout, meta, logLevel, logPretty}),
    debug: buildLogFunc({level: 20, log: stdout, meta, logLevel, logPretty}),
    trace: buildLogFunc({level: 10, log: stderr, meta, logLevel, logPretty, modifyOutput: addTrace})
  }
}

Object.assign(buildLogger, buildLogger())

module.exports = buildLogger

function buildLogFunc (options) {
  const {
    level,
    log,
    modifyOutput = emptyFunc,
    meta,
    logLevel,
    logPretty,
  } = options

  if (level < logLevel) return emptyFunc

  const formatOutput = logPretty
    ? (output) => circularJSON.stringify(output, null, 2)
    : (output) => circularJSON.stringify(output)

  return function (...args) {
    const output = {
      ...meta,
      level
    }

    const [errors, messages, details] = classifyArgs(args)

    attachArgs('error', 'errors', errors.map(formatError), output)
    attachArgs('message', 'messages', messages, output)
    attachArgs('detail', 'details', details, output)

    modifyOutput(output)

    log(formatOutput(output))
  }
}

function classifyArgs (args) {
  // errors, messages, details
  const result = [[], [], []]
  args.forEach(arg => {
    if (arg instanceof Error) result[0].push(arg)
    else if (typeof arg === 'object' && arg !== null) result[2].push(arg)
    else result[1].push(arg)
  })
  return result
}

function attachArgs (singular, plural, args, output) {
  if (args.length === 1) output[singular] = args[0]
  else if (args.length > 1) output[plural] = args
}

function formatError (err) {
  return {
    ...err,
    name: err.name,
    message: err.message,
    stack: err.stack.split('\n').map(trim),
  }
}

function addTrace (output) {
  output.trace = (new Error()).stack.split('\n').slice(3).map(trim)
}

function trim (str) {
  return str.trim()
}

function emptyFunc () {}
