import { Component, Element, Event, EventEmitter, Host, Method, Prop, h, State } from '@stencil/core';
import { IDropdown, IDropdownEvents } from './dropdown.types';

import { ComputePositionConfig } from '@floating-ui/dom';
import { DEFAULT_INPUT_CONFIG } from './dropdown.config';
import { EIconName } from '../icon/icon.types';
import { ITextField } from '../text-field/text-field.types';
import { merge } from 'lodash-es';
import { DEFAULT_DROPDOWN_Z_INDEX } from '../../globals/config';
import { getDefaultDropdownPositionConfig } from './dropdown.helper';

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
	@Prop({ reflect: false }) options?: Partial<ComputePositionConfig>;
	/** @inheritdoc */
	@Prop({ reflect: false }) actionElement?: HTMLElement | null = null;
	/** @inheritdoc */
	@Prop({ reflect: false }) listElement?: HTMLElement | null = null;
	/** @inheritdoc */
	@Prop({ reflect: false }) disabled?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) clickOutsideClose?: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: true }) escapeClose?: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: false }) zIndex?: number = DEFAULT_DROPDOWN_Z_INDEX;

	/** @inheritdoc */
	@Event({ bubbles: false }) openStateChange: EventEmitter<boolean>;
	/** @inheritdoc */
	@Event() clickOutside: EventEmitter<MouseEvent>;

	@Element() el: HTMLKvDropdownElement;
	private inputRef?: HTMLKvTextFieldElement;

	/**
	 * Focuses the default trigger or a custom action's focusInput method/native control.
	 * @param canFocus Optional live check passed to the trigger's focusInput method.
	 */
	@Method()
	async setFocus(canFocus?: () => boolean): Promise<void> {
		if (this.disabled || canFocus?.() === false) return;
		const action =
			this.actionElement ??
			Array.from(this.el.querySelectorAll<HTMLElement>('[slot="dropdown-action"]:not(slot)')).find(candidate => {
				// Only this dropdown's action slot supplies its custom trigger.
				for (let ancestor = candidate.parentElement; ancestor && ancestor !== this.el; ancestor = ancestor.parentElement) {
					if (ancestor.localName === 'kv-dropdown' || ['left-slot', 'right-slot', 'list'].includes(ancestor.slot)) return false;
				}
				return true;
			});
		if (action) {
			const inputAction = action as HTMLElement & { focusInput?: (canFocus?: () => boolean) => Promise<void> };
			if (typeof inputAction.focusInput === 'function') await inputAction.focusInput(canFocus);
			else action.focus();
		} else if (!this.inputConfig?.inputDisabled && !this.inputConfig?.loading) await this.inputRef?.focusInput(canFocus);
	}

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
		// Only the `actionElement` prop can name an action element here. This used to
		// fall back to `this.el.querySelector('#dropdown-input').shadowRoot.querySelector('#dropdown-input')`,
		// which could never match: `kv-text-field` gives its inner `<input>` only a
		// `name` and `part="input-text"`, never `id="dropdown-input"`. The lookup
		// always produced `null` and `kv-dropdown-base` silently fell back to its own
		// `div#dropdown-action` — and when a consumer filled the `dropdown-action`
		// slot the fallback `kv-text-field` was gone, so the unguarded `.shadowRoot`
		// threw a `TypeError` on every render.
		this._actionElement = this.actionElement ?? null;
	}

	render() {
		const inputConfig = this.getInputConfig();

		return (
			<Host>
				<div class="dropdown-container">
					<kv-dropdown-base
						isOpen={this.isOpen}
						options={this.options ?? getDefaultDropdownPositionConfig(inputConfig)}
						actionElement={this._actionElement}
						listElement={this.listElement}
						clickOutsideClose={this.clickOutsideClose}
						escapeClose={this.escapeClose}
						zIndex={this.zIndex}
					>
						<slot name="dropdown-action" slot="action">
							<div>
								<kv-text-field
									ref={element => (this.inputRef = element)}
									{...inputConfig}
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
