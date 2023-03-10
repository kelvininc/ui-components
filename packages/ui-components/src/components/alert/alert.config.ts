import { EIconName } from '../icon/icon.types';
import { EAlertType } from './alert.types';

export const ALERT_ICON_NAMES: { [key in EAlertType]: EIconName } = {
	[EAlertType.Info]: EIconName.Error,
	[EAlertType.Error]: EIconName.Error,
	[EAlertType.Success]: EIconName.Success,
	[EAlertType.Warning]: EIconName.Warning
};
