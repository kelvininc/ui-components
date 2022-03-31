import { Component, h, Event, EventEmitter, Prop, Host, State, Watch } from '@stencil/core';
import { isEmpty } from 'lodash-es';
import { EComponentSize } from '../../types';
import { EInputFieldType, ITextFieldEvents } from '../text-field/text-field.types';
import { ISearchEvents } from './search.types';

@Component({
	tag: 'kv-search',
	shadow: true
})
export class KvSearch implements ISearchEvents, ITextFieldEvents {
	/** (optional) Search place holder */
	@Prop({ reflect: true }) placeholder: string = 'Search';
	/** (optional) Sets this tab item to a different styling configuration */
	@Prop() size?: EComponentSize = EComponentSize.Large;
	/** (optional) Search disabled */
	@Prop({ reflect: true }) disabled = false;
	/** Search value*/
	@Prop({ reflect: true }) value?: string;
	/** @inheritdoc */
	@Event() textChange: EventEmitter<string>;
	/** @inheritdoc */
	@Event() textFieldBlur: EventEmitter<string>;
	/** @inheritdoc */
	@Event() clickResetButton: EventEmitter<MouseEvent>;
	/** Internal value state */
	@State() _value: string = this.value;
	/** Watch changes on value to ensure reset event clears the text */
	@Watch('value')
	valueChangeHandler(newValue: string) {
		this._value = newValue;
	}

	/** Icons */
	private searchIcon = 'kv-search';
	private resetIcon = 'kv-close';

	private onTextChange = (event: CustomEvent<string>) => {
		this._value = event.detail;
	};

	private onResetClick = (event: MouseEvent) => {
		this._value = '';
		this.textChange.emit('');
		this.clickResetButton.emit(event);
	};

	/** TODO: <kv-svg-icon> tag will change to <kv-icon> in the future */
	render() {
		const shouldShowResetIcon = !isEmpty(this._value) && !this.disabled;
		return (
			<Host>
				<kv-text-field
					type={EInputFieldType.Text}
					placeholder={this.placeholder}
					size={this.size}
					value={this._value}
					disabled={this.disabled}
					icon={this.searchIcon}
					onTextChange={this.onTextChange}
				>
					{shouldShowResetIcon && <kv-svg-icon slot="right-slot" name={this.resetIcon} onClick={this.onResetClick} />}
				</kv-text-field>
			</Host>
		);
	}
}
