export type FontsApi = {
	isFontLoaded: boolean;
	checkFont: () => boolean;
	loadFont: () => void;
};

export type IFontOptions = {
	fontFamily: string;
	fontSize: number;
};
