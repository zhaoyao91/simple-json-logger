# Simple Json Logger

Simple json logger.

## Usage

Install package:

`npm install --save simpe-json-logger`

Import and use:

```
const logger = require('simple-json-logger')

logger.info('hello world') // {"level": "30", "msg": "hello world"}
```

## Levels

- fatal 60
- error 50
- warn  40
- info  30
- debug 20
- trace 10

## API Styles

- `logger.xxx(msg)`
- `logger.xxx(msg, more)`
- `logger.xxx(error)`
- `logger.xxx(error, msg)`
- `logger.xxx(error, msg, more)`

Note:

- `msg` is a string which goes into `msg` field
- `more` is an object which goes into `more` field
- `error` is an instance of `Error` which goes into `error` field

## License

MIT
