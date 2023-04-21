import { Component, Event, EventEmitter, Host, Prop, h } from '@stencil/core';
import { IRadioList, IRadioListEvents } from './radio-list.types';
import { IRadioListItem } from '../radio-list-item/radio-list-item.types';
/**
 * @part items-container - The container for the list items
 */
@Component({
	tag: 'kv-radio-list',
	styleUrl: 'radio-list.scss',
	shadow: true
})
export class KvRadioList implements IRadioList, IRadioListEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) label?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) options!: IRadioListItem[];
	/** @inheritdoc */
	@Prop({ reflect: true }) selectedOption?: string | number;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabledOptions?: Record<string | number, boolean>;
	/** @inheritdoc */
	@Prop({ reflect: true }) required?: boolean = false;

	/** @inheritdoc */
	@Event() optionSelected: EventEmitter<string | number>;

	private onOptionClick = ({ detail }: CustomEvent<string | number>) => {
		this.optionSelected.emit(detail);
	};

	render() {
		return (
			<Host>
				{this.label && <kv-form-label label={this.label} required={this.required} />}
				<div class="radio-list-items" part="items-container">
					{this.options.map(item => {
						return (
							<kv-radio-list-item
								{...item}
								key={item.optionId}
								checked={this.selectedOption === item.optionId}
								disabled={this.disabledOptions?.[item.optionId]}
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
