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
					Object.assign(elements.floating.style, {
						width: `${rects.reference.width}px`
					});
				}
			})
		]
	};
};

/**
 * Whether an `openStateChange` is this dropdown's own request to open or close its list, rather than one a
 * dropdown or a toggle tip slotted into its trigger emitted and let bubble through it. The request is the
 * dropdown's own emit, from its trigger, or its `kv-dropdown-base`'s, from an Escape or a click outside;
 * the base is the first one under the dropdown, since everything slotted into it sits inside it.
 */
export const isOwnOpenStateRequest = (event: Event, dropdown: HTMLKvDropdownElement | undefined): boolean =>
	event.target === dropdown || event.target === dropdown?.querySelector('kv-dropdown-base');
