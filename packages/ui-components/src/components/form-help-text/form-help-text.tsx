import { Component, Host, h, Prop, State, Watch } from '@stencil/core';
import { isEmpty } from 'lodash-es';
import { EValidationState } from '../../types';
import { EIconName } from '../icon/icon.types';

@Component({
	tag: 'kv-form-help-text',
	styleUrl: 'form-help-text.scss',
	shadow: true
})
export class KvFormHelpText {
	/** (optional) Form field help text */
	@Prop({ reflect: true }) helpText: string | string[] = [];
	/** (optional) Form field state */
	@Prop({ reflect: true }) state: EValidationState = EValidationState.None;

	/** Internal help texts state */
	@State() _helpTexts: string[];
	/** Watch the `helpText` property and update internal state accordingly */
	@Watch('helpText')
	helpTextChangeHandler(newValue: string | string[]) {
		this._helpTexts = this.buildHelpTextMessages(newValue);
	}

	componentWillLoad() {
		// Init the states because Watches run only on component updates
		this._helpTexts = this.buildHelpTextMessages(this.helpText);
	}

	private buildHelpTextMessages(value: string | string[]) {
		value = value || [];
		return Array.isArray(value) ? value : [value];
	}

	render() {
		return (
			<Host>
				{!isEmpty(this._helpTexts) && (
					<div class={{ 'help-text-container': true, 'invalid': this.state === EValidationState.Invalid }}>
						{this.state === EValidationState.Invalid && <kv-icon name={EIconName.Error} customClass="icon-16"></kv-icon>}
						{this._helpTexts.map(msg => (
							<span class="help-text">{msg}</span>
						))}
					</div>
				)}
			</Host>
		);
	}
}
