var assert = require('assert')
var Stream = require('stream').Stream

var streamify = require('./')

;(function () {
  var chunk = ''
  var readStream = new Stream()
  var writeStream = streamify('a')

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
      + '\n\n]a'
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