import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
import { EIconName } from '../icon/icon.types';
import { IModalConfig, IModalEvents } from './modal.types';

@Component({
	tag: 'kv-modal',
	styleUrls: {
		night: 'modal.night.scss',
		light: 'modal.light.scss'
	},
	shadow: true
})
export class KvModal implements IModalConfig, IModalEvents {
	/** @inheritdoc */
	@Prop() label?: string;
	/** @inheritdoc */
	@Prop() hasBackdrop: boolean = true;
	/** @inheritdoc */
	@Prop() showCloseButton: boolean = true;

	/** @inheritdoc */
	@Event() clickClose: EventEmitter<void>;

	private onClose = (ev: MouseEvent) => {
		ev.preventDefault();
		this.clickClose.emit();
	};

	render() {
		return (
			<Host>
				<div
					class={{
						'modal-overlay': this.hasBackdrop
					}}
					onClick={this.onClose}
				/>
				<div class="modal-container">
					<div class="top-bar">
						<div class="title">{this.label}</div>
						<div class="actions">
							<slot name="more-top-actions"></slot>
							{this.showCloseButton && (
								<div class="close" onClick={this.onClose}>
									<kv-icon name={EIconName.Close} customClass="icon-20"></kv-icon>
								</div>
							)}
						</div>
					</div>
					<div class="content">
						<slot name="header"></slot>
						<div class="body">
							<slot name="body"></slot>
						</div>
						<div class="footer">
							<slot name="footer"></slot>
						</div>
					</div>
				</div>
			</Host>
		);
	}
}
