import { Component, Host, h, Prop, EventEmitter, Event, Element, Watch } from '@stencil/core';
import { HostAttributes } from '@stencil/core/internal';
import { EToggleState, ISelectOption, ISelectOptionAction, ISelectOptionEvents } from './select-option.types';
import { LEVEL_OFFSET_PX } from './select-option.config';
import { EIconName, EOtherIconName } from '../icon/icon.types';
import { CustomCssClass, EActionButtonType } from '../../types';
import { getClassMap } from '../../utils/css-class.helper';

/**
 * @part select-option-content - The option's content container
 * @part option-container - The option's container
 * @part checkbox - The option's checkbox
 * @part label - The option's label
 * @part icon - The option's icon
 */
@Component({
	tag: 'kv-select-option',
	styleUrl: 'select-option.scss',
	shadow: true
})
export class KvSelectOption implements ISelectOption, ISelectOptionEvents {
	@Element() el!: HTMLKvSelectOptionElement;

	/** @inheritdoc */
	@Prop({ reflect: true }) label!: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) value!: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) icon?: EIconName | EOtherIconName;
	/** @inheritdoc */
	@Prop({ reflect: true }) description?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) selected?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) highlighted?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) togglable?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) selectable?: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: true }) heading?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) level = 0;
	/** @inheritdoc */
	@Prop({ reflect: true }) state?: EToggleState;
	/** @inheritdoc */
	@Prop({ reflect: true }) isDirty?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) customClass?: CustomCssClass = '';
	/** @inheritdoc */
	@Prop({ reflect: true }) customStyle?: HostAttributes['style'];
	/** @inheritdoc */
	@Prop({ reflect: true }) action?: ISelectOptionAction;

	/** @inheritdoc */
	@Event() itemSelected: EventEmitter<string>;

	@Watch('highlighted')
	highlightedChangeHandler() {
		if (this.highlighted) {
			this.el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		}
	}

	private onItemClick = () => {
		if (this.disabled) {
			return;
		}

		this.itemSelected.emit(this.value);
	};

	render() {
		return (
			<Host class={getClassMap(this.customClass)} style={{ ...this.customStyle }}>
				<div part="select-option-content">
					<div
						class={{
							'select-option': true,
							'select-option--selected': this.selected,
							'select-option--highlighted': this.highlighted,
							'select-option--disabled': this.disabled,
							'select-option--selectable': this.selectable,
							'select-option--heading': this.heading
						}}
						part="option-container"
						onClick={this.onItemClick}
						style={{ '--level-padding-offset': `${LEVEL_OFFSET_PX * this.level}px` }}
					>
						{this.selectable && this.togglable && (
							<kv-checkbox checked={this.state === EToggleState.Selected} indeterminate={this.state === EToggleState.Indeterminate} part="checkbox" />
						)}
						{this.icon && (
							<div class="icon-container" part="icon">
								<kv-icon name={this.icon} />
							</div>
						)}
						<div class="text-container">
							<div class="left-content">
								{this.isDirty && <kv-dirty-dot />}
								<div class="item-label" part="label">
									{this.label}
								</div>
							</div>
							<div class="right-content">
								{this.description && <div class="item-description">{this.description}</div>}
								{this.action && (
									<div class="action-container">
										<kv-action-button-icon
											type={EActionButtonType.Ghost}
											icon={this.action.icon}
											onClickButton={this.action.onClick}
											active={this.action.active}
											onClick={event => event.stopPropagation()}
										/>
									</div>
								)}
							</div>
						</div>
					</div>
					<slot />
				</div>
			</Host>
		);
	}
}
