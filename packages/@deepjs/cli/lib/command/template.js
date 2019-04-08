// const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
// const { get, set, del, error, launch } = require('@vue/cli-shared-utils')
const { JSCLIRC, templates, getAllTpls, setCustomTpl, getCustomTpl } = require('../../config');
const { printList, line, exit, launch, checkTpls } = require('../utils');

module.exports = (...args) => {
  return template(...args).catch(err => {
    exit(err);
  })
}

async function template(action, options) {
  // const JSCLIRC = path.resolve(homedir, '.jsclirc')
  // const config = await fs.readJson(JSCLIRC);
  const { key, value } = options;

  // const actions = ['get', 'add', 'delete', 'ls', 'rm', 'edit'];
  // console.log(options);

  switch (action) {
    case 'list':
    case 'ls':
      return list(options.json);
      break;
    case 'add':
    case 'set':
      options.tip = `    ${chalk.green(action)} template:${chalk.cyan(key)} --- ${chalk.cyan(value)} success`;
      return curd('add', options);
      break;
    case 'get':
      return curd('get', options);
      break;
    case 'del':
    case 'rm':
    case 'delete':
    case 'remove':
      options.tip = `    ${chalk.red(action)} template:${chalk.cyan(key)} --- ${chalk.cyan(value)} success`;
      return curd('del', options);
      break;
    case 'edit':
      return edit();
      break;
    case 'check':
      return checkTpls(getAllTpls());
      break;
    default:
      return errTip(`  未知的命令项 ${chalk.red(action)}`)
  }
}

function curd(action, options) {
  const { key, value, tip } = options;
  const customTpls = getCustomTpl();
  // console.log(customTpls)
  // if (!customTpls.hasOwnProperty(key)) return;

  switch(action) {
    case 'add': {
      const type = !check(key, value);
      if (!type) return;
      const current = customTpls[key] = {};
      current['value'] = value;
      current['type'] = type;
      // console.log(111, current);
      // console.log(customTpls);
      break;
    }
    case 'get':
      return customTpls[key];
      break;
    case 'del':
      delete customTpls[key];
      break;
    default:
      return false;
      // do nothing...
  }
  save(customTpls, tip);
}

function save(config, tip) {
  setCustomTpl(config, err => {
    if (err) return exit(err);
    printList(['', tip, '']);
  })
}

function edit() {
  launch(JSCLIRC);
}

function check(key, value) {
  // 检查自定义模板数据有效性，返回有效类型
  const obj = {};
  if (typeof key === 'string') {
    if (!value) {
      errTip(`  添加自定义模板缺少必要参数: ${chalk.cyan('jscli add <template>')} ${chalk.red('<value>')}\n\n  err input <value>: ${chalk.red(value)}\n`);
      return;
    }
    return checkTpls(value);
  }
  return true;
}

function printLine(key, value, fix) {
  return key + line(key, 24, fix) + value;
}

function list(useJSON) {
  const info = [''];
  const allTpls = getAllTpls();

  if (useJSON) {
    console.log(JSON.stringify(allTpls, null, 2));
    return;
  }

  info.push(printLine('template:', 'value:', ' '));
  info.push('');

  Object.keys(allTpls).forEach(tpl => {
    const item = allTpls[tpl];
    info.push(printLine(tpl, item.value));
  });

  info.push('');
  info.push('Usage command: jscli create|add <template> <name>');
  info.push('');
  printList(info);
}

function errTip(tip) {
  console.error(tip)
  console.log()
  console.log(`  Run ${chalk.cyan(`jscli tpls --help`)} for detailed usage of given command.`)
}
