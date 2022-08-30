import { Component, Host, h, Prop } from '@stencil/core';
import { buildSelectGroupLabel } from './select-group.helper';
import { ISelectGroup } from './select-group.types';

/**
 * @part group-container - The group element container.
 */
@Component({
	tag: 'kv-select-group',
	styleUrl: 'select-group.scss',
	shadow: true
})
export class KvSelectGroup implements ISelectGroup {
	/** @inheritdoc */
	@Prop({ reflect: true }) label?: string;

	render() {
		return (
			<Host>
				<div class="group" part="group-container">
					<div class="label">{buildSelectGroupLabel(this.label)}</div>
					<div class="items">
						<slot></slot>
					</div>
				</div>
			</Host>
		);
	}
}
