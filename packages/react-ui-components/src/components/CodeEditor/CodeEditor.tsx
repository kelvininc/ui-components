import React, { ForwardedRef, forwardRef, useCallback, useMemo } from 'react';
import Editor from '@monaco-editor/react';
import { DEFAULT_CODE_EDITOR_LANGUAGE, DEFAULT_CODE_EDITOR_THEME, KELVIN_CODE_EDITOR_THEME } from './config';
import { CodeEditor, CodeInstance, ICodeEditorProps, OnCodeEditorChange } from './types';
import { getEditorOptions } from './utils';
import { CodeEditorLoader } from './CodeEditorLoader';
import { useLoadMonacoEditorStyle } from './hooks';

const Component = ({
	forwardedRef,
	instanceRef,
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

	const handleEditorDidMount = (editor: CodeEditor, instance: CodeInstance) => {
		if (typeof forwardedRef === 'function') {
			forwardedRef(editor);
		} else if (forwardedRef) {
			forwardedRef.current = editor;
		}

		if (typeof instanceRef === 'function') {
			instanceRef(instance);
		} else if (instanceRef) {
			instanceRef.current = instance;
		}
	};

	if (!hasLoaded) {
		return <LoadingComponent />;
	}

	return <Editor language={language} theme={theme} options={options} loading={<LoadingComponent />} value={code} onChange={onTextChange} onMount={handleEditorDidMount} />;
};

export const KvCodeEditor = forwardRef(function CodeEditorWithRef(props: ICodeEditorProps, ref: ForwardedRef<CodeEditor>) {
	return <Component {...props} forwardedRef={ref} />;
});
