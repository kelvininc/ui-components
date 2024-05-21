import React, { useCallback, useMemo } from 'react';
import { DiffEditor } from '@monaco-editor/react';
import { DEFAULT_CODE_EDITOR_LANGUAGE, DEFAULT_CODE_EDITOR_THEME, KELVIN_CODE_EDITOR_THEME } from './config';
import { ICodeDiffEditorProps, OnCodeEditorChange } from './types';
import { getEditorOptions } from './utils';
import { editor } from 'monaco-editor';
import { CodeEditorLoader } from './CodeEditorLoader';
import { useLoadMonacoEditorStyle } from './hooks';

export const KvCodeDiffEditor = ({
	originalCode,
	modifiedCode,
	language = DEFAULT_CODE_EDITOR_LANGUAGE,
	theme = DEFAULT_CODE_EDITOR_THEME,
	customTheme = KELVIN_CODE_EDITOR_THEME,
	customOptions,
	LoadingComponent = CodeEditorLoader,
	onChange
}: ICodeDiffEditorProps) => {
	const options = useMemo(() => getEditorOptions(customOptions), [customOptions]);

	const hasLoaded = useLoadMonacoEditorStyle(options, customTheme);

	const onTextChange: OnCodeEditorChange = useCallback(value => onChange?.(value), [onChange]);

	/**
	 * The monaco editor does not have a onChange method to get the value from the diff editor.
	 * A workaround is to get the modified editor and listen to the onDidChangeModelContent event.
	 * https://github.com/suren-atoyan/monaco-react/issues/281
	 */
	const handleEditorMount = useCallback((editor: editor.IStandaloneDiffEditor) => {
		const modifiedEditor = editor.getModifiedEditor();
		modifiedEditor.onDidChangeModelContent(() => {
			onTextChange(modifiedEditor.getValue());
		});
	}, []);

	if (!hasLoaded) {
		return <LoadingComponent />;
	}

	return (
		<DiffEditor
			onMount={handleEditorMount}
			original={originalCode}
			modified={modifiedCode}
			language={language}
			theme={theme}
			options={options}
			loading={<LoadingComponent />}
		/>
	);
};
