import { AutoPlacementOptions, ComputePositionConfig, DetectOverflowOptions, offset, shift } from '@floating-ui/dom';

export const DEFAULT_POSITION_CONFIG: Partial<ComputePositionConfig> = {
	strategy: 'fixed',
	middleware: [offset(5), shift({ padding: 5 })]
};

export const DEFAULT_DELAY_CONFIG: number = 1000;

export const DEFAULT_AUTO_PLACEMENT_CONFIG: Partial<AutoPlacementOptions & DetectOverflowOptions> = {
	padding: 5
};
