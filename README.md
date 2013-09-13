# JSON Array Stream [![Build Status](https://travis-ci.org/jonathanong/json-array-stream.png)](https://travis-ci.org/jonathanong/json-array-stream)

`JSON.stringify([])` in streaming form.
Similar to [JSONStream.stringify()](https://github.com/dominictarr/JSONStream#jsonstreamstringifyopen-sep-close) except it is, by default, a binary stream, and it is a streams2 implementation.

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
* The stream is terminated with `'\n]\n'`.

## API

### streamify([options])

Returns a `Transform` stream.
The options are passed to the `Transform` constructor.

## License

The MIT License (MIT)

Copyright (c) 2013 Jonathan Ong me@jongleberry.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
