# Simple JSON Logger

- Easy to use
- All are JSON

## Install

```
npm install --save simple-json-logger
```

## Usage

### Basic Usage

You can log any number strings, objects or errors in any order. Logger
will classify them and put them into right fields.

```
const logger = require('simple-json-logger')

logger.log('hello world')
// {"level": 30, "message": "hello world"}

logger.warn('some user is invalid', {name: 'Bob', age: 20})
// {"level": 40, "message": "some user is invalid", "detail": {"name": "Bob", "age": 20}}

logger.error('Something', new TypeError('invalid arg'), 'Wrong!!!')
// {"level": 50, messages:['Something', 'Wrong!!!'], "error": {"name": "TypeError", "message": "invalid arg", "stack": ...}}
```

### Set Options via Code

```
const logger = require('simple-json-logger')

logger.options.printLevel = 40

logger.info('ok') // won't be printed

logger.warn('warning!') // printed
```

### Set Options via Env

Set env variables:

```
export LOG_PRINT_LEVEL=40
export LOG_PRINT_PRETTY=true
```

Using default logger:

```
const logger = require('simple-json-logger')

logger.info('ok') // won't be printed

logger.warn('warning!') // printed with pretty
```

### Clone

```
const logger = require('simple-json-logger')

logger.options.printPretty = true

const logger2 = logger.clone()

logger2.options.logTimestamp = true

logger.info('hi') // pretty without timestamp

logger2.info('hello') // pretty with timestamp
```

## API

### Options

- (LOG_PRINT_LEVEL) printLevel = 30 - Only logs with level equal or greater than this will be printed
- (LOG_PRINT_PRETTY) printPretty = false - Print logs with pretty format
- (LOG_TIMESTAMP) logTimestamp = false - Add 'timestamp' to every logs
- (LOG_TRACE) logTrace = false - Add 'trace' to every logs. Only for development
- (LOG_POSITION) logPosition = false - Add 'position' to every logs. Only for development
- meta = null - Object that will be merged into every logs. User should be careful to not to override the builtin fields
- jsonStringifier - Help stringify the output object. See [default-json-stringifier.js](./default-json-stringifier.js)

### Levels

- verbose: 10
- debug: 20
- info: 30
- log: 30
- warn: 40
- error: 50
- fatal: 60

## License

MIT
