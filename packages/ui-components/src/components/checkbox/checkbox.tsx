import { Component, Event, EventEmitter, h, Host, Prop } from '@stencil/core';
import { EComponentSize, EIconName } from '../../types';
import { ICheckbox, ICheckboxEvents } from './checkbox.types';
import { ERadioControlType } from '../radio/radio.types';

/**
 * @part icon - The icon element.
 * @part label - The label element.
 */
@Component({
	tag: 'kv-checkbox',
	shadow: { delegatesFocus: true }
})
export class KvCheckbox implements ICheckbox, ICheckboxEvents {
	/** @inheritdoc */
	@Prop() size: EComponentSize = EComponentSize.Small;
	/** @inheritdoc */
	@Prop({ reflect: true }) checked?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) label?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) indeterminate?: boolean = false;
	/** @inheritdoc */
	@Prop() accessibleLabel?: string;

	/** @inheritdoc */
	@Event() clickCheckbox: EventEmitter<Event>;

	private getIconName = () => {
		if (this.indeterminate) {
			return EIconName.IndeterminateState;
		}

		if (this.checked) {
			return EIconName.CheckState;
		}

		return EIconName.UncheckState;
	};

	private onCheckedChange = ({ detail }: CustomEvent<Event>) => {
		this.clickCheckbox.emit(detail);
	};

	render() {
		return (
			<Host>
				<kv-radio
					exportparts="label"
					size={this.size}
					checked={this.checked}
					label={this.label}
					disabled={this.disabled}
					accessibleLabel={this.accessibleLabel}
					controlType={ERadioControlType.Checkbox}
					indeterminate={this.indeterminate}
					onCheckedChange={this.onCheckedChange}
				>
					<kv-icon slot="action-icon" name={this.getIconName()} part="icon" />
				</kv-radio>
			</Host>
		);
	}
}
