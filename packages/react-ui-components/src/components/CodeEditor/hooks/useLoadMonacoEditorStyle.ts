import { useMonaco } from '@monaco-editor/react';
import { CodeDiffEditorOptions, CodeEditorOptions, ECodeEditorTheme } from '../types';
import { getFontOptions } from '../utils';
import { useFontsApi } from '../../../hooks';
import { useCallback, useEffect, useMemo } from 'react';
import { editor } from 'monaco-editor';

export const useLoadMonacoEditorStyle = (options: CodeDiffEditorOptions | CodeEditorOptions, customTheme: editor.IStandaloneThemeData) => {
	const monaco = useMonaco();
	const { isFontLoaded, loadFont } = useFontsApi(getFontOptions(options));

	const hasLoaded = useMemo(() => monaco && isFontLoaded, [monaco, isFontLoaded]);

	const defineCustomTheme = useCallback(() => {
		if (!monaco || !customTheme) return;
		monaco.editor.defineTheme(ECodeEditorTheme.Custom, customTheme);
	}, [customTheme, monaco]);

	useEffect(() => {
		loadFont();
		defineCustomTheme();
	}, [loadFont, defineCustomTheme]);

	return hasLoaded;
};
