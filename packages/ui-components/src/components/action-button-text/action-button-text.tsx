import { Component, Event, EventEmitter, h, Host, Prop } from '@stencil/core';
import { EActionButtonType } from '../action-button/action-button.types';
import { EAnchorTarget, EComponentSize } from '../../utils/types';
import { EIconName, EOtherIconName } from '../icon/icon.types';
import { IActionButtonTextConfig } from './action-button-text.types';

/**
 * @part button-text - The text button.
 */
@Component({
	tag: 'kv-action-button-text',
	styleUrl: 'action-button-text.scss',
	shadow: true
})
export class KvActionButtonText implements IActionButtonTextConfig {
	/** @inheritdoc */
	@Prop({ reflect: true }) text!: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) icon?: EIconName | EOtherIconName;
	/** @inheritdoc */
	@Prop({ reflect: true }) type!: EActionButtonType;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) active: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) size: EComponentSize = EComponentSize.Large;
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
				<kv-action-button
					active={this.active}
					type={this.type}
					disabled={this.disabled}
					size={this.size}
					download={this.download}
					href={this.href}
					target={this.target}
					exportparts="button"
				>
					{this.icon && <kv-icon name={this.icon} exportparts="icon" />}
					<span class="action-button-text" part="button-text">
						{this.text}
					</span>
				</kv-action-button>
			</Host>
		);
	}
}
