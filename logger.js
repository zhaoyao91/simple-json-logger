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
    const output = {level}

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

function emptyFunc () {}
