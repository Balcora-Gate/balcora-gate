module.exports = {
	root: true,
	env: {
		node: true
	},
	'extends': [
		'plugin:vue/essential',
		'@vue/standard',
		'@vue/typescript'
	],
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-tabs': 0,
		'indent': ['error', 'tab'],
		'semi': ['error', 'always'],
		'camelcase': 'off',
		'promise/param-names': 'off'
	},
	parserOptions: {
		parser: '@typescript-eslint/parser'
	},
	overrides: [
		{
			files: [
				'**/__tests__/*.{j,t}s?(x)'
			],
			env: {
				mocha: true
			}
		}
	]
};
