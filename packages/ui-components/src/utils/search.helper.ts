export const searchString = <T extends { label: string }>(searchTerm: string | undefined, searchOptions: T[]): T[] => {
	if (!searchTerm || searchTerm.length <= 0) {
		return searchOptions;
	}

	// filter by search
	const lowerCaseSearchTerm = searchTerm.toLowerCase();
	return searchOptions.filter(option => option.label.toLowerCase().includes(lowerCaseSearchTerm));
};
