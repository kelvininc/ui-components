import { useMonaco } from '@monaco-editor/react';
import { CodeDiffEditorOptions, CodeEditorOptions, ECodeEditorTheme } from '../types';
import { getFontOptions } from '../utils';
import { useFontsApi } from '../../../utils';
import { editor } from 'monaco-editor';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useLoadMonacoEditorStyle = (options: CodeDiffEditorOptions | CodeEditorOptions, customTheme: editor.IStandaloneThemeData) => {
	const monaco = useMonaco();
	const [editorInstance, setEditorInstance] = useState<editor.IStandaloneCodeEditor | null>(null);

	const { isFontLoaded, loadFont } = useFontsApi(getFontOptions(options));

	const hasLoaded = useMemo(() => monaco && isFontLoaded, [monaco, isFontLoaded]);

	const defineCustomTheme = useCallback(() => {
		if (!monaco || !customTheme) return;
		monaco.editor.defineTheme(ECodeEditorTheme.Custom, customTheme);
	}, [customTheme, monaco]);

	useEffect(() => {
		if (monaco) {
			const newEditorInstance = monaco.editor.create(document.createElement('div'), {
				...options,
				theme: ECodeEditorTheme.Custom
			});
			setEditorInstance(newEditorInstance);
		}

		loadFont();
		defineCustomTheme();

		return () => {
			editorInstance?.dispose();
		};
	}, [monaco, loadFont, defineCustomTheme]);

	return hasLoaded;
};
