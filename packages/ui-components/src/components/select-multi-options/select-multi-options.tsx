import { Component, Event, EventEmitter, Prop, State, Watch, h, Element } from '@stencil/core';
import { ISelectMultiOption, ISelectMultiOptions, ISelectMultiOptionsConfig, ISelectMultiOptionsEvents } from './select-multi-options.types';
import { buildSelectGroups, hasGroups } from '../select-group/select-group.helper';
import { DEFAULT_NO_DATA_AVAILABLE_LABEL } from './select-multi-options.config';
import { getFlattenedOptionsMap } from './select-multi-options.helper';

@Component({
	tag: 'kv-select-multi-options',
	styleUrl: 'select-multi-options.scss',
	shadow: true
})
export class KvSelectMultiOptions implements ISelectMultiOptionsConfig, ISelectMultiOptionsEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) options?: ISelectMultiOptions = {};
	/** @inheritdoc */
	@Prop({ reflect: true }) filteredOptions?: ISelectMultiOptions;
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
	@Prop({ reflect: true }) selectionAll?: boolean;
	/** @inheritdoc */
	@Prop({ reflect: true }) selectAllLabel?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) counter?: boolean;

	@Element() el: HTMLKvSelectMultiOptionsElement;

	/** @inheritdoc */
	@Event() optionsSelected: EventEmitter<Record<string, boolean>>;
	/** @inheritdoc */
	@Event() searchChange: EventEmitter<string>;
	/** @inheritdoc */
	@Event() clearSelection: EventEmitter<void>;
	/** @inheritdoc */
	@Event() selectAll: EventEmitter<void>;

	@State() _searchValue: string = this.searchValue;

	@Watch('searchValue')
	searchValueWatcher(newValue: string, oldValue: string) {
		if (newValue === oldValue) return;
		this._searchValue = newValue;
	}

	private get currentOptions(): ISelectMultiOptions | undefined {
		if (this.filteredOptions) {
			return this.filteredOptions;
		}

		return this.options;
	}

	private onSelectAll = (event: CustomEvent<void>) => {
		event.stopPropagation();
		this.selectAll.emit();
	};

	private onClearSelection = (event: CustomEvent<void>) => {
		event.stopPropagation();
		this.clearSelection.emit();
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
		const options = this.options ?? {};
		const currentOptions = this.currentOptions ?? {};
		const selectedOptions = this.selectedOptions ?? {};

		const optionsLength = Object.keys(getFlattenedOptionsMap(options)).length;
		const currentOptionsLength = Object.keys(getFlattenedOptionsMap(currentOptions)).length;
		const selectedOptionsLength = Object.keys(selectedOptions).filter(key => selectedOptions[key]).length;

		const groups = buildSelectGroups(currentOptions);
		const groupNames = Object.keys(groups);

		const areOptionsFiltered = currentOptionsLength < optionsLength;
		const isSelectionClearable = optionsLength > 0 && this.selectionClearable;
		const isSelectionClearEnabled = !areOptionsFiltered && selectedOptionsLength > 0;
		const isSelectAllAvailable = optionsLength > 0 && this.selectionAll;
		const isSelectAllEnabled = !areOptionsFiltered && selectedOptionsLength < optionsLength;

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
				selectionAll={isSelectAllAvailable}
				selectionAllEnabled={isSelectAllEnabled}
				selectAllLabel={this.selectAllLabel}
				onSelectAll={this.onSelectAll}
				onClearSelection={this.onClearSelection}
			>
				<slot name="header-actions" slot="header-actions" />
				<slot name="header-label" slot="header-label">
					{this.counter && <div class="selected-items-label">Selected: {`${selectedOptionsLength}/${optionsLength}`}</div>}
				</slot>
				{currentOptionsLength === 0 && this.noDataAvailableLabel && (
					<slot name="no-data-available">
						<kv-select-option class="no-data" label={this.noDataAvailableLabel} value="no-data-available" />
					</slot>
				)}
				{hasGroups(groupNames) ? this.renderGroups(groupNames, groups) : this.renderOptions(Object.values(currentOptions))}
			</kv-select>
		);
	}
}
