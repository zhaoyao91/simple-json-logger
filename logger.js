const circularJSON = require('circular-json')

module.exports = {
  fatal: buildLogFunc(60, console.error.bind(console)),
  error: buildLogFunc(50, console.error.bind(console)),
  warn: buildLogFunc(40, console.error.bind(console)),
  info: buildLogFunc(30, console.info.bind(console)),
  debug: buildLogFunc(20, console.info.bind(console)),
  trace: buildLogFunc(10, console.info.bind(console), addTrace)
}

function buildLogFunc (level, log, mapOutput) {
  return function (...args) {
    if (level < (process.env.LOG_LEVEL || 30)) return

    let output = {level}
    args = joinStrings(args)

    // logger.xxx(details)
    if (args.length === 1 && isDetails(args[0])) {
      output.details = args[0]
    }
    // logger.xxx(message)
    else if (args.length === 1 && isMessage(args[0])) {
      output.message = args[0]
    }
    // logger.xxx(message, details)
    else if (args.length === 2 && isMessage(args[0]) && isDetails(args[1])) {
      output.message = args[0]
      output.details = args[1]
    }
    // logger.xxx(error)
    else if (args.length === 1 && isError(args[0])) {
      output.error = formatError(args[0])
    }
    // logger.xxx(error, message)
    else if (args.length === 2 && isError(args[0]) && isMessage(args[1])) {
      output.error = formatError(args[0])
      output.message = args[1]
    }
    // logger.xxx(error, details)
    else if (args.length === 2 && isError(args[0]) && isDetails(args[1])) {
      output.error = formatError(args[0])
      output.details = args[1]
    }
    // logger.xxx(error, message, details)
    else if (args.length === 3 && isError(args[0]) && isMessage(args[1]) && isDetails(args[2])) {
      output.error = formatError(args[0])
      output.message = args[1]
      output.details = args[2]
    }
    // empty args
    else if (!args || args.length === 0) {

    }
    // unknown format
    else {
      output.unknown = args
    }

    if (mapOutput) output = mapOutput(output)

    log(circularJSON.stringify(output))
  }
}

function joinStrings (args) {
  return args.reduce((results, arg) => {
    const lastArg = results[results.length - 1]
    if (typeof lastArg === 'string' && typeof arg === 'string') {
      results[results.length - 1] = lastArg.concat(' ', arg)
    }
    else {
      results.push(arg)
    }
    return results
  }, [])
}

function formatError (err) {
  return Object.assign({
    name: err.name,
    message: err.message,
    stack: err.stack,
  }, err)
}

function addTrace (output) {
  const lines = (new Error()).stack.split('\n')
  output.trace = ['Trace'].concat(lines.slice(3)).join('\n')
  return output
}

function isMessage (arg) {
  return typeof arg === 'string'
}

function isError (arg) {
  return arg instanceof Error
}

function isDetails (arg) {
  return typeof arg === 'object'
    && arg !== null
    && !isError(arg)
}