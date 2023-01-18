import type { editor } from 'monaco-editor';
import { ReactNode } from 'react';

export type OnEditorChangeCallback = (value: string | undefined) => void;
export type CustomThemeData = editor.IStandaloneThemeData;

export enum ECodeEditorTheme {
	Dark = 'vs-dark',
	Light = 'light',
	Custom = 'custom'
}

export interface ICodeEditorProps {
	/** Use this property to pass a starting value to the editor. */
	code?: string;
	/** Use this property to set the editor to a read only mode where the user cannot modify the value. */
	readOnly?: boolean;
	/** Use this property to define the debounce time in ms of the `onChange` function. */
	debounceTime?: number;
	/** Use this property to define a placeholder component to display when the editor is loading. */
	loadingComponent?: ReactNode;
	/** Use this property to define the language mode of the editor. */
	language?: string;
	/** Use this property to define the theme of the editor. */
	theme?: ECodeEditorTheme;
	/** Use this property to define and set a custom theme on the editor */
	customTheme?: CustomThemeData;
	/** Use this property to pass a callback function for when the value (`code`) changes. */
	onChange?: OnEditorChangeCallback;
}
