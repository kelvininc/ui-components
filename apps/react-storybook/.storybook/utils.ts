export function camelToKebab(camelCaseString) {
	return camelCaseString.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
