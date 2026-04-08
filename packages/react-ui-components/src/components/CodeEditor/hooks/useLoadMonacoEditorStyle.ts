import { useMonaco } from '@monaco-editor/react';
import { CodeDiffEditorOptions, CodeEditorOptions, CodeEditorTheme, ECodeEditorTheme } from '../types';
import { getFontOptions } from '../utils';
import { useFontsApi } from '../../../hooks';
import { useCallback, useEffect, useMemo } from 'react';
import { editor } from 'monaco-editor';
import { DEFAULT_KELVIN_CODE_EDITOR_THEME } from '../config';

export const useLoadMonacoEditorStyle = (options: CodeDiffEditorOptions | CodeEditorOptions, theme: ECodeEditorTheme, customTheme = DEFAULT_KELVIN_CODE_EDITOR_THEME) => {
	const monaco = useMonaco();
	const { isFontLoaded, loadFont } = useFontsApi(getFontOptions(options));

	const hasLoaded = useMemo(() => monaco && isFontLoaded, [monaco, isFontLoaded]);

	const defineCustomTheme = useCallback(() => {
		if (!monaco) return;

		let themeToDefine = customTheme;

		if (theme !== ECodeEditorTheme.Custom) {
			const isLightTheme = theme === ECodeEditorTheme.Light;
			themeToDefine = {
				base: theme,
				inherit: true,
				rules: [],
				colors: {
					'editor.background': !isLightTheme ? '#262626' : '#F2F2F2', // background/surface/neutral/subtle
					'editorGutter.background': !isLightTheme ? '#1A1A1A' : '#FFFFFF' // background/surface/neutral/default
				}
			};
		}

		monaco.editor.defineTheme(ECodeEditorTheme.Custom, themeToDefine);
	}, [theme, customTheme, monaco]);

	useEffect(() => {
		loadFont();
		defineCustomTheme();
	}, [loadFont, defineCustomTheme]);

	return hasLoaded;
};
