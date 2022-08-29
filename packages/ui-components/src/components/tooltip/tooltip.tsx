import { autoPlacement, computePosition, ComputePositionConfig, offset, shift } from '@floating-ui/dom';
import { Host, h, Component, Prop, Element } from '@stencil/core';
import { isEmpty } from 'lodash-es';
import { ETooltipPosition } from '../../utils/types/components';

import { DEFAULT_AUTOPLACEMENT_CONFIG, DEFAULT_OFFSET, DEFAULT_SHIFT_CONFIG, DEFAULT_TOOLTIP_CONFIG } from './tooltip.config';

/**
 * @part container - The tooltip container.
 * @part content - The tooltip content.
 */
@Component({
	tag: 'kv-tooltip',
	styleUrl: 'tooltip.scss',
	shadow: true
})
export class KvTooltip {
	/** (required) Text of tooltip */
	@Prop({ reflect: true }) text!: string;
	/** (optional) Position of tooltip */
	@Prop({ reflect: true }) position?: ETooltipPosition;
	/** (optional) Array of allowed positions of tooltip (if defined the 'position' is ignored) */
	@Prop({ reflect: true }) allowedPositions?: ETooltipPosition[];
	/** (optional) Object with tooltip options */
	@Prop({ reflect: true }) options?: Partial<ComputePositionConfig>;

	/** The Host's element reference */
	@Element() el: HTMLKvTooltipElement;

	render() {
		return (
			<Host>
				<div id="content" class="tooltip-content" aria-describedby="tooltip" part="content">
					<slot></slot>
				</div>
				<div id="tooltip" class="tooltip-container" role="tooltip" part="container">
					{this.text}
				</div>
			</Host>
		);
	}

	componentDidRender() {
		const child = this.el.shadowRoot.querySelector('#content');
		const tooltip = this.el.shadowRoot.querySelector('#tooltip') as HTMLElement;

		const position = isEmpty(this.allowedPositions) ? this.position : undefined;
		const middleware = [offset(DEFAULT_OFFSET), shift(DEFAULT_SHIFT_CONFIG)];

		if (isEmpty(position)) {
			middleware.push(autoPlacement({ ...DEFAULT_AUTOPLACEMENT_CONFIG, allowedPlacements: this.allowedPositions }));
		}

		function update() {
			computePosition(child, tooltip, {
				...DEFAULT_TOOLTIP_CONFIG,
				placement: position,
				middleware
			}).then(({ x, y }) => {
				Object.assign(tooltip.style, {
					left: `${x}px`,
					top: `${y}px`
				});
			});
		}

		const showTooltip = () => {
			tooltip.style.display = 'inline-block';
			update();
		};

		const hideTooltip = () => {
			tooltip.style.display = '';
		};

		child.addEventListener('mouseenter', showTooltip);
		child.addEventListener('mouseleave', hideTooltip);
		child.addEventListener('focus', showTooltip);
		child.addEventListener('blur', hideTooltip);
	}
}
