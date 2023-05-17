```tsx
import React from 'react';

import { KvTooltip, KvActionButton, ETooltipPosition, EActionButtonType } from '@kelvininc/react-ui-components';

export const TooltipExample: React.FC = () => (
  <>
    {/*-- Default --*/}
	<KvTooltip text="Tooltip">
		<KvActionButton type={EActionButtonType.Primary}>Hover me!</KvActionButton>
	</KvTooltip>

	{/*-- With Fixed Position --*/}
	<KvTooltip text="Tooltip" position={ETooltipPosition.Left}>
		<KvActionButton type={EActionButtonType.Primary}>Hover me!</KvActionButton>
	</KvTooltip>

	{/*-- With Allowed Positions --*/}
	<KvTooltip text="Tooltip" allowedPositions={[ETooltipPosition.Top, ETooltipPosition.Bottom]}>
		<KvActionButton type={EActionButtonType.Primary}>Hover me!</KvActionButton>
	</KvTooltip>
  </>
);
```
