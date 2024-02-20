import { ComputePositionConfig } from '@floating-ui/dom';

import { AutoPlacementOptions } from '@floating-ui/dom';
import { DetectOverflowOptions as CoreDetectOverflowOptions } from '@floating-ui/dom';

export const DEFAULT_TOOLTIP_CONFIG: Partial<ComputePositionConfig> = {
	strategy: 'fixed'
};

export const DEFAULT_AUTO_PLACEMENT_CONFIG: Partial<AutoPlacementOptions & CoreDetectOverflowOptions> = {
	padding: 5
};
