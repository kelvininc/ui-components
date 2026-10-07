import { dataURItoBlob } from '@rjsf/utils';
import { FileInfoType } from './types';

const processFile = (file: File): Promise<FileInfoType> =>
	new Promise((resolve, reject) => {
		const reader = new window.FileReader();
		reader.onerror = () => reject(reader.error ?? new Error('Could not read file'));
		reader.onabort = () => reject(new Error('File read was canceled'));
		reader.onload = () => {
			if (typeof reader.result !== 'string') {
				reject(new Error('File read did not return a data URL'));
				return;
			}
			const value = reader.result.replace(';base64', `;name=${encodeURIComponent(file.name)};base64`);
			resolve({ value, dataURL: value, name: file.name, size: file.size, type: file.type });
		};
		reader.readAsDataURL(file);
	});

export const processFiles = (files: FileList | readonly File[]): Promise<FileInfoType[]> => Promise.all(Array.from(files).map(processFile));

const fileInfo = (value: string): FileInfoType => {
	try {
		if (!value.startsWith('data:')) throw new Error('Not a data URL');
		const { blob, name } = dataURItoBlob(value);
		// RJSF's decodeURI leaves reserved characters escaped. Decode the original name once.
		const encodedName = value.slice(0, value.indexOf(',')).match(/;name=([^;]*)/)?.[1];
		return { value, dataURL: value, name: encodedName ? decodeURIComponent(encodedName) : name, size: blob.size, type: blob.type };
	} catch {
		return { value, name: value, size: 0, type: '' };
	}
};

/** Preserve unsupported stored strings so they can be inspected and removed without decoding them. */
export const extractFileInfo = (data: unknown): FileInfoType[] =>
	(Array.isArray(data) ? data : [data]).filter((value): value is string => typeof value === 'string' && value !== '').map(fileInfo);
