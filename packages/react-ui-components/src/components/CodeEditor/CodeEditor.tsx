import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import Editor, { OnMount, useMonaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { DEFAULT_CHANGE_DEBOUNCE_TIME, DEFAULT_EDITOR_LANGUAGE, DEFAULT_EDITOR_THEME, DEFAULT_MONACO_OPTIONS } from './config';
import { ECodeEditorTheme, ICodeEditorProps, OnEditorChangeCallback } from './types';
import { DebouncedFunc, debounce } from 'lodash';
import { KvLoader } from '../stencil-generated';

export const KvCodeEditor = ({
	code,
	readOnly = false,
	debounceTime = DEFAULT_CHANGE_DEBOUNCE_TIME,
	loadingComponent = <KvLoader />,
	language = DEFAULT_EDITOR_LANGUAGE,
	theme = DEFAULT_EDITOR_THEME,
	customTheme,
	onChange
}: ICodeEditorProps) => {
	const monaco = useMonaco();
	const editorRef = useRef<editor.IStandaloneCodeEditor>();
	const readOnlyRef = useRef<boolean>(readOnly);

	const onChangeDebounced: DebouncedFunc<OnEditorChangeCallback> = useMemo(() => debounce(value => onChange?.(value), debounceTime), []);
	const onEditorMount: OnMount = useMemo(() => editor => (editorRef.current = editor), []);

	const setupEditor = useCallback(() => {
		if (!monaco || !customTheme) return;
		monaco.editor.defineTheme(ECodeEditorTheme.Custom, customTheme);
		monaco.editor.setTheme(ECodeEditorTheme.Custom);
	}, [monaco, customTheme]);

	const updateOptions = useCallback(() => {
		if (!readOnlyRef.current || !editorRef.current) return;
		readOnlyRef.current = readOnly;
		editorRef.current.updateOptions({ readOnly });
	}, [editorRef.current, readOnlyRef.current, readOnly]);

	useEffect(() => {
		setupEditor();
		updateOptions();
	}, [setupEditor]);

	return (
		<Editor language={language} theme={theme} options={DEFAULT_MONACO_OPTIONS} value={code} loading={loadingComponent} onMount={onEditorMount} onChange={onChangeDebounced} />
	);
};

export default KvCodeEditor;
