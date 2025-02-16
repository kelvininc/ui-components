import { Monaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { ForwardedRef, FunctionComponent } from 'react';

export type CodeEditor = editor.IStandaloneCodeEditor;
export type CodeInstance = Monaco;
export type OnCodeEditorChange = (value: string | undefined) => void;
export type CodeEditorOptions = editor.IGlobalEditorOptions & editor.IEditorOptions;
export type CodeDiffEditorOptions = editor.IGlobalEditorOptions & editor.IDiffEditorOptions;

export type CodeEditorTheme = editor.IStandaloneThemeData;

export enum ECodeEditorTheme {
	Dark = 'vs-dark',
	Light = 'light',
	Custom = 'custom'
}

export interface ICodeEditorProps {
	/** Use this property to pass a starting value to the editor. */
	code?: string;
	/** Use this property to define the language mode of the editor. */
	language?: string;
	/** Use this property to define the theme of the editor. */
	theme?: ECodeEditorTheme;
	/** Use this property to define and set a custom theme on the editor */
	customTheme?: CodeEditorTheme;
	/** Use this property to define options on the editor */
	customOptions?: CodeEditorOptions;
	/** Use this property to define a placeholder component to display when the editor is loading. */
	LoadingComponent?: FunctionComponent;
	/** Use this property to pass a ref to the editor. */
	forwardedRef?: ForwardedRef<CodeEditor>;
	/** Use this property to pass a ref to the editor instance. */
	instanceRef?: ForwardedRef<CodeInstance>;
	/** Use this property to pass a callback function for when the value (`code`) changes. */
	onChange?: OnCodeEditorChange;
}

export interface ICodeDiffEditorProps extends Omit<ICodeEditorProps, 'code' | 'customOptions'> {
	/** Use this property to pass the original code value to the editor. */
	originalCode?: string;
	/** Use this property to pass the modified code value to the editor. */
	modifiedCode?: string;
	/** Use this property to define options on the editor */
	customOptions?: CodeDiffEditorOptions;
}
