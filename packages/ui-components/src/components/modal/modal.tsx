import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
import { EIconName } from '../icon/icon.types';
import { IModal, IModalEvents } from './modal.types';

@Component({
	tag: 'kv-modal',
	styleUrl: 'modal.scss',
	shadow: true
})
export class KvModal implements IModal, IModalEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) modalTitle: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) center: boolean;
	/** @inheritdoc */
	@Prop({ reflect: true }) closeClickOutside: boolean;
	/** @inheritdoc */
	@Event() clickCloseButton: EventEmitter<MouseEvent>;

	private onCloseClick = event => {
		this.clickCloseButton.emit(event);
	};

	private onClickModal = event => {
		if ((event.path[0] as HTMLElement).tagName === 'KV-MODAL' && this.closeClickOutside) this.onCloseClick(event);
	};

	render() {
		return (
			<Host onClick={this.onClickModal}>
				<div class={{ 'modal-container': true, 'center': this.center }}>
					<div class="top-bar">
						<div class="title">{this.modalTitle}</div>
						<div class="actions">
							<ng-content select="[more-top-actions]"></ng-content>
							<div class="close" onClick={this.onCloseClick}>
								<kv-icon name={EIconName.Close} customClass="pk-grey3 icon-20"></kv-icon>
							</div>
						</div>
					</div>
					<div class="content">
						<slot></slot>
					</div>
				</div>
			</Host>
		);
	}
}
