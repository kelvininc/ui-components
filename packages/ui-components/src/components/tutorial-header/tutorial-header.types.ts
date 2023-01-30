export interface ITutorialHeader {
	/** (required) A title to describe a state (e.g step) */
	label: string;
	/** (required) A description of the state (e.g the description of a step) */
	description: string;
	/** (optional) A separator character to place between the label and description */
	separator: string;
}
