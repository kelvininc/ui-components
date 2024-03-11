import { EIllustrationName } from '../illustration/illustration.types';

export interface IIllustrationMessage {
	/** (required) The illustration that will be presented. */
	illustration: EIllustrationName;
	/** (required) The message header to be displayed below the illustration. */
	header: string;
	/** (optional) The message description to be displayed below the title. */
	description?: string;
}
