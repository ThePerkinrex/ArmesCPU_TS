module.exports = {
	env: {
		node: true
	},
	extends: [
		'standard',
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended'
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',

	},
	plugins: [
		'@typescript-eslint'
	],
	rules: {
		'@typescript-eslint/no-explicit-any': ['off'],
		'@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
		'arrow-parens': ['error', 'as-needed'],
		'indent': ['error', 'tab'],
		'no-tabs': ['error', { allowIndentationTabs: true }],
		'semi': ['error', 'never']
	}
}