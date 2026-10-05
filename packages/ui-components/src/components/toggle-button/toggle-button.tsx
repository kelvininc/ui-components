import { Component, Host, h, Prop, EventEmitter, Event } from '@stencil/core';
import { isEmpty, throttle } from 'lodash-es';
import { DEFAULT_THROTTLE_WAIT } from '../../config';
import { EComponentSize, EIconName, ERadioControlType } from '../../types';
import { IToggleButton, IToggleButtonEvents } from './toggle-button.types';
import { isValidLabel } from '../../utils/string.helper';
/**
 * @part toggle-button - The toggle action.
 * @part toggle-icon - The toggle button's icon container.
 * @part toggle-text - The toggle button's text container.
 * @part toggle-label - The toggle button's label container.
 */
@Component({
	tag: 'kv-toggle-button',
	styleUrl: 'toggle-button.scss',
	shadow: { delegatesFocus: true }
})
export class KvToggleButton implements IToggleButton, IToggleButtonEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) value!: string | number;
	/** @inheritdoc */
	@Prop({ reflect: true }) label?: string;
	/** @inheritdoc */
	@Prop() accessibleLabel?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) icon?: EIconName;
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
	@Prop() radioControlType?: ERadioControlType = ERadioControlType.Radio;
	/** @inheritdoc */
	@Prop() skipTabStop?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) tooltip?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) customAttributes?: Record<string, string> = {};

	/** @inheritdoc */
	@Event() checkedChange: EventEmitter<string | number>;

	private clickThrottler: (e: MouseEvent) => void;
	private onCheck = () => {
		if (!this.disabled) {
			this.checkedChange.emit(this.value);
		}
	};

	connectedCallback() {
		this.clickThrottler = throttle(() => this.onCheck(), DEFAULT_THROTTLE_WAIT);
	}

	// The inner radio is the toggle's focusable part. Its own checkedChange would otherwise bubble
	// out under this component's event name with the wrong detail; a click on it already reaches
	// onClick, so only Space (a keydown) needs to toggle from here.
	private onRadioCheckedChange = (event: CustomEvent<Event>) => {
		event.stopPropagation();
		if (event.detail?.type === 'keydown' && !(event.detail as KeyboardEvent).repeat) {
			this.onCheck();
		}
	};

	onClick = (event: MouseEvent) => {
		if (this.preventDefault) {
			event.preventDefault();
		}

		this.clickThrottler(event);
	};

	render() {
		const hasLabel = !isEmpty(this.label);
		const hasIcon = !isEmpty(this.icon);
		const Control = this.withRadio ? 'div' : 'button';
		const accessibleLabel = [this.accessibleLabel, this.label, this.tooltip].find(isValidLabel);
		const controlAttributes = this.withRadio
			? this.customAttributes
			: { ...this.customAttributes, 'type': 'button', 'aria-label': accessibleLabel, 'aria-pressed': String(!!this.checked), 'disabled': this.disabled };

		return (
			<Host>
				<kv-tooltip text={this.tooltip}>
					<Control
						class={{
							'toggle-button': true,
							'toggle-button--checked': !!this.checked,
							'toggle-button--disabled': !!this.disabled,
							'toggle-button--only-icon': hasIcon && !hasLabel,
							'toggle-button--with-radio': !!this.withRadio,
							[`toggle-button--size-${this.size}`]: true
						}}
						part="toggle-button"
						onClick={this.onClick}
						{...controlAttributes}
					>
						{this.withRadio && (
							<kv-radio
								size={EComponentSize.Small}
								checked={this.checked}
								disabled={this.disabled}
								accessibleLabel={accessibleLabel}
								controlType={this.radioControlType}
								skipTabStop={this.skipTabStop}
								onCheckedChange={this.onRadioCheckedChange}
							/>
						)}
						{hasIcon && (
							<div class="toggle-button-icon" part="toggle-icon">
								<kv-icon name={this.icon!} />
							</div>
						)}
						{hasLabel && (
							<div class="toggle-button-label" part="toggle-label" aria-hidden={this.withRadio ? 'true' : undefined}>
								{this.label}
							</div>
						)}
					</Control>
				</kv-tooltip>
			</Host>
		);
	}
}
