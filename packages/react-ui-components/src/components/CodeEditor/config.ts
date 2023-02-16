import { ECodeEditorTheme } from './types';
import type { editor } from 'monaco-editor';

export const DEFAULT_CHANGE_DEBOUNCE_TIME = 200;
export const DEFAULT_EDITOR_LANGUAGE = 'yaml';
export const DEFAULT_EDITOR_THEME = ECodeEditorTheme.Dark;
export const DEFAULT_PADDING_TOP = 0;

export const DEFAULT_MONACO_OPTIONS: editor.IStandaloneEditorConstructionOptions = {
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
	}
};
