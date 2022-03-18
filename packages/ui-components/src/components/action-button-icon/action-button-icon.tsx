import { Component, Event, EventEmitter, h, Host, Prop } from '@stencil/core';
import { EActionButtonType, IButton, IButtonEvents } from '../action-button/action-button.types';
import { EAnchorTarget, EComponentSize, IAnchor } from '../../utils/types';
import { EIconName, EOtherIconName } from '../icon/icon.types';

@Component({
	tag: 'kv-action-button-icon',
	styleUrl: 'action-button-icon.scss',
	shadow: true
})
export class KvActionButtonIcon implements IButton, IButtonEvents, IAnchor {
	/** (required) Button's icon symbol name */
	@Prop({ reflect: true }) icon!: EIconName | EOtherIconName;
	/** @inheritdoc */
	@Prop({ reflect: true }) type!: EActionButtonType;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) active: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) size: EComponentSize = EComponentSize.Small;
	/** @inheritdoc */
	@Prop({ reflect: true }) href?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) target?: EAnchorTarget;
	/** @inheritdoc */
	@Prop({ reflect: true }) download?: string;

	/** @inheritdoc */
	@Event() clickButton: EventEmitter<MouseEvent>;
	/** @inheritdoc */
	@Event() focusButton: EventEmitter<FocusEvent>;
	/** @inheritdoc */
	@Event() blurButton: EventEmitter<FocusEvent>;

	render() {
		return (
			<Host>
				<div
					class={{
						'action-button-icon': true,
						[`action-button-icon--size-${this.size}`]: true
					}}
				>
					<kv-action-button
						type={this.type}
						active={this.active}
						size={this.size}
						disabled={this.disabled}
						download={this.download}
						href={this.href}
						target={this.target}
						exportparts="button"
					>
						<kv-icon name={this.icon} exportparts="icon" />
					</kv-action-button>
				</div>
			</Host>
		);
	}
}
