import { Component, Event, EventEmitter, h, Host, Prop } from '@stencil/core';
import { EActionButtonType } from './action-button.types';
import { EComponentSize } from '../../utils/types';

/**
 * @part button - The action button.
 */
@Component({
	tag: 'kv-action-button',
	styleUrl: 'action-button.scss',
	shadow: true
})
export class KvActionButton {
	/** (optional) Button's type */
	@Prop({ reflect: true }) type!: EActionButtonType;

	/** (optional) If `true` the button is disabled */
	@Prop({ reflect: true }) disabled: boolean = false;

	/** (optional) If `true` the button is active */
	@Prop({ reflect: true }) active: boolean = false;

	/** (optional) Button's size */
	@Prop({ reflect: true }) size: EComponentSize = EComponentSize.Large;

	/** Emitted when action button is clicked */
	@Event() buttonClick: EventEmitter<MouseEvent>;

	private onButtonClick = (event: MouseEvent) => {
		if (this.disabled) {
			return;
		}

		this.buttonClick.emit(event);
	};

	render() {
		return (
			<Host>
				<div
					class={{
						'action-button': true,
						'action-button--disabled': this.disabled,
						'action-button--active': this.active,
						[`action-button--type-${this.type}`]: true,
						[`action-button--size-${this.size}`]: true
					}}
					part="button"
					aria-disabled={this.disabled}
					onClick={this.onButtonClick}
				>
					<slot />
				</div>
			</Host>
		);
	}
}
