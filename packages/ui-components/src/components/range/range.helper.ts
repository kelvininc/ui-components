export const getInputPercentageFromValue = (inputValue: number, min: number, max: number) => {
	return (100 * (inputValue - min)) / (max - min);
};

export const getOffset = (percentage: number) => {
	const offSet = -0.25;
	const halfDistance = percentage - 50;

	return halfDistance * offSet;
};
