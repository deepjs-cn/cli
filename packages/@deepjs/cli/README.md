# js-cli

小工具，将重复简单的工作，使用工具来处理

为什么需要需要脚手架？

- 减少重复性的工作，不再需要复制其他项目再删除无关代码，或者从零创建一个项目和文件。
- 根据交互动态生成项目结构和配置文件等。
- 多人协作更为方便，不需要把文件传来传去。

- 使用（参考 @vue/cli）
  - [ ] 支持初始化新项目 `jscli create <template> <name>`
  - [ ] 支持项目内添加组件、模块、页面 `jscli add <template> <name>`
  - [ ] 创建或添加时，支持交互式的生成
- 模板管理（参考 npm config & nrm 的形式）
  - [x] 支持提供官方模板列表
  - [x] 支持添加自定义模板，使用配置 `~/.jsclirc`
  - [x] 查看模板列表 `jscli tpl ls [--json]`
  - [x] 添加模板 `jscli tpl add <key> <value>`
  - [x] 删除模板 `jscli tpl del <key>`
  - [x] 编辑模板 `jscli tpl edit`，调用默认编辑器编辑(也可以考虑使用 VIM)
  - [x] 校验模板数据有效性 `jscli tpl check`

参考：

- 文档
  - https://github.com/lin-xin/blog/issues/27
  - https://juejin.im/post/5a31d210f265da431a43330e
- 项目
  - https://github.com/Pana/nrm
  - https://github.com/tj/commander.js/blob/master/Readme_zh-CN.md
  - https://github.com/vuejs/vue-cli (@2.x @3.x)
  - https://github.com/STMU1320/Jsm-cli.git
  - https://github.com/ChangedenCZD/optimize-vue-cli
  - https://github.com/kesla/download-npm-package
  - https://github.com/npm/cli/blob/latest/lib/config.js
  - https://github.com/yarnpkg/yarn/blob/master/src/cli/index.js
