module.exports = {
    extends: [
      'react-app',
      'react-app/jest',
      'prettier',
    ],
    parser: '@typescript-eslint/parser',
    ignorePatterns: ['.eslintrc.js'],
    rules: {
      'no-console': 'warn',
      'no-debugger': 'warn',
      'no-alert': 'warn',
    },
    
  };