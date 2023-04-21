```tsx
import React from 'react';

import { KvRadioList } from '@kelvininc/react-ui-components';

const RadioListExample: React.FC = () => {
	return (
		<>
			{/* Default */}
			<KvRadioList options={options} onOptionSelected={onOptionSelected} />

			{/* With label */}
			<KvRadioList required label="Select an option" options={options} onOptionSelected={onOptionSelected} />

			{/* With disabled option */}
			<KvRadioList options={optionsWithDisabled} disabledOptions={disabledOptions} onOptionSelected={onOptionSelected} />

			{/* With selected option */}
			<KvRadioList options={options} selectedOption={2} onOptionSelected={onOptionSelected} />
		</>
	);
};

```
