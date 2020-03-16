module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        'plugin:vue/essential',
        'eslint:recommended',
        '@vue/prettier'
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        // 'vue/script-indent': ['error', 4, {'baseIndent': 1}],
        indent: ['error', 4]
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
};