import { Component, Host, h, Prop, EventEmitter, Event } from '@stencil/core';
import { HostAttributes } from '@stencil/core/internal';
import { throttle } from 'lodash-es';
import { DEFAULT_THROTTLE_WAIT } from '../../config';
import { CustomCssClass, EIconName, ICustomCss } from '../../types';
import { ETabItemType } from './tab-item.types';
import { getClassMap } from '../../utils/css-class.helper';

@Component({
	tag: 'kv-tab-item',
	styleUrl: 'tab-item.scss',
	shadow: true
})
export class KvTabItem implements ICustomCss {
	/** (required) A unique identifier for this tab */
	@Prop() tabKey!: number | string;
	/** (optional) Sets this tab item to a different styling configuration */
	@Prop() type?: ETabItemType = ETabItemType.Primary;
	/** (optional) Name to show in UI for this tab */
	@Prop() label?: string;
	/** (optional) Icon to show in UI for this tab */
	@Prop() icon?: EIconName;
	/** (optional) To disable this tab */
	@Prop() disabled?: boolean = false;
	/** (optional) To set this tab as the selected one */
	@Prop() selected?: boolean = false;
	/** (optional) Additional style to apply for custom CSS. */
	@Prop({ reflect: true }) customStyle?: HostAttributes['style'];
	/** @inheritdoc */
	@Prop({ reflect: true }) customClass?: CustomCssClass = '';
	/** (optional) Custom attributes to be applied to the tab element */
	@Prop({ reflect: true }) customAttributes?: Record<string, string> = {};

	/** Emitted when the tab is selected */
	@Event() tabSelected: EventEmitter<number | string>;

	private tabClickThrottler: () => void;

	connectedCallback() {
		this.tabClickThrottler = throttle(() => this.tabClick(), DEFAULT_THROTTLE_WAIT);
	}

	private tabClick = () => {
		if (this.disabled) return;
		this.tabSelected.emit(this.tabKey);
	};

	render() {
		return (
			<Host>
				<div
					class={{
						'tab-item-container': true,
						'selected': this.selected,
						'disabled': this.disabled,
						'only-icon': this.type === ETabItemType.Secondary && this.icon && !this.label,
						[this.type]: true,
						...getClassMap(this.customClass)
					}}
					onClick={this.tabClickThrottler}
					style={this.customStyle}
					{...this.customAttributes}
				>
					{this.icon && this.type === ETabItemType.Secondary && <kv-icon name={this.icon} />}
					{this.label && <div class="label">{this.label}</div>}
					<slot name="right-slot"></slot>
				</div>
			</Host>
		);
	}
}
