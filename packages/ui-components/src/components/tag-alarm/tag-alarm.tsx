import { isEmpty } from 'lodash-es';

import { Component, Host, h, Prop } from '@stencil/core';

import { ETagAlarmSize } from './tag-alarm.types';
import { ALARM_CONFIG } from './tag-alarm.config';
import { EAlarmSeverity } from '../../utils/types/components';

@Component({
	tag: 'kv-tag-alarm',
	styleUrl: 'tag-alarm.scss',
	shadow: true
})
export class KvTagAlarm {
	/** (required) Alarm Severity */
	@Prop({ reflect: true }) severity!: EAlarmSeverity;
	/** (optional) Tag Alarm Size */
	@Prop({ reflect: true }) size?: ETagAlarmSize = ETagAlarmSize.Normal;
	/** (optional) Hide alarm label */
	@Prop({ reflect: true }) hideLabel?: boolean = false;
	/** (optional) Alarm custom label */
	@Prop({ reflect: true }) label?: string = '';

	render() {
		const alarmConfig = ALARM_CONFIG[this.severity];

		return (
			<Host>
				<div
					class={{
						'alarm-tag': true,
						[`alarm-tag--severity-${this.severity}`]: true
					}}
				>
					<kv-tag>
						<div class="alarm-tag-container" slot="left-slot">
							<div
								class={{
									'icon-wrapper': true,
									[`icon-wrapper--size-${this.size}`]: true
								}}
							>
								<kv-icon name={alarmConfig.icon} />
							</div>
							{!this.hideLabel && <div class="alarm-tag-label">{isEmpty(this.label) ? alarmConfig.name : this.label}</div>}
						</div>
					</kv-tag>
				</div>
			</Host>
		);
	}
}
