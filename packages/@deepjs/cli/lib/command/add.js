const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const inquirer = require('inquirer')
const ora = require('ora');
const symbols = require('log-symbols');

const { getAllTpls } = require('../../config');
const {exit, checkTpls, printErr, down } = require('../utils');

// const home = require('user-home')
// let template = program.args[0]
// const tmp = path.join(home, '.jscli-templates', template.replace(/[\/:]/g, '-'))
// if (program.offline) {
//   console.log(`> Use cached template at ${chalk.yellow(tildify(tmp))}`)
//   template = tmp
// }

async function add(template, projectName, options) {
  // templatePath = path.resolve('../tpls', template);
  const tpls = getAllTpls();
  const tpl = tpls[template];
  if (!tpl) {
    printErr(`不存在的模板: ${chalk.red(template)}, 请先添加到模板，查看 ${chalk.cyan('jscli tpl --help')}`);
    return;
  }
  const templatePath = tpl.value;
  const type = checkTpls(tpl.value);
  if (!type) {
    printErr(`当前模板配置的数据格式暂不支持 ${chalk.green(template)}: ${chalk.red(tpl.value)}`);
    return;
  }
  // templatePath = `@xmini/${template}`;
  // if (fs.existsSync(templatePath)) {
  //   console.error(`${templatePath} must be isExist`);
  // }
  const cwd = options.cwd || process.cwd();
  const inCurrent = projectName === '.';
  const name = inCurrent ? path.relative('../', cwd) : projectName;
  // 转为系统绝对地址
  const targetDir = path.resolve(cwd, projectName || '.');

  if (fs.existsSync(targetDir)) {
      // await clearConsole()
    if (inCurrent) {
      const { ok } = await inquirer.prompt([
        {
          name: 'ok',
          type: 'confirm',
          message: `Generate project in current directory?`
        }
      ])
      if (!ok) return;
    } else {
      const { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: `Target directory ${chalk.cyan(targetDir)} already exists. Pick an action:`,
          choices: [
            { name: 'Overwrite', value: 'overwrite' },
            { name: 'Merge', value: 'merge' },
            { name: 'Cancel', value: false }
          ]
        }
      ])
      if (!action) return
      if (action === 'overwrite') {
        console.log(`\nRemoving ${chalk.cyan(targetDir)}...`)
        await fs.remove(targetDir)
      }
    }
  }

  // const creator = new Creator(name, targetDir, getPromptModules())
  // await creator.create(options)

  // await downloadAndGenerate(template);

  // 询问并选择模板(使用 npm 版本库管理更好)
  // template = '@tpls/wxapp'
  // const template = 'direct:https://github.com/ChangedenCZD/optimize-vue.git#master';

  const spinner = ora('Get ready template...')
  spinner.start()
  // if (/^https/.test(templatePath)) {
  //   await download(templatePath, targetDir, { clone: true }, err => {
  //     spinner.stop()
  //     if (err) {
  //       spinner.fail();
  //       console.log(symbols.error, chalk.red(err));
  //       return;
  //     }
  //   })
  // } else {
  // }

  const download = down(type);

  await download(templatePath, targetDir);

  spinner.succeed();

  const fileName = `${targetDir}/package.json`;
  if (fs.existsSync(fileName)) {
    const packageFile = require(fileName);
    // 修改本地项目中package.json中的name为项目名称
    packageFile.name = name;
    fs.writeFileSync(fileName, JSON.stringify(packageFile, null, 2));
  }
  console.log(symbols.success, chalk.green('Generate project success.'));
}

module.exports = (...args) => {
  return add(...args).catch(err => {
    // stopSpinner(false) // do not persist
    exit(err);
  })
}
