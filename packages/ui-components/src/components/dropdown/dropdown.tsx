import { ComputePositionConfig } from '@floating-ui/dom';
import { Component, Host, h, Prop, Event, EventEmitter, Element, Method } from '@stencil/core';
import { merge } from 'lodash-es';
import { EIconName } from '../icon/icon.types';
import { ITextField } from '../text-field/text-field.types';
import { DEFAULT_INPUT_CONFIG } from './dropdown.config';
import { IDropdown, IDropdownEvents } from './dropdown.types';

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
	@Prop({ reflect: true, mutable: true }) isOpen?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: false }) options?: Partial<ComputePositionConfig>;
	/** @inheritdoc */
	@Prop({ reflect: false }) actionElement?: HTMLElement = null;
	/** @inheritdoc */
	@Prop({ reflect: false }) listElement?: HTMLElement = null;

	/** @inheritdoc */
	@Event({ bubbles: false }) openStateChange: EventEmitter<boolean>;

	@Element() el: HTMLKvDropdownElement;

	/** Toogles the dropdown open state */
	@Method()
	async onToggleOpenState() {
		this.openStateChange.emit(!this.isOpen);
	}

	private onOpenStateChange = ({ detail: openState }: CustomEvent<boolean>) => {
		this.isOpen = openState;
	};

	private getInputConfig = () => {
		return merge({}, DEFAULT_INPUT_CONFIG, this.inputConfig);
	};

	render() {
		return (
			<Host>
				<div class="dropdown-container">
					<kv-dropdown-base
						isOpen={this.isOpen}
						options={this.options}
						onOpenStateChange={this.onOpenStateChange}
						actionElement={this.actionElement}
						listElement={this.listElement}
					>
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
