import { EAlarmSeverity } from '../../utils/types/components';
import { EIconName } from '../icon/icon.types';
import { ITagAlarmConfig } from './tag-alarm.types';

export const ALARM_CONFIG: { [key in EAlarmSeverity]: ITagAlarmConfig } = {
	[EAlarmSeverity.One]: {
		name: 'Critical',
		icon: EIconName.Circle
	},
	[EAlarmSeverity.Two]: {
		name: 'Urgent',
		icon: EIconName.Nabla
	},
	[EAlarmSeverity.Three]: {
		name: 'Advisory',
		icon: EIconName.Triangle
	},
	[EAlarmSeverity.Four]: {
		name: 'Medium',
		icon: EIconName.Square
	},
	[EAlarmSeverity.Five]: {
		name: 'Low',
		icon: EIconName.Diamond
	}
};
