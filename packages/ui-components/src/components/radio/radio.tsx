import { Component, Host, h, Prop, EventEmitter, Event } from '@stencil/core';
import { throttle } from 'lodash-es';
import { DEFAULT_THROTTLE_WAIT } from '../../config';
import { EComponentSize, EIconName } from '../../types';
import { ERadioControlType, IRadio, IRadioEvents } from './radio.types';

/**
 * @part icon - The icon element.
 * @part label - The label element.
 */
@Component({
	tag: 'kv-radio',
	styleUrl: 'radio.scss',
	// Focusing the host focuses the radio inside, so callers can move focus to an option
	shadow: { delegatesFocus: true }
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
	@Prop() accessibleLabel?: string;
	/** @internal Configures the checkbox wrapper's control role. */
	@Prop() controlType?: ERadioControlType = ERadioControlType.Radio;
	/** @internal Reports the checkbox wrapper's mixed state. */
	@Prop() indeterminate?: boolean = false;
	/** @inheritdoc */
	@Prop() skipTabStop?: boolean = false;

	/** @inheritdoc */
	@Event() checkedChange: EventEmitter<Event>;

	// Space selects the radio, and must not also scroll the page. Holding it down fires repeat
	// keydowns, which would toggle a checkbox back and forth, so only the first one counts
	private onKeyDown = (ev: KeyboardEvent) => {
		if (ev.defaultPrevented || ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey) return;
		if (ev.code === 'Space') {
			ev.preventDefault();
			if (!ev.repeat) {
				this.onCheck(ev);
			}
		}
	};

	private clickThrottler: (event: MouseEvent) => void;
	private onCheck = (event: Event) => {
		if (!this.disabled) {
			this.checkedChange.emit(event);
		}
	};

	private getAriaChecked = (): string => {
		if (this.controlType === ERadioControlType.Checkbox && this.indeterminate) {
			return 'mixed';
		}

		return this.checked ? 'true' : 'false';
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
					onKeyDown={this.onKeyDown}
				>
					<div
						class="circle"
						tabIndex={this.disabled || this.skipTabStop ? -1 : 0}
						role={this.controlType ?? ERadioControlType.Radio}
						aria-checked={this.getAriaChecked()}
						aria-disabled={this.disabled ? 'true' : undefined}
						aria-label={this.accessibleLabel || this.label || undefined}
					>
						<slot name="action-icon">
							<kv-icon name={this.checked ? EIconName.RadioBtnSelected : EIconName.RadioBtn} part="icon" />
						</slot>
					</div>
					{this.label && (
						// The control already carries the label as its name; this copy is for sight only
						<span part="label" class="label" aria-hidden="true">
							{this.label}
						</span>
					)}
				</div>
			</Host>
		);
	}
}
