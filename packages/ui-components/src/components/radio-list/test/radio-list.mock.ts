import { IRadioListItem } from '../../radio-list-item/radio-list-item.types';

export const OPTIONS_MOCK: IRadioListItem[] = [
	{
		optionId: 'k3s',
		label: 'K3S',
		description:
			'To create an edge cluster, use the Kelvin installation script for K3S. For more information, see the [documentation](https://docs.kelvininc.com/4.10.2/) here.'
	},
	{
		optionId: 'kubernetes',
		label: 'Kubernetes',
		description:
			'To use, either choose an already existing cloud hosted or a generic Kubernetes cluster. For more information, see the [documentation](https://docs.kelvininc.com/4.10.2/) here.'
	}
];

export const DISABLED_OPTIONS_MOCK: Record<string | number, boolean> = {
	k3s: true
};
