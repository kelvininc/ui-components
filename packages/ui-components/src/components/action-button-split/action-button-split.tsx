import { Component, Event, EventEmitter, h, Host, Prop } from '@stencil/core';
import { EActionButtonType } from '../action-button/action-button.types';
import { EComponentSize, EAnchorTarget } from '../../utils/types';
import { EIconName, EOtherIconName } from '../icon/icon.types';
import { IActionButtonSplitConfig } from './action-button-split.types';

@Component({
	tag: 'kv-action-button-split',
	styleUrl: 'action-button-split.scss',
	shadow: true
})
export class KvActionButtonSplit implements IActionButtonSplitConfig {
	/** @inheritdoc */
	@Prop({ reflect: true }) splitIcon!: EIconName | EOtherIconName;
	/** @inheritdoc */
	@Prop({ reflect: true }) text!: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) icon?: EIconName | EOtherIconName;
	/** @inheritdoc */
	@Prop({ reflect: true }) type!: EActionButtonType;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) active: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) size: EComponentSize = EComponentSize.Large;
	/** @inheritdoc */
	@Prop({ reflect: true }) leftHref?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) leftTarget?: EAnchorTarget;
	/** @inheritdoc */
	@Prop({ reflect: true }) leftDownload?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) rightHref?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) rightTarget?: EAnchorTarget;
	/** @inheritdoc */
	@Prop({ reflect: true }) rightDownload?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) target?: EAnchorTarget;
	/** @inheritdoc */
	@Prop({ reflect: true }) download?: string;

	/** @inheritdoc */
	@Event() clickLeftButton: EventEmitter<MouseEvent>;
	/** @inheritdoc */
	@Event() clickRightButton: EventEmitter<MouseEvent>;
	/** @inheritdoc */
	@Event() focusLeftButton: EventEmitter<FocusEvent>;
	/** @inheritdoc */
	@Event() focusRightButton: EventEmitter<FocusEvent>;
	/** @inheritdoc */
	@Event() blurLeftButton: EventEmitter<FocusEvent>;
	/** @inheritdoc */
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
