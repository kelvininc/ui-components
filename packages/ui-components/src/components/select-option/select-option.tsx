import { Component, Host, h, Prop, EventEmitter, Event, Element, Watch } from '@stencil/core';
import { EToggleState, ISelectOption, ISelectOptionEvents } from './select-option.types';
import { isEmpty } from 'lodash';
import { LEVEL_OFFSET_PX } from './select-option.config';

/**
 * @part select-option-content - The option's content container
 * @part option-container - The option's container
 * @part checkbox - The option's checkbox
 * @part label - The option's label
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
	@Prop({ reflect: true }) options?: Record<string, ISelectOption> = {};
	/** @inheritdoc */
	@Prop({ reflect: true }) level = 0;
	/** @inheritdoc */
	@Prop({ reflect: true }) state?: EToggleState;

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

	private get hasChildren() {
		return !isEmpty(this.options);
	}

	render() {
		const children = Object.values(this.options);

		return (
			<Host>
				<div part="select-option-content">
					<div
						class={{
							'select-option': true,
							'select-option--selected': this.selected,
							'select-option--highlighted': this.highlighted,
							'select-option--disabled': this.disabled,
							'select-option--selectable': this.selectable,
							'select-option--parent': this.hasChildren
						}}
						part="option-container"
						onClick={this.onItemClick}
						style={{ '--level-padding-offset': `${LEVEL_OFFSET_PX * this.level}px` }}
					>
						{this.selectable && this.togglable && (
							<kv-checkbox checked={this.state === EToggleState.Selected} indeterminate={this.state === EToggleState.Indeterminate} part="checkbox" />
						)}
						<div class="text-container">
							<div class="item-label" part="label">
								{this.label}
							</div>
							{this.description && <div class="item-description">{this.description}</div>}
						</div>
					</div>
					{this.hasChildren && (
						<div class="children-options">
							{children.map(childOption => (
								<kv-select-option {...childOption} level={this.level + 1} />
							))}
						</div>
					)}
					<slot />
				</div>
			</Host>
		);
	}
}
