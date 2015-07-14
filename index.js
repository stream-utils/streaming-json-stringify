
/*

  db.collection.find().stream().pipe(Stringify()).pipe(res)

*/

var Transform = require('readable-stream/transform')
var stringify = require('json-stringify-safe')
var util = require('util')

util.inherits(Stringify, Transform)

module.exports = Stringify

function Stringify(options) {
  if (!(this instanceof Stringify))
    return new Stringify(options || {})
  if (options && options.replacer) {
    this.replacer = options.replacer;
  }
  if (options && options.space !== undefined) {
    this.space = options.space;
  }
  Transform.call(this, options || {})
  this._writableState.objectMode = true

  // Array Deliminator defaults
  var open = options && options.open ? options.open : '[\n'
  var seperator = options && options.seperator ? options.seperator : '\n,\n'
  var close = options && options.close ? options.close : '\n]\n'

  // Array Deliminators
  this.open = new Buffer(open, 'utf8')
  this.seperator = new Buffer(seperator, 'utf8')
  this.close = new Buffer(close, 'utf8')
}

// Flags
Stringify.prototype.started = false

// JSON.stringify options
Stringify.prototype.replacer = null
Stringify.prototype.space = 0

Stringify.prototype._transform = function (doc, enc, cb) {
  if (this.started) {
    this.push(this.seperator)
  } else {
    this.push(this.open)
    this.started = true
  }

  doc = stringify(doc, this.replacer, this.space)

  this.push(new Buffer(doc, 'utf8'))
  cb()
}

Stringify.prototype._flush = function (cb) {
  if (!this.started) this.push(this.open)
  this.push(this.close)
  this.push(null)
  cb()
}
