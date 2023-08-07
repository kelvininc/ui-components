import { Component, Element, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { ILabelsDropdown } from './labels-dropdown.types';
import { getTextFieldConfig, setOverflowingLabels } from './labels-dropdown.helper';
import { isEmpty, isEqual } from 'lodash';
import { EIconName, ISelectMultiOptions, ISelectMultiOptionsEvents } from '../../types';
import { getSelectableOptions, getSelectedSelectableOptions } from '../../utils/select.helper';

@Component({
	tag: 'kv-labels-dropdown',
	styleUrl: 'labels-dropdown.scss',
	shadow: false
})
export class KvLabelsDropdown implements ILabelsDropdown, ISelectMultiOptionsEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) isOpen?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) options?: ISelectMultiOptions = {};
	/** @inheritdoc */
	@Prop({ reflect: true }) selectedOptions?: Record<string, boolean> = {};
	/** @inheritdoc */
	@Prop({ reflect: true }) filteredOptions?: ISelectMultiOptions;
	/** @inheritdoc */
	@Prop({ reflect: true }) noDataAvailableLabel?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) searchable?: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: true }) searchValue?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) minHeight?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) maxHeight?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) selectionClearable?: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: true }) clearSelectionLabel?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) selectionAll?: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: true }) selectAllLabel?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) counter?: boolean = true;

	@State() _isOpen = this.isOpen;
	@State() _searchValue = this.searchValue;
	@State() _overflowingLabelsCounter: number = 0;

	@Watch('isOpen')
	isOpenWatcher(newValue: boolean, oldValue: boolean) {
		if (newValue === oldValue) return;
		this._isOpen = newValue;
	}

	/** @inheritdoc */
	@Event() optionsSelected: EventEmitter<Record<string, boolean>>;
	/** @inheritdoc */
	@Event() searchChange: EventEmitter<string>;
	/** @inheritdoc */
	@Event() clearSelection: EventEmitter<void>;
	/** @inheritdoc */
	@Event() selectAll: EventEmitter<void>;

	@Element() el: HTMLKvLabelsDropdownElement;

	@Watch('options')
	optionsWatcher(newValue: Record<string, boolean>, oldValue: Record<string, boolean>) {
		if (isEqual(newValue, oldValue)) return;
		this.flattenedOptionsHash = getSelectableOptions(this.options);
	}

	@Watch('searchValue')
	searchValueWatcher(newValue: string, oldValue: string) {
		if (newValue === oldValue) return;
		this._searchValue = newValue;
	}

	private dropdownElRef: HTMLKvDropdownElement;
	private flattenedOptionsHash = getSelectableOptions(this.options);

	private onDropdownMount = (dropdownEl: HTMLKvDropdownElement) => {
		this.dropdownElRef = dropdownEl;
	};

	private onOpenStateChange = ({ detail: isOpen }: CustomEvent<boolean>) => {
		this._isOpen = isOpen;

		if (!this._isOpen) {
			this._searchValue = '';
			this.searchChange.emit('');
		}
	};

	private renderSelectedOptionsLabels = (): HTMLKvLabelsDropdownInputItemElement[] => {
		return Object.keys(this.selectedOptions)
			.filter(value => this.selectedOptions[value])
			.map(value => {
				const selectedOption = this.flattenedOptionsHash[value];
				if (selectedOption) {
					const { label } = selectedOption;
					return <kv-labels-dropdown-input-item key={value} value={value} label={label} icon={EIconName.Close} selected={true} onItemClick={this.onOptionRemove} />;
				}
			});
	};

	private onOptionRemove = ({ detail }: CustomEvent<string>) => {
		const { [detail]: unselectedOption, ...newOptions } = this.selectedOptions;
		this.optionsSelected.emit(newOptions);
	};

	private onSelectAll = (event: CustomEvent<void>) => {
		event.stopPropagation();
		this.selectAll.emit();
	};

	private onClearSelection = (event: CustomEvent<void>) => {
		event.stopPropagation();
		this.clearSelection.emit();
	};

	componentDidRender() {
		this._overflowingLabelsCounter = setOverflowingLabels(this.dropdownElRef);
	}

	render() {
		const selectedSelectOptions = getSelectedSelectableOptions(this.options, this.selectedOptions);

		return (
			<Host>
				<kv-dropdown
					isOpen={this._isOpen}
					inputConfig={getTextFieldConfig(isEmpty(selectedSelectOptions))}
					onOpenStateChange={this.onOpenStateChange}
					ref={this.onDropdownMount}
				>
					<div class="selected-labels-container" slot="input-content">
						<div class="selected-labels" onClick={e => e.stopPropagation()}>
							{this.renderSelectedOptionsLabels()}
						</div>
						{this._overflowingLabelsCounter > 0 && <div class="overflowing-counter">+{this._overflowingLabelsCounter}</div>}
					</div>
					<kv-select-multi-options
						options={this.options}
						filteredOptions={this.filteredOptions}
						selectedOptions={this.selectedOptions}
						noDataAvailableLabel={this.noDataAvailableLabel}
						searchable={this.searchable}
						searchValue={this._searchValue}
						minHeight={this.minHeight}
						maxHeight={this.maxHeight}
						onSearchChange={({ detail }) => this.searchChange.emit(detail)}
						onOptionsSelected={({ detail }) => this.optionsSelected.emit(detail)}
						selectionAll={this.selectionAll}
						selectAllLabel={this.selectAllLabel}
						selectionClearable={this.selectionClearable}
						clearSelectionLabel={this.clearSelectionLabel}
						counter={this.counter}
						onSelectAll={this.onSelectAll}
						onClearSelection={this.onClearSelection}
					>
						<slot name="select-header-actions" slot="select-header-actions" />
						<slot name="select-header-label" slot="select-header-label" />
						<slot name="no-data-available" slot="no-data-available" />
					</kv-select-multi-options>
				</kv-dropdown>
			</Host>
		);
	}
}
