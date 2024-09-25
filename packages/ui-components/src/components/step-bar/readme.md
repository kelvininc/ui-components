# _<kv-step-bar>_



<!-- Auto Generated Below -->


## Usage

### React

```tsx
import React from 'react';

import { KvStepBar } from '@kelvininc/react-ui-components';

export const StepBarExample: React.FC = () => {
	const stepsSuccess = [
		{
			enabled: true,
			active: true
		},
		{
			enabled: true,
			active: true
		},
		{
			enabled: false
		}
	];

	const stepsError = [
		{
			enabled: true,
			active: true,
			hasError: true
		},
		{
			enabled: true,
			active: true,
			hasError: true
		},
		{
			enabled: false
		}
	];

	return (
		<>
			{/*-- Default --*/}
			<KvStepBar steps={stepsSuccess} currentStep={1} progressPercentage={50}></KvStepBar>
			{/*-- Error state --*/}
			<KvStepBar steps={stepsError} currentStep={1} progressPercentage={50} hasError></KvStepBar>
		</>
	);
};
```



## Properties

| Property                          | Attribute             | Description                                                                                  | Type             | Default         |
| --------------------------------- | --------------------- | -------------------------------------------------------------------------------------------- | ---------------- | --------------- |
| `currentStep` _(required)_        | `current-step`        | (required) Defines the current step index                                                    | `number`         | `undefined`     |
| `hasError`                        | `has-error`           | (optional) Defines if the progress bar should be in an error state                           | `boolean`        | `false`         |
| `label`                           | `label`               | (optional) Defines the label to display next to the step counter (defaults to: "Progress: ") | `string`         | `DEFAULT_LABEL` |
| `progressPercentage` _(required)_ | `progress-percentage` | (required) Defines the percentage of steps completed                                         | `number`         | `undefined`     |
| `steps` _(required)_              | --                    | (required) Defines the steps array to render                                                 | `IStepBarStep[]` | `undefined`     |


## Events

| Event         | Description                                      | Type                  |
| ------------- | ------------------------------------------------ | --------------------- |
| `stepClicked` | Fires when a step is clicked and emits the index | `CustomEvent<number>` |


## CSS Custom Properties

| Name                   | Description                    |
| ---------------------- | ------------------------------ |
| `--step-counter-color` | The color of the step counter. |
| `--step-label-color`   | The color of the label.        |


## Dependencies

### Used by

 - [kv-wizard-footer](../wizard-footer)

### Depends on

- [kv-step-progress-bar](../step-progress-bar)
- [kv-step-indicator](../step-indicator)

### Graph
```mermaid
graph TD;
  kv-step-bar --> kv-step-progress-bar
  kv-step-bar --> kv-step-indicator
  kv-step-indicator --> kv-icon
  kv-wizard-footer --> kv-step-bar
  style kv-step-bar fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


