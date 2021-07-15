module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    mocha: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'no-unused-expressions': 0,
    'func-names': 0,
    'no-param-reassign': 0,
    'no-underscore-dangle': 0,
    'class-methods-use-this': 0,
    // TODO: Fix syntax errors
    'no-restricted-syntax': 0,
    'chai-friendly/no-unused-expressions': 2,
    'no-console': 0,
    'max-classes-per-file': 0,
  },
  plugins: [
    'mocha',
    'chai-friendly',
  ],
};
