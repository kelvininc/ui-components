import { Component, Host, h, Prop, EventEmitter, Event } from '@stencil/core';
import { HostAttributes } from '@stencil/core/internal';
import { throttle } from 'lodash-es';

import { DEFAULT_THROTTLE_WAIT } from '../../config';
import { EIconName, EOtherIconName } from '../icon/icon.types';
import { EComponentSize, CustomCssClass, ICustomCss } from '../../types';
import { getClassMap } from '../../utils/css-class.helper';

/**
 * @part icon - The tab's item icon.
 */
@Component({
	tag: 'kv-tab-item',
	styleUrl: 'tab-item.scss',
	shadow: true
})
export class KvTabItem implements ICustomCss {
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
	/** (optional) The tab's icon */
	@Prop() icon?: EIconName | EOtherIconName;
	/** (optional) Sets this tab item to a different styling configuration */
	@Prop() size?: EComponentSize = EComponentSize.Large;
	/** Emitted when the tab is selected */
	@Event() tabSelected: EventEmitter<number | string>;
	/** (optional) Additional style to apply for custom CSS. */
	@Prop({ reflect: true }) customStyle?: HostAttributes['style'];
	/** @inheritdoc */
	@Prop({ reflect: true }) customClass?: CustomCssClass = '';

	private tabClickThrottler: () => void;

	connectedCallback() {
		this.tabClickThrottler = throttle(() => this.tabClick(), DEFAULT_THROTTLE_WAIT);
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
						'small': this.size === EComponentSize.Small,
						...getClassMap(this.customClass)
					}}
					onClick={this.tabClickThrottler}
					style={this.customStyle}
				>
					<div class="label">{this.label}</div>
					{this.icon && (
						<div class="icon">
							<kv-icon name={this.icon} part="icon" />
						</div>
					)}
					{this.hasNotification && <div class="notification-dot" style={customStyles}></div>}
				</div>
			</Host>
		);
	}
}
