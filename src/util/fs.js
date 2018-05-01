const
  rimraf = require('rimraf'),
  fs = require('mz/fs'),
  fsx = require('fs-extra'),
  mkdirp = require('mkdirp'),
  Promise = require('bluebird')

class FSUtil {
  /**
   * Remove a directory
   * @param dir
   * @return {Promise<T | void>}
   */
  static rmdir (dir) {
    return fs.stat(dir).then(stats => {
      if (stats.isDirectory()) {
        return new Promise((resolve, reject) => {
          rimraf(dir, err => {
            if (err) return reject(err)
            console.debug(`FSUtil.rmdir: '${dir}' removed`)
            resolve()
          })
        })
      }
      return Promise.resolve()
    }).catch(err => {
      if (err.code !== 'ENOENT') {
        console.error(`FSUtil.rmdir: '${dir}' not removed: ${err.message}`)
      }
      return Promise.resolve()
    })
  }

  /**
   * Recursively create a directory
   * @param dir
   * @return {Promise<any>}
   */
  static mkdirp (dir) {
    return new Promise((resolve, reject) => {
      mkdirp(dir, err => {
        if (err) return reject(err)
        resolve()
      })
    })
  }

  /**
   * Duplicates a file
   * @param src
   * @param dest
   */
  static async copyFile (src, dst) {
    await fsx.copy(src, dst)
  }

  /**
   * Moves a file
   * @param src
   * @param dest
   */
  static async moveFile (src, dst) {
    await fsx.move(src, dst)
  }
}

module.exports = FSUtil
