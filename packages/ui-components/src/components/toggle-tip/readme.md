# _kv-toggle-tip_



<!-- Auto Generated Below -->


## Usage

### Angular

```html
<!-- Default -->
<kv-toggle-tip text="Toggle tip">
	<kv-icon slot="open-element-slot" name={EIconName.Info}/>
	<kv-action-button [type]="EActionButtonType.Primary" slot="content-slot">Learn More</kv-action-button>
</kv-toggle-tip>

<!-- With Fixed Position -->
<kv-toggle-tip text="Toggle tip" [position]="ETooltipPosition.Left">
	<kv-icon slot="open-element-slot" name={EIconName.Info}/>
	<kv-action-button [type]="EActionButtonType.Primary" slot="content-slot">Learn More</kv-action-button>
</kv-toggle-tip>

<!-- With Allowed Position -->
<kv-toggle-tip text="Toggle tip" [allowedPositions]="[ETooltipPosition.Top, ETooltipPosition.Bottom]">
	<kv-icon slot="open-element-slot" name={EIconName.Info}/>
	<kv-action-button [type]="EActionButtonType.Primary" slot="content-slot">Learn More</kv-action-button>
</kv-toggle-tip>
```


### React

```tsx
import React from 'react';

import { KvToggleTip, KvIcon, KvActionButton, EIconName, ETooltipPosition, EActionButtonType } from '@kelvininc/react-ui-components';

export const ToggleTipExample: React.FC = () => (
  <>
    {/*-- Default --*/}
	<KvToggleTip text="Toggle tip">
		<KvIcon slot="open-element-slot" name={EIconName.Info}/>
		<KvActionButton slot="content-slot" type={EActionButtonType.Primary}>Learn More</KvActionButton>
	</KvToggleTip>

	{/*-- With Fixed Position --*/}
	<KvToggleTip text="Toggle tip" position={ETooltipPosition.Left}>
		<KvIcon slot="open-element-slot" name={EIconName.Info}/>
		<KvActionButton slot="content-slot" type={EActionButtonType.Primary}>Learn More</KvActionButton>
	</KvToggleTip>

	{/*-- With Allowed Positions --*/}
	<KvToggleTip text="Toggle tip" allowedPositions={[ETooltipPosition.Top, ETooltipPosition.Bottom]}>
		<KvIcon slot="open-element-slot" name={EIconName.Info}/>
		<KvActionButton slot="content-slot" type={EActionButtonType.Primary}>Learn More</KvActionButton>
	</KvToggleTip>
  </>
);
```



## Properties

| Property           | Attribute    | Description                                                                                | Type                                                                                                                                                                                                                                                                                                                                             | Default     |
| ------------------ | ------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| `allowedPositions` | --           | (optional) Array of allowed positions of toggle tip (if defined the 'position' is ignored) | `ETooltipPosition[]`                                                                                                                                                                                                                                                                                                                             | `undefined` |
| `arrowElement`     | --           | (optional) html arrow element ref                                                          | `HTMLElement`                                                                                                                                                                                                                                                                                                                                    | `null`      |
| `containerElement` | --           | (optional) html toggle tip container ref                                                   | `HTMLElement`                                                                                                                                                                                                                                                                                                                                    | `null`      |
| `disabled`         | `disabled`   | (optional) if true it will disable clicks to open toggle tip                               | `boolean`                                                                                                                                                                                                                                                                                                                                        | `false`     |
| `isFixed`          | `is-fixed`   | (optional) if true it will ignore outside clicks to close the toggle tip                   | `boolean`                                                                                                                                                                                                                                                                                                                                        | `false`     |
| `isOpen`           | `is-open`    | (optional) Set open state of toggle tip, default false                                     | `boolean`                                                                                                                                                                                                                                                                                                                                        | `false`     |
| `openElement`      | --           | (optional) html toggle tip opening element ref                                             | `HTMLElement`                                                                                                                                                                                                                                                                                                                                    | `null`      |
| `position`         | `position`   | (optional) Position of toggletip                                                           | `ETooltipPosition.Bottom \| ETooltipPosition.BottomEnd \| ETooltipPosition.BottomStart \| ETooltipPosition.Left \| ETooltipPosition.LeftEnd \| ETooltipPosition.LeftStart \| ETooltipPosition.Right \| ETooltipPosition.RightEnd \| ETooltipPosition.RightStart \| ETooltipPosition.Top \| ETooltipPosition.TopEnd \| ETooltipPosition.TopStart` | `undefined` |
| `text`             | `text`       | (optional) Text of toggletip                                                               | `string`                                                                                                                                                                                                                                                                                                                                         | `undefined` |
| `withArrow`        | `with-arrow` | (optional) if true it will render an arrow pointing to the opening element                 | `boolean`                                                                                                                                                                                                                                                                                                                                        | `false`     |


## Events

| Event             | Description                                   | Type                   |
| ----------------- | --------------------------------------------- | ---------------------- |
| `openStateChange` | Emitted when the dropdown opens state changes | `CustomEvent<boolean>` |


## Shadow Parts

| Part                        | Description                  |
| --------------------------- | ---------------------------- |
| `"toggle-tip-container"`    | The toggle tip container.    |
| `"toggle-tip-slot-content"` | The toggle tip slot content. |


## CSS Custom Properties

| Name                               | Description           |
| ---------------------------------- | --------------------- |
| `--toggle-tip-container-max-width` | toggle tip max width. |
| `--toggle-tip-container-width`     | toggle tip width.     |
| `--toggletip-z-index`              | toggle tip z-index.   |


----------------------------------------------


