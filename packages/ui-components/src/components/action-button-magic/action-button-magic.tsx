import { Component, Event, EventEmitter, h, Host, Prop } from '@stencil/core';
import { EActionButtonType } from '../action-button/action-button.types';
import { EComponentSize } from '../../utils/types';
import { EIconName } from '../icon/icon.types';
import { IActionButtonTextConfig } from '../action-button-text/action-button-text.types';

/**
 * @part button-text - The text button.
 * @part icon - The icon button.
 */
@Component({
	tag: 'kv-action-button-magic',
	styleUrl: 'action-button-magic.scss',
	shadow: true
})
export class KvActionButtonMagic implements IActionButtonTextConfig {
	/** @inheritdoc */
	@Prop({ reflect: true }) text!: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) icon?: EIconName;
	/** @inheritdoc */
	@Prop({ reflect: true }) rightIcon?: EIconName;
	/** @inheritdoc */
	@Prop({ reflect: true }) type!: EActionButtonType;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) active: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) loading: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) size: EComponentSize = EComponentSize.Large;

	/** @inheritdoc */
	@Event() clickButton: EventEmitter<MouseEvent>;
	/** @inheritdoc */
	@Event() focusButton: EventEmitter<FocusEvent>;
	/** @inheritdoc */
	@Event() blurButton: EventEmitter<FocusEvent>;

	render() {
		return (
			<Host>
				<kv-action-button-text
					text={this.text}
					icon={this.icon}
					rightIcon={this.rightIcon}
					type={this.type}
					disabled={this.disabled}
					active={this.active}
					loading={this.loading}
					size={this.size}
					exportparts="button, button-text, icon"
				/>
			</Host>
		);
	}
}
