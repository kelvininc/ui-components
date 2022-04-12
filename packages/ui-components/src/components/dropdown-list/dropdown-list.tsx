import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
import { DROPDOWN_LIST_CLEAR_SELECTION_LABEL } from './dropdown-list.config';
import { IDropdownList, IDropdownListEvents } from './dropdown-list.types';

@Component({
	tag: 'kv-dropdown-list',
	styleUrl: 'dropdown-list.scss',
	shadow: true
})
export class KvDropdownList implements IDropdownList, IDropdownListEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) searchable?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) selectionClearable?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) searchPlaceholder?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) selectionClearEnabled?: boolean;
	/** @inheritdoc */
	@Prop({ reflect: true }) clearSelectionLabel?: string = DROPDOWN_LIST_CLEAR_SELECTION_LABEL;

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
				<div class="dropdown-list-container">
					{(this.searchable || this.selectionClearable) && (
						<div class="dropdown-list-header-container">
							{this.searchable && <kv-search placeholder={this.searchPlaceholder} onTextChange={this.onSearchChange} />}
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
					<div class="dropdown-list-items-container">
						<slot></slot>
					</div>
				</div>
			</Host>
		);
	}
}
