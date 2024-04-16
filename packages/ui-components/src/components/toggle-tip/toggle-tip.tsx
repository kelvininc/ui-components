import { autoPlacement, ComputePositionConfig, Middleware } from '@floating-ui/dom';
import { Component, Host, h, Prop, Element, Listen, Event, EventEmitter } from '@stencil/core';
import { isEmpty } from 'lodash-es';
import { CustomCssClass, ETooltipPosition } from '../../utils/types/components';
import { DEFAULT_AUTO_PLACEMENT_CONFIG, DEFAULT_TOOLTIP_CONFIG } from './toggle-tip.config';
import { IToggleTip, IToggleTipEvents } from './toggle-tip.types';
import { getClassMap } from '../../utils/css-class.helper';
import { didClickOnElement } from '../../utils/mouse-event.helper';
import { TOGGLE_TIP_Z_INDEX } from '../../globals/config';
import { mergeComputePositionConfigs } from '../../utils/floating-ui.helper';

@Component({
	tag: 'kv-toggle-tip',
	styleUrl: 'toggle-tip.scss',
	shadow: false
})
export class KvToggleTip implements IToggleTip, IToggleTipEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) text?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) position?: ETooltipPosition;
	/** @inheritdoc */
	@Prop({ reflect: true }) allowedPositions?: ETooltipPosition[];
	/** @inheritdoc */
	@Prop({ reflect: false }) options?: Partial<ComputePositionConfig> = DEFAULT_TOOLTIP_CONFIG;
	/** @inheritdoc */
	@Prop({ reflect: true, mutable: true }) isOpen?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) isFixed?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) withArrow?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) customClass?: CustomCssClass = '';

	/** @inheritdoc */
	@Event() openStateChange: EventEmitter<boolean>;

	/** The Host's element reference */
	@Element() el: HTMLKvToggleTipElement;

	@Listen('click', { target: 'window' })
	checkForClickOutside(event) {
		if (!this.isFixed) {
			// Check if clicked inside the toggle tip
			if (didClickOnElement(this.portal, event) || didClickOnElement(this.openElement, event)) {
				return;
			}
			if (this.isOpen) {
				this.isOpen = false;
				this.openStateChange.emit(false);
			}
		}
	}

	private portal: HTMLElement;
	private openElement: HTMLElement;

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

	private onButtonClick = () => {
		if (this.disabled) {
			return;
		}

		this.isOpen = !this.isOpen;
		this.openStateChange.emit(this.isOpen);
	};

	disconnectedCallback() {
		// Requires deleting portal from outside KvPortal because KvPortal is moved to global context
		// and would only be destroyed when the global context is destroyed.
		this.portal.remove();
	}

	render() {
		return (
			<Host>
				<div ref={el => (this.openElement = el)} onClick={this.onButtonClick} class="toggle-tip-open-element-container">
					<slot name="open-element-slot"></slot>
				</div>
				<kv-portal
					zIndex={TOGGLE_TIP_Z_INDEX}
					ref={el => (this.portal = el)}
					withArrow={this.withArrow}
					animated
					show={this.isOpen}
					reference={this.openElement}
					options={this.getOptions()}
				>
					<kv-tooltip-text class={{ 'toggle-tip-container': true, ...getClassMap(this.customClass) }} text={this.text}>
						{/* Shadow Root should be false to slot work here */}
						<div>
							<slot name="content-slot" />
						</div>
					</kv-tooltip-text>
				</kv-portal>
			</Host>
		);
	}
}
