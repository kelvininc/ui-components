import { Component, Host, h, Prop, EventEmitter, Event, Listen } from '@stencil/core';
import { throttle } from 'lodash-es';
import { DEFAULT_THROTTLE_WAIT } from '../../config';
import { EComponentSize, EIconName } from '../../types';
import { IRadio, IRadioEvents } from './radio.types';

/**
 * @part icon - The icon element.
 * @part label - The label element.
 */
@Component({
	tag: 'kv-radio',
	styleUrl: 'radio.scss',
	shadow: true
})
export class KvRadio implements IRadio, IRadioEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) label?: string = '';
	/** @inheritdoc */
	@Prop() size: EComponentSize = EComponentSize.Small;
	/** @inheritdoc */
	@Prop({ reflect: true }) checked?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled?: boolean = false;

	/** @inheritdoc */
	@Event() checkedChange: EventEmitter<Event>;

	@Listen('keydown', {
		passive: true
	})
	handleKeyDown(ev: KeyboardEvent) {
		if (ev.code === 'Space') {
			this.onCheck(ev);
		}
	}

	private clickThrottler: (event: MouseEvent) => void;
	private onCheck = (event: Event) => {
		if (!this.disabled) {
			this.checkedChange.emit(event);
		}
	};

	connectedCallback() {
		this.clickThrottler = throttle((event: MouseEvent) => this.onCheck(event), DEFAULT_THROTTLE_WAIT);
	}

	render() {
		return (
			<Host>
				<div
					class={{
						'radio-container': true,
						[`radio-container--size-${this.size}`]: true,
						'disabled': this.disabled
					}}
					onClick={this.clickThrottler}
				>
					<div class="circle" tabIndex={this.disabled ? -1 : 0}>
						<slot name="action-icon">
							<kv-icon name={this.checked ? EIconName.RadioBtnSelected : EIconName.RadioBtn} part="icon" />
						</slot>
					</div>
					{this.label && (
						<span part="label" class="label">
							{this.label}
						</span>
					)}
				</div>
			</Host>
		);
	}
}
