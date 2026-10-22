export function getValueAsString(newValue?: string | number | null): string {
	return typeof newValue === 'number' ? newValue.toString() : (newValue || '').toString();
}
