const
  // os = require('os'),
  path = require('path'),
  Promise = require('bluebird'),
  VideoUtil = require('../util/video')

// import { Document } from '../../models/index'

class MediaIngest {
  static ingestBatch (files, opts = {}) {
    const mapconf = {
      concurrency: 1 // os.cpus().length
    }

    if (!Array.isArray(files)) {
      console.debug('ingestBatch: files are not an array', files)
      return
    }

    return Promise.map(files, file => {
      return MediaIngest.ingest(file, opts)
    }, mapconf)
  }

  static ingest (file, opts = {}) {
    const
      extname = path.extname(file.filename),
      basename = path.basename(file.filename, extname),
      thumbpath = path.join(path.dirname(file.filepath), `${basename}.gif`)

    return Promise.resolve()
      .then(() => {
        if (opts.thumbs === false) return Promise.resolve()
        return VideoUtil.videoThumbs(file.filepath, thumbpath)
      })
      .then(() => {
        /*
        const document = Document.fromIngestedMediaFile(file)
        console.debug('DOCUMENT', document.uuid, document)

        let errors
        if (document.isErrors()) {
          errors = document.getErrors()
          document.clearErrors()
        }

        return { errors, document }
        */
      })
      .then(result => {
        /*
        const { errors, document } = result
        if (errors) console.error('ingest error', errors)
        console.debug('ingested new document', document)
        return document
        */
      })
      .catch(err => {
        console.error('ingest failed:', err.message)
      })
  }
}

module.exports = MediaIngest
