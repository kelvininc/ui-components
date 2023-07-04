import { Component, Element, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { ILabelsDropdown, ILabelsDropdownEvents } from './labels-dropdown.types';
import { getFlattenedOptionsMap, getTextFieldConfig, setOverflowingLabels } from './labels-dropdown.helper';
import { isEmpty, isEqual, isNil } from 'lodash';
import { EIconName, ISelectMultiOptions } from '../../types';

@Component({
	tag: 'kv-labels-dropdown',
	styleUrl: 'labels-dropdown.scss',
	shadow: false
})
export class KvLabelsDropdown implements ILabelsDropdown, ILabelsDropdownEvents {
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
	@Event() selectAll: EventEmitter<void>;
	/** @inheritdoc */
	@Event() selectionCleared: EventEmitter<void>;

	@Element() el: HTMLKvLabelsDropdownElement;

	@Watch('options')
	optionsWatcher(newValue: Record<string, boolean>, oldValue: Record<string, boolean>) {
		if (isEqual(newValue, oldValue)) return;
		this.flattenedOptionsHash = getFlattenedOptionsMap(this.options);
	}

	@Watch('searchValue')
	searchValueWatcher(newValue: string, oldValue: string) {
		if (newValue === oldValue) return;
		this._searchValue = newValue;
	}

	private dropdownElRef: HTMLKvDropdownElement;
	private flattenedOptionsHash = getFlattenedOptionsMap(this.options);

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

	private onSelectAll = () => {
		this.selectAll.emit();
	};

	private onSelectionClear = () => {
		this.selectionCleared.emit();
	};

	private isEmptySearch = () => {
		return !isNil(this.filteredOptions) && isEmpty(this.filteredOptions);
	};

	componentDidRender() {
		this._overflowingLabelsCounter = setOverflowingLabels(this.dropdownElRef);
	}

	render() {
		const optionsLength = Object.keys(this.flattenedOptionsHash).length;
		const selectedOptionsLength = Object.keys(this.selectedOptions).length;

		const selectAllDisabled = this.isEmptySearch() || optionsLength === selectedOptionsLength;
		const clearAllDisabled = this.isEmptySearch() || selectedOptionsLength === 0;
		const selectedItemsCounterLabel = `${selectedOptionsLength}/${optionsLength}`;

		return (
			<Host>
				<kv-dropdown
					isOpen={this._isOpen}
					inputConfig={getTextFieldConfig(isEmpty(this.selectedOptions))}
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
						options={this.filteredOptions || this.options}
						selectedOptions={this.selectedOptions}
						noDataAvailableLabel={this.noDataAvailableLabel}
						searchable={this.searchable}
						searchValue={this._searchValue}
						minHeight={this.minHeight}
						maxHeight={this.maxHeight}
						onSearchChange={({ detail }) => this.searchChange.emit(detail)}
						onOptionsSelected={({ detail }) => this.optionsSelected.emit(detail)}
					>
						<div slot="header-actions" class="header-actions">
							<div class="actions">
								<div
									class={{
										'action-label': true,
										'disabled': selectAllDisabled
									}}
									onClick={this.onSelectAll}
								>
									Select all
								</div>
								<div class="action-separator" />
								<div
									class={{
										'action-label': true,
										'disabled': clearAllDisabled
									}}
									onClick={this.onSelectionClear}
								>
									Clear all
								</div>
							</div>
							<div class="selected-items-counter">Selected: {selectedItemsCounterLabel}</div>
						</div>
						<slot name="no-data-available" slot="no-data-available"></slot>
					</kv-select-multi-options>
				</kv-dropdown>
			</Host>
		);
	}
}
