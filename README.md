# Simple Json Logger

Simple json logger.

## Usage

Install package:

`npm install --save simple-json-logger`

Import and use:

```
const logger = require('simple-json-logger')

logger.info('hello world') 
// {"level": 30, "message": "hello world"}

logger.warn('some user is invalid', {name: 'Bob', age: 20})
// {"level": 40, "message": "some user is invalid", "details": {"name": "Bob", "age": 20}}

logger.error(new TypeError('invalid arg'))
// {"level": 50, "error": {"name": "TypeError", "message": "invalid arg", "stack": ...}}
```

## API Styles

`xxx` could be any of [levels](#levels).

- `logger.xxx(details)`
- `logger.xxx(message)`
- `logger.xxx(message, details)`
- `logger.xxx(error)`
- `logger.xxx(error, message)`
- `logger.xxx(error, details)`
- `logger.xxx(error, message, details)`

You can remember args order as **EMD**.

Note:

- `message` is a string which goes into `message` field.
- `details` is an object which goes into `details` field.
- `error` is an instance of `Error` which goes into `error` field.

## Levels

- `fatal`   60
- `error`   50
- `warn`    40
- `info`    30
- `debug`   20
- `trace`   10

Note:

- You can set environment `LOG_LEVEL` to some number. Only logs of levels equal or larger than `LOG_LEVEL` will
be output. The default value is 30.
- `fatal`, `error`, `warn` logs will be output to stderr.
- `info`, `debug`, `trace` logs will be output to stdout.
- `trace` logs have an extra field `trace` which is the trace stack string.

## License

MIT
