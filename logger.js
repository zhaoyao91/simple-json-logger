const defaultsDeep = require('lodash.defaultsdeep')
const stringifyJSON = require('safe-stable-stringify')

const stdout = console.info.bind(console)
const stderr = console.error.bind(console)

class Logger {
  constructor (options) {
    options = defaultsDeep({}, options, {
      printLevel: 30,
      printPretty: false,
      logTimestamp: false,
      logTrace: false,
      logPosition: false,
      meta: null,
    })

    this.options = options

    this.verbase = buildLogMethod(10, stdout, options)
    this.debug = buildLogMethod(20, stdout, options)
    this.info = buildLogMethod(30, stdout, options)
    this.log = buildLogMethod(30, stdout, options)
    this.warn = buildLogMethod(40, stderr, options)
    this.error = buildLogMethod(50, stderr, options)
    this.fatal = buildLogMethod(60, stderr, options)
  }

  clone() {
    return new Logger(this.options)
  }
}

module.exports = Logger

function buildLogMethod (level, stream, options) {
  return function (...args) {
    // parse options in log function so it can be modified at runtime
    const {
      printLevel,
      printPretty,
      logTimestamp,
      logTrace,
      logPosition,
      meta,
    } = options

    if (level < printLevel) return

    let output = {
      level: level
    }

    if (logTimestamp) output.timestamp = Date.now()

    if (logTrace) addTrace(output)

    if (logPosition) addPosition(output)

    if (meta) Object.assign(output, meta)

    const [errors, messages, details] = classifyArgs(args)

    attachArgs('error', 'errors', errors.map(formatError), output)
    attachArgs('message', 'messages', messages, output)
    attachArgs('detail', 'details', details, output)

    if (printPretty) output = stringifyJSON(output, null, 2)
    else output = stringifyJSON(output)

    stream(output)
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
    stack: err.stack.split('\n').slice(1).map(trim),
  }
}

function addTrace (output) {
  output.trace = (new Error()).stack.split('\n').slice(3).map(trim)
}

function addPosition (output) {
  const frameLine = (new Error()).stack.split('\n')[3].trim()
  const frameMatch = frameLine.match(/^at (.+) \((.+):(.+):(.+)\)$/)
  output.position = {
    function: frameMatch[1],
    file: frameMatch[2],
    line: frameMatch[3],
    column: frameMatch[4]
  }
}

function trim (str) {
  return str.trim()
}
