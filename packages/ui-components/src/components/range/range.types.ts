import { EventEmitter } from '@stencil/core';

export interface IRangeEvents {
	/** Emitted when the value changes */
	valueChange: EventEmitter<number>;
}

export interface IRange {
	/** (required) Range minimum value */
	min: number;
	/** (required) Range maximum value */
	max: number;
	/** (optional) Range value */
	value?: number;
	/** (optional) Range value step */
	step?: number;
	/** (optional) Hide value label */
	hideLabel?: boolean;
	/** (optional) Min label */
	minLabel?: string;
	/** (optional) Max label */
	maxLabel?: string;
	/** (optional) Range input disabled */
	disabled?: boolean;
}
