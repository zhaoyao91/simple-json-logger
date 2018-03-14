const circularJSON = require('circular-json')
const clean = require('clean-options')

const stdout = console.log.bind(console)
const stderr = console.error.bind(console)

/**
 * (Options?) => Logger
 *
 * Options ~ {
 *   meta: Object?,
 *   printLevel: Number = 30,
 *   printPretty: Boolean = false,
 *   logTimestamp: Boolean = false,
 *   formatTimestamp?: (ts: Number) => Any,
 * }
 */
function buildLogger (options) {
  return {
    error: buildLogFunc({...options, level: 50, log: stderr}),
    warn: buildLogFunc({...options, level: 40, log: stderr}),
    info: buildLogFunc({...options, level: 30, log: stdout}),
    log: buildLogFunc({...options, level: 30, log: stdout}),
    debug: buildLogFunc({...options, level: 20, log: stdout}),
    trace: buildLogFunc({...options, level: 10, log: stderr, modifyOutput: addTrace})
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
    printLevel = 30,
    printPretty = false,
    logTimestamp = false,
    formatTimestamp = id,
  } = clean(options)

  if (level < printLevel) return emptyFunc

  const formatOutput = printPretty
    ? (output) => circularJSON.stringify(output, null, 2)
    : (output) => circularJSON.stringify(output)

  const generateTimestamp = logTimestamp
    ? () => formatTimestamp(getTimestamp())
    : emptyFunc

  return function (...args) {
    const output = {
      ...meta,
      timestamp: generateTimestamp(),
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

function id (x) {
  return x
}

function getTimestamp () {
  return (new Date()).getTime()
}