# JSON Array Stream [![Build Status](https://travis-ci.org/jonathanong/json-array-stream.png)](https://travis-ci.org/jonathanong/json-array-stream)

This is meant to stream an array of documents as JSON.
The idea is that a simple `[]` is returned without any metadata and the total number of documents is unknown until the very end.

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

```js
[

{_id:"123412341234123412341234"}

,

{_id:"123412341234123412341234"}

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

```js
{"collection":"things", "things":[

{_id:"123412341234123412341234"}

,

{_id:"123412341234123412341234"}

]}
```

### streamify.pipe()

`streamify` should only be used as an intermediary stream as in the example.

### License

WTFPL