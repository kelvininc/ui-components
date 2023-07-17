import { Component, Event, EventEmitter, Prop, State, Watch, h } from '@stencil/core';
import { ISelectMultiOption, ISelectMultiOptions, ISelectMultiOptionsConfig, ISelectMultiOptionsEvents } from './select-multi-options.types';
import { isEmpty } from 'lodash';
import { buildSelectGroups, hasGroups } from '../select-group/select-group.helper';
import { DEFAULT_NO_DATA_AVAILABLE_LABEL } from './select-multi-options.config';

@Component({
	tag: 'kv-select-multi-options',
	styleUrl: 'select-multi-options.scss',
	shadow: true
})
export class KvSelectMultiOptions implements ISelectMultiOptionsConfig, ISelectMultiOptionsEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) options?: ISelectMultiOptions = {};
	/** @inheritdoc */
	@Prop({ reflect: true }) filteredOptions?: ISelectMultiOptions = {};
	/** @inheritdoc */
	@Prop({ reflect: true }) selectedOptions?: Record<string, boolean> = {};
	/** @inheritdoc */
	@Prop({ reflect: true }) noDataAvailableLabel?: string = DEFAULT_NO_DATA_AVAILABLE_LABEL;
	/** @inheritdoc */
	@Prop({ reflect: true }) searchable?: boolean;
	/** @inheritdoc */
	@Prop({ reflect: true }) searchPlaceholder?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) searchValue?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) selectionClearable?: boolean;
	/** @inheritdoc */
	@Prop({ reflect: true }) clearSelectionLabel?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) minHeight?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) maxHeight?: string;

	/** @inheritdoc */
	@Event() optionsSelected: EventEmitter<Record<string, boolean>>;
	/** @inheritdoc */
	@Event() searchChange: EventEmitter<string>;
	/** @inheritdoc */
	@Event() selectionCleared: EventEmitter<void>;

	@State() _searchValue: string = this.searchValue;

	@Watch('searchValue')
	searchValueWatcher(newValue: string, oldValue: string) {
		if (newValue === oldValue) return;
		this._searchValue = newValue;
	}

	private get currentOptions(): ISelectMultiOptions | undefined {
		if (!isEmpty(this.filteredOptions)) {
			return this.filteredOptions;
		}

		return this.options;
	}

	private onClearSelection = () => {
		this.selectionCleared.emit();
	};

	private onSelectedOptionsChange = ({ detail: newOptions }: CustomEvent<Record<string, boolean>>) => {
		this.optionsSelected.emit(newOptions);
	};

	private renderGroups = (groupNames: string[], groups: Record<string, ISelectMultiOption[]>) => {
		return groupNames.map(groupName => (
			<kv-select-group key={groupName} label={groupName}>
				{this.renderOptions(groups[groupName])}
			</kv-select-group>
		));
	};

	private renderOptions = (options: ISelectMultiOption[]) => {
		return options.map(option => <kv-select-option-multi-level option={option} selectedOptions={this.selectedOptions} onOptionSelected={this.onSelectedOptionsChange} />);
	};

	render() {
		const currentOptions = this.currentOptions;
		const groups = buildSelectGroups(currentOptions);
		const groupNames = Object.keys(groups);
		const isSelectionClearable = !isEmpty(currentOptions) && this.selectionClearable;
		const isSelectionClearEnabled = Object.keys(this.selectedOptions ?? {}).length > 0;

		return (
			<kv-select
				maxHeight={this.maxHeight}
				minHeight={this.minHeight}
				searchable={this.searchable}
				searchValue={this._searchValue}
				selectionClearable={isSelectionClearable}
				selectionClearEnabled={isSelectionClearEnabled}
				searchPlaceholder={this.searchPlaceholder}
				clearSelectionLabel={this.clearSelectionLabel}
				onClearSelection={this.onClearSelection}
			>
				<slot name="header-actions" slot="select-header-actions" />
				{isEmpty(currentOptions) && this.noDataAvailableLabel && (
					<slot name="no-data-available">
						<kv-select-option class="no-data" label={this.noDataAvailableLabel} value="no-data-available" />
					</slot>
				)}
				{hasGroups(groupNames) ? this.renderGroups(groupNames, groups) : this.renderOptions(Object.values(currentOptions ?? {}))}
			</kv-select>
		);
	}
}
