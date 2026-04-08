import { CodeEditorTheme, ECodeEditorTheme, CodeEditorOptions } from './types';

export const DEFAULT_CODE_EDITOR_LANGUAGE = 'yaml';

export const DEFAULT_CODE_EDITOR_OPTIONS: CodeEditorOptions = {
	readOnly: false,
	padding: {
		top: 12
	}
};

export const DEFAULT_KELVIN_CODE_EDITOR_THEME: CodeEditorTheme = {
	base: 'vs-dark',
	inherit: true,
	rules: [],
	colors: {
		'editor.background': '#262626',
		'editorGutter.background': '#1A1A1A'
	}
};

export const MONACO_FONT_FAMILY = `Menlo, Monaco, "Courier New", monospace`;
export const MONACO_FONT_SIZE = 12;
