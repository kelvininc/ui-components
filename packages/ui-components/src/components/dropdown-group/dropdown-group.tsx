import { Component, Host, h, Prop } from '@stencil/core';
import { buildDropdownGroupLabel } from './dropdown-group.helper';
import { IDropdownGroup } from './dropdown-group.types';

/**
 * @part group-container - The group element container.
 */
@Component({
	tag: 'kv-dropdown-group',
	styleUrl: 'dropdown-group.scss',
	shadow: true
})
export class KvDropdownGroup implements IDropdownGroup {
	/** @inheritdoc */
	@Prop({ reflect: true }) label?: string;

	render() {
		return (
			<Host>
				<div class="group" part="group-container">
					<div class="label">{buildDropdownGroupLabel(this.label)}</div>
					<div class="items">
						<slot></slot>
					</div>
				</div>
			</Host>
		);
	}
}
