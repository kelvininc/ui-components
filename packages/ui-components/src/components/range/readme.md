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

| Property         | Attribute    | Description                      | Type                        | Default     |
| ---------------- | ------------ | -------------------------------- | --------------------------- | ----------- |
| `disabled`       | `disabled`   | (optional) Range input disabled  | `boolean`                   | `false`     |
| `hideLabel`      | `hide-label` | (optional) Hide value label      | `boolean`                   | `false`     |
| `max`            | `max`        | (required) Range maximum value   | `number`                    | `undefined` |
| `maxLabel`       | `max-label`  | (optional) Max label             | `string`                    | `undefined` |
| `min`            | `min`        | (required) Range minimum value   | `number`                    | `undefined` |
| `minLabel`       | `min-label`  | (optional) Min label             | `string`                    | `undefined` |
| `step`           | `step`       | (optional) Range value step      | `number`                    | `1`         |
| `value`          | `value`      | (optional) Range value           | `number`                    | `0`         |
| `valueFormatter` | --           | (optional) Range value formatter | `(value: number) => string` | `identity`  |


## Events

| Event         | Description                    | Type                  |
| ------------- | ------------------------------ | --------------------- |
| `valueChange` | Emitted when the value changes | `CustomEvent<number>` |


## CSS Custom Properties

| Name                         | Description                        |
| ---------------------------- | ---------------------------------- |
| `--range-height`             | Height of the range slider         |
| `--range-label-color`        | range labels color                 |
| `--range-selector-radius`    | Radius of the range thumb          |
| `--range-width`              | Width of the range slider          |
| `--select-label-color`       | select labels color                |
| `--slider-background-empty`  | color of the slider when its empty |
| `--slider-background-filled` | color of the slider when its full  |
| `--thumb-border-color`       | thumb border color                 |


----------------------------------------------


