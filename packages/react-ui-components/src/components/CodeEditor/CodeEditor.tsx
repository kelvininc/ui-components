import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { DEFAULT_EDITOR_LANGUAGE, DEFAULT_EDITOR_THEME, DEFAULT_PADDING_TOP, FONT_NOT_FOUND_ERROR, KELVIN_CODE_EDITOR_THEME } from './config';
import { ECodeEditorTheme, ICodeEditorProps, OnEditorChangeCallback } from './types';
import { KvLoader } from '../stencil-generated';
import { getEditorOptions } from './utils';

export const KvCodeEditor = ({
	code,
	readOnly = false,
	loadingComponent = <KvLoader isLoading />,
	language = DEFAULT_EDITOR_LANGUAGE,
	theme = DEFAULT_EDITOR_THEME,
	customTheme = KELVIN_CODE_EDITOR_THEME,
	paddingTop = DEFAULT_PADDING_TOP,
	onChange
}: ICodeEditorProps) => {
	const monaco = useMonaco();
	const [isFontLoaded, setFontLoaded] = useState(false);

	const options = useMemo(() => getEditorOptions({ readOnly, padding: { top: paddingTop } }), [readOnly, paddingTop]);

	const loadFont = useCallback(async () => {
		try {
			const { fontSize, fontFamily } = options;
			await document.fonts.load(`${fontSize}px ${fontFamily}`);
			setFontLoaded(true);
		} catch (error) {
			throw new Error(FONT_NOT_FOUND_ERROR);
		}
	}, [options.fontSize, options.fontFamily]);

	const setupEditor = useCallback(() => {
		if (!monaco || !customTheme) return;
		monaco.editor.defineTheme(ECodeEditorTheme.Custom, customTheme);
		monaco.editor.setTheme(ECodeEditorTheme.Custom);
	}, [monaco, customTheme]);

	const onTextChange: OnEditorChangeCallback = useCallback(value => onChange?.(value), [onChange]);

	useEffect(() => {
		loadFont();
		setupEditor();
	}, [loadFont, setupEditor]);

	if (!isFontLoaded) {
		return loadingComponent;
	}

	return <Editor language={language} theme={theme} options={options} value={code} loading={loadingComponent} onChange={onTextChange} />;
};

export default KvCodeEditor;
