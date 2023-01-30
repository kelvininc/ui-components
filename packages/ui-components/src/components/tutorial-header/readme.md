# kv-tutorial-header



<!-- Auto Generated Below -->


## Usage

### Angular

```html
<!-- Required properties only -->
<kv-tutorial-header label="Label 1" description="Example label" />

<!-- Custom separator -->
<kv-tutorial-header label="Label 1" description="Example label" separator="/" />
```


### React

```jsx
import React from 'react';

import { KvTutorialHeader } from '@kelvininc/react-ui-components';

export const TutorialHeaderExamples = () => (
	<>
		{/*-- Required properties only --*/}
		<KvTutorialHeader label="Label 1" description="Example label" />

		{/*-- Custom separator --*/}
		<KvTutorialHeader label="Label 1" description="Example label" separator="/" />
	</>
);
```



## Properties

| Property                   | Attribute     | Description                                                                 | Type     | Default     |
| -------------------------- | ------------- | --------------------------------------------------------------------------- | -------- | ----------- |
| `description` _(required)_ | `description` | (required) A description of the state (e.g the description of a step)       | `string` | `undefined` |
| `label` _(required)_       | `label`       | (required) A title to describe a state (e.g step)                           | `string` | `undefined` |
| `separator`                | `separator`   | (optional) A separator character to place between the label and description | `string` | `'-'`       |


## CSS Custom Properties

| Name           | Description                   |
| -------------- | ----------------------------- |
| `--text-color` | The color to use for all text |


----------------------------------------------


