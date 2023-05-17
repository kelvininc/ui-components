import { ComputePositionConfig, offset, shift } from '@floating-ui/dom';

export const TOOLTIP_TEXT_ID = 'tooltip-text';

export const DEFAULT_POSITION_CONFIG: Partial<ComputePositionConfig> = {
	strategy: 'fixed',
	middleware: [offset(5), shift({ padding: 5 })]
};

export const DEFAULT_DELAY_CONFIG: number = 1000;
