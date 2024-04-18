import { Component, Host, h, Prop, EventEmitter, Event } from '@stencil/core';
import { isEmpty, throttle } from 'lodash-es';
import { DEFAULT_THROTTLE_WAIT } from '../../config';
import { EComponentSize, EIconName, EOtherIconName } from '../../types';
import { IToggleButton, IToggleButtonEvents } from './toggle-button.types';

/**
 * @part toggle-button - The toggle action.
 * @part toggle-icon - The toggle button's icon container.
 * @part toggle-text - The toggle button's text container.
 * @part toggle-label - The toggle button's label container.
 */
@Component({
	tag: 'kv-toggle-button',
	styleUrl: 'toggle-button.scss',
	shadow: true
})
export class KvToggleButton implements IToggleButton, IToggleButtonEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) value!: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) label?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) icon?: EIconName | EOtherIconName;
	/** @inheritdoc */
	@Prop({ reflect: true }) size: EComponentSize = EComponentSize.Small;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) checked?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) preventDefault? = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) withRadio?: boolean = false;

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
				<div
					class={{
						'toggle-button': true,
						'toggle-button--checked': this.checked,
						'toggle-button--disabled': this.disabled,
						'toggle-button--only-icon': hasIcon && !hasLabel,
						[`toggle-button--size-${this.size}`]: true
					}}
					part="toggle-button"
					onClick={this.onClick}
				>
					{this.withRadio && <kv-radio checked={this.checked} />}
					{hasIcon && (
						<div class="toggle-button-icon" part="toggle-icon">
							<kv-icon name={this.icon} />
						</div>
					)}
					{hasLabel && (
						<div class="toggle-button-label" part="toggle-label">
							{this.label}
						</div>
					)}
				</div>
			</Host>
		);
	}
}
