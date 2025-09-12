```tsx
import React from 'react';

import { KvToggleTip, KvIcon, KvActionButton, EIconName, ETooltipPosition, EActionButtonType } from '@kelvininc/react-ui-components/client';

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
