```tsx
import React from 'react';
import { KvSingleSelectDropdown } from '@kelvininc/react-ui-components/client';

export const KvSingleSelectDropdownExample: React.FC = (props) => (
  <>
    <KvSingleSelectDropdown 
		placeholder="Select an option"
		label="Options"
		icon={EIconName.Layer}
		options={props.options}
		selectedOption={props.selectedOption}>
	</KvSingleSelectDropdown>
  </>
);
```

### Empty states

`noDataAvailableConfig` is shown when there are no options, searching or not, and `noResultsFoundConfig` when the search matches none. A config with an `illustration` shows the illustration message in the list; one without it shows only its `header`, in the list header. By default, no options shows the "No Data Available" illustration, and no results shows `No results found` in the list header.

```tsx
<KvSingleSelectDropdown
	options={options}
	noDataAvailableConfig={{ header: 'No tags yet' }}
	noResultsFoundConfig={{ illustration: EIllustrationName.NoResultsFound, header: 'No tags found', description: 'Try another name' }}
/>
```

### Creating options

With `canAddItems` the list ends with an add option, labelled by `createOptionPlaceholder`, below any empty state. Picking it replaces the list with a create form, and `createFormToggle` reports the form opening (`true`, once it is rendered) and closing (`false`).

By default submitting the form emits `optionCreated` and then `optionSelected` with the typed value, and the dropdown closes. Add the new option to `options` from `optionCreated`.

```tsx
<KvSingleSelectDropdown
	options={options}
	selectedOption={selectedOption}
	canAddItems
	createOptionPlaceholder={searchTerm ? `Create “${searchTerm}”` : 'Create tag'}
	noResultsFoundConfig={{ header: 'No tags found' }}
	onSearchChange={({ detail }) => setSearchTerm(detail)}
	onOptionCreated={({ detail: name }) => addOption(name)}
	onOptionSelected={({ detail }) => setSelectedOption(detail)}
/>
```

### Creating options asynchronously

With a `createOptionState`, submitting only emits `optionCreated`: the form stays open and nothing is selected yet. Its `status` reports how the request goes:

-   `loading` while it runs: the form locks and shows the create action loading, and the dropdown stays open.
-   `error` if it fails: the form can be edited and submitted again, and shows `error` until the value is edited.
-   `success` once the option exists: the option with `optionKey`, or the submitted value without one, is selected as if it had been clicked, and the dropdown closes. Add it to `options` first.

```tsx
const [createState, setCreateState] = useState<ICreateOptionState>({ status: ECreateOptionStatus.Idle });

const onOptionCreated = async ({ detail: name }: KvSingleSelectDropdownCustomEvent<string>) => {
	setCreateState({ status: ECreateOptionStatus.Loading });

	try {
		const tag = await createTag(name);
		addOption(tag);
		setCreateState({ status: ECreateOptionStatus.Success, optionKey: tag.id });
	} catch {
		setCreateState({ status: ECreateOptionStatus.Error, error: 'A tag with this name already exists' });
	}
};

<KvSingleSelectDropdown
	options={options}
	selectedOption={selectedOption}
	canAddItems
	createOptionState={createState}
	onOptionCreated={onOptionCreated}
	onOptionSelected={({ detail }) => setSelectedOption(detail)}
/>;
```

The state describes the open form's latest submit, and `success` is read when the status changes to it: report `loading` while the request runs, so that a `success` left over from an earlier submit doesn't complete a new one. While `loading` the form can't be cancelled, so the form that succeeds is still the one that was submitted.

### Custom create forms

Content in the `create-new-option` slot replaces the default form, laid out edge to edge: give it its own inset, e.g. `padding: var(--spacing-xl)`. It drives the form with the same bubbling events as `kv-select-create-option`: `valueChanged` with the value, `clickCreate` to submit and `clickCancel` to go back to the list. The dropdown shows neither the loading nor the error of a slotted form, which shows them itself, e.g. by passing `loading` to its `kv-select-create-option`. A custom form that submits on its own finishes with a `success` state and its `optionKey`.

A form mounted when `createFormToggle` reports `true` appears a frame after the create form opens; keep it mounted and reset it on the event to avoid that. The dropdown focuses a `kv-select-create-option` or `kv-text-field` that is already slotted when the form opens; a form mounted later focuses itself.

A `loading` state holds the dropdown open against the trigger and a click outside, but `clickOutside` is still emitted: a consumer closing the dropdown from it should skip that while creating.
