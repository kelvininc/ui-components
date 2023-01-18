import { EIconName } from '../icon/icon.types';

export enum ETagAlarmSize {
	XXSmall = 'xxsmall',
	XSmall = 'xsmall',
	Small = 'small',
	Normal = 'normal',
	Large = 'large'
}

export interface ITagAlarmConfig {
	name: string;
	icon: EIconName;
}
