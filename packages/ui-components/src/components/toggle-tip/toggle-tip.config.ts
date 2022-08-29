import { Placement } from '@floating-ui/dom';

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
		[staticSide]: STATIC_SIDE_OFFSET
	};
};
