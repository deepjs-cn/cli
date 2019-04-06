#!/usr/bin/env node

// Check node version before requiring/doing anything else
// The user may be on a very old node version

// require('colors');
const fs = require('fs')
const path = require('path')
const slash = require('slash')
const minimist = require('minimist')
const program = require('commander');
const chalk = require('chalk')
const semver = require('semver')

const PKG = require('../package.json');
const { JSCLIRC, templates, getAllTpls } = require('../config');
const { cleanArgs } = require('../lib/utils/index');

const requiredVersion = PKG.engines.node
const version = PKG.version

// check
function checkNodeVersion (wanted, id) {
  if (!semver.satisfies(process.version, wanted)) {
    console.log(chalk.red(
      'You are using Node ' + process.version + ', but this version of ' + id +
      ' requires Node ' + wanted + '.\nPlease upgrade your Node version.'
    ))
    process.exit(1)
  }
}

checkNodeVersion(requiredVersion, 'js-cli')

// Padding
console.log()
process.on('exit', () => {
  console.log()
})

// console.log(process.argv)

program
  .version(version, '-v, --version') // 输出版本号
  .usage('<command> [options]') // 设置命令行传参形式

// ============================== custom start ==============================

/**
 * js init
 * js add
 * js tpl <ls|add|del|edit>
 * js config
 */

program
  .command('list')
  .description('List all the templates')
  .action((cmd) => {
    const options = cleanArgs(cmd)
    require('../lib/command/list')(options)
  })

program
  .command('create <template> <app-name>')
  .alias('init')
  .description('Create a new project powered by jscli')
  .action((template, name, cmd) => {
    const options = cleanArgs(cmd)
    // --git makes commander to default git to true
    // if (process.argv.includes('-g') || process.argv.includes('--git')) {
    //   options.forceGit = true
    // }

    // console.log(options)
    require('../lib/command/create')(template, name, options)
  })

program
  .command('add <template> <name>')
  .description('Generates page/component/module ...')
  .action((template, name, cmd) => {
    // 需要指定 模板位置 新增模块名称 添加位置
    // 在 components 下新增组件 wxapp-component
    // 在 pages 下新增页面 wxapp-page
    const options = cleanArgs(cmd);
    require('../lib/command/add')(template, options)
  });

program
  // jscli template [options...]
  .command('tpl <action> [key] [value]')
  .alias('template')
  .usage(`
  jscli tpl list                           List all the templates
  jscli tpl add <key> <value>              Add one custom template
  jscli tpl del <key>                      Delete one custom template
  jscli tpl edit                           Open custom template with default editor
  jscli tpl check                          Check the validity of custom template data
  `)
  .description('Manage the template. action -> [ls add del edit...]')
  // .option('-t, --template', 'config and modify the template')
  // .option('--json', 'outputs JSON result only')
  .action((action = 'list', key, value, cmd) => {
    // console.log(cmd._name);
    const options = cleanArgs(cmd);

    Object.assign(options, {
      key,
      value,
    });
    // console.log(action, options)
    // console.log(JSON.stringify(templates, null, 2));
    require('../lib/command/template')(action, options);
  });

// program
//   // jscli config [options...]
//   .command('config [action] [key] [value]')
//   .usage(`\n
//   -v, --version
//   js config add <key> <value>              set option value
//   js config get [<key>]                    get value from option
//   js config delete <key>                   delete option from config
//   js config list [--json]                  ouput the configs
//   js config edit                           open config with default editor
//   `)
//   // .description('List all the configs')
//   .option('--json', 'outputs JSON result only')
//   .action((action = 'list', key, value, cmd) => {
//     // console.log(cmd);
//     const options = cleanArgs(cmd);

//     Object.assign(options, {
//       key,
//       value,
//     });
//     require('../lib/command/config')(action, options)
//   });

// =============================== custom end ===============================

program
  .command('info')
  .description('print debugging information about your environment')
  .action((cmd) => {
    console.log(chalk.bold('\nEnvironment Info:'))
    require('envinfo').run(
      {
        System: ['OS', 'CPU'],
        Binaries: ['Node', 'Yarn', 'npm'],
        Browsers: ['Chrome', 'Edge', 'Firefox', 'Safari'],
        npmPackages: '/**/{typescript,*deepjs*,@deepjs/*/}',
        npmGlobalPackages: ['@deepjs/cli']
      },
      {
        showNotFound: true,
        duplicates: true,
        fullTree: true
      }
    ).then(console.log)
  })

// output help information on unknown commands
program
  .arguments('<command>')
  .action((cmd) => {
    program.outputHelp()
    console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`))
    console.log()
  })

// add some useful info on help
program.on('--help', () => {
  console.log(`  Run ${chalk.cyan(`jscli <command> --help`)} for detailed usage of given command.`)
})

program.commands.forEach(c => c.on('--help', () => console.log()))

// enhance common error messages
const enhanceErrorMessages = require('../lib/helpers/enhanceErrorMessages')

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
