import { Component, Event, EventEmitter, h, Host, Prop, State, Watch } from '@stencil/core';
import { isEmpty } from 'lodash-es';
import { EActionButtonType } from '../action-button/action-button.types';
import { EComponentSize } from '../../utils/types';

@Component({
	tag: 'kv-action-button-split',
	styleUrl: 'action-button-split.scss',
	shadow: true
})
export class KvActionButtonSplit {
	/** (required) Buttons type */
	@Prop({ reflect: true }) type!: EActionButtonType;

	/** (required) Right button text */
	@Prop({ reflect: true }) text!: string;

	/** (required) Right button icon symbol name */
	@Prop({ reflect: true }) splitIcon!: string;

	/** (optional) Left button icon symbol name */
	@Prop({ reflect: true }) icon: string = '';

	/** (optional) If `true` the buttons are disabled */
	@Prop({ reflect: true }) disabled: boolean = false;

	/** (optional) Buttons size */
	@Prop({ reflect: true }) size: EComponentSize = EComponentSize.Large;

	/** Whether the left button icon exists and it's not empty */
	@State() hasIcon: boolean = !isEmpty(this.icon);

	/** Watch `icon` property for changes and update `hasIcon` accordingly */
	@Watch('icon')
	iconHandler(newIcon: string) {
		this.hasIcon = !isEmpty(newIcon);
	}

	/** Emitted when left button is clicked */
	@Event() clickLeftButton: EventEmitter<MouseEvent>;
	/** Emitted when right button is clicked */
	@Event() clickRightButton: EventEmitter<MouseEvent>;

	private onClickLeftButton = (event: CustomEvent<MouseEvent>) => {
		this.clickLeftButton.emit(event.detail);
	};
	private onClickRightButton = (event: CustomEvent<MouseEvent>) => {
		this.clickRightButton.emit(event.detail);
	};

	render() {
		return (
			<Host>
				<div class="action-button-split">
					<kv-action-button-text
						type={this.type}
						text={this.text}
						icon={this.icon}
						disabled={this.disabled}
						size={this.size}
						onClickButton={this.onClickLeftButton}
						exportparts="button"
					/>
					<kv-action-button type={this.type} disabled={this.disabled} size={this.size} onClickButton={this.onClickRightButton} exportparts="button">
						<kv-svg-icon name={this.splitIcon} exportparts="icon" />
					</kv-action-button>
				</div>
			</Host>
		);
	}
}
