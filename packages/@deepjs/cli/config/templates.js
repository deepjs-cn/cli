// 支持本地路径 local，github 库，npm 模块等
// jscli add wxapp-component ttt -v 0.0.4
// 默认使用最新版 latest，也可指定版本

// Available official templates:
// ★ [name]
exports.templates = {
  "wxapp": {
    "type": "npm",
    "value": "@tpls/wxapp",
    "desc": "说明",
  },
  "wxapp-component": {
    "type": "npm",
    "value": "@tpls/wxapp-component",
    "desc": "说明",
  },
  "wxapp-page": {
    "type": "npm",
    "value": "@tpls/wxapp-page",
    "desc": "说明",
  },
  "aliapp": {
    "type": "npm",
    "value": "@tpls/aliapp",
    "desc": "说明",
  },
  "aliapp-component": {
    "type": "npm",
    "value": "@tpls/aliapp-component",
    "desc": "说明",
  },
  "aliapp-page": {
    "type": "npm",
    "value": "@tpls/aliapp-page",
    "desc": "说明",
  },
}
