/*

  db.collection.find().stream().pipe(Stringify()).pipe(res)

*/
var Transform = require('stream').Transform
var util = require('util')

util.inherits(Stringify, Transform)

module.exports = Stringify

function Stringify(options) {
  if (!(this instanceof Stringify))
    return new Stringify(options || {})

  Transform.call(this, options || {})
  this._writableState.objectMode = true
}

// Flags
Stringify.prototype.destroyed = false
Stringify.prototype.started = false

// Array delimiters
Stringify.prototype.open = new Buffer('[\n', 'utf8')
Stringify.prototype.seperator = new Buffer('\n,\n', 'utf8')
Stringify.prototype.close = new Buffer('\n]\n', 'utf8')

// JSON.stringify options
Stringify.prototype.replacer = null
Stringify.prototype.space = 0

Stringify.prototype._transform = function (doc, enc, cb) {
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
    cb(err)
    return
  }

  this.push(new Buffer(doc, 'utf8'))
  cb()
}

Stringify.prototype._flush = function (cb) {
  if (this.destroyed)
    return

  if (!this.started)
    this.push(this.open)

  this.push(this.close)
  this.push(null)
  cb()
}

Stringify.prototype.destroy = function () {
  if (!this.destroyed) {
    this.emit('close')
    this.destroyed = true
  }
}