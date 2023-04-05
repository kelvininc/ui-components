import { isNil } from 'lodash-es';

export function fallbackCopyTextToClipboard(text: string) {
	const textArea = document.createElement('textarea');
	let isCopySuccessful = true;

	textArea.value = text;
	textArea.style.position = 'fixed';
	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();

	try {
		isCopySuccessful = document.execCommand('copy');
	} catch (err) {
		isCopySuccessful = false;
	}

	document.body.removeChild(textArea);

	return isCopySuccessful;
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
	const sanitizedText = !isNil(text) ? text.replace(/^\s+|\s+$/gm, '') : '';

	if (isNil(navigator.clipboard)) {
		return fallbackCopyTextToClipboard(sanitizedText);
	}

	return await navigator.clipboard.writeText(sanitizedText).then(
		() => true,
		_ => false
	);
}
