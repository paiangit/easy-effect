module.exports = {
  // 默认规则列表：https://stylelint.io/user-guide/rules/list/
  // 插件列表：https://github.com/stylelint/awesome-stylelint#plugins
  "extends": ["stylelint-config-standard"],
  rules: {
    "selector-pseudo-class-no-unknown": [
      true,
      {
        // 允许:global正常使用
        "ignorePseudoClasses": ["global"]
      }
    ],
  },
}
