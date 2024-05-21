import React, { useCallback, useMemo } from 'react';
import Editor from '@monaco-editor/react';
import { DEFAULT_CODE_EDITOR_LANGUAGE, DEFAULT_CODE_EDITOR_THEME, KELVIN_CODE_EDITOR_THEME } from './config';
import { ICodeEditorProps, OnCodeEditorChange } from './types';
import { getEditorOptions } from './utils';
import { CodeEditorLoader } from './CodeEditorLoader';
import { useLoadMonacoEditorStyle } from './hooks';

export const KvCodeEditor = ({
	code,
	language = DEFAULT_CODE_EDITOR_LANGUAGE,
	theme = DEFAULT_CODE_EDITOR_THEME,
	customTheme = KELVIN_CODE_EDITOR_THEME,
	customOptions,
	LoadingComponent = CodeEditorLoader,
	onChange
}: ICodeEditorProps) => {
	const options = useMemo(() => getEditorOptions(customOptions), [customOptions]);
	const hasLoaded = useLoadMonacoEditorStyle(options, customTheme);

	const onTextChange: OnCodeEditorChange = useCallback(value => onChange?.(value), [onChange]);

	if (!hasLoaded) {
		return <LoadingComponent />;
	}

	return <Editor language={language} theme={theme} options={options} loading={<LoadingComponent />} value={code} onChange={onTextChange} />;
};
