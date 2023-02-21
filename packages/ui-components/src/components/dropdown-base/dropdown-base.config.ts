import { ComputePositionConfig, flip, offset } from '@floating-ui/dom';

const DEFAULT_DROPDOWN_OFFSET = 8;

export const DEFAULT_POSITION_CONFIG: Partial<ComputePositionConfig> = {
	placement: 'bottom',
	middleware: [
		offset(DEFAULT_DROPDOWN_OFFSET),
		flip({
			padding: 16,
			fallbackPlacements: ['top-end', 'bottom-end', 'top-start', 'bottom-start']
		})
	]
};
