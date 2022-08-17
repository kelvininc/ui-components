import { ComputePositionConfig, offset, shift } from '@floating-ui/dom';

export const DEFAULT_POSITION_CONFIG: Partial<ComputePositionConfig> = {
	strategy: 'fixed',
	middleware: [offset(5), shift({ padding: 5 })]
};
