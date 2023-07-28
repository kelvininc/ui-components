import { AutoPlacementOptions } from '@floating-ui/core/src/middleware/autoPlacement';
import { Options as CoreDetectOverflowOptions } from '@floating-ui/core/src/detectOverflow';
import { ComputePositionConfig, offset, shift } from '@floating-ui/dom';

export const DEFAULT_POSITION_CONFIG: Partial<ComputePositionConfig> = {
	strategy: 'fixed',
	middleware: [offset(5), shift({ padding: 5 })]
};

export const DEFAULT_DELAY_CONFIG: number = 1000;

export const DEFAULT_AUTO_PLACEMENT_CONFIG: Partial<AutoPlacementOptions & CoreDetectOverflowOptions> = {
	padding: 5
};
