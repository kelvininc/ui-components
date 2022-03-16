import { autoPlacement, computePosition, offset, shift } from '@floating-ui/dom';
import { Host, h, Component, Prop, Element } from '@stencil/core';
import { isEmpty } from 'lodash-es';
import { TooltipPosition } from './tooltip.types';

@Component({
	tag: 'kv-tooltip',
	styleUrl: 'tooltip.scss',
	shadow: true
})
export class KvTooltip {
	/** (required) Text of tooltip */
	@Prop({ reflect: true }) text!: string;
	/** (optional) Position of tooltip */
	@Prop({ reflect: true }) position: TooltipPosition;
	/** (optional) Array of allowed positions of tooltip (if defined the 'position' is ignored) */
	@Prop({ reflect: true }) allowedPositions: TooltipPosition[];

	/** The Host's element reference */
	@Element() el: HTMLKvTooltipElement;

	render() {
		return (
			<Host>
				<div id="content" class="tooltip-content" aria-describedby="tooltip">
					<slot></slot>
				</div>
				<div id="tooltip" class="tooltip-container" role="tooltip">
					{this.text}
				</div>
			</Host>
		);
	}

	componentDidRender() {
		const child = this.el.shadowRoot.querySelector('#content');
		const tooltip = this.el.shadowRoot.querySelector('#tooltip') as HTMLElement;

		const position = isEmpty(this.allowedPositions) ? this.position : undefined;
		const middleware = [offset(5), shift({ padding: 5 })];

		if (isEmpty(position)) {
			middleware.push(autoPlacement({ padding: 5, allowedPlacements: this.allowedPositions }));
		}

		function update() {
			computePosition(child, tooltip, {
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
			tooltip.style.display = 'block';
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
