import { Component, Fragment, Prop, h } from '@stencil/core';
import { EBadgeState, EComponentSize } from '../../types';
import { IDropdownDisplayValue } from './dropdown-display-value.types';

/**
 * @part container - the display value container
 */
@Component({
	tag: 'kv-dropdown-display-value',
	styleUrl: 'dropdown-display-value.scss',
	shadow: true
})
export class DropdownDisplayValue implements IDropdownDisplayValue {
	/** @inheritdoc */
	@Prop({ reflect: true }) size?: EComponentSize = EComponentSize.Large;
	/** @inheritdoc */
	@Prop({ reflect: true }) visible!: boolean;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled?: boolean;
	/** @inheritdoc */
	@Prop({ reflect: true }) value?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) valuePrefix?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) badge?: string;

	render() {
		return (
			<div
				class={{
					'value-container': true,
					[`value-container-${this.size}`]: true
				}}
				part="container"
			>
				{this.visible && (
					<Fragment>
						<div class={{ 'display-value': true, 'disabled': this.disabled }}>
							{this.valuePrefix && <div class="prefix">{this.valuePrefix}</div>}
							<div class="value">{this.value}</div>
						</div>
						{this.badge && <kv-badge state={EBadgeState.Secondary}>{this.badge}</kv-badge>}
					</Fragment>
				)}
			</div>
		);
	}
}
