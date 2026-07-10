import { Component, Element, Host, Prop, State, h } from '@stencil/core';
import { ComputePositionConfig, Middleware, autoPlacement } from '@floating-ui/dom';

import { DEFAULT_AUTO_PLACEMENT_CONFIG, DEFAULT_DELAY_CONFIG, DEFAULT_HIDE_DELAY, DEFAULT_POSITION_CONFIG } from './tooltip.config';
import { CustomCssClass, ETooltipPosition } from '../../types';
import { ITooltip } from './tooltip.types';
import { isElementCollapsed } from './tooltip.utils';
import { isEmpty } from 'lodash-es';
import { getClassMap } from '../../utils/css-class.helper';
import { mergeComputePositionConfigs } from '../../utils/floating-ui.helper';
import { TOOLTIP_Z_INDEX } from '../../globals/config';
import { HostAttributes } from '@stencil/core/internal';

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
	@Prop({ reflect: true }) allowedPositions?: ETooltipPosition[];
	/** @inheritdoc */
	@Prop({ reflect: false }) options?: Partial<ComputePositionConfig> = DEFAULT_POSITION_CONFIG;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: false }) contentElement?: HTMLElement;
	/** @inheritdoc */
	@Prop({ reflect: false }) truncate?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) delay?: number = DEFAULT_DELAY_CONFIG;
	/** @inheritdoc */
	@Prop({ reflect: true }) hideDelay?: number = DEFAULT_HIDE_DELAY;
	/** @inheritdoc */
	@Prop({ reflect: true }) withArrow: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) customClass?: CustomCssClass = '';
	/** @inheritdoc */
	@Prop({ reflect: true }) customStyle?: HostAttributes['style'];

	/** The Host's element reference */
	@Element() el: HTMLKvTooltipElement;

	@State() showTooltip: boolean = false;
	@State() hoverContent: boolean = false;
	@State() hoverTooltip: boolean = false;

	private tooltipContent?: HTMLElement;

	private getContentElement = (): HTMLElement | undefined => {
		return this.contentElement ?? this.tooltipContent;
	};

	private getOptions = (): Partial<ComputePositionConfig> => {
		const placement = isEmpty(this.allowedPositions) ? this.position : undefined;
		const middleware: Array<Middleware> = [];

		if (!isEmpty(this.allowedPositions) && isEmpty(placement)) {
			middleware.push(
				autoPlacement({
					...DEFAULT_AUTO_PLACEMENT_CONFIG,
					allowedPlacements: this.allowedPositions
				})
			);
		}

		return mergeComputePositionConfigs({ placement, middleware }, this.options ?? {});
	};

	private hideTooltipHandler = (delay?: number) => {
		if (delay) {
			setTimeout(() => {
				if (!this.hoverContent && !this.hoverTooltip) {
					this.showTooltip = false;
				}
			}, delay);
			return;
		}
		this.showTooltip = false;
	};

	private getTooltipSlotElement = (): HTMLElement | null => {
		return this.el.querySelector('[slot="tooltip-text"]');
	};

	private showTooltipHandler = () => {
		if (this.disabled || (this.truncate && !isElementCollapsed(this.el))) return;
		this.showTooltip = true;
	};

	disconnectedCallback() {
		this.showTooltip = false;
	}

	render() {
		const tooltipSlotElement = this.getTooltipSlotElement();

		return (
			<Host>
				<div
					id="content"
					part="content"
					ref={el => (this.tooltipContent = el)}
					onMouseOver={() => {
						this.showTooltipHandler();
						this.hoverContent = true;
					}}
					onMouseOut={() => {
						this.hoverContent = false;
						this.hideTooltipHandler(!isEmpty(tooltipSlotElement) ? this.hideDelay : undefined);
					}}
					onBlur={() => {
						this.hoverContent = false;
						this.hideTooltipHandler(!isEmpty(tooltipSlotElement) ? this.hideDelay : undefined);
					}}
					onClick={() => {
						this.hoverContent = false;
						this.hideTooltipHandler();
					}}
				>
					<slot></slot>
				</div>
				{/* Hidden slot holder - always in DOM to capture slotted content */}
				<div style={{ display: 'none' }}>
					<slot name="tooltip-text"></slot>
				</div>
				{this.showTooltip && (!isEmpty(this.text) || !isEmpty(tooltipSlotElement)) && (
					<kv-portal
						zIndex={TOOLTIP_Z_INDEX}
						show={true}
						delay={this.delay}
						withArrow={this.withArrow}
						animated
						reference={this.getContentElement()}
						options={this.getOptions()}
					>
						<kv-tooltip-text
							class={{ ...getClassMap(this.customClass) }}
							text={this.text}
							style={this.customStyle}
							onMouseOver={() => {
								this.hoverTooltip = true;
								this.showTooltipHandler();
							}}
							onMouseOut={() => {
								this.hoverTooltip = false;
								this.hideTooltipHandler();
							}}
							onBlur={() => {
								this.hoverTooltip = false;
								this.hideTooltipHandler();
							}}
						>
							{tooltipSlotElement && <div innerHTML={tooltipSlotElement.innerHTML}></div>}
						</kv-tooltip-text>
					</kv-portal>
				)}
			</Host>
		);
	}
}
