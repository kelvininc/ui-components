import { EIconName } from '../icon/icon.types';
import { EToasterIconTypeClass, EToasterType } from './toaster.types';

export const TYPE_ICONS: { [T in EToasterType]: EToasterIconTypeClass } = {
	[EToasterType.Info]: { icon: EIconName.Info },
	[EToasterType.Warning]: { icon: EIconName.Warning },
	[EToasterType.Error]: { icon: EIconName.Error },
	[EToasterType.Success]: { icon: EIconName.Success }
};

export const TOASTER_ANIMATION_DURATION = 500;
