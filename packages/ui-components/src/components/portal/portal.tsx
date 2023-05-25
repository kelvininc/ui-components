import { arrow, autoUpdate, computePosition, ComputePositionConfig, offset, shift } from '@floating-ui/dom';
import { Component, Element, Event, EventEmitter, h, Host, Prop, State } from '@stencil/core';
import { IPortal, IPortalEvents } from './portal.types';
import { isNil } from 'lodash';
import { DEFAULT_OFFSET, DEFAULT_SHIFT_CONFIG, getArrowElementPositionConfig, OFFSET_WITH_ARROW, Z_INDEX } from './portal.config';
import { mergeComputePositionConfigs } from '../../utils/floating-ui.helper';

@Component({
	tag: 'kv-portal',
	styleUrl: 'portal.scss',
	shadow: true
})
export class KvPortal implements IPortal, IPortalEvents {
	/** @inheritdoc */
	@Prop() portalId = 'kv-portal';
	/** @inheritdoc */
	@Prop() reference: HTMLElement;
	/** @inheritdoc */
	@Prop() options: ComputePositionConfig;
	/** @inheritdoc */
	@Prop() autoUpdate: boolean = true;
	/** @inheritdoc */
	@Prop() animated: boolean = false;
	/** @inheritdoc */
	@Prop() withArrow: boolean = false;
	/** @inheritdoc */
	@Prop() delay?: number = 0;

	/** @inheritdoc */
	@Event() elementAppend: EventEmitter<void>;

	/** The Host's element reference */
	@Element() element: HTMLKvPortalElement;

	@State() visible: boolean = false;

	private portal: HTMLElement;
	private moved: boolean = false;
	private timeoutId: number;
	private closeAutoUpdate: () => void;

	private createPortal() {
		this.portal = document.createElement('div');
		this.portal.setAttribute('id', this.portalId);
		this.portal.style.zIndex = Z_INDEX;
		this.portal.style.position = 'absolute';
		document.body.append(this.portal);
	}

	private moveElementToPortal() {
		this.portal.appendChild(this.element);
		this.elementAppend.emit();
	}

	private getPortalArrowElement = (): HTMLElement | null => {
		return this.element.shadowRoot.querySelector('#portal-arrow') as HTMLElement | null;
	};

	private getMiddlewareConfig = () => {
		const arrowElement = this.getPortalArrowElement();

		const offSet = this.withArrow ? OFFSET_WITH_ARROW : DEFAULT_OFFSET;
		const middleware = [offset(offSet), shift(DEFAULT_SHIFT_CONFIG)];
		if (this.withArrow) middleware.push(arrow({ element: arrowElement, padding: 5 }));

		return middleware;
	};

	private getOptions = (): Partial<ComputePositionConfig> => {
		const middleware = this.getMiddlewareConfig();

		return mergeComputePositionConfigs(this.options, { middleware });
	};

	private updatePosition() {
		computePosition(this.reference, this.portal, this.getOptions()).then(({ x, y, placement, middlewareData }) => {
			Object.assign(this.portal.style, {
				left: `${x}px`,
				top: `${y}px`
			});

			if (this.withArrow) {
				const { x: arrowX, y: arrowY } = middlewareData.arrow;
				Object.assign(this.getPortalArrowElement().style, {
					...getArrowElementPositionConfig(arrowX, arrowY, placement)
				});
			}
		});
	}

	private calculatePosition() {
		if (this.autoUpdate) {
			this.closeAutoUpdate = autoUpdate(this.reference, this.portal, () => this.updatePosition());
		} else {
			this.updatePosition();
		}
	}

	componentWillLoad() {
		this.createPortal();
	}

	componentDidLoad() {
		this.moveElementToPortal();
		this.calculatePosition();

		if (this.delay) {
			this.timeoutId = window.setTimeout(() => {
				this.visible = true;
			}, this.delay);
		} else {
			this.visible = true;
		}
	}

	disconnectedCallback() {
		this.visible = false;
		if (this.timeoutId) {
			window.clearTimeout(this.timeoutId);
			this.timeoutId = undefined;
		}
		if (!isNil(this.closeAutoUpdate)) {
			this.closeAutoUpdate();
		}
		this.moved ? this.portal.remove() : (this.moved = true);
	}

	render() {
		return (
			<Host>
				<div class={{ 'portal-container': true, 'portal-container--animated': this.animated, 'portal-container--visible': this.visible }}>
					<slot />
					{this.withArrow && <div id="portal-arrow" class="portal-arrow"></div>}
				</div>
			</Host>
		);
	}
}
