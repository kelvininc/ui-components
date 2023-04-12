import React, { useCallback, useEffect, useMemo } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { DEFAULT_CODE_EDITOR_LANGUAGE, DEFAULT_CODE_EDITOR_THEME, KELVIN_CODE_EDITOR_THEME } from './config';
import { ECodeEditorTheme, ICodeEditorProps, OnCodeEditorChange } from './types';
import { KvLoader } from '../stencil-generated';
import { getEditorOptions, getFontOptions } from './utils';
import { useFontsApi } from '../../utils';

const CodeEditorLoader = () => <KvLoader isLoading />;

export const KvCodeEditor = ({
	code,
	language = DEFAULT_CODE_EDITOR_LANGUAGE,
	theme = DEFAULT_CODE_EDITOR_THEME,
	customTheme = KELVIN_CODE_EDITOR_THEME,
	customOptions,
	LoadingComponent = CodeEditorLoader,
	onChange
}: ICodeEditorProps) => {
	const monaco = useMonaco();
	const options = useMemo(() => getEditorOptions(customOptions), [customOptions]);
	const { isFontLoaded, loadFont } = useFontsApi(getFontOptions(options));

	const hasLoaded = useMemo(() => monaco && isFontLoaded, [monaco, isFontLoaded]);

	const defineCustomTheme = useCallback(() => {
		if (!monaco || !customTheme) return;
		monaco.editor.defineTheme(ECodeEditorTheme.Custom, customTheme);
	}, [customTheme, monaco]);

	const onTextChange: OnCodeEditorChange = useCallback(value => onChange?.(value), [onChange]);

	useEffect(() => {
		loadFont();
		defineCustomTheme();
	}, [loadFont, defineCustomTheme]);

	if (!hasLoaded) {
		return <LoadingComponent />;
	}

	return <Editor language={language} theme={theme} options={options} loading={<LoadingComponent />} value={code} onChange={onTextChange} />;
};

export default KvCodeEditor;
