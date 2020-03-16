module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        'plugin:vue/essential',
        'eslint:recommended',
    ],
    rules: {
        'indent': ['error', 4]
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
};