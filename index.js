/*

  db.collection.find().stream().pipe(Streamify()).pipe(res)

*/

var Stream = require('stream').Stream
var util = require('util')

util.inherits(Streamify, Stream)

module.exports = Streamify

function Streamify(finishingString) {
  if (!(this instanceof Streamify))
    return new Streamify(finishingString);

  this.finishingString = finishingString
  this.writable = true
}

Streamify.prototype.write = function (doc) {
  var str
  if (this._started) {
    str = '\n\n,\n\n'
  } else {
    this._started = true
    str = '[\n\n'
  }

  try {
    this.emit('data', str + JSON.stringify(doc))
  } catch (err) {
    this.emit('error', err)
  }

  return true
}

Streamify.prototype.end = function () {
  this.emit('data', '\n\n]' + (this.finishingString || ''))

  this.emit('end')
}