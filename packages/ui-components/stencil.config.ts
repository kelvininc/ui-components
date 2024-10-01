import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';
import { sass } from '@stencil/sass';

const SOURCE_MAP = process.env.SOURCE_MAP === 'true';

export const config: Config = {
	namespace: 'Peacock-UI',
	globalScript: 'src/globals/globals.ts',
	outputTargets: [
		reactOutputTarget({
			outDir: '../react-ui-components/src/stencil-generated/',
			hydrateModule: '@kelvininc/ui-components/hydrate'
		}),
		{
			type: 'dist',
			esmLoaderPath: '../loader',
			copy: [{ src: 'assets', dest: '../assets', warn: true }]
		},
		{
			type: 'dist-custom-elements',
			customElementsExportBehavior: 'auto-define-custom-elements',
			externalRuntime: false
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
			copy: [{ src: 'assets/svg-symbols.svg' }]
		},
		{
			type: 'dist-hydrate-script',
			dir: './hydrate'
		}
	],
	plugins: [sass()],
	sourceMap: SOURCE_MAP,
	testing: {
		browserHeadless: 'new',
		moduleNameMapper: {
			'^lodash-es$': 'lodash'
		},
		testRegex: ['(.(test|spec|e2e)).(tsx?|jsx?)$'],
		collectCoverage: true,
		moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx', 'd.ts'],
		coverageDirectory: 'unit-coverage',
		coveragePathIgnorePatterns: ['/node_modules/', '.types.tsx', '.mock.ts', '.config.tsx'],
		coverageReporters: ['html', 'json']
	}
};
