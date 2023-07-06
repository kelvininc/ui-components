import { ComputePositionConfig } from '@floating-ui/dom';

import { Options as AutoPlacementOptions } from '@floating-ui/core/src/middleware/autoPlacement';
import { Options as CoreDetectOverflowOptions } from '@floating-ui/core/src/detectOverflow';

export const DEFAULT_TOOLTIP_CONFIG: Partial<ComputePositionConfig> = {
	strategy: 'fixed'
};

export const DEFAULT_AUTO_PLACEMENT_CONFIG: Partial<AutoPlacementOptions & CoreDetectOverflowOptions> = {
	padding: 5
};
