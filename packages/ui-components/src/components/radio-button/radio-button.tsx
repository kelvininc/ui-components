import { Component, Host, h, Prop, EventEmitter, Event } from '@stencil/core';
import { isEmpty, throttle } from 'lodash-es';
import { DEFAULT_THROTTLE_WAIT } from '../../config';
import { EAnchorTarget, EIconName, EOtherIconName } from '../../types';
import { IRadioButton, IRadioButtonEvents } from './radio-button.types';

/**
 * @part radio-button - The radio action.
 * @part radio-icon - The radio button's icon container.
 * @part radio-text - The radio button's text container.
 * @part radio-label - The radio button's label container.
 */
@Component({
	tag: 'kv-radio-button',
	styleUrl: 'radio-button.scss',
	shadow: true
})
export class KvRadioButton implements IRadioButton, IRadioButtonEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) value!: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) label?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) icon?: EIconName | EOtherIconName;
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

	onClick = (event: MouseEvent) => {
		if (this.preventDefault) {
			event.preventDefault();
		}

		this.clickThrottler(event);
	};

	render() {
		const hasLabel = !isEmpty(this.label);
		const hasIcon = !isEmpty(this.icon);

		return (
			<Host>
				<a
					class={{
						'radio-button': true,
						'radio-button--checked': this.checked,
						'radio-button--disabled': this.disabled,
						'radio-button--only-icon': hasIcon && !hasLabel
					}}
					part="radio-button"
					onClick={this.onClick}
					download={this.download}
					href={this.href}
					target={this.target}
				>
					{hasIcon && (
						<div class="radio-button-icon" part="radio-icon">
							<kv-icon name={this.icon} />
						</div>
					)}
					{hasLabel && (
						<div class="radio-button-label" part="radio-label">
							{this.label}
						</div>
					)}
				</a>
			</Host>
		);
	}
}
