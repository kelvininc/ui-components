import { arrow, autoUpdate, computePosition, ComputePositionConfig, hide, offset, shift } from '@floating-ui/dom';
import { Component, Element, Event, EventEmitter, h, Host, Prop, State, Watch } from '@stencil/core';
import { IPortal, IPortalEvents } from './portal.types';
import { isNil } from 'lodash';
import { DEFAULT_OFFSET, DEFAULT_SHIFT_CONFIG, getArrowElementPositionConfig, OFFSET_WITH_ARROW, PORTAL_Z_INDEX } from './portal.config';
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
	@Prop() show = false;
	/** @inheritdoc */
	@Prop() autoUpdate: boolean = true;
	/** @inheritdoc */
	@Prop() animated: boolean = false;
	/** @inheritdoc */
	@Prop() withArrow: boolean = false;
	/** @inheritdoc */
	@Prop() delay?: number = 0;
	/** @inheritdoc */
	@Prop({ reflect: false }) zIndex = PORTAL_Z_INDEX.show;

	/** @inheritdoc */
	@Event() elementAppend: EventEmitter<HTMLElement>;

	/** The Host's element reference */
	@Element() element: HTMLKvPortalElement;

	@State() visible: boolean = false;

	@Watch('show')
	showWatch(newValue: boolean) {
		if (newValue) {
			this.showPortalContent();
		} else {
			this.hidePortalContent();
		}
	}

	@Watch('reference')
	referenceWatch() {
		if (this.show) {
			this.showPortalContent();
		}
	}

	private portal: HTMLElement;
	private moved: boolean = false;
	private timeoutId: number;
	private closeAutoUpdate: () => void;

	private createPortal() {
		this.portal = document.createElement('div');
		this.portal.setAttribute('id', this.portalId);
		this.portal.style.zIndex = `${PORTAL_Z_INDEX.hidden}`;
		this.portal.style.position = 'absolute';
		document.body.prepend(this.portal);
	}

	private moveElementToPortal() {
		this.portal.appendChild(this.element);
		this.elementAppend.emit(this.element);
	}

	private getPortalArrowElement = (): HTMLElement | null => {
		return this.element.shadowRoot.querySelector('#portal-arrow') as HTMLElement | null;
	};

	private getMiddlewareConfig = () => {
		const arrowElement = this.getPortalArrowElement();

		const offSet = this.withArrow ? OFFSET_WITH_ARROW : DEFAULT_OFFSET;
		const middleware = [offset(offSet), shift(DEFAULT_SHIFT_CONFIG)];
		if (this.withArrow) middleware.push(arrow({ element: arrowElement, padding: 5 }));

		middleware.push(hide({ padding: 15 }));
		return middleware;
	};

	private getOptions = (): Partial<ComputePositionConfig> => {
		const middleware = this.getMiddlewareConfig();

		return mergeComputePositionConfigs({ middleware }, this.options);
	};

	private updatePosition() {
		computePosition(this.reference, this.portal, this.getOptions()).then(({ x, y, placement, middlewareData }) => {
			if (this.autoUpdate) {
				const { referenceHidden } = middlewareData.hide;
				if (this.show) {
					this.visible = !referenceHidden;
					this.portal.style.zIndex = referenceHidden ? `${PORTAL_Z_INDEX.hidden}` : `${this.zIndex}`;
				}
			}

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
		if (!this.reference || !this.portal) {
			return;
		}

		if (this.autoUpdate) {
			this.closeAutoUpdate = autoUpdate(this.reference, this.portal, () => this.updatePosition());
		} else {
			this.updatePosition();
		}
	}

	private showPortalContent() {
		if (!this.portal) return;
		this.calculatePosition();

		this.portal.style.zIndex = `${this.zIndex}`;
		if (this.delay) {
			this.timeoutId = window.setTimeout(() => {
				this.visible = true;
			}, this.delay);
		} else {
			this.visible = true;
		}
	}

	private hidePortalContent() {
		this.visible = false;
		this.portal.style.zIndex = `${PORTAL_Z_INDEX.hidden}`;
		if (this.timeoutId) {
			window.clearTimeout(this.timeoutId);
			this.timeoutId = undefined;
		}
		if (!isNil(this.closeAutoUpdate)) {
			this.closeAutoUpdate();
		}
	}

	componentWillLoad() {
		this.createPortal();
	}

	componentDidLoad() {
		this.moveElementToPortal();

		if (this.show) {
			this.showPortalContent();
		}
	}

	disconnectedCallback() {
		this.moved ? this.portal?.remove() : (this.moved = true);
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
