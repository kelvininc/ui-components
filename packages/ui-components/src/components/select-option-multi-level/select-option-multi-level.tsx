import { Component, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { ISelectMultiOption } from '../select-multi-options/select-multi-options.types';
import { LEVEL_OFFSET_PX } from './select-option-multi-level.config';
import { ELevelState, ISelectOptionMultiLevel, ISelectOptionMultiLevelEvents } from './select-option-multi-level.types';
import { calculateLevelState, getAllChildrenValues } from './select-option-multi-level.helper';
import { isEmpty, isEqual } from 'lodash';

@Component({
	tag: 'kv-select-option-multi-level',
	styleUrl: 'select-option-multi-level.scss',
	shadow: true
})
export class KvSelectOptionMultiLevel implements ISelectOptionMultiLevel, ISelectOptionMultiLevelEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) option: ISelectMultiOption;
	/** @inheritdoc */
	@Prop({ reflect: true }) selectedOptions: Record<string, boolean> = {};
	/** @inheritdoc */
	@Prop({ reflect: true }) level = 0;

	/** @inheritdoc */
	@Event() optionSelected: EventEmitter<Record<string, boolean>>;
	/** @inheritdoc */
	@Event() optionLevelStateChange: EventEmitter<ELevelState>;

	@State() _childrenLevelStates: Record<string, ELevelState> = {};
	@State() _levelState: ELevelState;

	@Watch('selectedOptions')
	selectedOptionsWatcher(newValue: Record<string, boolean>, oldValue: Record<string, boolean>) {
		if (isEqual(newValue, oldValue)) return;
		// This approach requires all groups to calculate their state every time any item is selected.
		this.updateLevelState(newValue);
	}

	get children() {
		return this.hasChildren ? Object.values(this.option.children) : [];
	}
	get hasChildren() {
		return !isEmpty(this.option.children);
	}

	private updateLevelState = (selectedOptions: Record<string, boolean>) => {
		if (this.hasChildren) {
			this._levelState = calculateLevelState(this.children, selectedOptions, this._childrenLevelStates);
			//Level state change must be emitted after selected options are updated
			setTimeout(() => this.optionLevelStateChange.emit(this._levelState));
		}
	};

	private onOptionSelection = (option: string) => {
		const { [option]: isSelected, ...newOptions } = this.selectedOptions;

		if (!isSelected) {
			newOptions[option] = true;
		}

		this.optionSelected.emit(newOptions);
	};

	private onLevelSelection = () => {
		const childrenIds = getAllChildrenValues(this.option.children);
		let childSelected = true;

		if ([ELevelState.Selected, ELevelState.Indeterminate].includes(this._levelState)) {
			childSelected = false;
		}

		const newSelectedItems = {
			...this.selectedOptions,
			...childrenIds.reduce((acc, childId) => {
				acc[childId] = childSelected;
				return acc;
			}, {})
		};

		this.optionSelected.emit({
			...Object.entries(newSelectedItems).reduce((acc, [key, selected]) => {
				if (selected) {
					acc[key] = true;
				}
				return acc;
			}, {})
		});
	};

	private onItemSelected = ({ detail: option }: CustomEvent<string>) => {
		return this.hasChildren ? this.onLevelSelection() : this.onOptionSelection(option);
	};

	private onChildLevelStateChange = (event: CustomEvent<ELevelState>, child: ISelectMultiOption) => {
		const { detail: newState } = event;
		this._childrenLevelStates[child.value] = newState;
		this.updateLevelState(this.selectedOptions);
	};

	componentDidLoad() {
		this.updateLevelState(this.selectedOptions);
	}

	render() {
		return (
			<Host>
				<kv-select-option
					exportparts="option-container,checkbox"
					label={this.option.label}
					value={this.option.value}
					disabled={this.option.disabled}
					selected={!this.hasChildren ? this.selectedOptions?.[this.option.value] : this._levelState === ELevelState.Selected}
					indeterminate={this._levelState === ELevelState.Indeterminate}
					togglable={true}
					class={{ level: this.hasChildren }}
					style={{ '--level-padding-offset': `${LEVEL_OFFSET_PX * this.level}px` }}
					onItemSelected={this.onItemSelected}
				>
					{this.hasChildren && (
						<div slot="host-bottom-slot">
							{this.children.map(childOption => (
								<kv-select-option-multi-level
									level={this.level + 1}
									option={childOption}
									selectedOptions={this.selectedOptions}
									onOptionLevelStateChange={(event: CustomEvent<ELevelState>) => this.onChildLevelStateChange(event, childOption)}
								/>
							))}
						</div>
					)}
				</kv-select-option>
			</Host>
		);
	}
}
