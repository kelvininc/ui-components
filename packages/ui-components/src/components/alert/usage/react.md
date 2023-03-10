```tsx
import React from 'react';

import { KvAlert, IAlertConfig, EAlertType, EComponentSize } from '@kelvininc/react-ui-components';

export const AlertExample: React.FC<IAlertConfig> = () => (
	<>
		{/** Default info alert with required props */}
		<KvAlert
			type={EAlertType.Info}
			label="Primary Message"
		/>

		{/** Error state */}
		<KvAlert
			type={EAlertType.Error}
			label="Primary Message"
			description="Secondary Message"
		/>

		{/** Success state */}
		<KvAlert
			type={EAlertType.Success}
			label="Primary Message"
			description="Secondary Message"
		/>

		{/** Warning state */}
		<KvAlert
			type={EAlertType.Warning}
			label="Primary Message"
			description="Secondary Message"
		/>

		{/** With description */}
		<KvAlert
			type={EAlertType.Info}
			label="Primary Message"
			description="Secondary Message"
		/>

		{/** Hiding icon */}
		<KvAlert
			type={EAlertType.Info}
			showIcon={false}
			label="Primary Message"
			description="Secondary Message"
		/>

		{/** Small size */}
		<KvAlert
			type={EAlertType.Info}
			showIcon={false}
			size={EComponentSize.Small}
			label="Primary Message"
			description="Secondary Message"
		/>
	</>
)

```
