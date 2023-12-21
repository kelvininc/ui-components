import { Placement } from '@floating-ui/dom';
import { DetectOverflowOptions as CoreDetectOverflowOptions } from '@floating-ui/dom';
import { ShiftOptions } from '@floating-ui/dom';
import { DEFAULT_PORTAL_Z_INDEX } from '../../globals/config';

export const PORTAL_Z_INDEX = {
	hidden: -1,
	show: DEFAULT_PORTAL_Z_INDEX
};
export const OFFSET_WITH_ARROW = 10;
export const STATIC_SIDE_OFFSET = '-5px';

export const getArrowElementPositionConfig = (x: number, y: number, placement: Placement) => {
	const staticSide = {
		top: 'bottom',
		right: 'left',
		bottom: 'top',
		left: 'right'
	}[placement.split('-')[0]];

	return {
		left: x != null ? `${x}px` : '',
		top: y != null ? `${y}px` : '',
		right: '',
		bottom: '',
		[staticSide]: STATIC_SIDE_OFFSET,
		transform: 'rotate(45deg)'
	};
};

export const DEFAULT_OFFSET: number = 5;
export const DEFAULT_SHIFT_CONFIG: Partial<ShiftOptions & CoreDetectOverflowOptions> = {
	padding: 5
};
