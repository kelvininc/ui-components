export const getInputPercentageFromValue = (inputValue: string, min: number, max: number) => {
	return (100 * (parseInt(inputValue) - min)) / (max - min);
};

export const getOffset = (percentage: number) => {
	const offSet = -0.25;
	const halfDistance = percentage - 50;

	return halfDistance * offSet;
};
