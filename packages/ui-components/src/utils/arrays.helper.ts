export const getArrayOfIndexes = (size: number): number[] =>
	Array(size)
		.fill({})
		.map((_value, index) => index);
