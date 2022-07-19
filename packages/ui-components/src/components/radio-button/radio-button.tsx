import { Component, Host, h, Prop, EventEmitter, Event } from '@stencil/core';
import { throttle } from 'lodash-es';
import { DEFAULT_THROTTLE_WAIT } from '../../config';
import { IAnchor, EAnchorTarget } from '../../types';
import { IRadioButton, IRadioButtonEvents } from './radio-button.types';

/**
 * @part radio-button - The radio action.
 */
@Component({
	tag: 'kv-radio-button',
	styleUrl: 'radio-button.scss',
	shadow: true
})
export class KvRadioButton implements IRadioButton, IRadioButtonEvents, IAnchor {
	/** @inheritdoc */
	@Prop({ reflect: true }) label!: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) value: string = this.label;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) checked?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) href?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) target?: EAnchorTarget;
	/** @inheritdoc */
	@Prop({ reflect: true }) download?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) preventDefault? = false;

	/** @inheritdoc */
	@Event() checkedChange: EventEmitter<string>;

	private clickThrottler: (e: MouseEvent) => void;
	private onCheck = () => {
		if (!this.disabled) {
			this.checkedChange.emit(this.value);
		}
	};

	connectedCallback() {
		this.clickThrottler = throttle(() => this.onCheck(), DEFAULT_THROTTLE_WAIT);
	}

	onClick(event: MouseEvent) {
		if (this.preventDefault) {
			event.preventDefault();
		}

		this.clickThrottler(event);
	}

	render() {
		return (
			<Host>
				<a
					class={{
						'radio-button': true,
						'radio-button--checked': this.checked,
						'radio-button--disabled': this.disabled
					}}
					part="radio-button"
					onClick={this.onClick.bind(this)}
					download={this.download}
					href={this.href}
					target={this.target}
				>
					{this.label}
				</a>
			</Host>
		);
	}
}
