module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 允许的type类型，第一个参数的含义：0-禁止、1-警告、2-错误
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'revert', 'build', 'chore', 'ci', 'perf'],
    ],
    // type需小写
    'type-case': [2, 'always', 'lowerCase'],
    // type不能为空
    'type-empty': [2, 'never'],
    // subject不能以'.'结尾
    'subject-full-stop': [2, 'never', '.'],
  },
}
