# _<KvCodeEditor\>_

KvCodeEditor is a [React](https://reactjs.org/) component based on [Monaco Editor](https://microsoft.github.io/monaco-editor/), it exposes a simple API to use a Kelvin styled code editor.

This component automatically resizes to fill size of a wrapper element.

## Usage

### React

```tsx
import React from 'react';
import { KvCodeEditor } from '@kelvininc/react-ui-components';

export const CodeEditorExample = () => {
	return (
		<div className={'wrapper'}>
			<KvCodeEditor></KvCodeEditor>
		</div>
	);
};
```

## Properties
All the props described below are optional.

### _code (string)_
Use this property to pass a starting value to the editor.
Defaults to: `undefined`

### _LoadingComponent (FunctionComponent)_
Use this property to define a placeholder component to display when the editor is loading.
Defaults to: `<KvLoader isLoading />`

### _language (string)_
Use this property to define the language mode of the editor.
Defaults to: `yaml`

### _theme (ECodeEditorTheme)_
Use this property to define the theme of the editor.
Defaults to: `ECodeEditorTheme.Dark`

### _customTheme (CustomThemeData)_
Use this property to define and set a custom theme on the editor
Defaults to: `undefined`

### _customOptions (CodeEditorOptions)_
Use this property to define options on the editor

### _onChange (OnEditorChangeCallback)_
Use this property to pass a callback function for when the value (`code`) changes.
Defaults to: `undefined`

## Types

### _ICodeEditorProps (interface)_
Aggregates the properties described in the properties section above in a single TypeScript interface.

### _ECodeEditorTheme (enum)_
Values:

#### ECodeEditorTheme.Dark
#### ECodeEditorTheme.Light
#### ECodeEditorTheme.Custom
