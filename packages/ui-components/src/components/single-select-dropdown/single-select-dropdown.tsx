import { Component, Element, Event, EventEmitter, Host, Method, Prop, State, Watch, h } from '@stencil/core';
import { EIconName, EOtherIconName } from '../icon/icon.types';
import { EValidationState, ITextField } from '../text-field/text-field.types';
import { ISingleSelectDropdown, ISingleSelectDropdownEvents, ISelectSingleOptions } from './single-select-dropdown.types';

import { EMPTY_STRING, INVALID_VALUE_ERROR, MINIMUM_SEARCHABLE_OPTIONS, SINGLE_SELECT_CLEAR_SELECTION_LABEL } from './single-select-dropdown.config';
import { CustomCssClass, EComponentSize, IIllustrationMessage, ISelectOption } from '../../types';
import { getClassMap } from '../../utils/css-class.helper';
import { getCssStyle } from '../utils';
import { ComputePositionConfig } from '@floating-ui/dom';
import { buildSingleSelectOptions, getDropdownCustomCss, getDropdownDisplayIcon } from './single-select-dropdown.helper';
import { getFlattenSelectOptions } from '../../utils/select.helper';
import { DEFAULT_DROPDOWN_Z_INDEX } from '../../globals/config';
import { merge } from 'lodash-es';

/**
 * @part select - The select container.
 */
@Component({
	tag: 'kv-single-select-dropdown',
	styleUrl: 'single-select-dropdown.scss',
	shadow: false
})
export class KvSingleSelectDropdown implements ISingleSelectDropdown, ISingleSelectDropdownEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) placeholder: string;
	/** @inheritdoc */
	@Prop({ reflect: true, mutable: true }) isOpen?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) loading?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) icon?: EIconName | EOtherIconName;
	/** @inheritdoc */
	@Prop({ reflect: true }) required?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) label?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) displayValue?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) displayPrefix?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) badge?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) errorState?: EValidationState = EValidationState.None;
	/** @inheritdoc */
	@Prop({ reflect: true }) helpText?: string | string[] = [];
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) inputSize?: EComponentSize = EComponentSize.Large;
	/** @inheritdoc */
	@Prop({ reflect: false }) dropdownOptions: Partial<ComputePositionConfig>;
	/** @inheritdoc */
	@Prop({ reflect: true }) customClass?: CustomCssClass = '';
	/** @inheritdoc */
	@Prop({ reflect: true }) clickOutsideClose?: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: false }) actionElement?: HTMLElement | null = null;
	/** @inheritdoc */
	@Prop({ reflect: true }) options?: ISelectSingleOptions = {};
	/** @inheritdoc */
	@Prop({ reflect: true }) selectedOption?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) filteredOptions?: ISelectSingleOptions;
	/** @inheritdoc */
	@Prop({ reflect: true }) noDataAvailableConfig?: IIllustrationMessage;
	/** @inheritdoc */
	@Prop({ reflect: true }) noResultsFoundConfig?: IIllustrationMessage;
	/** @inheritdoc */
	@Prop({ reflect: true }) searchable?: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: true }) searchPlaceholder?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) selectionClearable?: boolean;
	/** @inheritdoc */
	@Prop({ reflect: true }) clearSelectionLabel?: string = SINGLE_SELECT_CLEAR_SELECTION_LABEL;
	/** @inheritdoc */
	@Prop({ reflect: true }) minHeight?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) maxHeight?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) minWidth?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) maxWidth?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) selectionAll?: boolean;
	/** @inheritdoc */
	@Prop({ reflect: true }) selectAllLabel?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) counter?: boolean;
	/** @inheritdoc */
	@Prop({ reflect: true }) minSearchOptions?: number = MINIMUM_SEARCHABLE_OPTIONS;
	/** @inheritdoc */
	@Prop({ reflect: true }) shortcuts?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: false }) zIndex?: number = DEFAULT_DROPDOWN_Z_INDEX;
	/** @inheritdoc */
	@Prop({ reflect: true }) canAddItems?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) createInputPlaceholder?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) createOptionPlaceholder?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) inputConfig?: Partial<ITextField>;
	/** @inheritdoc */
	@Prop({ reflect: true }) autoFocus?: boolean = true; // eslint-disable-line @stencil-community/reserved-member-names

	/** @inheritdoc */
	@Event() optionSelected: EventEmitter<string>;
	/** @inheritdoc */
	@Event() searchChange: EventEmitter<string>;
	/** @inheritdoc */
	@Event() clearSelection: EventEmitter<void>;
	/** @inheritdoc */
	@Event() dismiss: EventEmitter<void>;
	/** @inheritdoc */
	@Event() clickOutside: EventEmitter<void>;
	/** @inheritdoc */
	@Event() optionCreated: EventEmitter<string>;
	/** @inheritdoc */
	@Event({ bubbles: false }) openStateChange: EventEmitter<boolean>;

	@State() _searchValue: string;
	@State() _selectionDisplayValue: string | undefined;

	/** The Host's element reference */
	@Element() el: HTMLKvSingleSelectDropdownElement;

	@State() selectOptions: {
		total: Record<string, ISelectOption>;
		filtered: Record<string, ISelectOption>;
		flatten: Record<string, ISelectOption>;
	};
	@State() highlightedOption?: string;

	@Watch('options')
	optionsChangeHandler() {
		this.buildSelectionOptions();
		this.calculateLabelValue();
	}

	@Watch('selectedOption')
	selectedOptionChangeHandler() {
		this.validateSelectedOptionValue();
		this.calculateLabelValue();
	}

	@Watch('displayValue')
	displayValueChangeHandler() {
		this.calculateLabelValue();
	}

	@Watch('filteredOptions')
	filterOptionsChangeHandler() {
		this.buildSelectionOptions();
	}

	/** Focuses the search text field */
	@Method()
	async focusSearch() {
		this.selectRef?.focusSearch();
	}

	componentWillLoad() {
		this.validateSelectedOptionValue();
		this.buildSelectionOptions();
		this.calculateLabelValue();
	}

	private selectRef?: HTMLKvSelectMultiOptionsElement | null;

	private onOptionSelected = (event: CustomEvent<string>): void => {
		event.stopPropagation();
		const { detail: selectedOptionKey } = event;
		this.selectOption(selectedOptionKey);
		this.highlightedOption = selectedOptionKey;
	};

	private onDismiss = (): void => {
		this.setOpenState(false);
		this.dismiss.emit();
	};

	private onSearchChange = ({ detail: searchTerm }: CustomEvent<string>) => {
		this.setSearch(searchTerm);
	};

	private onOpenStateChange = ({ detail: state }: CustomEvent<boolean>) => {
		this.setOpenState(state);
	};

	private onClearSelection = (): void => {
		this.optionSelected.emit(undefined);
		this.clearSelection.emit();
		this.calculateLabelValue();
	};

	private onOptionCreated = ({ detail: newOptionKey }: CustomEvent<string>): void => {
		this.optionCreated.emit(newOptionKey);
	};

	private selectOption = (selectedOption: string) => {
		this.optionSelected.emit(selectedOption);
		this.setOpenState(false);
	};

	private focusSearchInput = () => {
		setTimeout(() => this.selectRef?.focusSearch());
	};

	private setOpenState = (state: boolean) => {
		if (state) {
			if (this.autoFocus) {
				this.focusSearchInput();
			}
		} else {
			this.setSearch('');
			this.closeCreatePopup();
		}

		this.highlightedOption = undefined;
		this.isOpen = state;
		this.openStateChange.emit(state);
		this.clearHighlightedOption();
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

	private getInputConfig = (): Partial<ITextField> => {
		return merge({}, this.inputConfig, {
			label: this.label,
			value: this._selectionDisplayValue,
			valuePrefix: this.displayPrefix,
			loading: this.loading,
			inputDisabled: this.disabled,
			inputRequired: this.required,
			placeholder: this.placeholder,
			state: this.errorState,
			helpText: this.helpText,
			size: this.inputSize,
			badge: this.badge,
			isDirty: this.selectedOption && this.options && this.options[this.selectedOption]?.isDirty,
			icon: getDropdownDisplayIcon(this.selectedOption, this.selectOptions.flatten) ?? this.icon,
			customStyle: getDropdownCustomCss(this.selectedOption, this.selectOptions.flatten)
		});
	};

	private clearHighlightedOption = (): void => {
		this.selectRef?.clearHighlightedOption();
	};

	private closeCreatePopup = (): void => {
		this.selectRef?.closeCreatePopup();
	};

	private calculateLabelValue = (): void => {
		if (this.displayValue?.length) {
			this._selectionDisplayValue = this.displayValue;
			return;
		}

		if (this.selectedOption && this.selectOptions?.flatten[this.selectedOption]) {
			this._selectionDisplayValue = this.selectOptions.flatten[this.selectedOption].label;
			return;
		}

		this._selectionDisplayValue = undefined;
	};

	private validateSelectedOptionValue = (): void => {
		if (this.selectedOption === EMPTY_STRING) {
			throw new Error(INVALID_VALUE_ERROR);
		}
	};

	private buildSelectionOptions = (): void => {
		const selectOptions = buildSingleSelectOptions(this.options);
		const filteredSelectOptions = this.filteredOptions ? buildSingleSelectOptions(this.filteredOptions) : undefined;
		const selectFlattenOptions = getFlattenSelectOptions(selectOptions);
		this.selectOptions = {
			total: selectOptions,
			filtered: filteredSelectOptions,
			flatten: selectFlattenOptions
		};
	};

	private get selectedOptions(): Record<string, boolean> | undefined {
		return this.selectedOption ? { [this.selectedOption]: true } : {};
	}

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
					isOpen={this.isOpen}
					onOpenStateChange={this.onOpenStateChange}
					disabled={this.disabled}
					options={this.dropdownOptions}
					clickOutsideClose={this.clickOutsideClose}
					actionElement={this.actionElement}
					zIndex={this.zIndex}
				>
					<slot name="right-slot" slot="right-slot" />
					<slot name="left-slot" slot="left-slot" />
					<slot name="dropdown-action" slot="dropdown-action" />
					<div class={{ ...getClassMap(this.customClass), 'single-select-dropdown-slot': true }}>
						<kv-select-multi-options
							ref={element => (this.selectRef = element)}
							options={this.selectOptions.total}
							filteredOptions={this.selectOptions.filtered}
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
							createInputPlaceholder={this.createInputPlaceholder}
							createOptionPlaceholder={this.createOptionPlaceholder}
							maxHeight={this.getMaxHeight()}
							minHeight={this.getMinHeight()}
							maxWidth={this.getMaxWidth()}
							minWidth={this.getMinWidth()}
							counter={this.counter}
							shortcuts={this.isOpen && this.shortcuts}
							onSearchChange={this.onSearchChange}
							onClearSelection={this.onClearSelection}
							onOptionSelected={this.onOptionSelected}
							onOptionCreated={this.onOptionCreated}
							onDismiss={this.onDismiss}
							canAddItems={this.canAddItems}
							exportparts="select"
						>
							<slot name="create-new-option" slot="create-new-option" />
							<slot name="select-header-actions" slot="select-header-actions" />
							<slot name="select-header-label" slot="select-header-label" />
							<slot name="no-data-available" slot="no-data-available" />
							<slot name="no-results-found" slot="no-results-found" />
						</kv-select-multi-options>
						<slot />
					</div>
				</kv-dropdown>
			</Host>
		);
	}
}
