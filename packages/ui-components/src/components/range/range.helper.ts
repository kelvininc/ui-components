export const getInputPercentageFromValue = (inputValue: number, min: number, max: number) => {
	return (100 * (inputValue - min)) / (max - min);
};

export const getInputOffset = (percentage: number) => {
	const offSet = -0.25;
	const halfDistance = percentage - 50;

	return halfDistance * offSet;
};

export const getValueOffset = (percentage: number, value: number) => {
	const valueLength = value.toString().length;
	const offSet = -0.15 * valueLength;
	const halfDistance = percentage - 50;

	return halfDistance * offSet;
};
