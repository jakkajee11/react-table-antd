import dayjs, { Dayjs } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';

dayjs.extend(relativeTime);
dayjs.extend(utc);

const DateTime = {
  toStrandardDate(date: string | number | Date | Dayjs) {
    if (dayjs(date).isValid()) return dayjs(date).format('DD-MMM-YYYY HH:mm');

    return date;
  },
  timeFromNow() {
    return dayjs().fromNow();
  },
  toTimeFromNow(date: string | number | Date | Dayjs, isUtc = true) {
    if (dayjs(date).isValid())
      return isUtc ? dayjs(date).utc().fromNow() : dayjs(date).fromNow();

    return date;
  },
};

export { DateTime };
