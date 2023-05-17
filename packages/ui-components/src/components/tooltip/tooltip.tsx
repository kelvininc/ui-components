import { Component, Element, Host, Prop, State, Watch, h } from '@stencil/core';
import { ComputePositionConfig, computePosition } from '@floating-ui/dom';
import { isEmpty, isEqual, merge } from 'lodash-es';

import { DEFAULT_DELAY_CONFIG, DEFAULT_POSITION_CONFIG, TOOLTIP_TEXT_ID } from './tooltip.config';
import { ETooltipPosition } from '../../types';
import { ITooltip } from './tooltip.types';
import { forwardStyleProperties, isElementCollapsed } from './tooltip.utils';

/**
 * @part content - The tooltip content.
 */
@Component({
	tag: 'kv-tooltip',
	shadow: true
})
export class KvTooltip implements ITooltip {
	/** @inheritdoc */
	@Prop({ reflect: true }) text: string = '';
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
	/** @inheritdoc */
	@Prop({ reflect: true }) delay?: number = DEFAULT_DELAY_CONFIG;

	@State() timeoutDelayId?: number;

	/** The Host's element reference */
	@Element() el: HTMLKvTooltipElement;

	@Watch('text')
	textChangeWatcher(newValue: string) {
		if (isEqual(this.text, newValue)) {
			return;
		}
		this.text = newValue;
		this.update(false);
	}

	private getOptions = (): Partial<ComputePositionConfig> => {
		return merge({}, { placement: this.position }, this.options);
	};

	private getTooltipElement = (): HTMLElement => {
		const tooltipEl = document.getElementById(TOOLTIP_TEXT_ID);
		if (tooltipEl) {
			return tooltipEl;
		}

		const tooltipElement = document.createElement('kv-tooltip-text');
		tooltipElement.style.position = 'absolute';
		tooltipElement.setAttribute('id', TOOLTIP_TEXT_ID);
		tooltipElement.setAttribute('text', this.text);
		tooltipElement.setAttribute('visible', 'false');
		document.body.append(tooltipElement);

		return tooltipElement;
	};

	private getContentElement = (): HTMLElement | null => {
		return this.contentElement ?? (this.el.shadowRoot.querySelector('#content') as HTMLElement | null);
	};

	private showTooltipHandler = () => {
		if (this.truncate && !isElementCollapsed(this.el)) return;

		if (this.delay) {
			this.timeoutDelayId = window.setTimeout(() => {
				this.update();
			}, this.delay);
		} else {
			this.update();
		}
	};

	private hideTooltip = () => {
		const tooltip = this.getTooltipElement();

		tooltip.setAttribute('visible', 'false');
	};

	private hideTooltipHandler = () => {
		this.hideTooltip();
		if (this.timeoutDelayId) {
			clearTimeout(this.timeoutDelayId);
			this.timeoutDelayId = undefined;
		}
	};

	private update = (forceVisibility = true) => {
		const tooltip = this.getTooltipElement();
		const child = this.getContentElement();
		if (!child || isEmpty(this.text)) return;

		tooltip.setAttribute('text', this.text);
		forwardStyleProperties(tooltip, this.el);
		// We need the timeout to have the tooltip-container sizes updated before compute the position
		setTimeout(() => {
			computePosition(child, tooltip.shadowRoot.querySelector('.tooltip-container'), this.getOptions()).then(({ x, y }) => {
				tooltip.style.left = `${x}px`;
				tooltip.style.top = `${y}px`;
				if (forceVisibility) {
					tooltip.setAttribute('visible', 'true');
				}
			});
		}, 100);
	};

	render() {
		return (
			<Host>
				<div
					id="content"
					part="content"
					onMouseOver={this.showTooltipHandler}
					onMouseOut={this.hideTooltipHandler}
					onBlur={this.hideTooltipHandler}
					onClick={this.hideTooltipHandler}
				>
					<slot></slot>
				</div>
			</Host>
		);
	}
}
