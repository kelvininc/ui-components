import { angularOutputTarget as angular, ValueAccessorConfig } from '@stencil/angular-output-target';
import { Config } from '@stencil/core';
import { reactOutputTarget as react } from '@stencil/react-output-target';
import { sass } from '@stencil/sass';

const angularValueAccessorBindings: ValueAccessorConfig[] = [
	// Configuration example to generate properties with 2 way bind in angular
	// {
	// 	elementSelectors: ['component-name'],
	// 	event: 'eventNameOfChamge',
	// 	targetAttr: 'propName',
	// 	type: 'number/type'
	// }
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
			type: 'www',
			serviceWorker: null, // disable service workers
		}
	],
	plugins: [sass()],
};
