const fs = require('fs-extra')

exports.cleanArgs = cleanArgs;
exports.printList = printList;
exports.printErr = printErr;
exports.exit = exit;
exports.line = line;
exports.isObject = isObject;

exports.isExist = fs.existsSync;

function isObject(v) {
  return v !== null && typeof v === 'object' && Array.isArray(v) === false;
}

function camelize(str) {
  return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}

// commander passes the Command object itself as options,
// extract only actual options into a fresh object.
function cleanArgs(cmd) {
  const args = {}
  cmd.options.forEach(o => {
    const key = camelize(o.long.replace(/^--/, ''))
    // if an option is not present and Command has a method with the same name
    // it should not be copied
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key]
    }
  })
  return args
}

function printList(infos) {
  infos.forEach(function(info) {
    console.log(info);
  });
}

function printErr(err) {
  console.log()
  console.error('Error: ' + err);
  console.log()
}

function exit(err) {
  printErr(err);
  process.exit(1);
}

function line(str, len, fix = '-') {
  const line = new Array(Math.max(1, len - str.length)).join(fix);
  return ' ' + line + ' ';
}
