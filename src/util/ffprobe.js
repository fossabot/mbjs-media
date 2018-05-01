const ffmpeg = require('fluent-ffmpeg')

const ffprobe = function (path) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(path, (err, meta) => {
      if (err) return reject(err)
      resolve(meta)
    })
  })
}

module.exports = ffprobe
