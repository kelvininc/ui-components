import { Watch, Component, Event, Host, h, Prop, EventEmitter, State } from '@stencil/core';
import { isEmpty } from 'lodash-es';
import { EToasterType, EToasterIconTypeClass, IToaster, IToasterEvents, CLOSE_ICON } from './toaster.types';
import { TYPE_ICONS } from './toaster.config';

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
	@Event() clickCloseButton: EventEmitter<MouseEvent>;
	/** @inheritdoc */
	@Event() ttlExpired: EventEmitter<CloseEvent>;
	/** State to store the timeout id */
	@State() timeoutID: number;
	/** Fade in animation state */
	@State() fadeInActive: boolean = false;
	/** Fade out animation state */
	@State() fadeOutActive: boolean = false;
	/** Icon of the toaster */
	@State() iconType: EToasterIconTypeClass;
	/** Case the type changes, the toaster updates the icon displayed */
	@Watch('type')
	updateIconType(value: string) {
		this.iconType = TYPE_ICONS[value];
	}

	private onCloseClick = event => {
		if (this.ttl > 0) {
			window.clearTimeout(this.timeoutID);
		}

		this.closeToaster();
		this.clickCloseButton.emit(event);
	};

	private closeToaster = () => {
		this.fadeInActive = false;
		this.fadeOutActive = true;
		if (this.ttl > 0) {
			window.clearTimeout(this.timeoutID);
			this.ttlExpired.emit();
		}
	};

	componentWillLoad() {
		this.iconType = TYPE_ICONS[this.type];
		this.fadeOutActive = false;
		this.fadeInActive = true;
		if (this.ttl > 0) {
			this.timeoutID = window.setTimeout(this.closeToaster, this.ttl);
		}
	}

	disconnectedCallback() {
		this.closeToaster();
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
					<div class="toaster-close-icon">
						<kv-icon name={CLOSE_ICON.icon} onClick={this.onCloseClick}></kv-icon>
					</div>
				</div>
			</Host>
		);
	}
}
