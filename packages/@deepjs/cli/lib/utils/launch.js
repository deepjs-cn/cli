const launch = require('launch-editor')

// 这个调用 vim 编辑，超牛逼，`npm edit <pkg>[/<subpkg>...]`
// const editor = require('editor');

module.exports = (...args) => {
  const file = args[0]
  console.log(`Opening ${file}...`)
  let cb = args[args.length - 1]
  if (typeof cb !== 'function') {
    cb = null
  }
  launch(...args, (fileName, errorMessage) => {
    console.error(`Unable to open '${fileName}'`, errorMessage)
    console.log(`Try setting the EDITOR env variable. More info: https://github.com/yyx990803/launch-editor`)

    if (cb) cb(fileName, errorMessage)
  })
}
