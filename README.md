# JSON Array Stream [![Build Status](https://travis-ci.org/jonathanong/json-array-stream.png)](https://travis-ci.org/jonathanong/json-array-stream)

## Example

The main use case for this is to stream a MongoDB query to a web client. This is to be used only with streaming arrays, not objects.

```js
var streamify = require('json-array-stream')

app.get('/things', function (req, res, next) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')

  db.things.find()
  .stream()
  .pipe(streamify())
  .pipe(res)
})
```

will yield something like

```json
[
{"_id":"123412341234123412341234"}
,
{"_id":"123412341234123412341234"}
]
```

## Separators

* The stream always starts with `'[\n'`.
* Documents are separated by `'\n,\n'`.
* The stream is terminated with `'\n]'`.

## API

### streamify()

Returns a duplex stream.

### License

WTFPL