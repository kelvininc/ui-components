export const CREATE_TAG_REQUEST_DURATION_IN_MS = 1500;
export const CREATE_TAG_ERROR = "Couldn't create the tag. Try again.";

// The colours new tags take in turn: the custom create row shows the next one
export const NEW_TAG_COLORS = [
	"var(--color-teal-500)",
	"var(--color-purple-500)",
	"var(--color-yellow-500)",
	"var(--color-green-500)",
	"var(--color-blue-500)"
];

export const NEW_TAG_INPUT_CONFIG = { placeholder: "Tag name" };

// Derived by the create stories from what is typed: controls for these would do nothing
export const CREATE_STORY_DERIVED_ARGS = [
	"createOptionPlaceholder",
	"searchTerm",
	"typedName",
	"tagColor",
	"colorPickerOpen"
];
