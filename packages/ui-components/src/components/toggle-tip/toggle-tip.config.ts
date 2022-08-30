import { ComputePositionConfig, Placement } from '@floating-ui/dom';

import { Options as AutoPlacementOptions } from '@floating-ui/core/src/middleware/autoPlacement';
import { Options as CoreDetectOverflowOptions } from '@floating-ui/core/src/detectOverflow';
import { Options as ShiftOptions } from '@floating-ui/core/src/middleware/shift';

export const OFFSET_WITH_ARROW = 10;
export const STATIC_SIDE_OFFSET = '-5px';

export const getArrowElementPositionConfig = (x: number, y: number, placement: Placement) => {
	const staticSide = {
		top: 'bottom',
		right: 'left',
		bottom: 'top',
		left: 'right'
	}[placement.split('-')[0]];

	return {
		left: x != null ? `${x}px` : '',
		top: y != null ? `${y}px` : '',
		right: '',
		bottom: '',
		[staticSide]: STATIC_SIDE_OFFSET
	};
};

export const DEFAULT_TOOLTIP_CONFIG: Partial<ComputePositionConfig> = {
	strategy: 'fixed'
};
export const DEFAULT_OFFSET: number = 5;
export const DEFAULT_SHIFT_CONFIG: Partial<ShiftOptions & CoreDetectOverflowOptions> = {
	padding: 5
};
export const DEFAULT_AUTOPLACEMENT_CONFIG: Partial<AutoPlacementOptions & CoreDetectOverflowOptions> = {
	padding: 5
};
