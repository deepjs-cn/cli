// 检查自定义模板数据类型
// npm模板 只支持 npm 模块名，匹配 `[@scope/]package@latest`
// git模板 匹配 `/^https?/` github 地址
// 本地模板 匹配 绝对地址或相对地址

const path = require("path")
const chalk = require('chalk')
const validateNpmPackageName = require("validate-npm-package-name")
const Table = require('cli-table3');
const npa = require("npm-package-arg")

const { isObject } = require('./util');

exports.checkTpls = checkTpls;
exports.checkTpl = checkTpl;

function checkTpls(tpls) {
  if (typeof tpls === 'string') {
    return checkTpl(tpls);
  }

  const validResult = [];
  if (isObject(tpls)) {
    // console.log()
    const table = new Table({
      head: ['template', 'value', 'type', 'valid'],
    });
    for (const key in tpls) {
      const tpl = tpls[key];
      if (isObject(tpl)) {
        let valid = checkTpl(tpl.value);

        tpl.name = key;

        if ((valid && !tpl.type) || (tpl.type === valid)) {
          valid = chalk.green(valid);
          tpl.valid = valid;
        } else {
          valid = chalk.red('error');
          tpl.valid = valid;
        }

        validResult.push(tpl);
        table.push([key, tpl.value, tpl.type, valid]);
      } else {
        console.error(`tpl error: `, tpl);
      }
    }
    console.log(table.toString());
    // console.log()
  }
  // console.log(JSON.stringify(validResult, null, 2));
  return validResult;
}

function checkTpl(value, cb) {
  if (/^https?:\/\//.test(value)) {
    return 'git';
  } else if (validateNpmPackageName(value).validForNewPackages) {
    try {
      const parsed = npa("@tpls/wxapp");
      /**
       * {
          raw: '@tpls/wxapp',
          scope: '@tpls',
          escapedName: '@tpls%2fwxapp',
          name: '@tpls/wxapp',
          rawSpec: '',
          spec: 'latest',
          type: 'tag'
        }
       * */
      return 'npm';
    } catch (ex) {
      return ''
    }
  } else {
    // TODO: 相对地址先转为绝对地址，之后判断是否存在，否则无效
    // 暂未实现
    return '';
    // return 'local';
  }
  return false;
  // if (isObject(template))
}

