import { Component, Element, Event, EventEmitter, Host, Method, Prop, h, State } from '@stencil/core';
import { IDropdown, IDropdownEvents } from './dropdown.types';

import { ComputePositionConfig } from '@floating-ui/dom';
import { DEFAULT_DROPDOWN_POSITION_CONFIG, DEFAULT_INPUT_CONFIG } from './dropdown.config';
import { EIconName } from '../icon/icon.types';
import { ITextField } from '../text-field/text-field.types';
import { merge } from 'lodash-es';
import { DEFAULT_DROPDOWN_Z_INDEX } from '../../globals/config';

@Component({
	tag: 'kv-dropdown',
	styleUrl: 'dropdown.scss',
	shadow: false
})
export class KvDropdown implements IDropdown, IDropdownEvents {
	/** @inheritdoc */
	@Prop({ reflect: false }) inputConfig?: Partial<ITextField> = {};
	/** @inheritdoc */
	@Prop({ reflect: true }) isOpen?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: false }) options?: Partial<ComputePositionConfig> = DEFAULT_DROPDOWN_POSITION_CONFIG;
	/** @inheritdoc */
	@Prop({ reflect: false }) actionElement?: HTMLElement | null = null;
	/** @inheritdoc */
	@Prop({ reflect: false }) listElement?: HTMLElement | null = null;
	/** @inheritdoc */
	@Prop({ reflect: false }) disabled?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) clickOutsideClose?: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: false }) zIndex?: number = DEFAULT_DROPDOWN_Z_INDEX;

	/** @inheritdoc */
	@Event({ bubbles: false }) openStateChange: EventEmitter<boolean>;
	/** @inheritdoc */
	@Event() clickOutside: EventEmitter<MouseEvent>;

	@Element() el: HTMLKvDropdownElement;

	/** Toggles the dropdown open state */
	@Method()
	async onToggleOpenState() {
		if (!this.disabled) {
			this.openStateChange.emit(!this.isOpen);
		}
	}

	/** Internal actionElement ref */
	@State() _actionElement: HTMLElement;

	private getInputConfig = () => {
		return merge({}, DEFAULT_INPUT_CONFIG, { inputDisabled: this.disabled }, this.inputConfig);
	};

	componentDidRender() {
		this._actionElement = this.actionElement ?? this.el.querySelector('#dropdown-input').shadowRoot.querySelector('#dropdown-input');
	}

	render() {
		return (
			<Host>
				<div class="dropdown-container">
					<kv-dropdown-base
						isOpen={this.isOpen}
						options={this.options}
						actionElement={this._actionElement}
						listElement={this.listElement}
						clickOutsideClose={this.clickOutsideClose}
						zIndex={this.zIndex}
					>
						<slot name="dropdown-action" slot="action">
							<div>
								<kv-text-field
									{...this.getInputConfig()}
									id="dropdown-input"
									forcedFocus={this.isOpen}
									onFieldClick={this.onToggleOpenState.bind(this)}
									inputReadonly
									actionIcon={this.isOpen ? EIconName.ArrowDropUp : EIconName.ArrowDropDown}
								>
									<slot name="right-slot" slot="right-slot" />
									<slot name="left-slot" slot="left-slot" />
								</kv-text-field>
							</div>
						</slot>
						<div slot="list">
							<div id="select" class="select">
								<slot />
							</div>
						</div>
					</kv-dropdown-base>
				</div>
			</Host>
		);
	}
}
