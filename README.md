# JSON Array Stream [![Build Status](https://travis-ci.org/jonathanong/json-array-stream.png)](https://travis-ci.org/jonathanong/json-array-stream)

## Example

The main use case for this is to stream a MongoDB query to a web client.

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

* The stream always starts with `'[\n\n'`.
* Documents are separated by `'\n\n,\n\n'`.
* The stream is terminated with `'\n\n]'`.

## API

### streamify([terminatingString])

A terminating string is a string that terminates the response after `'\n\n]'`.
For example, use this if the array is part of an object.

```js
var streamify = require('json-array-stream')

app.get('/things', function (req, res, next) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')

  res.write('{"collection":"things", "things":')

  db.things.find()
  .stream()
  .pipe(streamify('}'))
  .pipe(res)
})
```

will yield something like:

```json
{"collection":"things", "things":[

{"_id":"123412341234123412341234"}

,

{"_id":"123412341234123412341234"}

]}
```

### .write(doc)

### .end([doc])

### .pipe()

### License

WTFPL