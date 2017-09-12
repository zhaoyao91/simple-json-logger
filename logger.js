const {LOG_LEVEL = 30} = process.env

module.exports = {
  fatal: buildLogFunc(60, console.error.bind(console)),
  error: buildLogFunc(50, console.error.bind(console)),
  warn: buildLogFunc(40, console.error.bind(console)),
  info: buildLogFunc(30, console.info.bind(console)),
  debug: buildLogFunc(20, console.info.bind(console)),
  trace: buildLogFunc(10, console.info.bind(console), addTrace)
}

function buildLogFunc (level, log, mapOutput) {
  if (level < LOG_LEVEL) return () => {}
  else return function (...args) {
    let output = {level}

    // logger.xxx(msg)
    if (args.length === 1 && typeof args[0] === 'string') {
      output.message = args[0]
    }
    // logger.xxx(msg, more)
    else if (args.length === 2 && typeof args[0] === 'string' && typeof args[1] === 'object') {
      output.message = args[0]
      output.details = args[1]
    }
    // logger.xxx(error)
    else if (args.length === 1 && args[0] instanceof Error) {
      output.error = formatError(args[0])
    }
    // logger.xxx(error, msg)
    else if (args.length === 2 && args[0] instanceof Error && typeof args[1] === 'string') {
      output.error = formatError(args[0])
      output.message = args[1]
    }
    // logger.xxx(error, msg, more)
    else if (args.length === 3 && args[0] instanceof Error && typeof args[1] === 'string' && typeof args[2] === 'object') {
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

    log(JSON.stringify(output))
  }
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