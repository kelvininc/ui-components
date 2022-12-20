import { Component, Element, Host, Prop, State, h } from '@stencil/core';
import { ComputePositionConfig, computePosition } from '@floating-ui/dom';
import { isEmpty, merge } from 'lodash-es';

import { DEFAULT_DELAY_CONFIG, DEFAULT_POSITION_CONFIG } from './tooltip.config';
import { ETooltipPosition } from '../../types';
import { ITooltip } from './tooltip.types';
import { isElementCollpased } from './tooltip.utils';

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
	/** (optional) Delay to show tooltip in milliseconds. */
	@Prop({ reflect: true }) delay?: number = DEFAULT_DELAY_CONFIG;
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
	/** @inheritdoc */
	@Prop({ reflect: false }) truncate?: boolean = false;

	@State() timeoutDelayId?: number;

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

	private showTooltipHandler = () => {
		if (this.truncate && !isElementCollpased(this.el)) return;

		if (this.delay) {
			this.timeoutDelayId = window.setTimeout(() => {
				this.showTooltip();
			}, this.delay);
		} else {
			this.showTooltip();
		}
	};

	private hideTooltip = () => {
		const tooltip = this.getTooltipElement();
		tooltip.style.display = '';
	};

	private hideTooltipHandler = () => {
		this.hideTooltip();
		if (this.timeoutDelayId) {
			clearTimeout(this.timeoutDelayId);
			this.timeoutDelayId = undefined;
		}
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
		child.addEventListener('mouseenter', this.showTooltipHandler);
		child.addEventListener('mouseleave', this.hideTooltipHandler);
		child.addEventListener('focus', this.showTooltip);
		child.addEventListener('blur', this.hideTooltip);
	};

	private unlistenToEvents = (child: HTMLElement) => {
		child.removeEventListener('mouseenter', this.showTooltipHandler);
		child.removeEventListener('mouseleave', this.hideTooltipHandler);
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
		if (child) {
			this.unlistenToEvents(child);
		}
	}

	render() {
		return (
			<Host>
				<div id="content" aria-describedby="tooltip" part="content">
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
