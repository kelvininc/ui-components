import { Component, Element, Event, EventEmitter, h, Host, Prop } from '@stencil/core';
import { EActionButtonType, IButton, IButtonEvents, IButtonMenuState } from './action-button.types';
import { EComponentSize } from '../../utils/types';
import { setAccessibleDescriptionElements } from '../../utils/accessible-description.helper';

/**
 * @part button - The action button.
 */
@Component({
	tag: 'kv-action-button',
	styleUrl: 'action-button.scss',
	// Focusing the host focuses the button inside, so callers can move focus to it
	shadow: { delegatesFocus: true }
})
export class KvActionButton implements IButton, IButtonEvents, IButtonMenuState {
	/** @inheritdoc */
	@Prop({ reflect: true }) type?: EActionButtonType;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) active: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) loading: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) size: EComponentSize = EComponentSize.Large;
	/** @inheritdoc */
	@Prop() accessibleLabel?: string;
	/** @inheritdoc */
	@Prop() accessibleDescriptionElements?: readonly Element[];
	/** @inheritdoc */
	@Prop() menuExpanded?: boolean;
	/** @inheritdoc */
	@Prop() menuTabIndex?: number;

	@Element() el: HTMLKvActionButtonElement;

	/** @inheritdoc */
	@Event() clickButton: EventEmitter<MouseEvent>;
	/** @inheritdoc */
	@Event() focusButton: EventEmitter<FocusEvent>;
	/** @inheritdoc */
	@Event() blurButton: EventEmitter<FocusEvent>;
	private control?: HTMLDivElement;

	componentDidRender() {
		setAccessibleDescriptionElements(this.control, this.accessibleDescriptionElements);
	}

	private onClickButton = (event: MouseEvent) => {
		if (this.disabled) {
			return;
		}

		this.clickButton.emit(event);
	};
	// Consume activation keys, including repeats, to prevent scrolling and parent shortcuts.
	// Clicking the host makes keyboard and mouse activation share the same listener.
	private onKeyDown = (event: KeyboardEvent) => {
		if ((event.key !== 'Enter' && event.key !== ' ') || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.target !== event.currentTarget) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();
		if (!this.disabled && !event.repeat) {
			this.el.click();
		}
	};
	private onFocusButton = (event: FocusEvent) => {
		this.focusButton.emit(event);
	};
	private onBlurButton = (event: FocusEvent) => {
		this.blurButton.emit(event);
	};

	render() {
		return (
			<Host onClick={this.onClickButton}>
				<div
					ref={element => (this.control = element)}
					class={{
						'action-button': true,
						'action-button--disabled': this.disabled,
						'action-button--active': this.active,
						'action-button--loading': this.loading,
						[`action-button--type-${this.type}`]: true,
						[`action-button--size-${this.size}`]: true
					}}
					tabIndex={this.disabled ? -1 : (this.menuTabIndex ?? 0)}
					role="button"
					aria-label={this.accessibleLabel || undefined}
					aria-disabled={this.disabled ? 'true' : undefined}
					aria-busy={this.loading ? 'true' : undefined}
					aria-haspopup={this.menuExpanded === undefined ? undefined : 'menu'}
					aria-expanded={this.menuExpanded === undefined ? undefined : String(this.menuExpanded)}
					part="button"
					onKeyDown={this.onKeyDown}
					onFocus={this.onFocusButton}
					onBlur={this.onBlurButton}
				>
					<slot />
				</div>
			</Host>
		);
	}
}
