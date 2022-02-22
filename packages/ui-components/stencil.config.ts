import { angularOutputTarget as angular, ValueAccessorConfig } from '@stencil/angular-output-target';
import { Config } from '@stencil/core';
import { reactOutputTarget as react } from '@stencil/react-output-target';
import { sass } from '@stencil/sass';

// Configuration to generate properties with 2 way bind in angular
const angularValueAccessorBindings: ValueAccessorConfig[] = [
	{
		elementSelectors: ['kv-switch-button'],
		event: 'switchStateChange',
		targetAttr: 'state',
		type: 'text'
	}
];

export const config: Config = {
	namespace: 'Peacock-UI',
	outputTargets: [
		angular({
			componentCorePackage: '@kelvininc/ui-components',
			directivesProxyFile: '../angular-ui-components/src/generated/component.ts',
			valueAccessorConfigs: angularValueAccessorBindings
		}),
		react({
			componentCorePackage: '@kelvininc/ui-components',
			proxiesFile: '../react-ui-components/src/components/stencil-generated/index.ts',
			includeDefineCustomElements: true,
		}),
		{
			type: 'dist',
			esmLoaderPath: '../loader',
			copy: [
				{ src: 'assets', dest: '../assets', warn: true }
			]
		},
		{
			type: 'dist-custom-elements',
		},
		{
			type: 'docs-readme',
		},
		{
			type: 'docs-json',
			file: 'docs/docs.json'
		},
		{
			type: 'www',
			serviceWorker: null, // disable service workers
		}
	],
	plugins: [sass()],
	testing: {
		moduleNameMapper: {
			'^lodash-es$': 'lodash'
		},
		testRegex: "(\.(test|spec|e2e))\.(tsx?|jsx?)$",
		collectCoverage: true,
		moduleFileExtensions: [
			"ts",
			"tsx",
			"js",
			"json",
			"jsx"
		],
		coverageDirectory: "unit-coverage",
		coveragePathIgnorePatterns: [
			"/node_modules/",
			".types.tsx",
			".config.tsx",
		],
		coverageReporters: ["html", "json"],
		verbose: true
		// coverageThreshold: {
		// 	global: {
		// 		branches: 60,
		// 		functions: 65,
		// 		lines: 70,
		// 		statements: 70,
		// 	},
		// }
	},
};
