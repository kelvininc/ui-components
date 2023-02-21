import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import Editor, { OnMount, useMonaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { DEFAULT_EDITOR_LANGUAGE, DEFAULT_EDITOR_THEME, DEFAULT_MONACO_OPTIONS, DEFAULT_PADDING_TOP } from './config';
import { ECodeEditorTheme, ICodeEditorProps, OnEditorChangeCallback } from './types';
import { KvLoader } from '../stencil-generated';

export const KvCodeEditor = ({
	code,
	readOnly = false,
	loadingComponent = <KvLoader />,
	language = DEFAULT_EDITOR_LANGUAGE,
	theme = DEFAULT_EDITOR_THEME,
	customTheme,
	paddingTop = DEFAULT_PADDING_TOP,
	onChange
}: ICodeEditorProps) => {
	const monaco = useMonaco();
	const editorRef = useRef<editor.IStandaloneCodeEditor>();
	const readOnlyRef = useRef<boolean>(readOnly);

	const onTextChange: OnEditorChangeCallback = value => onChange?.(value);
	const onEditorMount: OnMount = useMemo(() => editor => (editorRef.current = editor), []);

	const editorOptions: editor.IEditorOptions = useMemo(() => ({ readOnly, padding: { top: paddingTop } }), [readOnly, paddingTop]);

	const setupEditor = useCallback(() => {
		if (!monaco || !customTheme) return;
		monaco.editor.defineTheme(ECodeEditorTheme.Custom, customTheme);
		monaco.editor.setTheme(ECodeEditorTheme.Custom);
	}, [monaco, customTheme]);

	const updateOptions = useCallback(() => {
		if (!editorRef.current) return;
		if (readOnlyRef.current) {
			readOnlyRef.current = readOnly;
		}
		editorRef.current.updateOptions(editorOptions);
	}, [editorRef.current, readOnlyRef.current, editorOptions]);

	useEffect(() => {
		setupEditor();
		updateOptions();
	}, [setupEditor, updateOptions]);

	return <Editor language={language} theme={theme} options={DEFAULT_MONACO_OPTIONS} value={code} loading={loadingComponent} onMount={onEditorMount} onChange={onTextChange} />;
};

export default KvCodeEditor;
