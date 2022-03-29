import { Host, h, Component, Prop } from '@stencil/core';
import { ToasterTypesEnum, TYPES_ICONS } from './toaster.types';

@Component({
	tag: 'kv-toaster',
	styleUrl: 'toaster.scss',
	shadow: true
})
export class KvToaster {
	typesIcons = TYPES_ICONS;

	/** (optional) Message text toaster */
	@Prop({ reflect: true }) messageText: string;
	/** (optional) Description text toaster */
	@Prop({ reflect: true }) descriptionText: string;
	/** (optional) Message type toaster */
	@Prop({ reflect: true }) type: ToasterTypesEnum;

	private onEnter = () => {

	}

	private onLeave = () => {

	}

	private onClose = () => {

	}

	render() {
		return (
			<Host>
				{this.messageText && this.type && <div
					class={`toaster-container ${this.type}`}
					onMouseEnter={this.onEnter}
					onMouseLeave={this.onLeave}
				>
					<kv-svg-icon
						class="type-icon"
						name={this.typesIcons[this.type]}
						customClass="icon-20">
					</kv-svg-icon>
					<div class="message-content">
						<div class="message">{ this.messageText }</div>
						<div class="description">{ this.descriptionText }</div>
					</div>
					<kv-svg-icon
						name="pk-close"
						class="close-button"
						customClass="pk-grey3"
						onClick={this.onClose}>
					</kv-svg-icon>
				</div>}
			</Host>
		);
	}
}
