import { IDescriptionListItemPopover } from './description-list.types';

export function getTooltipText(popoverInfo: IDescriptionListItemPopover) {
	return popoverInfo?.text && !popoverInfo.icon ? popoverInfo.text : '';
}
