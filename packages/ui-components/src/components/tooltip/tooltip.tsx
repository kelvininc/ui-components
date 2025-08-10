import { Component, Element, Host, Prop, State, h } from '@stencil/core';
import { ComputePositionConfig, Middleware, autoPlacement } from '@floating-ui/dom';

import { DEFAULT_AUTO_PLACEMENT_CONFIG, DEFAULT_DELAY_CONFIG, DEFAULT_POSITION_CONFIG } from './tooltip.config';
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
	@Prop({ reflect: false }) contentElement?: HTMLElement = null;
	/** @inheritdoc */
	@Prop({ reflect: false }) truncate?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) delay?: number = DEFAULT_DELAY_CONFIG;
	/** @inheritdoc */
	@Prop({ reflect: true }) withArrow: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) customClass?: CustomCssClass = '';
	/** @inheritdoc */
	@Prop({ reflect: true }) customStyle?: HostAttributes['style'];

	/** The Host's element reference */
	@Element() el: HTMLKvTooltipElement;

	@State() showTooltip: boolean = false;

	private tooltipContent: HTMLElement;

	private getContentElement = (): HTMLElement | null => {
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

		return mergeComputePositionConfigs({ placement, middleware }, this.options);
	};

	private hideTooltipHandler = () => {
		this.showTooltip = false;
	};

	private showTooltipHandler = () => {
		if (this.disabled || (this.truncate && !isElementCollapsed(this.el))) return;
		this.showTooltip = true;
	};

	disconnectedCallback() {
		this.showTooltip = false;
	}

	render() {
		return (
			<Host>
				<div
					id="content"
					part="content"
					ref={el => (this.tooltipContent = el)}
					onMouseOver={this.showTooltipHandler}
					onMouseOut={this.hideTooltipHandler}
					onBlur={this.hideTooltipHandler}
					onClick={this.hideTooltipHandler}
				>
					<slot></slot>
				</div>
				{this.showTooltip && !isEmpty(this.text) && (
					<kv-portal
						zIndex={TOOLTIP_Z_INDEX}
						show={true}
						delay={this.delay}
						withArrow={this.withArrow}
						animated
						reference={this.getContentElement()}
						options={this.getOptions()}
					>
						<kv-tooltip-text class={{ ...getClassMap(this.customClass) }} text={this.text} style={this.customStyle}>
							<slot name="tooltip-content" />
						</kv-tooltip-text>
					</kv-portal>
				)}
			</Host>
		);
	}
}
