import { Component, Event, EventEmitter, h, Host, Prop } from '@stencil/core';
import { EActionButtonType, IButton } from '../action-button/action-button.types';
import { EComponentSize, IAnchor, EAnchorTarget } from '../../utils/types';
import { EIconName, EOtherIconName } from '../icon/icon.types';

@Component({
	tag: 'kv-action-button-split',
	styleUrl: 'action-button-split.scss',
	shadow: true
})
export class KvActionButtonSplit implements IButton, IAnchor {
	/** (required) Right button icon symbol name */
	@Prop({ reflect: true }) splitIcon!: EIconName | EOtherIconName;
	/** (required) (required) Button's text */
	@Prop({ reflect: true }) text!: string;
	/** (optional) Button's left icon symbol name */
	@Prop({ reflect: true }) icon?: EIconName | EOtherIconName;
	/** @inheritdoc */
	@Prop({ reflect: true }) type!: EActionButtonType;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) active: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) size: EComponentSize = EComponentSize.Large;
	/** (optional) The left button anchor's link to open when clicking */
	@Prop({ reflect: true }) leftHref?: string;
	/** (optional) The left button anchor's target */
	@Prop({ reflect: true }) leftTarget?: EAnchorTarget;
	/** (optional) The left button anchor's download filename */
	@Prop({ reflect: true }) leftDownload?: string;
	/** (optional) The right button anchor's link to open when clicking */
	@Prop({ reflect: true }) rightHref?: string;
	/** (optional) The right button anchor's target */
	@Prop({ reflect: true }) rightTarget?: EAnchorTarget;
	/** (optional) The right button anchor's download filename */
	@Prop({ reflect: true }) rightDownload?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) target?: EAnchorTarget;
	/** @inheritdoc */
	@Prop({ reflect: true }) download?: string;

	/** Emitted when left button is clicked */
	@Event() clickLeftButton: EventEmitter<MouseEvent>;
	/** Emitted when right button is clicked */
	@Event() clickRightButton: EventEmitter<MouseEvent>;
	/** Emitted when left button is focused */
	@Event() focusLeftButton: EventEmitter<FocusEvent>;
	/** Emitted when right button is focused */
	@Event() focusRightButton: EventEmitter<FocusEvent>;
	/** Emitted when left button is blur */
	@Event() blurLeftButton: EventEmitter<FocusEvent>;
	/** Emitted when right button is blur */
	@Event() blurRightButton: EventEmitter<FocusEvent>;

	private onClickLeftButton = (event: CustomEvent<MouseEvent>) => {
		this.clickLeftButton.emit(event.detail);
	};
	private onClickRightButton = (event: CustomEvent<MouseEvent>) => {
		this.clickRightButton.emit(event.detail);
	};
	private onFocusLeftButton = (event: CustomEvent<FocusEvent>) => {
		this.focusLeftButton.emit(event.detail);
	};
	private onFocusRightButton = (event: CustomEvent<FocusEvent>) => {
		this.focusRightButton.emit(event.detail);
	};
	private onBlurLeftButton = (event: CustomEvent<FocusEvent>) => {
		this.blurLeftButton.emit(event.detail);
	};
	private onBlurRightButton = (event: CustomEvent<FocusEvent>) => {
		this.blurRightButton.emit(event.detail);
	};

	render() {
		return (
			<Host>
				<div class="action-button-split">
					<kv-action-button-text
						type={this.type}
						text={this.text}
						icon={this.icon}
						disabled={this.disabled}
						size={this.size}
						download={this.leftDownload}
						href={this.leftHref}
						target={this.leftTarget}
						onClickButton={this.onClickLeftButton}
						onFocusButton={this.onFocusLeftButton}
						onBlurButton={this.onBlurLeftButton}
						exportparts="button"
					/>
					<kv-action-button
						type={this.type}
						disabled={this.disabled}
						size={this.size}
						download={this.rightDownload}
						href={this.rightHref}
						target={this.rightTarget}
						onClickButton={this.onClickRightButton}
						onFocusButton={this.onFocusRightButton}
						onBlurButton={this.onBlurRightButton}
						exportparts="button"
					>
						<kv-icon name={this.splitIcon} exportparts="icon" />
					</kv-action-button>
				</div>
			</Host>
		);
	}
}
