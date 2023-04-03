import { CustomThemeData, ECodeEditorTheme } from './types';

export const DEFAULT_EDITOR_LANGUAGE = 'yaml';
export const DEFAULT_EDITOR_THEME = ECodeEditorTheme.Custom;
export const DEFAULT_PADDING_TOP = 12;

export const FONT_NOT_FOUND_ERROR = `Font was not found, make sure the 'Inconsolata' font is included in your css`;

export const KELVIN_CODE_EDITOR_THEME: CustomThemeData = {
	base: 'vs-dark',
	inherit: true,
	rules: [],
	colors: {
		'editor.background': '#202020',
		'editorGutter.background': '#2A2A2A'
	}
};
