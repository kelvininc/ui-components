import { Config } from '@stencil/core';
import { reactOutputTarget as react } from '@stencil/react-output-target';
import { sass } from '@stencil/sass';

const SOURCE_MAP = process.env.SOURCE_MAP ?? false;

export const config: Config = {
	namespace: 'Peacock-UI',
	globalScript: 'src/globals/globals.ts',
	outputTargets: [
		react({
			componentCorePackage: '@kelvininc/ui-components',
			proxiesFile: '../react-ui-components/src/components/stencil-generated/index.ts',
			includeDefineCustomElements: true
		}),
		{
			type: 'dist',
			esmLoaderPath: '../loader',
			copy: [{ src: 'assets', dest: '../assets', warn: true }]
		},
		{
			type: 'dist-custom-elements'
		},
		{
			type: 'docs-readme',
			dir: 'docs',
			strict: true,
			footer: ''
		},
		{
			type: 'docs-json',
			file: 'docs/docs.json'
		},
		{
			type: 'www',
			serviceWorker: null, // disable service workers
			copy: [{ src: 'assets/svg-symbols.svg', dest: 'svg-symbols.svg' }]
		}
	],
	plugins: [sass()],
	sourceMap: SOURCE_MAP,
	testing: {
		moduleNameMapper: {
			'^lodash-es$': 'lodash'
		},
		testRegex: '(.(test|spec|e2e)).(tsx?|jsx?)$',
		collectCoverage: true,
		moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx', 'd.ts'],
		coverageDirectory: 'unit-coverage',
		coveragePathIgnorePatterns: ['/node_modules/', '.types.tsx', '.mock.ts', '.config.tsx'],
		coverageReporters: ['html', 'json'],
		verbose: true
		// coverageThreshold: {
		// 	global: {
		// 		branches: 60,
		// 		functions: 65,
		// 		lines: 70,
		// 		statements: 70,
		// 	},
		// }
	}
};
