import { Component, Event, EventEmitter, h, Prop, State } from '@stencil/core';
import { isEmpty } from 'lodash-es';
import { EActionButtonType } from './action-button.types';

@Component({
	tag: 'kv-action-button',
	styleUrl: 'action-button.scss',
	shadow: true,
})
export class ActionButton {
	@State() isButtonHovered = false;

	@Prop({ reflect: true }) type!: EActionButtonType;
	@Prop({ reflect: true }) text: string;
	@Prop({ reflect: true }) icon: string;
	@Prop({ reflect: true }) enabled = true;
	@Prop({ reflect: true }) buttonClass: string;
	@Prop({ reflect: true }) smallSize = false;
	@Prop({ reflect: true }) buttonId: string;
	@Prop({ reflect: true }) fixedWidth: number = null;

	@Event() buttonClick: EventEmitter<MouseEvent>;

	private onActionButtonClick = (event: MouseEvent) => {
		this.isButtonHovered = false;

		if (!isEmpty(event)) {
			event.preventDefault();
		}

		if (this.enabled) {
			this.buttonClick.emit(event);
		}
	}

	private onMouseEnter = () => {
		if (this.enabled) {
			this.isButtonHovered = true;
		}
	}

	private onMouseLeave = () => {
		this.isButtonHovered = false;
	}

	render() {
		return (
			<div class="action-btn-container">
				<div
					id={this.buttonId}
					class={{
						'action-button': true,
						[`${this.buttonClass ?? ''}`]: true,
						[`${this.type}`]: true,
						'hover': this.isButtonHovered,
						'small': this.smallSize,
						'icon-only': isEmpty(this.text),
					}}
					aria-disabled={!this.enabled || null}
					style={{ width: this.fixedWidth > 0 ? `${this.fixedWidth}px` : 'auto' }}
					onClick={this.onActionButtonClick}
					onMouseEnter={this.onMouseEnter}
					onMouseLeave={this.onMouseLeave}>
					{this.text && (
						<div class="button-wrapper">
							<span class="button-title">
								{this.text}
							</span>
						</div>
					)}
				</div>
			</div>
		);
	}
}
