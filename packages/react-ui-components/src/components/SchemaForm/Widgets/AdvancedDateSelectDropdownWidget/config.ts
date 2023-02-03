import { ComputePositionConfig, offset } from '@floating-ui/dom';

export const DEFAULT_DROPDOWN_POSITION_OPTIONS: Partial<ComputePositionConfig> = {
	placement: 'bottom-end',
	middleware: [offset(4)]
};
