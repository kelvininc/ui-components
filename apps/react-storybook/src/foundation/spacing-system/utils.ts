const getSpacingFactor = (spacing: string): number => {
	return parseFloat(spacing.replace(/[^0-9.-]+/g, "") || "0");
};

export const sortSpacings = (spacings: string[]): string[] => {
	return spacings.sort((a, b) => {
		const aValue = getSpacingFactor(a);
		const bValue = getSpacingFactor(b);

		if (aValue === bValue) {
			return 0;
		}

		return aValue < bValue ? 1 : -1;
	});
};
