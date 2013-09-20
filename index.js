/*

  db.collection.find().stream().pipe(Streamify()).pipe(res)

*/
var Transform = require('stream').Transform
var util = require('util')

util.inherits(Streamify, Transform)

module.exports = Streamify

function Streamify(options) {
  if (!(this instanceof Streamify))
    return new Streamify(options || {})

  options = options || {}
  options.objectMode = true
  Transform.call(this, options)
}

// Flags
Streamify.prototype.destroyed = false
Streamify.prototype.started = false

// Array delimiters
Streamify.prototype.open = new Buffer('[\n', 'utf8')
Streamify.prototype.seperator = new Buffer('\n,\n', 'utf8')
Streamify.prototype.close = new Buffer('\n]\n', 'utf8')

// JSON.stringify options
Streamify.prototype.replacer = null
Streamify.prototype.space = 0

Streamify.prototype._transform = function (doc, encoding, cb) {
  if (this.destroyed)
    return

  if (this.started) {
    this.push(this.seperator)
  } else {
    this.push(this.open)
    this.started = true
  }

  try {
    doc = JSON.stringify(doc, this.replacer, this.space)
  } catch (err) {
    process.nextTick(function () {
      cb(err)
    })
    return
  }

  this.push(new Buffer(doc, 'utf8'))
  process.nextTick(cb)
}

Streamify.prototype._flush = function (cb) {
  if (this.destroyed)
    return

  if (!this.started)
    this.push(this.open)

  this.push(this.close)
  this.push(null)
  process.nextTick(cb)
}

Streamify.prototype.destroy = function () {
  if (!this.destroyed) {
    this.emit('close')
    this.destroyed = true
  }
}