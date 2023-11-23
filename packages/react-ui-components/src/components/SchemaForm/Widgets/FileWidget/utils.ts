import { dataURItoBlob } from '@rjsf/utils';
import { FileInfoType } from './types';

const addNameToDataURL = (dataURL: string, name: string) => {
	if (dataURL === null) {
		return null;
	}
	return dataURL.replace(';base64', `;name=${encodeURIComponent(name)};base64`);
};

const processFile = (file: File): Promise<FileInfoType> => {
	const { name, size, type } = file;
	return new Promise((resolve, reject) => {
		const reader = new window.FileReader();
		reader.onerror = reject;
		reader.onload = event => {
			if (typeof event.target?.result === 'string') {
				resolve({
					dataURL: addNameToDataURL(event.target.result, name),
					name,
					size,
					type
				});
			} else {
				resolve({
					dataURL: null,
					name,
					size,
					type
				});
			}
		};
		reader.readAsDataURL(file);
	});
};

export const processFiles = (files: FileList) => {
	return Promise.all(Array.from(files).map(processFile));
};

export const extractFileInfo = (data: string | string[]): FileInfoType[] => {
	const dataURLs = Array.isArray(data) ? data : [data];
	return dataURLs
		.filter(dataURL => dataURL)
		.map(dataURL => {
			const { blob, name } = dataURItoBlob(dataURL);
			return {
				dataURL,
				name: name,
				size: blob.size,
				type: blob.type
			};
		});
};
