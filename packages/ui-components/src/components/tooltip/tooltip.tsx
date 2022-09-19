import { computePosition, ComputePositionConfig } from '@floating-ui/dom';
import { Host, h, Component, Prop, Element } from '@stencil/core';
import { isEmpty, merge } from 'lodash-es';

import { ETooltipPosition } from '../../types';
import { DEFAULT_POSITION_CONFIG } from './tooltip.config';
import { ITooltip } from './tooltip.types';

/**
 * @part container - The tooltip container.
 * @part content - The tooltip content.
 */
@Component({
	tag: 'kv-tooltip',
	styleUrl: 'tooltip.scss',
	shadow: true
})
export class KvTooltip implements ITooltip {
	/** @inheritdoc */
	@Prop({ reflect: true }) text: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) position?: ETooltipPosition;
	/** @inheritdoc */
	@Prop({ reflect: false }) options?: Partial<ComputePositionConfig> = DEFAULT_POSITION_CONFIG;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: false }) contentElement?: HTMLElement = null;

	/** The Host's element reference */
	@Element() el: HTMLKvTooltipElement;

	private getOptions = (): Partial<ComputePositionConfig> => {
		return merge({}, { placement: this.position }, this.options);
	};

	private getTooltipElement = (): HTMLElement | null => {
		return this.el.shadowRoot.querySelector('#tooltip') as HTMLElement | null;
	};

	private getContentElement = (): HTMLElement | null => {
		return this.contentElement ?? (this.el.shadowRoot.querySelector('#content') as HTMLElement | null);
	};

	private showTooltip = () => {
		if (!this.disabled) {
			const tooltip = this.getTooltipElement();
			tooltip.style.display = 'inline-block';
			this.update();
		}
	};

	private hideTooltip = () => {
		const tooltip = this.getTooltipElement();
		tooltip.style.display = '';
	};

	private update = () => {
		const tooltip = this.getTooltipElement();
		const child = this.getContentElement();

		computePosition(child, tooltip, this.getOptions()).then(({ x, y }) => {
			tooltip.style.left = `${x}px`;
			tooltip.style.top = `${y}px`;
		});
	};

	private listenToEvents = (child: HTMLElement) => {
		child.addEventListener('mouseenter', this.showTooltip);
		child.addEventListener('mouseleave', this.hideTooltip);
		child.addEventListener('focus', this.showTooltip);
		child.addEventListener('blur', this.hideTooltip);
	};

	private unlistenToEvents = (child: HTMLElement) => {
		child.removeEventListener('mouseenter', this.showTooltip);
		child.removeEventListener('mouseleave', this.hideTooltip);
		child.removeEventListener('focus', this.showTooltip);
		child.removeEventListener('blur', this.hideTooltip);
	};

	componentDidRender() {
		const child = this.getContentElement();
		const tooltip = this.getTooltipElement();

		if (tooltip === null) {
			return;
		}
		this.unlistenToEvents(child);
		this.listenToEvents(child);
	}

	disconnectedCallback() {
		const child = this.getContentElement();
		this.unlistenToEvents(child);
	}

	render() {
		return (
			<Host>
				<div id="content" class="tooltip-content" aria-describedby="tooltip" part="content">
					<slot></slot>
				</div>
				{!isEmpty(this.text) && (
					<div id="tooltip" class="tooltip-container" role="tooltip" part="container">
						{this.text}
					</div>
				)}
			</Host>
		);
	}
}
