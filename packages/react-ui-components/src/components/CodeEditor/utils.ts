import { CustomEditorOptions } from './types';

export const getEditorOptions = (customOptions?: CustomEditorOptions): CustomEditorOptions => ({
	fontFamily: 'Inconsolata',
	fontSize: 14,
	wordWrap: 'on',
	renderLineHighlight: 'none',
	scrollBeyondLastLine: false,
	automaticLayout: true,
	scrollbar: {
		useShadows: false,
		verticalScrollbarSize: 6
	},
	minimap: {
		enabled: false
	},
	guides: {
		indentation: false,
		highlightActiveBracketPair: false,
		bracketPairs: false
	},
	...(customOptions || {})
});
