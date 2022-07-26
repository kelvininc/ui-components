import { Component, Prop, h, Host, Element, State } from '@stencil/core';
import { ResizeSensor } from 'css-element-queries';
import { isEmpty } from 'lodash-es';
import clipboardHelper from '../../utils/clipboard.helper';
import { EIconName } from '../icon/icon.types';
import { DEFAULT_DESCRIPTION_COLLAPSED_TEXT, DEFAULT_DESCRIPTION_OPENED_TEXT } from './info-label.config';
import { COPY_TOOLTIP } from './info-label.types';

@Component({
	tag: 'kv-info-label',
	styleUrls: {
		night: 'info-label.night.scss',
		light: 'info-label.light.scss'
	},
	shadow: true
})
export class KvInfoLabel {
	private descriptionContainer: Element;
	private tooltipConfig = COPY_TOOLTIP;
	private resizeSensor: ResizeSensor = null;

	/** Define if the show more button needed to be visible */
	@State() enableShowMoreButton = false;
	/** Define if the label content is completely visible */
	@State() showMore = false;
	/** Store the current div content height */
	@State() currentDescriptionHeight: number = null;

	/** (required) Info label title */
	@Prop({ reflect: true }) labelTitle!: string;
	/** (optional) Info label description */
	@Prop({ reflect: true }) description?: string;
	/** (optional) Info label description height */
	@Prop({ reflect: true }) descriptionHeight?: number;
	/** (optional) Info label description collapse text */
	@Prop({ reflect: true }) descriptionCollapsedText = DEFAULT_DESCRIPTION_COLLAPSED_TEXT;
	/** (optional) Info label description opened text */
	@Prop({ reflect: true }) descriptionOpenedText = DEFAULT_DESCRIPTION_OPENED_TEXT;
	/** (optional) Info label copy value */
	@Prop({ reflect: true }) copyValue?: string;

	/** The Host's element reference */
	@Element() el: HTMLKvInfoLabelElement;

	get showMoreButtonLabel() {
		return this.showMore ? this.descriptionOpenedText : this.descriptionCollapsedText;
	}

	private loadDescriptionHeight() {
		if (this.descriptionHeight !== undefined) {
			const descriptionHeight = this.descriptionContainer.clientHeight;
			this.enableShowMoreButton = descriptionHeight !== undefined && descriptionHeight > this.descriptionHeight;
		} else {
			this.enableShowMoreButton = false;
		}
		this.showMore = this.enableShowMoreButton ? this.showMore : false;
		this.currentDescriptionHeight = this.enableShowMoreButton && !this.showMore ? this.descriptionHeight : null;
	}

	private onShowMoreToggle = () => {
		this.showMore = !this.showMore;

		if (this.showMore) {
			const textElementHeight = this.descriptionContainer.clientHeight;
			this.currentDescriptionHeight = textElementHeight;
			return;
		}

		this.currentDescriptionHeight = this.descriptionHeight;
	};

	private onClickCopyAction = async () => {
		const tooltip: HTMLKvTooltipElement = this.el.shadowRoot.querySelector('kv-tooltip');
		const tooltipText = tooltip.shadowRoot.querySelector('#tooltip') as HTMLElement;
		if (await clipboardHelper.copyTextToClipboard(this.copyValue)) {
			tooltipText.innerText = this.tooltipConfig.copyTooltipResultLabel;
		} else {
			console.error('Copy to clipboard failed');
		}
	};

	componentDidRender() {
		this.descriptionContainer = this.el.shadowRoot.querySelector('.description');

		if (this.descriptionHeight > 0) {
			this.resizeSensor = new ResizeSensor(this.descriptionContainer, () => {
				this.loadDescriptionHeight();
			});
		}
	}

	disconnectedCallback() {
		this.resizeSensor?.reset();
		this.resizeSensor?.detach();
		this.resizeSensor = null;
	}

	render() {
		return (
			<Host>
				<div class="info-label">
					{this.labelTitle && <div class={{ 'title': true, 'no-description': isEmpty(this.description) }}>{this.labelTitle}</div>}
					{this.description && (
						<div style={{ height: `${this.currentDescriptionHeight}px` }} class="description-wrapper">
							<div class="description">
								{this.description && <div class="text">{this.description}</div>}
								{this.copyValue && (
									<kv-tooltip text={this.tooltipConfig.copyTooltipLabel} position={this.tooltipConfig.tooltipPosition}>
										<kv-icon class="copy-icon" name={EIconName.Copy} onClick={this.onClickCopyAction} />
									</kv-tooltip>
								)}
								<slot></slot>
							</div>
						</div>
					)}
					{this.enableShowMoreButton && (
						<div class={{ 'expand-description-button': true, 'expanded': this.showMore }} onClick={this.onShowMoreToggle}>
							{this.showMoreButtonLabel}
							<kv-icon name={EIconName.Expand} />
						</div>
					)}
				</div>
			</Host>
		);
	}
}
