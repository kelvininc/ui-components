import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';

@Component({
	tag: 'kv-dropdown-list',
	styleUrl: 'dropdown-list.scss',
	shadow: true
})
export class KvDropdownList {
	/** (optional) If `true` the list has a search text field */
	@Prop({ reflect: true }) searchable?: boolean = false;
	/** (optional) If `true` the list has an action to unselect all items */
	@Prop({ reflect: true }) selectionClearable?: boolean = false;
	/** (optional) The list search text field placeholder */
	@Prop({ reflect: true }) searchPlaceholder?: string;
	/** (optional) If `true` the list can be cleared */
	@Prop({ reflect: true }) selectionClearEnabled?: boolean;

	/** Emitted when the user interacts with the search text field */
	@Event() searchChange: EventEmitter<string>;
	/** Emitted when the user clears the selected items */
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
									Clear selected items
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
