import { EActionButtonType, EComponentSize, EIconName, ETooltipPosition } from '@kelvininc/ui-components';
import React from 'react';
import { KvActionButtonIcon, KvIcon, KvToggleTip } from '../../../../stencil-generated';

const FieldHelp = ({ help, className, accessibleLabel }: { help?: string; className?: string; accessibleLabel?: string }) =>
	help ? (
		<KvToggleTip className={className} text={help} position={ETooltipPosition.Right}>
			{accessibleLabel ? (
				<KvActionButtonIcon
					icon={EIconName.InfoOutline}
					type={EActionButtonType.Tertiary}
					size={EComponentSize.Small}
					accessibleLabel={accessibleLabel}
					slot="open-element-slot"
				/>
			) : (
				<KvIcon name={EIconName.Info} slot="open-element-slot" />
			)}
		</KvToggleTip>
	) : null;

export default FieldHelp;
