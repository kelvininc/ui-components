import { useCallback, useMemo, useState } from 'react';
import { FontsApi, IFontOptions } from './types';
import { FONT_NOT_FOUND_ERROR } from './constants';

export const useFontsApi = ({ fontFamily, fontSize }: IFontOptions): FontsApi => {
	const fontName = useMemo(() => `${fontSize}px ${fontFamily}`, [fontFamily, fontSize]);
	const [isFontLoaded, setFontLoaded] = useState(() => document.fonts.check(fontName));

	const checkFont = useCallback(() => document.fonts.check(fontName), [fontName]);

	const loadFont = useCallback(() => {
		if (isFontLoaded) return;

		document.fonts
			.load(fontName)
			.then(() => setFontLoaded(true))
			.catch(() => {
				setFontLoaded(false);
				throw new Error(FONT_NOT_FOUND_ERROR);
			});
	}, [fontName]);

	return { isFontLoaded, checkFont, loadFont };
};
