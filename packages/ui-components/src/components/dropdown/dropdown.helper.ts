import { ComputePositionConfig, flip, MiddlewareState, offset, size } from '@floating-ui/dom';
import { isEmpty } from 'lodash-es';
import { DEFAULT_DROPDOWN_OFFSET, HELP_TEXT_HEIGHT_PX } from './dropdown.config';
import { ITextField } from '../text-field/text-field.types';

export const getDefaultDropdownPositionConfig = (
	inputConfig: Partial<ITextField> & {
		inputDisabled: boolean;
	}
): Partial<ComputePositionConfig> => {
	const helpTextOffset = isEmpty(inputConfig.helpText) ? 0 : HELP_TEXT_HEIGHT_PX;

	return {
		placement: 'bottom',
		middleware: [
			offset(DEFAULT_DROPDOWN_OFFSET - helpTextOffset),
			flip({
				padding: 16,
				fallbackPlacements: ['top-end', 'bottom-end', 'top-start', 'bottom-start']
			}),
			size({
				apply({ rects, elements }: MiddlewareState) {
					console.log('top', { element: elements.floating.style.top });

					Object.assign(elements.floating.style, {
						width: `${rects.reference.width}px`
					});
				}
			})
		]
	};
};
