import {
	IRelativeTimePickerOption,
	relativeTimeHelper,
	ERelativeTimeRangeKey,
	ERelativeTimeComparisonConfig
} from "@kelvininc/ui-components";

// Example of a consumer-defined option list: future durations whose description
// is the resolved target date (a positive offset builds a [now, target] range).
export const FUTURE_DURATION_OPTIONS: IRelativeTimePickerOption[][] = [
	[3, 7, 14, 30, 60].map((days) =>
		relativeTimeHelper.buildRelativeTimeOption(
			`${days} days`,
			ERelativeTimeRangeKey[
				`Next_${days}_D` as keyof typeof ERelativeTimeRangeKey
			],
			ERelativeTimeComparisonConfig.RelativeAmountOfUnits,
			{ endDateFormatter: "D MMM" }
		)
	)
];
