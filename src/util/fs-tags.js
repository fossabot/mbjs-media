const { exec } = require('child_process')

function fsTags (filename) {
  const cmd = ['tag', '--list', '--no-name', filename]
  return new Promise((resolve, reject) => {
    exec(cmd.join(' '), (err, stdout, stderr) => {
      if (err) return reject(err)
      const tags = stdout.toString().split(',')
        .map(tag => { return tag.trim() })
        .filter(tag => { return tag !== '' })
      resolve({ tags, stdout, stderr })
    })
  })
}

module.exports = fsTags
