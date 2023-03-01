import { Component, Event, EventEmitter, Host, Prop, h } from '@stencil/core';
import { IInputWrapper, IInputWrapperEvents } from './input-wrapper.types';
import { EIconName } from '../icon/icon.types';

@Component({
	tag: 'kv-input-wrapper',
	styleUrl: 'input-wrapper.scss',
	shadow: true
})
export class KvInputWrapper implements IInputWrapper, IInputWrapperEvents {
	/** @inheritdoc */
	@Prop({ reflect: false }) contentVisible!: boolean;
	/** @inheritdoc */
	@Prop({ reflect: false }) contentDisabled?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: false }) label?: string;
	/** @inheritdoc */
	@Prop({ reflect: false }) icon?: EIconName = EIconName.Edit;

	/** @inheritdoc */
	@Event() contentClick: EventEmitter<boolean>;

	private handleContentClick = () => {
		if (!this.contentVisible && !this.contentDisabled) {
			this.contentClick.emit(this.contentVisible);
		}
	};

	render() {
		return (
			<Host>
				<div
					class={{
						'input-container': true,
						'input-container--content-hidden': !this.contentVisible && !this.contentDisabled
					}}
					onClick={this.handleContentClick}
				>
					{this.contentVisible && !this.contentDisabled ? (
						<div class="slot-container">
							<slot />
						</div>
					) : (
						<div class="label-container">
							<div class="label">{this.label}</div>
							<kv-icon name={this.icon} />
						</div>
					)}
				</div>
			</Host>
		);
	}
}
