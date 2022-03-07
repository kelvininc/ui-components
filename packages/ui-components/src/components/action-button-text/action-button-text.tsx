import { Component, h, Host, Prop, State, Watch } from '@stencil/core';
import { isEmpty } from 'lodash-es';
import { EActionButtonType } from '../action-button/action-button.types';
import { EComponentSize } from '../../utils/types';

/**
 * @part action-button - The action button.
 * @part button-text - The text button.
 */
@Component({
	tag: 'kv-action-button-text',
	styleUrl: 'action-button-text.scss',
	shadow: true
})
export class KvActionButtonText {
	/** (required) Button's type */
	@Prop({ reflect: true }) type!: EActionButtonType;

	/** (required) (required) Button's text */
	@Prop({ reflect: true }) text!: string;

	/** (optional) Button's left icon symbol name */
	@Prop({ reflect: true }) icon: string = '';

	/** (optional) If `true` the button is disabled */
	@Prop({ reflect: true }) disabled: boolean = false;

	/** (optional) Button's size */
	@Prop({ reflect: true }) size: EComponentSize = EComponentSize.Large;

	/** (optional) Whether the icon exist and it's not empty */
	@State() hasIcon: boolean = !isEmpty(this.icon);

	/** Watch `icon` property for changes and update `hasIcon` accordingly */
	@Watch('icon')
	iconHandler(newIcon: string) {
		this.hasIcon = !isEmpty(newIcon);
	}

	render() {
		return (
			<Host>
				<kv-action-button type={this.type} disabled={this.disabled} size={this.size} exportparts="button">
					{this.hasIcon && <kv-svg-icon name={this.icon} exportparts="icon" />}
					<span class="action-button-text" part="button-text">
						{this.text}
					</span>
				</kv-action-button>
			</Host>
		);
	}
}
