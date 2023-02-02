export interface IStepProgressBar {
	/** (required) Defines how much space the progress bar should fill */
	progressPercentage: number;
	/** (optional) Defines if the bar should be in an error state, setting to `true` will change the background color to the defined error color */
	hasError: boolean;
}
