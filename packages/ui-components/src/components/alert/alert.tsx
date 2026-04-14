import { Component, Event, EventEmitter, Host, Prop, h } from '@stencil/core';
import { EAlertType, IAlertConfig, IAlertEvents } from './alert.types';
import { ALERT_ICON_NAMES } from './alert.config';
import { EActionButtonType, EComponentSize, EIconName } from '../../types';
import { isEmpty } from 'lodash-es';

/**
 * @part container - The alert container.
 */
@Component({
	tag: 'kv-alert',
	styleUrl: 'alert.scss',
	shadow: true
})
export class KvAlert implements IAlertConfig, IAlertEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) type!: EAlertType;
	/** @inheritdoc */
	@Prop({ reflect: true }) size: EComponentSize = EComponentSize.Large;
	/** @inheritdoc */
	@Prop({ reflect: true }) showIcon: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: true }) label!: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) description?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) closable: boolean = false;

	/** @inheritdoc */
	@Event() clickCloseButton: EventEmitter<MouseEvent>;

	private onCloseClick = (event: MouseEvent) => {
		this.clickCloseButton.emit(event);
	};

	render() {
		return (
			<Host>
				<div class="alert-container">
					<div
						part="container"
						class={{
							'alert': true,
							[`alert--type-${this.type}`]: true,
							'alert--size-small': this.size === EComponentSize.Small || !isEmpty(this.description)
						}}
					>
						<div class={{ 'main': true, 'show-icon': !!this.showIcon }}>
							<div class="information">
								{this.showIcon && <kv-icon name={ALERT_ICON_NAMES[this.type]} class="icon" />}
								<div class="text-container">
									<div class="title">{this.label}</div>
									<slot name="description">{this.description && <div class="description">{this.description}</div>}</slot>
								</div>
							</div>
							<slot name="actions"></slot>
							{this.closable && (
								<kv-action-button-text
									size={EComponentSize.Small}
									type={EActionButtonType.Text}
									icon={EIconName.Close}
									class="close-button"
									onClick={this.onCloseClick}
								/>
							)}
						</div>
						<slot name="alert-content"></slot>
					</div>
				</div>
			</Host>
		);
	}
}
