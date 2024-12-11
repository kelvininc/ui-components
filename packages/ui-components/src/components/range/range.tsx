import { Component, Host, h, Prop, Element, EventEmitter, Event } from '@stencil/core';
import { IRange, IRangeEvents } from './range.types';
import { getInputOffset, getInputPercentageFromValue, getValueOffset } from './range.helper';
import { identity } from 'lodash-es';

@Component({
	tag: 'kv-range',
	styleUrls: {
		night: 'range.night.scss',
		light: 'range.light.scss'
	},
	shadow: true
})
export class KvRange implements IRange, IRangeEvents {
	@Element() el!: HTMLKvRangeElement;
	/** @inheritdoc */
	@Prop({ reflect: true }) min: number;
	/** @inheritdoc */
	@Prop({ reflect: true }) max: number;
	/** @inheritdoc */
	@Prop({ reflect: true }) value?: number = 0;
	/** @inheritdoc */
	@Prop({ reflect: true }) step?: number = 1;
	/** @inheritdoc */
	@Prop({ reflect: true }) hideLabel?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) minLabel?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) maxLabel?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled: boolean = false;
	/** @inheritdoc */
	@Prop() valueFormatter: (value: number) => string = identity;

	/** @inheritdoc */
	@Event() valueChange: EventEmitter<number>;

	componentDidRender() {
		this.applyCssStyles();
	}

	private getRangeElement = (): HTMLInputElement => {
		return this.el.shadowRoot.querySelector('input');
	};

	private getInputValue = (element: HTMLInputElement) => {
		return parseInt(element.value);
	};

	get displayMinLabel() {
		return this.minLabel || `${this.min}`;
	}

	get displayMaxLabel() {
		return this.maxLabel || `${this.max}`;
	}

	private applyCssStyles = () => {
		const rangeInputValue = this.getRangeElement();

		const inputValue = this.getInputValue(rangeInputValue);
		const percentage = getInputPercentageFromValue(inputValue, this.min, this.max);
		const inputOffSet = getInputOffset(percentage);

		if (!this.hideLabel) {
			const selector = this.el.shadowRoot.getElementById('select-value');
			const valueOffset = getValueOffset(percentage, inputValue);
			selector.style.left = percentage + '%';
			selector.style.marginLeft = valueOffset + 'px';
		}

		rangeInputValue.style.background = `linear-gradient(90deg, var(--slider-background-filled${
			this.disabled ? '-disabled' : ''
		}) calc(${percentage}% + ${inputOffSet}px), var(--slider-background-empty) calc(${percentage}% + ${inputOffSet}px))`;
	};

	private onInputChange = () => {
		const inputValue = this.getInputValue(this.getRangeElement());
		this.valueChange.emit(inputValue);
	};

	render() {
		return (
			<Host>
				<div class={{ 'range-container': true, 'has-label': !this.hideLabel }}>
					<input
						id="slider"
						class="slider"
						type="range"
						min={this.min}
						max={this.max}
						step={this.step}
						value={this.value}
						disabled={this.disabled}
						onInput={this.onInputChange}
					/>
					{!this.hideLabel && (
						<span id="select-value" class={{ 'select-value': true, 'disabled': this.disabled }}>
							{this.valueFormatter(this.value)}
						</span>
					)}
					<div class="range-min-max">
						<span>{this.displayMinLabel}</span>
						<span>{this.displayMaxLabel}</span>
					</div>
				</div>
			</Host>
		);
	}
}
