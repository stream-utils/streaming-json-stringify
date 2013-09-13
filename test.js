var assert = require('assert')
var PassThrough = require('stream').PassThrough
var cat = require('cat-stream')

var streamify = require('./')

describe('Streamify()', function () {
  it('should work with an empty stream', function (done) {
    var stream = new PassThrough({
      objectMode: true
    })

    stream.pipe(streamify()).pipe(cat(function (err, buf) {
      assert.ifError(err)
      assert.equal(buf.toString('utf8'), '[\n\n]\n')
      done()
    }))

    stream.end()
  })

  it('should work with a stream of length 1', function (done) {
    var stream = new PassThrough({
      objectMode: true
    })

    stream.pipe(streamify()).pipe(cat(function (err, buf) {
      assert.ifError(err)
      assert.equal(buf.toString('utf8'), '[\n{}\n]\n')
      done()
    }))

    stream.write({})
    stream.end()
  })

  it('should work with a stream of length 2', function (done) {
    var stream = new PassThrough({
      objectMode: true
    })

    stream.pipe(streamify()).pipe(cat(function (err, buf) {
      assert.ifError(err)
      assert.equal(buf.toString('utf8'), '[\n{}\n,\n{}\n]\n')
      done()
    }))

    stream.write({})
    stream.write({})
    stream.end()
  })

  it('should work with non-objects', function (done) {
    var stream = new PassThrough({
      objectMode: true
    })

    stream.pipe(streamify()).pipe(cat(function (err, buf) {
      assert.ifError(err)
      assert.equal(buf.toString('utf8'), '[\n"hello"\n]\n')
      done()
    }))

    stream.write('hello')
    stream.end()
  })

  it('should return a string if encoding: "utf8"', function (done) {
    var stream = new PassThrough({
      objectMode: true
    })

    stream.pipe(streamify({
      encoding: 'utf8'
    })).once('data', function (chunk) {
      assert.equal(typeof chunk, 'string')
      done()
    })

    stream.write({})
    stream.end()
  })
})