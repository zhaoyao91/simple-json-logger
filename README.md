# Simple JSON Logger

Simple JSON logger.

Just convert your logs into JSON format and add necessary fields (in fact, only level). 

## Usage

Install package:

`npm install --save simple-json-logger`

Import and use:

```
const logger = require('simple-json-logger')

logger.log('hello world') 
// {"level": 30, "message": "hello world"}

logger.warn('some user is invalid', {name: 'Bob', age: 20})
// {"level": 40, "message": "some user is invalid", "detail": {"name": "Bob", "age": 20}}

logger.error(new TypeError('invalid arg'))
// {"level": 50, "error": {"name": "TypeError", "message": "invalid arg", "stack": ...}}
```

You can also build a customized logger:

```
const buildLogger = require('simple-json-logger')

const logger = buildLogger({meta: {pid: 'xxx'}})

logger.info('hello world')
// {"pid": "xxx", "level": 30, "message": "hello world"}
```

## API

### Logger

A logger object is also a logger builder.

The child logger will inherent options deeply from its parent logger.

```
(Options?) => Logger

Options ~ {
  meta: Object?,
  printLevel: Number = 30,
  printPretty: Boolean = false,
  logTimestamp: Boolean = false,
  formatTimestamp?: (Number) => Any,
}
```

#### $.${level}

`${level}` could be any of [levels](#levels).

`(...args) => Void`

Notes:

- there could be any number or args
- each arg will be classified either as `error`, `message` or `detail`
  - if arg is instance of `Error`, then it is treated as `error`
  - if arg is type of `object` but is not `null`, then it is treated as `detail`
  - otherwise, the arg is treated as `message`
- for each arg type:
  - if there is only one arg, it is put in `error`, `message` or `detail` filed
  - if there are more than one args, they are put in an array of `errors`, `messages` or `details` field

## Levels

- `error` - 50
- `warn` - 40
- `info` or `log` - 30
- `debug` - 20
- `trace` - 10

Notes:

- `error`, `warn`, `trace` logs will be output to stderr.
- `info`, `debug` logs will be output to stdout.
- `trace` logs have an extra field `trace` which is a string array of the trace stack.

## License

MIT
