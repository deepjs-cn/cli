// const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
// const { get, set, del, error, launch } = require('@vue/cli-shared-utils')
const { JSCLIRC, templates, getOfficialTpl, getCustomTpl } = require('../../config');
const { printList, line, exit, launch, checkTpls } = require('../utils');

module.exports = (...args) => {
  return list(...args).catch(err => {
    exit(err);
  })
}

async function list(options) {
  // const { key, value } = options;
  console.log()
  console.log('  Available official templates:')
  console.log()
  const oTpls = getOfficialTpl();
  const cTpls = getCustomTpl();

  Object.keys(oTpls).forEach(key => {
    const tpl = oTpls[key];
    console.log(
      '  ' + chalk.yellow('★') +
      '  ' + chalk.blue(key) +
      ' - ' + tpl.value);
  });

  const cTplsArr = Object.keys(cTpls);

  if (cTplsArr.length) {
    console.log()
    console.log('  Available custom templates:')
    console.log()

    cTplsArr.forEach(key => {
      const tpl = cTpls[key];
      console.log(
        '  ' + chalk.blue(key) +
        ' - ' + tpl.value);
    });
  }

  console.log()
}
