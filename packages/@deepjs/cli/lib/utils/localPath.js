const path = require('path')

exports.isLocalPath = isLocalPath;
exports.getTemplatePath = getTemplatePath;


function isLocalPath(templatePath) {
  return /^[./]|(^[a-zA-Z]:)/.test(templatePath)
}

// console.log(isLocalPath('a:cc'));

function getTemplatePath(templatePath) {
  return path.isAbsolute(templatePath)
    ? templatePath
    : path.normalize(path.join(process.cwd(), templatePath))
}
