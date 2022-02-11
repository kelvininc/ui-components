import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
	namespace: 'peacock-ui',
	outputTargets: [
		{
			type: 'dist',
			esmLoaderPath: '../loader',
			copy: [
				{ src: 'fonts', warn: true }
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
		},
	],
	plugins: [
		sass()
	]
};
