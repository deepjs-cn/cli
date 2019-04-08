const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const inquirer = require('inquirer')
const ora = require('ora');
const symbols = require('log-symbols');

const generate = require('../generate');
const { getAllTpls, JSCLITMP } = require('../../config');
const { sleep, exit, checkTpls, printErr, isExist, down, isLocalPath, getTemplatePath } = require('../utils');

// const home = require('user-home')
// let template = program.args[0]
// const tmp = path.join(home, '.jscli-templates', template.replace(/[\/:]/g, '-'))
// if (program.offline) {
//   console.log(`> Use cached template at ${chalk.yellow(tildify(tmp))}`)
//   template = tmp
// }

// const isExist = fs.existsSync;

async function add(template, projectName, options) {
  // templatePath = path.resolve('../tpls', template);
  if (isLocalPath(template)) {
    const templatePath = getTemplatePath(template);
    console.log(`  暂还未支持本地路径 ${chalk.red(template)}`);
    console.log(`  ${templatePath}`)
    if (!isExist(templatePath)) return;
    return;
  }
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
  // if (isExist(templatePath)) {
  //   console.error(`${templatePath} must be isExist`);
  // }
  const cwd = options.cwd || process.cwd();
  const inCurrent = projectName === '.';
  const name = inCurrent ? path.relative('../', cwd) : projectName;
  // 转为系统绝对地址
  let targetDir = path.resolve(cwd, projectName || '.');

  const tmp = path.join(JSCLITMP, template.replace(/[\/:]/g, '-'))

  // 附加项
  // 二次确认 targetDir，选择添加组件或页面的位置（相对于当前目录）
  async function confirmDir() {
    const { ok } = await inquirer.prompt([
      {
        name: 'ok',
        type: 'confirm',
        message: `Confirm to add to the directory: \n  ${chalk.cyan(targetDir)}`
      }
    ]);
    console.log();
    if (!ok) {
      const { dir } = await inquirer.prompt([
        {
          name: 'dir',
          type: 'input',
          message: `Please input the generate dirname:`
        }
      ]);
      targetDir = path.resolve(cwd, dir || '.');
      console.log();
      console.log('You input:')
      console.log(`${chalk.cyan(targetDir)}`);
    };
  }

  await confirmDir();

  console.log();
  console.log('You can cancel by input `Ctrl + c`.');
  console.log();

  await sleep(5000);

  if (isExist(targetDir)) {
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

  const spinner = ora('Get ready template...');

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

  // 先将代码下载到临时目录里
  await download(templatePath, tmp);

  spinner.succeed();

  // jscli create pwa ttt;
  // ttt /Users/dwd/.jscli-templates/pwa /Users/dwd/github/cloudyan/cli/packages/@deepjs/cli/ttt
  // 从临时目录生成目标代码
  generate(name, tmp, targetDir, err => {
    if (err) exit(err)
    console.log()
    console.log('  Generated "%s".', name)
  })

  const fileName = `${targetDir}/package.json`;
  if (isExist(fileName)) {
    const packageFile = require(fileName);
    // 修改本地项目中package.json中的name为项目名称
    packageFile.name = name;
    fs.writeFileSync(fileName, JSON.stringify(packageFile, null, 2));
  }
  console.log(symbols.success, chalk.green('Generate project success.'));
  console.log();
}

module.exports = (...args) => {
  return add(...args).catch(err => {
    // stopSpinner(false) // do not persist
    exit(err);
  })
}
