import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(timezone);

export const getDefaultTimezone = () => dayjs.tz.guess() ?? 'UTC';
