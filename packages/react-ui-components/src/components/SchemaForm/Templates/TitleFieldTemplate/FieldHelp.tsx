import { EIconName, ETooltipPosition } from '@kelvininc/ui-components';
import React from 'react';
import { KvIcon, KvToggleTip } from '../../../../stencil-generated';

const FieldHelp = ({ help, className }: { help?: string; className?: string }) =>
	help ? (
		<KvToggleTip className={className} text={help} position={ETooltipPosition.Right}>
			<KvIcon name={EIconName.Info} slot="open-element-slot" />
		</KvToggleTip>
	) : null;

export default FieldHelp;
