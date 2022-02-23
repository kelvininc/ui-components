import { Component, Host, h, Prop, EventEmitter, Event } from '@stencil/core';
import { EAnchorTarget, IAnchor } from '../../utils/types/anchor';

@Component({
	tag: 'kv-link',
	styleUrl: 'link.scss',
	shadow: true
})
export class KvLink implements IAnchor {
	/** (required) Main component label */
	@Prop({ reflect: true }) label!: string;
	/** (optional) Description for the label */
	@Prop({ reflect: true }) subtitle?: string;
	/** (optional) The link to open when clicking on the tag */
	@Prop({ reflect: true }) href?: string;
	/** (optional) The link to open when clicking on the tag */
	@Prop({ reflect: true }) target?: EAnchorTarget;

	/** Emitted when clicking the label */
	@Event() labelClick: EventEmitter<MouseEvent>;

	private onLabelClick = event => {
		this.labelClick.emit(event);
	};

	render() {
		return (
			<Host>
				<div class="link-container">
					<a class="label" href={this.href} target={this.target} onClick={this.onLabelClick}>
						{this.label}
					</a>
					{this.subtitle && <div class="subtitle">{this.subtitle}</div>}
				</div>
			</Host>
		);
	}
}
