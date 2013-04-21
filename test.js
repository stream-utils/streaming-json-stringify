var assert = require('assert')
var Stream = require('stream').Stream

var streamify = require('./')

;(function () {
  var chunk = ''
  var readStream = new Stream()
  var writeStream = streamify()

  readStream.pipe(writeStream)

  readStream.on('error', function (err) {
    throw err
  })

  writeStream.on('error', function (err) {
    throw err
  })

  writeStream.on('data', function (data) {
    chunk += data
  })

  writeStream.on('end', function () {
    assert.equal(chunk, '[\n\n'
      + '{}'
      + '\n\n,\n\n'
      + '{}'
      + '\n\n,\n\n'
      + '{}'
      + '\n\n,\n\n'
      + '{}'
      + '\n\n,\n\n'
      + '{}'
      + '\n\n]'
    )

    console.log('All checks out!')
  })

  var docs = 0

  ;(function write() {
    setImmediate(function () {
      if (docs++ < 5) {
        writeStream.write({})
        write()
      } else {
        readStream.emit('end')
      }
    })
  })();
})();

;(function () {
  var chunk = ''
  var stream = streamify()

  stream.on('data', function (str) {
    chunk += str
  })

  stream.on('end', function () {
    assert.equal(chunk, '[\n\n\n\n]')

    console.log('Empty stream works!')
  })

  stream.end()
})();