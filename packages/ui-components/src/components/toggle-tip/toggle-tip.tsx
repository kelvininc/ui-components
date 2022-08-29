import { autoPlacement, computePosition, offset, shift, arrow } from '@floating-ui/dom';
import { Component, Host, h, Prop, Element, Listen, Event, EventEmitter } from '@stencil/core';
import { isEmpty } from 'lodash-es';
import { ETooltipPosition } from '../../utils/types/components';
import { DEFAULT_AUTOPLACEMENT_CONFIG, DEFAULT_OFFSET, DEFAULT_SHIFT_CONFIG, DEFAULT_TOOLTIP_CONFIG } from '../tooltip/tooltip.config';
import { getArrowElementPositionConfig, OFFSET_WITH_ARROW } from './toggle-tip.config';
import { IToggleTip, IToggleTipEvents } from './toggle-tip.types';

/**
 * @part toggle-tip-container - The toggle tip container.
 * @part toggle-tip-slot-content - The toggle tip slot content.
 */
@Component({
	tag: 'kv-toggle-tip',
	styleUrl: 'toggle-tip.scss',
	shadow: true
})
export class KvToggleTip implements IToggleTip, IToggleTipEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) text?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) position?: ETooltipPosition;
	/** @inheritdoc */
	@Prop({ reflect: true }) allowedPositions?: ETooltipPosition[];
	/** @inheritdoc */
	@Prop({ reflect: true, mutable: true }) isOpen?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) isFixed?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) withArrow?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: false }) openElement?: HTMLElement = null;
	/** @inheritdoc */
	@Prop({ reflect: false }) containerElement?: HTMLElement = null;
	/** @inheritdoc */
	@Prop({ reflect: false }) arrowElement?: HTMLElement = null;

	/** @inheritdoc */
	@Event() openStateChange: EventEmitter<boolean>;

	/** The Host's element reference */
	@Element() el: HTMLKvToggleTipElement;

	@Listen('click', { target: 'window' })
	checkForClickOutside(ev: { target: Node }) {
		if (!this.isFixed) {
			if (this.el.contains(ev.target)) {
				return;
			}
			if (this.isOpen) {
				this.isOpen = false;
				this.addButtonClickEvent();
				this.openStateChange.emit(false);
			}
		}
	}

	componentDidRender() {
		this.calculateTogglePositions();
	}

	private getToggleOpenElement = (): HTMLElement | null => {
		return this.openElement ?? (this.el.shadowRoot.querySelector('#toggle-tip-open-element-wrapper') as HTMLElement | null);
	};

	private getToggleTipContainerElement = (): HTMLElement | null => {
		return this.containerElement ?? (this.el.shadowRoot.querySelector('#toggle-tip-container') as HTMLElement | null);
	};

	private getToggleTipArrowElement = (): HTMLElement | null => {
		return this.arrowElement ?? (this.el.shadowRoot.querySelector('#toggle-tip-arrow') as HTMLElement | null);
	};

	private getMiddlewareConfig = () => {
		const arrowElement = this.getToggleTipArrowElement();

		const offSet = this.withArrow ? OFFSET_WITH_ARROW : DEFAULT_OFFSET;
		const middleware = [offset(offSet), shift(DEFAULT_SHIFT_CONFIG)];
		if (this.withArrow) middleware.push(arrow({ element: arrowElement, padding: 5 }));

		return middleware;
	};

	private onButtonClick = () => {
		this.isOpen = !this.isOpen;
		this.openStateChange.emit(this.isOpen);
	};

	private addButtonClickEvent = () => {
		const toggleIcon = this.getToggleOpenElement();
		toggleIcon.addEventListener('click', this.onButtonClick);
	};

	private calculateTogglePositions = () => {
		const toggleIcon = this.getToggleOpenElement();
		const toggletip = this.getToggleTipContainerElement();
		const arrowElement = this.getToggleTipArrowElement();

		const position = isEmpty(this.allowedPositions) ? this.position : undefined;
		const middleware = this.getMiddlewareConfig();

		if (isEmpty(position)) {
			middleware.push(
				autoPlacement({
					...DEFAULT_AUTOPLACEMENT_CONFIG,
					allowedPlacements: this.allowedPositions
				})
			);
		}

		computePosition(toggleIcon, toggletip, {
			...DEFAULT_TOOLTIP_CONFIG,
			placement: position,
			middleware
		}).then(({ x, y, placement, middlewareData }) => {
			Object.assign(toggletip.style, {
				left: `${x}px`,
				top: `${y}px`
			});

			if (this.withArrow) {
				const { x: arrowX, y: arrowY } = middlewareData.arrow;
				Object.assign(arrowElement.style, {
					...getArrowElementPositionConfig(arrowX, arrowY, placement)
				});
			}
		});

		toggletip.style.display = this.isOpen ? 'inline-block' : '';

		if (!this.disabled) {
			this.addButtonClickEvent();
		}
	};

	render() {
		return (
			<Host>
				<div id="toggle-tip-open-element-wrapper" class="toggle-tip-open-element-wrapper">
					<slot name="open-element-slot"></slot>
				</div>
				<div id="toggle-tip-container" class="toggle-tip-container" part="toggle-tip-container">
					{this.text && <div class="toggle-tip-text">{this.text}</div>}
					<div class="toggle-tip-slot" part="toggle-tip-slot-content">
						<slot name="content-slot"></slot>
					</div>
					{this.withArrow && <div id="toggle-tip-arrow" class="toggle-tip-arrow"></div>}
				</div>
			</Host>
		);
	}
}
