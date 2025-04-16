export interface ICurrentDirtyFieldsContextValues {
	isDirty: (field: string) => boolean;
	setDirty: (field: string) => void;
}
