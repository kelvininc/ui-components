export const searchString = (searchTerm: string | undefined, searchOptions: string[]): string[] => {
	if (!searchTerm || searchTerm.length <= 0) {
		return searchOptions;
	}

	// filter by search
	const lowerCaseSearchTerm = searchTerm.toLowerCase();
	const filteredOptions = searchOptions.filter(option => option.toLowerCase().includes(lowerCaseSearchTerm));

	return filteredOptions;
};
