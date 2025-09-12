# *<kv-info-label>*



<!-- Auto Generated Below -->


## Usage

### React

```tsx
import React from 'react';

import { KvInfoLabel, KvTagLetter } from '@kelvininc/react-ui-components/client';

export const InfoLabelExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvInfoLabel labelTitle="Default" />

		{/*-- Read more and read less --*/}
		<KvInfoLabel
			labelTitle="Description"
			description="Lorem Ipsulum..."
			descriptionHeight="34"
			descriptionCollapsedText="Read more"
			descriptionOpennedText="Read less"
		/>

		{/*-- Copy values --*/}
		<KvInfoLabel
			labelTitle="TYPE"
			description="data-model"
			copyValue="data-model"
		/>

		{/*-- With component --*/}
		<KvInfoLabel labelTitle="DESCRIPTION">
			<KvTagLetter label="Test" tagLetter="T" />
		</KvInfoLabel>
	</>
);

```



## Properties

| Property                   | Attribute                    | Description                                     | Type      | Default                              |
| -------------------------- | ---------------------------- | ----------------------------------------------- | --------- | ------------------------------------ |
| `copyValue`                | `copy-value`                 | (optional) Info label copy value                | `string`  | `undefined`                          |
| `description`              | `description`                | (optional) Info label description               | `string`  | `undefined`                          |
| `descriptionCollapsedText` | `description-collapsed-text` | (optional) Info label description collapse text | `string`  | `DEFAULT_DESCRIPTION_COLLAPSED_TEXT` |
| `descriptionHeight`        | `description-height`         | (optional) Info label description height        | `number`  | `undefined`                          |
| `descriptionOpenedText`    | `description-opened-text`    | (optional) Info label description opened text   | `string`  | `DEFAULT_DESCRIPTION_OPENED_TEXT`    |
| `labelTitle`               | `label-title`                | (optional) Info label title                     | `string`  | `undefined`                          |
| `showTextShadow`           | `show-text-shadow`           | (optional) Show text with a shadow              | `boolean` | `false`                              |


## Shadow Parts

| Part      | Description  |
| --------- | ------------ |
| `"title"` | Label title. |


## CSS Custom Properties

| Name                        | Description                     |
| --------------------------- | ------------------------------- |
| `--description-fade-height` | Description fade height.        |
| `--description-fade-height` | Description fade height.        |
| `--description-fade-shadow` | Description fade shadow.        |
| `--description-fade-shadow` | Description fade shadow.        |
| `--expanded-buttom-color`   | Expandded buttom's color.       |
| `--expanded-buttom-color`   | Expandded buttom's color.       |
| `--text-color-description`  | Info label's description color. |
| `--text-color-description`  | Info label's description color. |
| `--text-color-title`        | Info label's title color.       |
| `--text-color-title`        | Info label's title color.       |


## Dependencies

### Depends on

- [kv-tooltip](../tooltip)
- [kv-icon](../icon)

### Graph
```mermaid
graph TD;
  kv-info-label --> kv-tooltip
  kv-info-label --> kv-icon
  kv-tooltip --> kv-portal
  kv-tooltip --> kv-tooltip-text
  style kv-info-label fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


