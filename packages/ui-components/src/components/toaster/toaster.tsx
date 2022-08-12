import { Watch, Component, Event, Host, h, Prop, EventEmitter, State } from '@stencil/core';
import { isEmpty } from 'lodash-es';
import { EToasterType, EToasterIconTypeClass, IToaster, IToasterEvents, CLOSE_ICON } from './toaster.types';
import { TOASTER_ANIMATION_DURATION, TYPE_ICONS } from './toaster.config';

@Component({
	tag: 'kv-toaster',
	styleUrl: 'toaster.scss',
	shadow: true
})
export class KvToaster implements IToaster, IToasterEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) header!: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) description?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) type!: EToasterType;
	/** @inheritdoc */
	@Prop({ reflect: true }) ttl?: number;
	/** @inheritdoc */
	@Prop({ reflect: true }) closable: boolean = true;
	/** @inheritdoc */
	@Event() clickCloseButton: EventEmitter<MouseEvent>;
	/** @inheritdoc */
	@Event() ttlExpired: EventEmitter<CloseEvent>;
	/** @inheritdoc */
	@Event() afterOpen: EventEmitter<void>;
	/** @inheritdoc */
	@Event() afterClose: EventEmitter<void>;
	/** State to store the timeout id */
	@State() timeoutID: number;
	/** Fade in animation state */
	@State() fadeInActive: boolean = false;
	/** Fade out animation state */
	@State() fadeOutActive: boolean = false;
	/** Icon of the toaster */
	@State() iconType: EToasterIconTypeClass = TYPE_ICONS[this.type];
	/** Case the type changes, the toaster updates the icon displayed */
	@Watch('type')
	updateIconType(value: string) {
		this.iconType = TYPE_ICONS[value];
	}

	private clearTTL = () => {
		window.clearTimeout(this.timeoutID);
	};

	private emitAfterClose = () => {
		this.fadeInActive = false;
		this.fadeOutActive = true;

		window.setTimeout(this.afterClose.emit.bind(this), TOASTER_ANIMATION_DURATION);
	};

	private emitAfterOpen = () => {
		this.fadeOutActive = false;
		this.fadeInActive = true;

		window.setTimeout(this.afterOpen.emit.bind(this), TOASTER_ANIMATION_DURATION);
	};

	private createTTL = () => {
		if (this.ttl > 0) {
			this.timeoutID = window.setTimeout(() => {
				this.ttlExpired.emit();

				this.closeToaster();
			}, this.ttl);
		}
	};

	private closeToaster = () => {
		this.clearTTL();
		this.emitAfterClose();
	};

	private onCloseClick = (event: MouseEvent) => {
		this.closeToaster();
		this.clickCloseButton.emit(event);
	};

	componentWillLoad() {
		this.createTTL();
		this.emitAfterOpen();
	}

	disconnectedCallback() {
		this.clearTTL();
	}

	render() {
		return (
			<Host>
				<div
					class={{
						'toaster-container': true,
						'animate-fade-in': this.fadeInActive,
						'animate-fade-out': this.fadeOutActive,
						[`toaster-container--large`]: !isEmpty(this.description)
					}}
				>
					<div
						class={{
							'toaster-icon': true,
							[`toaster-icon--${this.type}`]: true
						}}
					>
						<kv-icon name={this.iconType.icon}></kv-icon>
					</div>
					<div class="message-content">
						<span class="main-message">{this.header}</span>
						{!isEmpty(this.description) && <span class="secondary-message">{this.description}</span>}
					</div>
					<slot></slot>
					{this.closable && (
						<div class="toaster-close-icon">
							<kv-icon name={CLOSE_ICON.icon} onClick={this.onCloseClick}></kv-icon>
						</div>
					)}
				</div>
			</Host>
		);
	}
}
