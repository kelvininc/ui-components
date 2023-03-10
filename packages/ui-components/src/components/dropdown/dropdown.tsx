import { Component, Element, Event, EventEmitter, Host, Method, Prop, h, State } from '@stencil/core';
import { IDropdown, IDropdownEvents } from './dropdown.types';

import { ComputePositionConfig } from '@floating-ui/dom';
import { DEFAULT_DROPDOWN_POSITION_CONFIG, DEFAULT_INPUT_CONFIG } from './dropdown.config';
import { EIconName } from '../icon/icon.types';
import { ITextField } from '../text-field/text-field.types';
import { merge } from 'lodash-es';

/**
 * @part input - The input container.
 */
@Component({
	tag: 'kv-dropdown',
	styleUrl: 'dropdown.scss',
	shadow: true
})
export class KvDropdown implements IDropdown, IDropdownEvents {
	/** @inheritdoc */
	@Prop({ reflect: false }) inputConfig?: Partial<ITextField> = {};
	/** @inheritdoc */
	@Prop({ reflect: true }) isOpen?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: false }) options?: Partial<ComputePositionConfig> = DEFAULT_DROPDOWN_POSITION_CONFIG;
	/** @inheritdoc */
	@Prop({ reflect: false }) actionElement?: HTMLElement = null;
	/** @inheritdoc */
	@Prop({ reflect: false }) listElement?: HTMLElement = null;
	/** @inheritdoc */
	@Prop({ reflect: false }) disabled?: boolean = false;

	/** @inheritdoc */
	@Event({ bubbles: false }) openStateChange: EventEmitter<boolean>;

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
		return merge({}, DEFAULT_INPUT_CONFIG, { disabled: this.disabled }, this.inputConfig);
	};

	componentDidRender() {
		this._actionElement = this.actionElement ?? this.el.shadowRoot.querySelector('#dropdown-input').shadowRoot.querySelector('#dropdown-input');
	}

	render() {
		return (
			<Host>
				<div class="dropdown-container">
					<kv-dropdown-base isOpen={this.isOpen} options={this.options} actionElement={this._actionElement} listElement={this.listElement} disabled={this.disabled}>
						<div slot="action">
							<kv-text-field
								{...this.getInputConfig()}
								id="dropdown-input"
								forcedFocus={this.isOpen}
								onClick={this.onToggleOpenState.bind(this)}
								readonly
								part="input"
							>
								<kv-icon slot="right-slot" name={this.isOpen ? EIconName.ArrowDropUp : EIconName.ArrowDropDown} customClass="icon-24" />
							</kv-text-field>
						</div>
						<div slot="list">
							<div id="select" class="select">
								<slot></slot>
							</div>
						</div>
					</kv-dropdown-base>
				</div>
			</Host>
		);
	}
}
