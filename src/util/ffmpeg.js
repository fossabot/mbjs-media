const FFmpeg = require('fluent-ffmpeg')

const ffmpeg = function (source, destination) {
  return new Promise((resolve, reject) => {
    FFmpeg(source)
      .output(destination)
      .on('end', resolve)
      .on('error', err => reject(err))
      .run()
  })
}

module.exports = ffmpeg
