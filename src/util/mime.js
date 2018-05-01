const mime = require('mime-types')

module.exports = function (file) {
  return mime.lookup(file)
}
