export enum ToasterTypesEnum {
	info = 'info',
	warning = 'warning',
	error = 'error',
	success = 'success'
}

export const TYPES_ICONS: { [T in ToasterTypesEnum]: string } = {
	[ToasterTypesEnum.info]: 'kv-info',
	[ToasterTypesEnum.warning]: 'kv-warning',
	[ToasterTypesEnum.error]: 'kv-error',
	[ToasterTypesEnum.success]: 'kv-success'
};
