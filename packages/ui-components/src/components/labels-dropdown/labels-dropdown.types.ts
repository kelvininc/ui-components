import { EventEmitter } from '@stencil/core';
import { ISelectMultiOptionsConfig, ISelectMultiOptionsEvents } from '../select-multi-options/select-multi-options.types';

type ExcludedSelectMultiOptionsProps = 'selectionClearable' | 'clearSelectionLabel';

export interface ILabelsDropdown extends Omit<ISelectMultiOptionsConfig, ExcludedSelectMultiOptionsProps> {
	/** (Optional) Allows outside implementation to open/close dropdown on demand */
	isOpen?: boolean;
}

export interface ILabelsDropdownEvents extends ISelectMultiOptionsEvents {
	/** Emits a signal whenever the 'select all' action is clicked */
	selectAll: EventEmitter<void>;
}
