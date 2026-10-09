import { EActionButtonType, EComponentSize, EIconName, ETooltipPosition } from '@kelvininc/ui-components';
import React from 'react';
import { KvActionButtonIcon, KvToggleTip } from '../../../../stencil-generated';

// One look for every help icon, headings and table headers alike, and always a named button keyboards can reach
const FieldHelp = ({ help, className, accessibleLabel }: { help?: string; className?: string; accessibleLabel: string }) =>
	help ? (
		<KvToggleTip className={className} text={help} position={ETooltipPosition.Right}>
			<KvActionButtonIcon
				icon={EIconName.InfoOutline}
				type={EActionButtonType.Tertiary}
				size={EComponentSize.Small}
				accessibleLabel={accessibleLabel}
				slot="open-element-slot"
			/>
		</KvToggleTip>
	) : null;

export default FieldHelp;
