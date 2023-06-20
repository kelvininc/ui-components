import { Component, Host, h, Prop, Event, EventEmitter, Element } from '@stencil/core';
import { isNil, omitBy } from 'lodash-es';
import { SELECT_CLEAR_SELECTION_LABEL } from './select.config';
import { ISelect, ISelectEvents } from './select.types';

/**
 * @part select - The select container.
 */
@Component({
	tag: 'kv-select',
	styleUrl: 'select.scss',
	shadow: true
})
export class KvSelect implements ISelect, ISelectEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) searchable?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) searchValue?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) selectionClearable?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) searchPlaceholder?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) selectionClearEnabled?: boolean;
	/** @inheritdoc */
	@Prop({ reflect: true }) clearSelectionLabel?: string = SELECT_CLEAR_SELECTION_LABEL;
	/** @inheritdoc */
	@Prop({ reflect: true }) minHeight?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) maxHeight?: string;

	/** @inheritdoc */
	@Event() searchChange: EventEmitter<string>;
	/** @inheritdoc */
	@Event() clearSelection: EventEmitter<void>;

	@Element() el: HTMLKvSelectElement;

	private onSearchChange = (event: CustomEvent<string>) => {
		this.searchChange.emit(event.detail);
	};

	private onClearSelection = () => {
		this.clearSelection.emit();
	};

	private get customStyle() {
		return omitBy(
			{
				'--select-max-height': this.maxHeight,
				'--select-min-height': this.minHeight
			},
			isNil
		);
	}

	private get hasActionsSlot() {
		return !isNil(this.el.querySelector('[slot="select-header-actions"]'));
	}

	render() {
		return (
			<Host style={this.customStyle}>
				<div class="select-container" part="select">
					{(this.searchable || this.selectionClearable || this.hasActionsSlot) && (
						<div class="select-header-container">
							{this.searchable && <kv-search value={this.searchValue} placeholder={this.searchPlaceholder} onTextChange={this.onSearchChange} />}
							{this.selectionClearable && (
								<div
									class={{
										'selection-clear': true,
										'disabled': !this.selectionClearEnabled
									}}
									onClick={this.onClearSelection}
								>
									{this.clearSelectionLabel}
								</div>
							)}
							<slot name="select-header-actions" />
						</div>
					)}
					<div class="select-options-container">
						<slot></slot>
					</div>
				</div>
			</Host>
		);
	}
}
