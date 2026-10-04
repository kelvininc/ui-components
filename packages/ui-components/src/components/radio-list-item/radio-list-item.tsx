import { Component, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { buildDescription } from './radio-list-item.helper';
import { IRadioListItem, IRadioListItemEvents } from './radio-list-item.types';
import { EComponentSize } from '../../types';

@Component({
	tag: 'kv-radio-list-item',
	styleUrl: 'radio-list-item.scss',
	// Group options delegate host focus to their radio; a focusable header slot takes precedence.
	shadow: { delegatesFocus: true }
})
export class KvRadioListItem implements IRadioListItem, IRadioListItemEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) optionId!: string | number;
	/** @inheritdoc */
	@Prop({ reflect: true }) label?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) description?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) size: EComponentSize = EComponentSize.Large;
	/** @inheritdoc */
	@Prop({ reflect: true }) checked?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled?: boolean = false;
	/** @inheritdoc */
	@Prop() skipTabStop?: boolean = false;

	/** @inheritdoc */
	@Event() optionClick: EventEmitter<string | number>;

	@State() parsedDescription = buildDescription(this.description);

	@Watch('description')
	descriptionWatcher(newValue: string, old: string) {
		if (newValue === old) return;
		this.parsedDescription = buildDescription(newValue);
	}

	private onOptionClick = (ev: Event) => {
		ev.stopPropagation();
		if (this.disabled) {
			return;
		}
		this.optionClick.emit(this.optionId);
	};

	private onRadioCheckedChange = (event: CustomEvent<Event>) => {
		event.stopPropagation();
		// Mouse clicks reach the container; Space activates through the radio's event.
		if (event.detail.type === 'keydown') this.onOptionClick(event);
	};

	render() {
		return (
			<Host>
				<div
					class={{
						'radio-list-item-container': true,
						'radio-list-item-container--disabled': !!this.disabled,
						'radio-list-item-container--checked': !!this.checked
					}}
					onClick={this.onOptionClick}
				>
					<slot name="header" />
					<div class={{ content: true, [`content--size-${this.size}`]: true }}>
						<kv-radio
							size={EComponentSize.Small}
							checked={this.checked}
							disabled={this.disabled}
							accessibleLabel={this.label}
							skipTabStop={this.skipTabStop}
							onCheckedChange={this.onRadioCheckedChange}
						/>
						<div class="info">
							{/* With a `label`, the radio carries it as its name; this copy is for sight only */}
							<div class="label" aria-hidden={this.label ? 'true' : undefined}>
								<slot name="label">{this.label}</slot>
							</div>
							{this.description && <div class="description">{this.parsedDescription}</div>}
							<slot name="additional-info"></slot>
						</div>
					</div>
				</div>
			</Host>
		);
	}
}
