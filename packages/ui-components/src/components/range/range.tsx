import { Component, Host, h, Prop, Element, EventEmitter, Event } from '@stencil/core';
import { IRange, IRangeEvents } from './range.types';
import { getInputPercentageFromValue, getOffset } from './range.helper';

@Component({
	tag: 'kv-range',
	styleUrl: 'range.scss',
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
	@Event() valueChange: EventEmitter<number>;

	componentDidRender() {
		this.applyCssStyles();
	}

	private applyCssStyles = () => {
		const rangeInputValue = this.el.shadowRoot.querySelector('input');

		const selector = this.el.shadowRoot.getElementById('selector');

		let inputValue = rangeInputValue.value;
		const percentage = getInputPercentageFromValue(inputValue, this.min, this.max);
		const offSet = getOffset(percentage);

		selector.style.left = percentage + '%';
		selector.style.marginLeft = offSet + 'px';
		rangeInputValue.style.background = `linear-gradient(90deg, var(--slider-background-filled) ${percentage}%, var(--slider-background-empty) ${percentage + 0.1}%)`;
		this.onValueChange(parseInt(inputValue));
	};

	private onValueChange = (newValue: number) => {
		this.value = newValue;
		this.valueChange.emit(newValue);
	};

	render() {
		return (
			<Host>
				<div class="range-container">
					<input id="slider" class="slider" type="range" min={this.min} max={this.max} step={this.step} value={this.value} onInput={this.applyCssStyles} />
					<div id="selector" class="selector">
						<div class="select-btn"></div>
						<span class="select-value">{this.value}</span>
					</div>
					<div class="range-min-max">
						<span>{this.min}</span>
						<span>{this.max}</span>
					</div>
				</div>
			</Host>
		);
	}
}
