export enum StyleMode {
	Night = 'night',
	Light = 'light'
}

export interface UIComponentsConfig {
	styleMode?: StyleMode;
	baseAssetsUrl?: string;
	symbolsFileName?: string;
}

declare global {
	interface Window {
		KvUiComponents?: {
			config?: UIComponentsConfig;
		};
	}
}
