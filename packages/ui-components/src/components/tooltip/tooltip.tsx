import { computePosition, ComputePositionConfig } from '@floating-ui/dom';
import { Host, h, Component, Prop, Element } from '@stencil/core';
import { isEmpty, merge } from 'lodash-es';

import { DEFAULT_POSITION_CONFIG } from './tooltip.config';
import { ETooltipPosition } from './tooltip.types';

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
	/** (optional) Object with tooltip position options */
	@Prop({ reflect: false }) options?: Partial<ComputePositionConfig> = DEFAULT_POSITION_CONFIG;

	/** The Host's element reference */
	@Element() el: HTMLKvTooltipElement;

	private getOptions = (): Partial<ComputePositionConfig> => {
		return merge({}, { placement: this.position }, this.options);
	};

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

	componentDidRender() {
		const child = this.el.shadowRoot.querySelector('#content');
		const tooltip = this.el.shadowRoot.querySelector('#tooltip') as HTMLElement;

		if (tooltip === null) {
			return;
		}

		const update = () => {
			computePosition(child, tooltip, this.getOptions()).then(({ x, y }) => {
				tooltip.style.left = `${x}px`;
				tooltip.style.top = `${y}px`;
			});
		};

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
