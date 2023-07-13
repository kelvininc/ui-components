import { Component, Event, EventEmitter, h, Host, Prop } from '@stencil/core';
import { EActionButtonType, IButton, IButtonEvents } from './action-button.types';
import { EAnchorTarget, EComponentSize, IAnchor } from '../../utils/types';

/**
 * @part button - The action button.
 */
@Component({
	tag: 'kv-action-button',
	styleUrl: 'action-button.scss',
	shadow: true
})
export class KvActionButton implements IButton, IButtonEvents, IAnchor {
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
	@Prop({ reflect: true }) href?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) target?: EAnchorTarget;
	/** @inheritdoc */
	@Prop({ reflect: true }) download?: string;

	/** @inheritdoc */
	@Event() clickButton: EventEmitter<MouseEvent>;
	/** @inheritdoc */
	@Event() focusButton: EventEmitter<FocusEvent>;
	/** @inheritdoc */
	@Event() blurButton: EventEmitter<FocusEvent>;

	private onClickButton = (event: MouseEvent) => {
		if (this.disabled) {
			return;
		}

		this.clickButton.emit(event);
	};
	private onFocusButton = (event: FocusEvent) => {
		this.focusButton.emit(event);
	};
	private onBlurButton = (event: FocusEvent) => {
		this.blurButton.emit(event);
	};

	render() {
		return (
			<Host aria-disabled={this.disabled} onClick={this.onClickButton}>
				<a
					class={{
						'action-button': true,
						'action-button--disabled': this.disabled,
						'action-button--active': this.active,
						'action-button--loading': this.loading,
						[`action-button--type-${this.type}`]: true,
						[`action-button--size-${this.size}`]: true
					}}
					tabIndex={this.disabled ? -1 : 0}
					part="button"
					download={this.download}
					href={this.href}
					target={this.target}
					onFocus={this.onFocusButton}
					onBlur={this.onBlurButton}
				>
					<slot />
				</a>
			</Host>
		);
	}
}
