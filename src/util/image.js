const
  gm = require('gm'),
  path = require('path'),
  fs = require('fs'),
  Promise = require('bluebird')

class ImageUtil {
  /**
   * Batch resize & crop a folder of images
   * @param dir
   * @param opts
   * @return {*|PromiseLike<T>|Promise<T>}
   */
  static resizeThumbs (dirs, opts) {
    return fs.readdir(dirs.in).then(images => {
      return Promise.map(images, img => {
        return new Promise((resolve, reject) => {
          const
            inpath = path.join(dirs.in, img),
            outpath = path.join(dirs.out, img),
            crop = { x: 0, y: 0 }
          const io = gm(inpath)
          io.resize(opts.width, opts.height, '^')
            .size((err, size) => {
              if (err) return reject(err)
              crop.x = Math.round((size.width - opts.width) * 0.5)
              crop.y = Math.round((size.height - opts.height) * 0.5)
              console.log('CROP', crop, size)
              io.crop(opts.width, opts.height, crop.x, crop.y)
                .write(outpath, err => {
                  if (err) return reject(err)
                  setTimeout(function () { resolve(outpath) }, opts.timeout)
                })
            })
        })
      }).then(() => {
        console.debug(`Resized screenshots to '${dirs.out}`)
      })
    })
  }

  /**
   * Combine folder of images into a GIF image
   * @param source
   * @param dest
   * @param opts
   */
  static makeGIF (source, dest, opts) {
    return new Promise((resolve, reject) => {
      const inpath = path.join(source, '*.png')
      console.debug(`Reading images for GIF from '${inpath}'...`)
      gm(inpath)
        .setFormat('gif')
        .delay(opts.delay || 50)
        .colors(opts.colors || 64)
        .write(dest, err => {
          if (err) return reject(err)
          console.debug(`Created GIF at '${dest}`)
          setTimeout(function () { resolve(dest) }, opts.timeout)
        })
    })
  }
}

module.exports = ImageUtil
