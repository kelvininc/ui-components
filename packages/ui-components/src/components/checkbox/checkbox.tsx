import { Component, Event, EventEmitter, h, Host, Prop } from '@stencil/core';
import { EIconName } from '../icon/icon.types';
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
	@Event() clickCheckbox: EventEmitter<MouseEvent>;

	private getIconName = () => {
		if (this.indeterminate) {
			return EIconName.IndeterminateState;
		}

		if (this.checked) {
			return EIconName.CheckState;
		}

		return EIconName.UncheckState;
	};

	private onClick = (event: MouseEvent) => {
		if (!this.disabled) {
			this.clickCheckbox.emit(event);
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
