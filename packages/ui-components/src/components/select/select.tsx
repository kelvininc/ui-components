import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
import { SELECT_CLEAR_SELECTION_LABEL } from './select.config';
import { ISelect, ISelectEvents } from './select.types';

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
	@Event() searchChange: EventEmitter<string>;
	/** @inheritdoc */
	@Event() clearSelection: EventEmitter<void>;

	private onSearchChange = (event: CustomEvent<string>) => {
		this.searchChange.emit(event.detail);
	};

	private onClearSelection = () => {
		this.clearSelection.emit();
	};

	render() {
		return (
			<Host>
				<div class="select-container">
					{(this.searchable || this.selectionClearable) && (
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