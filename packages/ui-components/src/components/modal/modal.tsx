import { Component, Host, h, Prop, Event, EventEmitter, Listen } from '@stencil/core';
import { CustomCssClass } from '../../types';
import { getClassMap } from '../../utils/css-class.helper';
import { EIconName } from '../icon/icon.types';
import { IModalConfig, IModalEvents } from './modal.types';

/**
 * @part topbar - The modal's topbar section.
 * @part content - The modal's content section.
 */
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
	@Prop() headerTitle?: string;
	/** @inheritdoc */
	@Prop() showOverlay?: boolean = true;
	/** @inheritdoc */
	@Prop() showCloseButton?: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: true }) customClass: CustomCssClass = '';

	/** @inheritdoc */
	@Event() clickClose: EventEmitter<MouseEvent>;
	/** @inheritdoc */
	@Event() clickOverlay: EventEmitter<MouseEvent>;
	/** @inheritdoc */
	@Event() escapeKeyPressed: EventEmitter<KeyboardEvent>;

	@Listen('keydown', { target: 'document' })
	handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			event.preventDefault();
			this.escapeKeyPressed.emit(event);
		}
	}

	private onClose = (ev: MouseEvent) => {
		ev.preventDefault();
		this.clickClose.emit(ev);
	};

	private onClickOverlay = (ev: MouseEvent) => {
		ev.preventDefault();
		this.clickOverlay.emit(ev);
	};

	render() {
		return (
			<Host class={getClassMap(this.customClass)}>
				<div class={{ 'modal-overlay': this.showOverlay }} onClick={this.onClickOverlay} />
				<div class="modal-container">
					<div class="topbar" part="topbar">
						<div class="title">{this.headerTitle}</div>
						<div class="actions">
							<slot name="more-topbar-actions"></slot>
							{this.showCloseButton && (
								<div class="close-button" onClick={this.onClose}>
									<kv-icon name={EIconName.Close} />
								</div>
							)}
						</div>
					</div>
					<div class="content" part="content">
						<slot name="header"></slot>
						<slot name="body"></slot>
						<slot name="footer"></slot>
					</div>
				</div>
			</Host>
		);
	}
}
