const fs = require('fs')
const path = require('path')
const ini = require('ini')
const echo = require('node-echo');
const { templates } = require('./templates');

// const homedir = require('os').homedir()
// homedir vs process.env.HOME
const JSCLIRC = path.join(process.env.HOME, '.jsclirc');

exports.JSCLIRC = JSCLIRC;
exports.templates = templates;
exports.getAllTpls = getAllTpls;
exports.getOfficialTpl = getOfficialTpl;
exports.getCustomTpl = getCustomTpl;
exports.setCustomTpl = setCustomTpl;

function getAllTpls() {
  return {
    ...templates,
    ...getCustomTpl(),
  };
}

function getOfficialTpl() {
  return {
    ...templates,
  };
}

function getCustomTpl() {
  return fs.existsSync(JSCLIRC) ? ini.parse(fs.readFileSync(JSCLIRC, 'utf-8')) : {};
}

function setCustomTpl(config, cbk) {
  echo(ini.stringify(config), '>', JSCLIRC, cbk);
}
