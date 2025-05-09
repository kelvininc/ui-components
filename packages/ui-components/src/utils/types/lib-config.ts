export interface UIComponentsConfig {
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
