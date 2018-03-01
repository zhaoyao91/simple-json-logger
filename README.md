# Simple JSON Logger

Simple JSON logger.

Just convert your logs into JSON format and add necessary fields (in fact, only level). 

## Usage

Install package:

`npm install --save simple-json-logger`

Import and use:

```
const logger = require('simple-json-logger')

logger.info('hello world') 
// {"level": 30, "message": "hello world"}

logger.warn('some user is invalid', {name: 'Bob', age: 20})
// {"level": 40, "message": "some user is invalid", "detail": {"name": "Bob", "age": 20}}

logger.error(new TypeError('invalid arg'))
// {"level": 50, "error": {"name": "TypeError", "message": "invalid arg", "stack": ...}}
```

## API

`xxx` could be any of [levels](#levels).

- `logger.xxx([...errors], [...messages], [...details])`

Note:

- an `error` is an instance of `Error`; a `detail` is an object; a `message` is any primitive value;
- there is no limit for order of args
- for each type:
  - if there is only one arg, it is put in `error`, `message` or `detail` filed
  - if there are more than one args, they are put in an array of `errors`, `messages` or `details` field

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

## Env

- LOG_LEVEL - print log only if level >= LOG_LEVEL
- LOG_PRETTY - if present, the print log with pretty format

## License

MIT
