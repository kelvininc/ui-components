import { ComputePositionConfig, flip, offset } from '@floating-ui/dom';

export const DEFAULT_POSITION_CONFIG: Partial<ComputePositionConfig> = {
	placement: 'bottom',
	middleware: [
		offset(8),
		flip({
			padding: 16,
			fallbackPlacements: ['top-end', 'bottom-end', 'top-start', 'bottom-start']
		})
	]
};
