import { ERelativeTimeComparisonConfig, IRelativeTimePickerOption } from '../relative-time-picker.types';

/** Added mock options with fixed dates to prevent tests from breaking due to snapshots differences caused
 * by the time ranges from the options that are constantly updated
 */
export const MOCK_RELATIVE_TIME_OPTIONS_GROUPS: IRelativeTimePickerOption[][] = [
	[
		{
			label: 'All time',
			value: 'all-time',
			comparisonConfig: ERelativeTimeComparisonConfig.StartDateEndDate,
			startDate: {
				date: '1-01-2018 23:50'
			},
			endDate: {
				date: '1-01-2023 23:50'
			},
			labelRangeFormatter: {
				startDateFormatter: 'D MMM YYYY',
				separator: 'to',
				endDateFormatter: 'D MMM YYYY'
			}
		}
	]
];
