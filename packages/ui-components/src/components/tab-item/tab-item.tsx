import { Component, Host, h, Prop, EventEmitter, Event } from '@stencil/core';
import { throttle } from 'lodash-es';
import { EComponentSize } from '../../utils/types';

@Component({
	tag: 'kv-tab-item',
	styleUrl: 'tab-item.scss',
	shadow: true
})
export class KvTabItem {
	/** (required) A unique identifier for this tab */
	@Prop() tabKey!: number | string;
	/** (required) Name to show in UI for this tab */
	@Prop() label!: string;
	/** (optional) To disable this tab */
	@Prop() disabled?: boolean = false;
	/** (optional) To set this tab as the selected one */
	@Prop() selected?: boolean = false;
	/** (optional) To show/hide notification icon or not */
	@Prop() hasNotification: boolean = false;
	/** (optional) The tab's notification color (hex value, rgb or css var format) */
	@Prop() notificationColor?: string = '';
	/** (optional) Sets this tab item to a different styling configuration */
	@Prop() size?: EComponentSize = EComponentSize.Large;
	/** Emitted when the tab is selected */
	@Event() tabSelected: EventEmitter<number | string>;

	private tabClickThrottler: () => void;

	connectedCallback() {
		this.tabClickThrottler = throttle(() => this.tabClick(), 300);
	}

	private tabClick = () => {
		this.tabSelected.emit(this.tabKey);
	};

	render() {
		const customStyles = {
			backgroundColor: this.notificationColor
		};

		return (
			<Host>
				<div
					class={{
						'tab-item-container': true,
						'selected': this.selected,
						'disabled': this.disabled,
						'has-notification': this.hasNotification,
						'small': this.size === EComponentSize.Small
					}}
					onClick={this.tabClickThrottler}
				>
					<div class="label">{this.label}</div>
					{this.hasNotification && <div class="notification-dot" style={customStyles}></div>}
				</div>
			</Host>
		);
	}
}
