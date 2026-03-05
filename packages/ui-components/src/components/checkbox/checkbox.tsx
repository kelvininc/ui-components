import { Component, Event, EventEmitter, h, Host, Prop } from '@stencil/core';
import { EComponentSize, EIconName } from '../../types';
import { ICheckbox, ICheckboxEvents } from './checkbox.types';

/**
 * @part icon - The icon element.
 * @part label - The label element.
 */
@Component({
	tag: 'kv-checkbox',
	shadow: true
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

	private onCheckedChange = (ev: Event) => {
		this.clickCheckbox.emit(ev);
	};

	render() {
		return (
			<Host>
				<kv-radio exportparts="label" size={this.size} checked={this.checked} label={this.label} disabled={this.disabled} onCheckedChange={this.onCheckedChange}>
					<kv-icon slot="action-icon" name={this.getIconName()} part="icon" />
				</kv-radio>
			</Host>
		);
	}
}
