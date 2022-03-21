import { Component, h, Event, EventEmitter, Prop, Host } from '@stencil/core';
import { isEmpty } from 'lodash-es';
import { EComponentSize } from '../../types';
import { EInputFieldType } from '../text-field/text-field.types';

@Component({
	tag: 'kv-search',
	shadow: true,
})
export class KvSearch {
	/** (optional) Search place holder */
	@Prop({ reflect: true }) placeholder: string = "Search";
	/** (optional) Sets this tab item to a different styling configuration */
	@Prop() size?: EComponentSize = EComponentSize.Large;
	/** (optional) Search disabled */
	@Prop({ reflect: true }) disabled = false;
	/** Search value*/
	@Prop({ reflect: true, mutable: true }) value: string;
	/** Emitted when search text value changes */
	@Event() textChange: EventEmitter<string>;
	/** Emitted when text field lost focus */
	@Event() textFieldBlur: EventEmitter<string>;

	/** Icons */
	searchIcon = 'kv-search';
	resetIcon = 'kv-close';

	private onTextChange = event => {
		const text = event.detail;
		this.value = text;
		this.textChange.emit(text);
	}

	private onResetClick = () => {
		this.value='';
		this.textChange.emit('');
	}

	private onBlurHandler = event => {
		this.value = event.target.value;
		this.textFieldBlur.emit(this.value);
	};

	/** TODO: <kv-svg-icon> tag will change to <kv-icon> in the future. 
	 * Please update Search component after that.
	 */ 
	render() {
		return (
			<Host>
				<kv-text-field 					
					placeholder={this.placeholder}
					size={this.size}
					type={EInputFieldType.Text}
					value = {this.value}
					disabled={this.disabled}
					icon={this.searchIcon}
					onTextChange={this.onTextChange}
					onTextFieldBlur={this.onBlurHandler}
					slotted={true}
				>
					{!isEmpty(this.value) &&
						<kv-svg-icon 
							name={this.resetIcon} 
							onClick={this.onResetClick}
						/>
					}
				</kv-text-field>
			</Host>
		);
	}
}
