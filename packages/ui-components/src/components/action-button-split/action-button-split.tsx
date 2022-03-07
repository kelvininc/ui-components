import { Component, Event, EventEmitter, h, Host, Prop, State, Watch } from '@stencil/core';
import { isEmpty } from 'lodash-es';
import { EActionButtonType } from '../action-button/action-button.types';
import { EComponentSize } from '../../utils/types';

/**
 * @part left-action-button - The left action button.
 * @part right-action-button - The right action button.
 * @part button-split-icon - The split icon button.
 */
@Component({
	tag: 'kv-action-button-split',
	styleUrl: 'action-button-split.scss',
	shadow: true
})
export class KvActionButtonSplit {
	/** (required) Button's type */
	@Prop({ reflect: true }) type!: EActionButtonType;

	/** (required) Button's text */
	@Prop({ reflect: true }) text!: string;

	/** (required) Button's split icon symbol name */
	@Prop({ reflect: true }) splitIcon!: string;

	/** (optional) Button's left icon symbol name */
	@Prop({ reflect: true }) icon: string = '';

	/** (optional) If `true` the button is disabled */
	@Prop({ reflect: true }) disabled: boolean = false;

	/** (optional) Button's size */
	@Prop({ reflect: true }) size: EComponentSize = EComponentSize.Large;

	/** Whether the icon exist and it's not empty */
	@State() hasIcon: boolean = !isEmpty(this.icon);

	/** Watch `icon` property for changes and update `hasIcon` accordingly */
	@Watch('icon')
	iconHandler(newIcon: string) {
		this.hasIcon = !isEmpty(newIcon);
	}

	/** Emitted when split button is clicked */
	@Event() splitButtonClick: EventEmitter<CustomEvent<MouseEvent>>;

	private onSplitButtonClick = (event: CustomEvent<MouseEvent>) => {
		this.splitButtonClick.emit(event);
	};

	render() {
		return (
			<Host>
				<div class="action-button-split">
					<kv-action-button-text type={this.type} text={this.text} icon={this.icon} disabled={this.disabled} size={this.size} part="left-action-button" />
					<kv-action-button type={this.type} disabled={this.disabled} size={this.size} part="right-action-button" onButtonClick={this.onSplitButtonClick}>
						<kv-svg-icon name={this.splitIcon} part="button-split-icon" />
					</kv-action-button>
				</div>
			</Host>
		);
	}
}
