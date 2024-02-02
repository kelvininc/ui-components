import { Component, Host, Prop, State, h } from '@stencil/core';
import { ECopyToClipboardState, ICopyToClipboard } from './copy-to-clipboard.types';
import { ICON_CONFIGS, STATE_TRANSITION_DURATION_MS, DEFAULT_TOOLTIP_CONFIG, DEFAULT_TOOLTIP_DELAY, UNABLE_TO_COPY_ERROR } from './copy-to-clipboard.config';
import { copyTextToClipboard } from '../../utils/clipboard.helper';
import { getTooltipText } from './copy-to-clipboard.utils';
import { ComputePositionConfig } from '@floating-ui/dom';

/**
 * @part content - The container for the content
 * @part icon - The copy icon
 */
@Component({
	tag: 'kv-copy-to-clipboard',
	styleUrl: 'copy-to-clipboard.scss',
	shadow: true
})
export class KvCopyToClipboard implements ICopyToClipboard {
	/** @inheritdoc */
	@Prop({ reflect: true }) copiableText: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) tooltipSuffix?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) tooltipDelay?: number = DEFAULT_TOOLTIP_DELAY;
	/** @inheritdoc */
	@Prop({ reflect: true }) tooltipConfig?: Partial<ComputePositionConfig> = DEFAULT_TOOLTIP_CONFIG;

	@State() copyState: ECopyToClipboardState = ECopyToClipboardState.ReadyToCopy;

	private onTextCopy = async (ev: MouseEvent) => {
		ev.stopPropagation();

		if (this.copyState === ECopyToClipboardState.Copied) return;

		try {
			await copyTextToClipboard(this.copiableText);
			this.copyState = ECopyToClipboardState.Copied;
			setTimeout(() => (this.copyState = ECopyToClipboardState.ReadyToCopy), STATE_TRANSITION_DURATION_MS);
		} catch {
			throw new Error(UNABLE_TO_COPY_ERROR);
		}
	};

	private get tooltipText() {
		return getTooltipText(this.copyState, this.tooltipSuffix);
	}

	render() {
		return (
			<Host>
				<kv-tooltip text={this.tooltipText} options={this.tooltipConfig} delay={this.tooltipDelay} onClick={this.onTextCopy}>
					<div part="content" class="copy-to-clipboard-container">
						<slot></slot>
						<div
							class={{
								'state-icon': true,
								'state-icon--success': this.copyState === ECopyToClipboardState.Copied
							}}
						>
							<kv-icon name={ICON_CONFIGS[this.copyState]} part="icon" />
						</div>
					</div>
				</kv-tooltip>
			</Host>
		);
	}
}
