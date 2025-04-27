import { Component, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { buildDescription } from './radio-list-item.helper';
import { IRadioListItem, IRadioListItemEvents } from './radio-list-item.types';

@Component({
	tag: 'kv-radio-list-item',
	styleUrl: 'radio-list-item.scss',
	shadow: true
})
export class KvRadioListItem implements IRadioListItem, IRadioListItemEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) optionId!: string | number;
	/** @inheritdoc */
	@Prop({ reflect: true }) label!: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) description?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) checked?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled?: boolean = false;

	/** @inheritdoc */
	@Event() optionClick: EventEmitter<string | number>;

	@State() parsedDescription = buildDescription(this.description);

	@Watch('description')
	descriptionWatcher(newValue: string, old: string) {
		if (newValue === old) return;
		this.parsedDescription = buildDescription(newValue);
	}

	private onOptionClick = (ev: MouseEvent) => {
		ev.stopPropagation();
		this.optionClick.emit(this.optionId);
	};

	render() {
		return (
			<Host>
				<div
					class={{
						'radio-list-item-container': true,
						'radio-list-item-container--disabled': this.disabled,
						'radio-list-item-container--checked': this.checked
					}}
					onClick={this.onOptionClick}
				>
					<slot name="header" />
					<div class="content">
						<kv-radio checked={this.checked} disabled={this.disabled} />
						<div class="info">
							<slot name="label">
								<div class="label">{this.label}</div>
							</slot>
							{this.description && <div class="description">{this.parsedDescription}</div>}
							<slot name="additional-info"></slot>
						</div>
					</div>
				</div>
			</Host>
		);
	}
}
