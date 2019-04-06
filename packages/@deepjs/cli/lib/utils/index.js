const { cleanArgs, printList, printErr, line, exit, isExist } = require('./util');
const { isLocalPath, getTemplatePath } = require('./localPath');
const { down, downNpm, downGit, downLocal } = require('./down');
const { checkTpl, checkTpls } = require('./check');
const launch = require('./launch');

exports.cleanArgs = cleanArgs;
exports.printList = printList;
exports.printErr = printErr;
exports.exit = exit;
exports.line = line;
exports.isExist = isExist;

exports.isLocalPath = isLocalPath;
exports.getTemplatePath = getTemplatePath;

exports.launch = launch;

exports.down = down;
exports.downNpm = downNpm;
exports.downGit = downGit;
exports.downLocal = downLocal;

exports.checkTpl = checkTpl;
exports.checkTpls = checkTpls;
