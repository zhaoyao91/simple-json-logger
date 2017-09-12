# Simple Json Logger

Simple json logger.

## Usage

Install package:

`npm install --save simpe-json-logger`

Import and use:

```
const logger = require('simple-json-logger')

logger.info('hello world') // {"level": "30", "message": "hello world"}
```

## Levels

- fatal 60
- error 50
- warn  40
- info  30
- debug 20
- trace 10

You can set environment `LOG_LEVEL` to some number. Only logs of levels equal or larger than `LOG_LEVEL` will
be output.

## API Styles

- `logger.xxx(message)`
- `logger.xxx(message, details)`
- `logger.xxx(error)`
- `logger.xxx(error, message)`
- `logger.xxx(error, message, details)`

Note:

- `message` is a string which goes into `message` field
- `details` is an object which goes into `details` field
- `error` is an instance of `Error` which goes into `error` field

## License

MIT
