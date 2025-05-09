import { Component, Event, EventEmitter, h, Host, Prop } from '@stencil/core';
import { EActionButtonType } from '../action-button/action-button.types';
import { EComponentSize } from '../../utils/types';
import { EIconName } from '../icon/icon.types';
import { EBadgeState } from '../badge/badge.types';
import { isEmpty } from 'lodash-es';
import { IActionButtonIconConfig } from './action-button-icon-types';

@Component({
	tag: 'kv-action-button-icon',
	styleUrl: 'action-button-icon.scss',
	shadow: true
})
export class KvActionButtonIcon implements IActionButtonIconConfig {
	/** @inheritdoc */
	@Prop({ reflect: true }) icon!: EIconName;
	/** @inheritdoc */
	@Prop({ reflect: true }) type!: EActionButtonType;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) active: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) loading: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) size: EComponentSize = EComponentSize.Small;
	/** @inheritdoc */
	@Prop({ reflect: true }) badgeLabel?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) badgeState?: EBadgeState;

	/** @inheritdoc */
	@Event() clickButton: EventEmitter<MouseEvent>;
	/** @inheritdoc */
	@Event() focusButton: EventEmitter<FocusEvent>;
	/** @inheritdoc */
	@Event() blurButton: EventEmitter<FocusEvent>;

	render() {
		return (
			<Host>
				<div
					class={{
						'action-button-icon': true,
						[`action-button-icon--size-${this.size}`]: true
					}}
				>
					<kv-action-button type={this.type} active={this.active} loading={this.loading} size={this.size} disabled={this.disabled} exportparts="button">
						<kv-icon name={this.icon} exportparts="icon" />
						{!isEmpty(this.badgeLabel) && (
							<div class="button-badge" exportparts="badge">
								<kv-badge state={this.badgeState}>{this.badgeLabel}</kv-badge>
							</div>
						)}
					</kv-action-button>
				</div>
			</Host>
		);
	}
}
