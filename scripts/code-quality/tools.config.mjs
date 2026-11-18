import { createRequire } from 'node:module';

const require = createRequire(
	new URL('../../packages/ui-components/package.json', import.meta.url)
);
const fromEslint = createRequire(require.resolve('eslint'));
const javascript = fromEslint('@eslint/js');
const globals = fromEslint('globals');

export default [
	{
		files: ['**/*.mjs', '**/*.cjs'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: globals.node
		},
		rules: {
			...javascript.configs.recommended.rules,
			curly: ['error', 'all'],
			'padding-line-between-statements': [
				'error',
				{
					blankLine: 'always',
					prev: ['const', 'let', 'var'],
					next: '*'
				},
				{
					blankLine: 'any',
					prev: ['const', 'let', 'var'],
					next: ['const', 'let', 'var']
				},
				{
					blankLine: 'always',
					prev: '*',
					next: ['if', 'for', 'while', 'switch', 'try', 'return']
				}
			],
			'brace-style': ['error', '1tbs', { allowSingleLine: false }],
			'block-spacing': 'error',
			indent: ['error', 'tab', { SwitchCase: 1 }],
			quotes: ['error', 'single', { avoidEscape: true }],
			semi: ['error', 'always'],
			'no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					ignoreRestSiblings: true,
					caughtErrorsIgnorePattern: '^_'
				}
			],
			'no-var': 'error',
			'prefer-const': 'error',
			'eol-last': ['error', 'always'],
			'keyword-spacing': 'error',
			'space-before-blocks': 'error',
			'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }]
		}
	}
];
