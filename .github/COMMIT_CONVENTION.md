# Git Commit 提交信息规范

一般来说，commit message 应该清晰明了，说明本次提交的目的。

> 这里改写自 [Angular 的提交信息约定](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular)

**TL;DR**

## Commit message 的格式

每次提交，Commit message 都包括三个部分：Header，Body 和 Footer。

```code
<type>(<scope>): <subject>
// 空一行
<body>
// 空一行
<footer>
```

### HEADER

其中，Header 是必需的，Body 和 Footer 可以省略。

不管是哪一个部分，任何一行都不得超过72个字符（或100个字符）。这是为了避免自动换行影响美观。

#### type

`type` 用于说明 commit 的类别，**只允许**使用下面列出来的标识。

- build: 影响系统构建或外部依赖的修改(如: gulp, broccoli, npm)
- ci: 对CI配置文件和脚本的更改(如: Travis, Circle, BrowserStack, SauceLabs)
- docs: 仅仅是文档修改(documentation)
- feat: 新功能(A new feature)
- fix: 修补bug(A bug fix)
- perf: 优化代码提升性能
- refactor: 重构(既不是新增功能，也不是修改bug的代码变动)
- style: 格式变动(不影响代码含义或运行的修改)，如空格，尾分号等
- test: 添加缺失的测试或更正现有测试

提交的信息必须符合以下的正则表达式

``` js
const commitRE = /^(v\d+\.\d+\.\d+(-(alpha|beta|rc.\d+))?$)|((revert: )?(feat|fix|docs|style|refactor|perf|test|workflow|ci|chore|types)(\(.+\))?: .{1,50})/
```

#### scope

`scope` 用于说明 commit 影响的范围，比如数据层、控制层、视图层等等，视项目不同而不同

#### subject

`subject` 是 commit 目的的简短描述，不超过50个字符。

- 以动词开头，使用第一人称现在时，比如 `change`，而不是 `changed` 或 `changes`
- 第一个字母小写
- 结尾不加句号（。）

### Body

Body 部分是对本次 commit 的详细描述，可以分成多行。下面是一个范例。

```code
More detailed explanatory text, if necessary.  Wrap it to
about 72 characters or so.

Further paragraphs come after blank lines.

- Bullet points are okay, too
- Use a hanging indent
```

::: tip 两个注意点

- 使用第一人称现在时，比如使用 `change` 而不是 `changed` 或 `changes`。
- 应该说明代码变动的动机，以及与以前行为的对比。

:::

#### Examples

新增关于 `compiler` 方面的功能

```code
feat(compiler): add 'comments' option
```

修复关于 `v-model` 方面的 bug，附加 issue #28

```code
fix(v-model): handle events on blur

close #28
```

性能改进以及不兼容更新的修改

```code
perf(core): improve vdom diffing by removing 'foo' option

BREAKING CHANGE: The 'foo' option has been removed.
```

## 工具化配置

```bash
sudo npm install -g commitizen cz-conventional-changelog

echo '{ "path": "cz-conventional-changelog" }' > ~/.czrc

# 使用 npm run commit 选择生成规范的 commit 信息
```
