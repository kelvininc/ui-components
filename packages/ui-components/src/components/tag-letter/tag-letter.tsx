import { Component, Host, h, Prop } from '@stencil/core';

@Component({
	tag: 'kv-tag-letter',
	styleUrl: 'tag-letter.scss',
	shadow: true
})
export class KvTagLetter {
	/** (optional) Tag letter's color */
	@Prop({ reflect: true }) color: string;
	/** (required) Tag letter's label */
	@Prop({ reflect: true }) label!: string;
	/** (optional) Tag letter's letter */
	@Prop({ reflect: true }) tagLetter: string;

	render() {
		return (
			<Host>
				<div class="tag-letter-container" style={{ borderColor: this.color }}>
					<div class="letter-avatar" style={{ backgroundColor: this.color }}>
						<div class="avatar">{this.tagLetter}</div>
					</div>
					<div class="label">{this.label}</div>
				</div>
			</Host>
		);
	}
}
