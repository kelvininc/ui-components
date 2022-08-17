# _kv-range_



<!-- Auto Generated Below -->


## Usage

### Angular

<!-- Default -->
<kv-range min=0 max=100 value=0 step=1></kv-range>


### React

import React from 'react';
import { KvRange } from '@kelvininc/react-ui-components';

export const KvRangeExample: React.FC = () => (
  <>
	<KvRange min={0} max={100} step={1} value={0} />
  </>
);



## Properties

| Property | Attribute | Description                    | Type     | Default     |
| -------- | --------- | ------------------------------ | -------- | ----------- |
| `max`    | `max`     | (required) Range maximum value | `number` | `undefined` |
| `min`    | `min`     | (required) Range minimum value | `number` | `undefined` |
| `step`   | `step`    | (optional) Range value step    | `number` | `1`         |
| `value`  | `value`   | (optional) Range value         | `number` | `0`         |


## Events

| Event         | Description                    | Type                  |
| ------------- | ------------------------------ | --------------------- |
| `valueChange` | Emitted when the value changes | `CustomEvent<number>` |


## CSS Custom Properties

| Name                         | Description                        |
| ---------------------------- | ---------------------------------- |
| `--range-width`              | Width of the range slider          |
| `--slider-background-empty`  | color of the slider when its empty |
| `--slider-background-filled` | color of the slider when its full  |


----------------------------------------------


