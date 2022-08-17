export const getInputPercentageFromValue = (inputValue: string, min: number, max: number) => {
	return (100 * (parseInt(inputValue) - min)) / (max - min);
};

export const getOffset = (percentage: number) => {
	const invertPercentage = 1 - percentage / 100;
	return invertPercentage * 10 - 4;
};
