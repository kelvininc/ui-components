import { Component, Event, EventEmitter, Host, Prop, h } from '@stencil/core';
import { EComponentSize } from '../../utils/types';
import { throttle } from 'lodash-es';
import { EIconName } from '../icon/icon.types';
import { DEFAULT_THROTTLE_WAIT } from '../../config';
import { ISwitchButton, ISwitchButtonEvents } from './switch-button.types';

/**
 * @part icon-svg - The switch icon.
 * @part icon-square - The switch icon square container.
 * @part button - The switch button.
 */
@Component({
	tag: 'kv-switch-button',
	styleUrl: 'switch-button.scss',
	shadow: true
})
export class KvSwitchButton implements ISwitchButton, ISwitchButtonEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true, mutable: true }) checked: boolean = false;
	/** @inheritdoc */
	@Prop() size: EComponentSize = EComponentSize.Large;

	/** @inheritdoc */
	@Event() switchChange: EventEmitter<boolean>;

	private onSwitchClick: () => void;
	private onStateChange() {
		if (this.disabled) {
			return;
		}

		this.checked = !this.checked;
		this.switchChange.emit(this.checked);
	}

	connectedCallback() {
		this.onSwitchClick = throttle(() => this.onStateChange(), DEFAULT_THROTTLE_WAIT);
	}

	render() {
		const iconName = this.disabled ? EIconName.Lock : EIconName.DoneAll;

		return (
			<Host>
				<slot name="left-slot" />
				<div
					class={{
						'switch-button': true,
						'switch-button--disabled': this.disabled,
						'switch-button--on': this.checked,
						[`switch-button--${this.size}`]: true
					}}
					part="button"
					onClick={this.onSwitchClick}
				>
					<div class="icon-square" part="icon-square">
						<kv-icon name={iconName} part="icon-svg" />
					</div>
				</div>
				<slot name="right-slot" />
			</Host>
		);
	}
}
