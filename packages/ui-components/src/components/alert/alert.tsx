import { Component, Host, Prop, h } from '@stencil/core';
import { EAlertType, IAlertConfig } from './alert.types';
import { ALERT_ICON_NAMES } from './alert.config';
import { EComponentSize } from '../../types';

@Component({
	tag: 'kv-alert',
	styleUrl: 'alert.scss',
	shadow: true
})
export class KvAlert implements IAlertConfig {
	/** @inheritdoc */
	@Prop({ reflect: true }) type!: EAlertType;
	/** @inheritdoc */
	@Prop({ reflect: true }) size?: EComponentSize = EComponentSize.Large;
	/** @inheritdoc */
	@Prop({ reflect: true }) showIcon?: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: true }) label!: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) description?: string;

	render() {
		return (
			<Host>
				<div class="alert-container">
					<div
						class={{
							'alert': true,
							[`alert--type-${this.type}`]: true,
							'alert--size-small': this.size === EComponentSize.Small
						}}
					>
						<div class="information">
							{this.showIcon && <kv-icon name={ALERT_ICON_NAMES[this.type]} class="icon" />}
							<div class="text-container">
								<div class="title">{this.label}</div>
								<slot name="description">{this.description && <div class="description">{this.description}</div>}</slot>
							</div>
						</div>
						<slot name="actions"></slot>
					</div>
				</div>
			</Host>
		);
	}
}
