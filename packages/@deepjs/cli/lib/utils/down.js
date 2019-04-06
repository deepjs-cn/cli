const fs = require('fs-extra')
const downloadNpmPackage = require('download-npm-package');
const downloadGitRepo = require('download-git-repo');
const { exit, isExist } = require('./util');
const rm = require('rimraf').sync;
// const isExist = fs.existsSync;

// 目前这个是直接拉代码到指定目录，但我们要的不仅仅是这个效果，我们要特殊处理
// 规则：如果模块内有 template，template 构建，否则使用模块根目录构建
// git 模块: 同规则：
// local 模块: 同规则：
// npm 模块: 去除 @scope/packageName 路径，之后同规则：
exports.downNpm = downNpm;
exports.downGit = downGit;
exports.downLocal = downLocal;

// 下载先下载到临时目录
exports.down = type => {
  if (type === 'npm') return downNpm;
  if (type === 'git') return downGit;
  if (type === 'local') return downLocal;
};

// check if template is local
async function downNpm(template, tmp) {
  if (isExist(tmp)) rm(tmp);
  // template = '@tpls/wxapp'
  await downloadNpmPackage({
    arg: template, // for example, npm@2 or @mic/version@latest etc
    dir: tmp, // package will be downlodaded to ${dir}/packageName
  });
}

async function downGit(url, tmp) {
  if (isExist(tmp)) rm(tmp);
  // 默认 master 分支 https://www.npmjs.com/package/download-git-repo
  // template = 'direct:https://github.com/deepjs-cn/tpl.git#master';
  url = 'https://github.com/vue-templates/pwa#development';
  await new Promise((resolve, reject) => {
    downloadGitRepo(`direct:${url}`, tmp, { clone: true }, err => {
      if (err) return reject(err)
      resolve()
    })
  });
}

async function downLocal(sourceDir, tmp) {
  if (isExist(tmp)) rm(tmp);
  try {
    await fs.copy(sourceDir, tmp);
  } catch (err) {
    exit(err);
  }
}
