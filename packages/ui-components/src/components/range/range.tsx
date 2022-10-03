import { Component, Host, h, Prop, Element, EventEmitter, Event } from '@stencil/core';
import { IRange, IRangeEvents } from './range.types';
import { getInputOffset, getInputPercentageFromValue, getValueOffset } from './range.helper';

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

		rangeInputValue.style.background = `linear-gradient(90deg, var(--slider-background-filled) calc(${percentage}% + ${inputOffSet}px), var(--slider-background-empty) calc(${percentage}% + ${inputOffSet}px))`;
	};

	private onInputChange = () => {
		const inputValue = this.getInputValue(this.getRangeElement());
		this.valueChange.emit(inputValue);
	};

	render() {
		return (
			<Host>
				<div class="range-container">
					<input id="slider" class="slider" type="range" min={this.min} max={this.max} value={this.value} step={this.step} onInput={this.onInputChange} />
					{!this.hideLabel && (
						<span id="select-value" class="select-value">
							{this.value}
						</span>
					)}
					<div class="range-min-max">
						<span>{this.min}</span>
						<span>{this.max}</span>
					</div>
				</div>
			</Host>
		);
	}
}
