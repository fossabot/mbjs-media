const
  ffprobe = require('./ffprobe'),
  ffmpeg = require('./ffmpeg'),
  filehash = require('./filehash'),
  FSUtil = require('./fs'),
  fsTags = require('./fs-tags'),
  ImageUtil = require('./image'),
  mime = require('./mime'),
  video = require('./video')

module.exports = {
  ffprobe,
  ffmpeg,
  filehash,
  FSUtil,
  fsTags,
  ImageUtil,
  mime,
  video
}
