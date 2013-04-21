/*

  db.collection.find().stream().pipe(Streamify()).pipe(res)

*/

var Through = require('through')

module.exports = function Streamify() {
  return new Through(write, end)
}

function write(doc) {
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
}

function end(doc) {
  if (doc) this.write(doc);
  if (!this._started) this.emit('data', '[\n\n');

  this.emit('data', '\n\n]')

  this.emit('end')
}