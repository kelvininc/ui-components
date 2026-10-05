import { Component, Element, Event, EventEmitter, Host, Method, Prop, h } from '@stencil/core';
import { IRadioList, IRadioListEvents } from './radio-list.types';
import { IRadioListItem } from '../radio-list-item/radio-list-item.types';
import { focusRadioGroup, getRadioGroupTabStop, handleRadioGroupKeyDown, RadioGroupOption } from '../../utils/radio-group.helper';
/**
 * @part items-container - The container for the list items
 */
@Component({
	tag: 'kv-radio-list',
	styleUrl: 'radio-list.scss',
	shadow: true
})
export class KvRadioList implements IRadioList, IRadioListEvents {
	@Element() el: HTMLKvRadioListElement;

	/** @inheritdoc */
	@Prop({ reflect: true }) label?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) options!: Omit<IRadioListItem, 'skipTabStop'>[];
	/** @inheritdoc */
	@Prop({ reflect: true }) selectedOption?: string | number;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabledOptions?: Record<string | number, boolean>;
	/** @inheritdoc */
	@Prop({ reflect: true }) required?: boolean = false;

	/** @inheritdoc */
	@Event() optionSelected: EventEmitter<string | number>;

	/** Focuses the selected enabled radio, or the first enabled radio when none is selected. */
	@Method()
	async setFocus(): Promise<void> {
		const hosts = Array.from(this.el.shadowRoot?.querySelectorAll<HTMLElement>('kv-radio-list-item') ?? []);
		focusRadioGroup(this.getGroupOptions(), hosts);
	}

	private onOptionClick = ({ detail }: CustomEvent<string | number>) => {
		this.optionSelected.emit(detail);
	};

	private isOptionDisabled = (item: IRadioListItem) => !!(item.disabled || this.disabledOptions?.[item.optionId]);

	private getGroupOptions = (): RadioGroupOption[] =>
		(this.options ?? []).map(item => ({ value: item.optionId, checked: this.selectedOption === item.optionId, disabled: this.isOptionDisabled(item) }));

	private onKeyDown = (event: KeyboardEvent) => {
		const hosts = Array.from(this.el.shadowRoot?.querySelectorAll<HTMLElement>('kv-radio-list-item') ?? []);
		handleRadioGroupKeyDown(event, this.getGroupOptions(), hosts, value => this.optionSelected.emit(value));
	};

	render() {
		const tabStop = getRadioGroupTabStop(this.getGroupOptions());
		return (
			<Host>
				{this.label && <kv-form-label label={this.label} required={this.required} />}
				<div
					class="radio-list-items"
					part="items-container"
					role="radiogroup"
					aria-label={this.label}
					aria-required={this.required ? 'true' : undefined}
					onKeyDown={this.onKeyDown}
				>
					{(this.options ?? []).map((item, index) => {
						return (
							<kv-radio-list-item
								{...item}
								key={item.optionId}
								checked={this.selectedOption === item.optionId}
								disabled={this.isOptionDisabled(item)}
								skipTabStop={index !== tabStop}
								class="radio-list-item"
								onOptionClick={this.onOptionClick}
							/>
						);
					})}
				</div>
			</Host>
		);
	}
}
