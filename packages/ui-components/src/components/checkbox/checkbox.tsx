import { Component, Event, EventEmitter, h, Host, Prop } from '@stencil/core';
import { EOtherIconName } from '../icon/icon.types';
import { ICheckbox, ICheckboxEvents } from './checkbox.types';

/**
 * @part icon - The icon element.
 */
@Component({
	tag: 'kv-checkbox',
	styleUrl: 'checkbox.scss',
	shadow: true
})
export class KvCheckbox implements ICheckbox, ICheckboxEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) checked?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) indeterminate?: boolean = false;

	/** @inheritdoc */
	@Event() clickCheckbox: EventEmitter<void>;

	private getIconName = () => {
		if (this.indeterminate) {
			return EOtherIconName.IconIndeterminateState;
		}

		if (this.checked) {
			return EOtherIconName.IconCheckState;
		}

		return EOtherIconName.IconUncheckState;
	};

	private onClick = () => {
		if (!this.disabled) {
			this.clickCheckbox.emit();
		}
	};

	render() {
		return (
			<Host
				onClick={this.onClick}
				class={{
					disabled: this.disabled
				}}
			>
				<kv-icon name={this.getIconName()} part="icon" />
			</Host>
		);
	}
}
