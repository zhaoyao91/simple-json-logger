const logMethods = {
  '60': console.error.bind(console),
  '50': console.error.bind(console),
  '40': console.warn.bind(console),
  '30': console.info.bind(console),
  '20': console.debug.bind(console),
  '10': console.trace.bind(console),
}

module.exports = {
  fatal: buildLogFunc(60),
  error: buildLogFunc(50),
  warn: buildLogFunc(40),
  info: buildLogFunc(30),
  debug: buildLogFunc(20),
  trace: buildLogFunc(10)
}

function buildLogFunc (level) {
  const log = logMethods[level]
  return function (...args) {
    const output = {level}

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
