import { ComputePositionConfig } from '@floating-ui/dom';

import { Options as AutoPlacementOptions } from '@floating-ui/core/src/middleware/autoPlacement';
import { Options as CoreDetectOverflowOptions } from '@floating-ui/core/src/detectOverflow';
import { Options as ShiftOptions } from '@floating-ui/core/src/middleware/shift';

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
