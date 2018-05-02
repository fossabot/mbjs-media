const
  { ObjectUtil } = require('mbjs-utils'),
  FSUtil = require('./fs'),
  ImageUtil = require('./image'),
  ffmpeg = require('fluent-ffmpeg'),
  path = require('path')

const
  ffmpegConf = {
    renice: 10
  },
  thumbsConf = {
    screenshots: {
      count: process.env.THUMBS_COUNT || 10
    },
    gif: {
      delay: 50,
      colors: 64
    },
    width: 250,
    height: 250,
    // FIXME: this shouldn't be necessary...
    timeout: 100
  }

class VideoUtil {
  static getScreenshots (source, outdir) {
    const ssc = ObjectUtil.merge(thumbsConf.screenshots, { folder: outdir })

    return new Promise((resolve, reject) => {
      ffmpeg(source)
        .renice(ffmpegConf.renice)
        .once('filenames', frames => {
          console.debug(`videoThumbs: Extracting ${frames.length} sample frames...`)
        })
        .once('end', () => {
          console.debug('videoThumbs: Screenshots complete')
          resolve()
        })
        .once('error', err => {
          console.debug(`videoThumbs: Screenshots failed: ${err.message()}`)
          reject(err)
        })
        .screenshots(ssc)
    })
  }

  static videoThumbs (source, dest) {
    const
      tmp = path.resolve(process.env.TMP_DATA || '/var/tmp'),
      dirs = {
        in: path.join(tmp, ObjectUtil.uuid4()),
        out: path.join(tmp, ObjectUtil.uuid4())
      }

    source = path.resolve(source)
    dest = path.resolve(dest)

    // FIXME: check why the gif stuff is behaving so erratically...
    return Promise.resolve()
      .then(() => { return FSUtil.rmdir(dirs.in) })
      .then(() => { return FSUtil.mkdirp(dirs.in) })
      .then(() => { return FSUtil.rmdir(dirs.out) })
      .then(() => { return FSUtil.mkdirp(dirs.out) })
      .then(() => { return VideoUtil.getScreenshots(source, dirs.in) })
      .then(() => { return ImageUtil.resizeThumbs(dirs, thumbsConf) })
      .then(() => { return ImageUtil.makeGIF(dirs.out, dest, thumbsConf.gif) })
      .then(() => { return FSUtil.rmdir(dirs.in) })
      .then(() => { return FSUtil.rmdir(dirs.out) })
      .catch(err => {
        return Promise.resolve()
          .then(() => { return FSUtil.rmdir(dirs.in) })
          .then(() => { return FSUtil.rmdir(dirs.out) })
          .then(() => { throw err })
      })
  }
}

module.exports.ffmpegConf = ffmpegConf
module.exports.thumbsConf = thumbsConf

module.exports = VideoUtil
