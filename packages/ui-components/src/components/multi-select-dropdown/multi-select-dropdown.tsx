import { Component, Element, Event, EventEmitter, Host, Method, Prop, State, Watch, h } from '@stencil/core';
import { EIconName, EOtherIconName } from '../icon/icon.types';
import { EValidationState, ITextField } from '../text-field/text-field.types';
import { IMultiSelectDropdown, IMultiSelectDropdownEvents } from './multi-select-dropdown.types';

import { MINIMUM_SEARCHABLE_OPTIONS } from './multi-select-dropdown.config';
import { getBadgeLabelValue, getDropdownDisplayValue } from './multi-select-dropdown.helper';
import { CustomCssClass, EComponentSize, IIllustrationMessage } from '../../types';
import { getCssStyle } from '../utils';
import { ISelectMultiOptions } from '../select-multi-options/select-multi-options.types';
import { getClassMap } from '../../utils/css-class.helper';
import { ComputePositionConfig } from '@floating-ui/dom';
import { DEFAULT_DROPDOWN_Z_INDEX } from '../../globals/config';
import { merge } from 'lodash-es';

@Component({
	tag: 'kv-multi-select-dropdown',
	styleUrl: 'multi-select-dropdown.scss',
	shadow: false
})
export class KvMultiSelectDropdown implements IMultiSelectDropdown, IMultiSelectDropdownEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) placeholder?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) loading?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) icon?: EIconName | EOtherIconName;
	/** @inheritdoc */
	@Prop({ reflect: true }) searchable?: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: true }) searchPlaceholder?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) selectionClearable?: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: true }) clearSelectionLabel?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) required?: boolean;
	/** @inheritdoc */
	@Prop({ reflect: true }) label?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) displayValue?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) displayPrefix?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) badge?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) errorState?: EValidationState;
	/** @inheritdoc */
	@Prop({ reflect: true }) helpText?: string | string[] = [];
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled?: boolean;
	/** @inheritdoc */
	@Prop({ reflect: true }) noDataAvailableConfig?: IIllustrationMessage;
	/** @inheritdoc */
	@Prop({ reflect: true }) noResultsFoundConfig?: IIllustrationMessage;
	/** @inheritdoc */
	@Prop({ reflect: true }) options?: ISelectMultiOptions = {};
	/** @inheritdoc */
	@Prop({ reflect: true }) selectedOptions?: Record<string, boolean> = {};
	/** @inheritdoc */
	@Prop({ reflect: true }) filteredOptions?: ISelectMultiOptions;
	/** @inheritdoc */
	@Prop({ reflect: true }) minHeight?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) maxHeight?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) minWidth?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) maxWidth?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) inputSize?: EComponentSize = EComponentSize.Large;
	/** @inheritdoc */
	@Prop({ reflect: true }) customClass?: CustomCssClass = '';
	/** @inheritdoc */
	@Prop({ reflect: false }) dropdownOptions: Partial<ComputePositionConfig>;
	/** @inheritdoc */
	@Prop({ reflect: false }) selectionAll: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: false }) selectAllLabel: string;
	/** @inheritdoc */
	@Prop({ reflect: false }) counter: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: true }) minSearchOptions?: number = MINIMUM_SEARCHABLE_OPTIONS;
	/** @inheritdoc */
	@Prop({ reflect: true }) shortcuts?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) clickOutsideClose?: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: false }) actionElement?: HTMLElement | null = null;
	/** @inheritdoc */
	@Prop({ reflect: false }) zIndex?: number = DEFAULT_DROPDOWN_Z_INDEX;
	/** @inheritdoc */
	@Prop({ reflect: true }) inputConfig?: Partial<ITextField>;
	/** @inheritdoc */
	@Prop({ reflect: true }) autoFocus?: boolean = true;

	/** @inheritdoc */
	@Event() optionsSelected: EventEmitter<Record<string, boolean>>;
	/** @inheritdoc */
	@Event() searchChange: EventEmitter<string>;
	/** @inheritdoc */
	@Event() clearSelection: EventEmitter<void>;
	/** @inheritdoc */
	@Event() selectAll: EventEmitter<void>;
	/** @inheritdoc */
	@Event() dismiss: EventEmitter<void>;
	/** @inheritdoc */
	@Event() clickOutside: EventEmitter<void>;
	/** @inheritdoc */
	@Event({ bubbles: false }) openStateChange: EventEmitter<boolean>;

	@State() _selectionDisplayValue: string | undefined;
	@State() _searchValue: string;
	@State() _badgeLabel: string | undefined = this.badge;
	@State() _isOpen: boolean = false;

	/** The Host's element reference */
	@Element() el: HTMLKvMultiSelectDropdownElement;

	@Watch('badge')
	badgeChangeHandler() {
		this.calculateBadgeValue();
	}

	@Watch('options')
	@Watch('selectedOptions')
	@Watch('displayValue')
	labelValueHandler() {
		this.calculateLabelValue();
		this.calculateBadgeValue();
	}

	/** Focuses the search text field */
	@Method()
	async focusSearch() {
		this.selectRef?.focusSearch();
	}

	componentWillLoad() {
		this.calculateLabelValue();
		this.calculateBadgeValue();
	}

	private selectRef?: HTMLKvSelectMultiOptionsElement | null;

	private onOptionsSelected = ({ detail: newOptions }: CustomEvent<Record<string, boolean>>): void => {
		this.optionsSelected.emit(newOptions);
	};

	private onSearchChange = ({ detail: searchValue }: CustomEvent<string>): void => {
		this.setSearch(searchValue);
	};

	private onClearSelection = (event: CustomEvent<void>): void => {
		event.stopPropagation();

		this.clearSelection.emit();
		this.calculateLabelValue();
	};

	private onSelectAll = (event: CustomEvent<void>): void => {
		event.stopPropagation();
		this.selectAll.emit();
		this.calculateLabelValue();
	};

	private onDismiss = (): void => {
		this.setOpenState(false);
		this.dismiss.emit();
	};

	private onOpenStateChange = ({ detail: state }: CustomEvent<boolean>): void => {
		this.setOpenState(state);
	};

	private setOpenState = (state: boolean): void => {
		if (state) {
			if (this.autoFocus) {
				this.focusSearchInput();
			}
		} else {
			this.setSearch('');
		}

		this.clearHighlightedOption();
		this._isOpen = state;
	};

	private setSearch = (searchTerm: string): void => {
		this._searchValue = searchTerm;
		this.searchChange.emit(searchTerm);
	};

	private getMaxHeight() {
		const maxHeight = getCssStyle(this.el, '--dropdown-max-height');
		return this.maxHeight ?? maxHeight;
	}

	private getMinHeight() {
		const minHeight = getCssStyle(this.el, '--dropdown-min-height');
		return this.minHeight ?? minHeight;
	}

	private getMaxWidth() {
		const maxWidth = getCssStyle(this.el, '--dropdown-max-width');
		return this.maxWidth ?? maxWidth;
	}

	private getMinWidth() {
		const minWidth = getCssStyle(this.el, '--dropdown-min-width');
		return this.minWidth ?? minWidth;
	}

	private clearHighlightedOption = (): void => {
		this.selectRef?.clearHighlightedOption();
	};

	private calculateLabelValue = (): void => {
		if (this.displayValue?.length) {
			this._selectionDisplayValue = this.displayValue;
		} else {
			this._selectionDisplayValue = getDropdownDisplayValue(this.options, this.selectedOptions);
		}
	};

	private calculateBadgeValue = (): void => {
		if (this.badge?.length) {
			this._badgeLabel = this.badge;
		} else {
			this._badgeLabel = getBadgeLabelValue(this.selectedOptions);
		}
	};

	private getInputConfig(): Partial<ITextField> {
		return merge({}, this.inputConfig, {
			label: this.label,
			value: this._selectionDisplayValue,
			valuePrefix: this.displayPrefix,
			loading: this.loading,
			icon: this.icon,
			inputDisabled: this.disabled,
			inputRequired: this.required,
			placeholder: this.placeholder,
			state: this.errorState,
			helpText: this.helpText,
			size: this.inputSize,
			badge: this._badgeLabel
		});
	}

	private focusSearchInput = () => {
		setTimeout(() => this.selectRef?.focusSearch());
	};

	connectedCallback() {
		if (this.autoFocus) {
			this.focusSearchInput();
		}
	}

	render() {
		return (
			<Host>
				<kv-dropdown
					inputConfig={this.getInputConfig()}
					isOpen={this._isOpen}
					onOpenStateChange={this.onOpenStateChange}
					disabled={this.disabled}
					options={this.dropdownOptions}
					clickOutsideClose={this.clickOutsideClose}
					actionElement={this.actionElement}
					zIndex={this.zIndex}
				>
					<slot name="dropdown-action" slot="dropdown-action" />
					<div class={getClassMap(this.customClass)}>
						<kv-select-multi-options
							ref={element => (this.selectRef = element)}
							options={this.options}
							filteredOptions={this.filteredOptions}
							selectedOptions={this.selectedOptions}
							noDataAvailableConfig={this.noDataAvailableConfig}
							noResultsFoundConfig={this.noResultsFoundConfig}
							searchable={this.searchable}
							minSearchOptions={this.minSearchOptions}
							searchValue={this._searchValue}
							selectionClearable={this.selectionClearable}
							clearSelectionLabel={this.clearSelectionLabel}
							selectionAll={this.selectionAll}
							selectAllLabel={this.selectAllLabel}
							searchPlaceholder={this.searchPlaceholder}
							maxHeight={this.getMaxHeight()}
							minHeight={this.getMinHeight()}
							maxWidth={this.getMaxWidth()}
							minWidth={this.getMinWidth()}
							counter={this.counter}
							shortcuts={this._isOpen && this.shortcuts}
							onSearchChange={this.onSearchChange}
							onClearSelection={this.onClearSelection}
							onOptionsSelected={this.onOptionsSelected}
							onSelectAll={this.onSelectAll}
							onDismiss={this.onDismiss}
							exportparts="select"
						>
							<slot name="select-header-actions" slot="select-header-actions" />
							<slot name="select-header-label" slot="select-header-label" />
							<slot name="no-data-available" slot="no-data-available" />
							<slot name="no-results-found" slot="no-results-found" />
						</kv-select-multi-options>
					</div>
				</kv-dropdown>
			</Host>
		);
	}
}
