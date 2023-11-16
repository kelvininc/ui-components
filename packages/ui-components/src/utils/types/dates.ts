import dayjs from 'dayjs';

export type DateInput = dayjs.ConfigType;

export type DayjsTimeRange = [dayjs.Dayjs, dayjs.Dayjs];

export type TimestampRange = [number, number];
