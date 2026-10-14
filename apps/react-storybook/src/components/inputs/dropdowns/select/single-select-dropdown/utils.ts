import {
	EIconName,
	ISelectSingleOption
} from "@kelvininc/react-ui-components/client";
import { CREATE_TAG_ERROR, CREATE_TAG_REQUEST_DURATION_IN_MS } from "./config";

// The add option names the search term it creates a tag from
export const getCreateTagLabel = (searchTerm?: string) =>
	searchTerm ? `Create “${searchTerm}”` : "Create tag";

let createdTagsCount = 0;

// Stands in for the request creating a tag, which resolves with the key the server gave it
export const requestTagCreation = (shouldFail = false): Promise<string> =>
	new Promise((resolve, reject) =>
		setTimeout(() => {
			if (shouldFail) {
				reject(new Error(CREATE_TAG_ERROR));
				return;
			}

			createdTagsCount += 1;
			resolve(`tag-${createdTagsCount}`);
		}, CREATE_TAG_REQUEST_DURATION_IN_MS)
	);

// A tag coloured like the ones in the tags mock
export const buildTagOption = (
	label: string,
	value: string,
	color: string
): ISelectSingleOption => ({
	label,
	value,
	icon: EIconName.Square,
	customStyle: {
		"--select-option-icon-color": color,
		"--select-option-icon-color-hover": color,
		"--select-option-icon-color-highlighted": color,
		"--select-option-icon-color-selected": color,
		"--text-color-icon-default": color,
		"--text-color-icon-focused": color,
		"--text-color-icon-filled": color
	}
});
