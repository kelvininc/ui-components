export interface IWizardHeader {
	/** (required) A title to describe a state (e.g step) */
	label: string;
	/** (required) A description of the state (e.g the description of a step) */
	description: string;
	/** (optional) An extra information for the step */
	tip?: string;
}
