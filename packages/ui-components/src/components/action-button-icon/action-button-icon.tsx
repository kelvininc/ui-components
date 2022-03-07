import { Component, Event, EventEmitter, h, Host, Prop } from '@stencil/core';
import { EActionButtonType } from '../action-button/action-button.types';
import { EComponentSize } from '../../utils/types';

@Component({
	tag: 'kv-action-button-icon',
	styleUrl: 'action-button-icon.scss',
	shadow: true
})
export class KvActionButtonIcon {
	/** (required) Button's type */
	@Prop({ reflect: true }) type!: EActionButtonType;

	/** (required) Button's icon symbol name */
	@Prop({ reflect: true }) icon!: string;

	/** (optional) If `true` the button is disabled */
	@Prop({ reflect: true }) disabled: boolean = false;

	/** (optional) If `true` the button is active */
	@Prop({ reflect: true }) active: boolean = false;

	/** (optional) Button's size */
	@Prop({ reflect: true }) size: EComponentSize = EComponentSize.Small;

	/** Emitted when action button is clicked */
	@Event() clickButton: EventEmitter<MouseEvent>;

	render() {
		return (
			<Host>
				<div
					class={{
						'action-button-icon': true,
						[`action-button-icon--size-${this.size}`]: true
					}}
				>
					<kv-action-button type={this.type} active={this.active} size={this.size} disabled={this.disabled} exportparts="button">
						<kv-svg-icon name={this.icon} exportparts="icon" />
					</kv-action-button>
				</div>
			</Host>
		);
	}
}
